"""Resume & ATS Analyzer: parses an uploaded PDF/DOCX resume (free, local
parsing — no external service for that part), then asks Groq for an ATS-style
review. No text extraction library ever sends the file anywhere; only the
extracted plain text goes to Groq."""
import io
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from deps import current_user
from db_mongo import col_resume_analyses, now
from utils.ai import _groq_call
from utils.groq_unique_questions import _extract_json

router = APIRouter()

MAX_FILE_BYTES = 5 * 1024 * 1024  # 5MB
DAILY_LIMIT = 10
MIN_TEXT_CHARS = 50  # below this, extraction almost certainly failed


def _extract_pdf_text(raw: bytes) -> str:
    import pdfplumber
    with pdfplumber.open(io.BytesIO(raw)) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)


def _extract_docx_text(raw: bytes) -> str:
    import docx
    doc = docx.Document(io.BytesIO(raw))
    return "\n".join(p.text for p in doc.paragraphs)


@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(""),
    user=Depends(current_user),
):
    filename = (file.filename or "").lower()
    if not (filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(400, "Only PDF and DOCX files are supported.")

    raw = await file.read()
    if len(raw) > MAX_FILE_BYTES:
        raise HTTPException(413, "File too large (max 5MB).")
    if not raw:
        raise HTTPException(400, "No file received.")

    today = date.today().isoformat()
    used_today = await col_resume_analyses().count_documents({"userId": user["id"], "date": today})
    if used_today >= DAILY_LIMIT:
        raise HTTPException(429, f"Daily resume analysis limit reached ({DAILY_LIMIT}/day). Try again tomorrow.")

    try:
        text = _extract_pdf_text(raw) if filename.endswith(".pdf") else _extract_docx_text(raw)
    except Exception:
        raise HTTPException(400, "Couldn't read that file — make sure it's a valid, non-password-protected PDF or DOCX.")

    text = text.strip()
    if len(text) < MIN_TEXT_CHARS:
        raise HTTPException(400, "Couldn't extract readable text from this file — it may be a scanned image rather than real text.")

    # Cap prompt size — a resume's content, not a token-budget landmine.
    text = text[:8000]

    jd_section = f"\n\nTARGET JOB DESCRIPTION (match resume against this):\n{job_description.strip()[:2000]}" if job_description.strip() else ""

    system = (
        "You are an ATS (Applicant Tracking System) resume screener and career coach. "
        "Analyze the resume text and return ONLY raw JSON, no markdown, no commentary, in this exact shape:\n"
        "{\n"
        '  "atsScore": <0-100 integer, how well an ATS would parse and rank this resume>,\n'
        '  "sectionsFound": [<list of sections detected, e.g. "Contact Info", "Experience", "Education", "Skills">],\n'
        '  "sectionsMissing": [<standard resume sections NOT found>],\n'
        '  "strengths": [<3-5 short, specific strengths>],\n'
        '  "weaknesses": [<3-5 short, specific, actionable weaknesses>],\n'
        '  "missingKeywords": [<if a job description was given, keywords from it missing in the resume; otherwise common ATS keywords missing for the apparent role — max 10>],\n'
        '  "formattingIssues": [<ATS-unfriendly formatting problems, e.g. tables, columns, images, unusual fonts inferred from structure — empty array if none detected>],\n'
        '  "summary": "<2-3 sentence overall verdict, plain English>"\n'
        "}"
    )
    user_msg = f"RESUME TEXT:\n{text}{jd_section}"

    try:
        r = await _groq_call({
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user_msg},
            ],
            "temperature": 0.4,
            "max_tokens": 1200,
        })
        analysis = _extract_json(r.json()["choices"][0]["message"]["content"])
    except Exception:
        raise HTTPException(503, "Resume analysis is unavailable right now — try again shortly.")

    await col_resume_analyses().insert_one({
        "userId": user["id"], "date": today, "filename": file.filename,
        "atsScore": analysis.get("atsScore"), "createdAt": now(),
    })

    return analysis
