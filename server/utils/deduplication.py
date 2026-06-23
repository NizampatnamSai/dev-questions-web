import hashlib
from difflib import SequenceMatcher

def hash_question(question_text: str) -> str:
    """Create a hash of question text for deduplication"""
    cleaned = question_text.lower().strip()
    return hashlib.md5(cleaned.encode()).hexdigest()

def check_question_duplicate(new_question: str, existing_questions: list, similarity_threshold=0.85) -> bool:
    """
    Check if question is too similar to existing ones (potential duplicate)
    Returns True if duplicate, False if unique
    """
    new_text = new_question.lower().strip()

    for existing in existing_questions:
        existing_text = existing.lower().strip()

        # Calculate similarity ratio
        similarity = SequenceMatcher(None, new_text, existing_text).ratio()

        if similarity >= similarity_threshold:
            return True  # Duplicate found

    return False  # Unique question


def calculate_question_similarity(q1: str, q2: str) -> float:
    """Calculate similarity between two questions (0-1)"""
    q1_clean = q1.lower().strip()
    q2_clean = q2.lower().strip()
    return SequenceMatcher(None, q1_clean, q2_clean).ratio()


def deduplicate_questions(questions: list, threshold=0.85) -> list:
    """
    Remove duplicate or similar questions from a list
    Keeps the first occurrence, removes similar ones
    """
    unique = []
    texts = []

    for q in questions:
        question_text = q.get("question", "") if isinstance(q, dict) else q
        is_duplicate = check_question_duplicate(question_text, texts, threshold)

        if not is_duplicate:
            unique.append(q)
            texts.append(question_text)

    return unique


def get_question_keywords(question: str) -> set:
    """Extract key concepts from a question"""
    stopwords = {
        "the", "a", "an", "and", "or", "in", "on", "at", "to", "for",
        "what", "how", "why", "when", "where", "is", "are", "be", "been",
        "write", "create", "implement", "function", "class", "method",
        "return", "value", "given", "output", "input", "result"
    }

    words = question.lower().split()
    keywords = {w for w in words if len(w) > 3 and w not in stopwords}
    return keywords


def calculate_concept_diversity(questions: list) -> float:
    """
    Calculate diversity of questions based on concept coverage
    Returns 0-1 score (1 = high diversity, 0 = low diversity)
    """
    if len(questions) < 2:
        return 1.0

    all_keywords = set()
    question_concepts = []

    for q in questions:
        question_text = q.get("question", "") if isinstance(q, dict) else q
        keywords = get_question_keywords(question_text)
        question_concepts.append(keywords)
        all_keywords.update(keywords)

    if not all_keywords:
        return 0.0

    # Calculate average overlap
    total_overlap = 0
    for i in range(len(question_concepts)):
        for j in range(i + 1, len(question_concepts)):
            overlap = len(question_concepts[i] & question_concepts[j])
            total_overlap += overlap

    max_possible_overlaps = len(questions) * (len(questions) - 1) / 2 * len(all_keywords)
    if max_possible_overlaps == 0:
        return 1.0

    diversity = 1 - (total_overlap / max_possible_overlaps)
    return max(0.0, min(1.0, diversity))
