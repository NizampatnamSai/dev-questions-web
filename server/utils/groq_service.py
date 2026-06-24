"""
Groq service wrapper for AI-powered question generation
"""
from groq import Groq
from utils.groq_unique_questions import generate_unique_questions, generate_flashcard_questions, call_groq_api

__all__ = ['generate_unique_questions', 'generate_flashcard_questions', 'call_groq_api']
