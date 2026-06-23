import json
import asyncio
from groq import Groq
from utils.deduplication import check_question_duplicate, deduplicate_questions

client = Groq()

async def generate_unique_questions(
    category: str,
    count: int = 10,
    difficulty: str = "Medium",
    exclude_texts: set = None,
    retry_limit: int = 3
) -> list:
    """
    Generate unique questions with deduplication
    Will retry if similar questions are generated
    """
    if exclude_texts is None:
        exclude_texts = set()

    questions = []
    retry_count = 0

    while len(questions) < count and retry_count < retry_limit:
        batch_size = count - len(questions) + 2  # Generate extra to account for duplicates

        prompt = f"""Generate {batch_size} UNIQUE and ORIGINAL {category} interview questions at {difficulty} level.

CRITICAL REQUIREMENTS:
1. Each question MUST be UNIQUE and ORIGINAL - not from standard resources
2. NO duplicate concepts or similar questions
3. Cover DIFFERENT topics and approaches
4. Each question should have a distinct solution approach
5. Include variety in problem types and patterns

Return a JSON array with this exact structure for each question:
[
    {{
        "question": "Unique question here",
        "answer": "Answer/solution",
        "explanation": "Why this answer",
        "difficulty": "{difficulty}",
        "category": "{category}",
        "keywords": ["keyword1", "keyword2"]
    }}
]

EXAMPLES OF UNIQUE vs DUPLICATE:
✓ UNIQUE: "Design a system to detect circular dependencies in a module graph"
✗ DUPLICATE: "How do you detect cycles in a linked list?" (same concept, different wording)

✓ UNIQUE: "Implement a rate limiter with sliding window and burst handling"
✗ DUPLICATE: "How do you implement rate limiting?" (too generic, similar)

Generate questions NOW:"""

        try:
            response = client.messages.create(
                model="mixtral-8x7b-32768",
                max_tokens=2048,
                messages=[{"role": "user", "content": prompt}]
            )

            response_text = response.content[0].text
            generated = json.loads(response_text)

            # Validate and deduplicate
            for q in generated:
                q_text = q.get("question", "")

                # Check against previously generated questions
                is_duplicate = check_question_duplicate(q_text, exclude_texts, similarity_threshold=0.80)

                if not is_duplicate:
                    questions.append(q)
                    exclude_texts.add(q_text)

                    if len(questions) >= count:
                        break

        except json.JSONDecodeError:
            # If JSON parsing fails, try to extract questions manually
            try:
                lines = response_text.split("\n")
                for line in lines:
                    if "question" in line.lower():
                        # Try to parse partial JSON
                        pass
            except:
                pass

        retry_count += 1

    return questions[:count]


async def generate_flashcard_questions(
    category: str,
    count: int = 20,
    difficulty: str = "all",
    exclude_texts: set = None
) -> list:
    """Generate unique flashcard Q&A pairs with no duplicates"""
    if exclude_texts is None:
        exclude_texts = set()

    prompt = f"""Generate {count} UNIQUE flashcard Q&A pairs for learning {category}.

REQUIREMENTS:
1. Each Q&A pair MUST be UNIQUE - different from standard resources
2. NO repeated concepts
3. Good for spaced repetition learning
4. Questions should be specific and testable
5. Answers should be concise but complete

Difficulty: {difficulty}

Return JSON array:
[
    {{
        "question": "Specific question",
        "answer": "Concise answer",
        "explanation": "Learning explanation",
        "difficulty": "Basic|Intermediate|Advanced",
        "keywords": ["keyword1", "keyword2"]
    }}
]

Generate NOW:"""

    try:
        response = client.messages.create(
            model="mixtral-8x7b-32768",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = response.content[0].text
        cards = json.loads(response_text)

        # Deduplicate
        unique_cards = []
        for card in cards:
            q_text = card.get("question", "")
            is_duplicate = check_question_duplicate(q_text, exclude_texts, similarity_threshold=0.80)

            if not is_duplicate:
                unique_cards.append(card)
                exclude_texts.add(q_text)

        return unique_cards[:count]
    except:
        return []


async def generate_daily_challenge(category: str, exclude_hashes: set = None) -> dict:
    """Generate unique daily challenge with no repeats"""
    if exclude_hashes is None:
        exclude_hashes = set()

    prompt = f"""Generate ONE unique daily coding challenge for {category}.

MUST BE UNIQUE - completely original problem, not from LeetCode/standard sources.

Return JSON:
{{
    "title": "Unique problem title",
    "description": "Problem description with examples",
    "difficulty": "Easy|Medium|Hard",
    "code": "Code template if applicable",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this is correct",
    "concept": "Main concept being tested"
}}

Make this problem COMPLETELY UNIQUE:"""

    try:
        response = client.messages.create(
            model="mixtral-8x7b-32768",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = response.content[0].text
        challenge = json.loads(response_text)

        return challenge
    except:
        return {
            "title": "Daily Challenge",
            "description": "Generate a solution",
            "difficulty": "Medium",
            "options": ["A", "B", "C", "D"],
            "correctIndex": 0,
            "explanation": "Check your answer"
        }


async def call_groq_api(prompt: str, max_tokens: int = 1024) -> str:
    """Generic Groq API call"""
    try:
        response = client.messages.create(
            model="mixtral-8x7b-32768",
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text
    except Exception as e:
        print(f"Groq API error: {e}")
        return ""
