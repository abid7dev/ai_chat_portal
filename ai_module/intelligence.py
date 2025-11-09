from .chat import chat_completion
from conversations.models import Message


def generate_intelligence_answer(conversation_id: int, question: str) -> str:
    """
    Generates an analytical, Markdown-formatted AI insight about a past conversation.
    Timestamps and metadata are removed — only conversation context is provided.
    """

    # ✅ Fetch conversation messages
    messages = Message.objects.filter(conversation_id=conversation_id).order_by("timestamp")

    if not messages.exists():
        return "⚠️ No messages found in this conversation."

    # ✅ Clean and format messages (no timestamps)
    formatted = [f"{m.sender.upper()}: {m.content.strip()}" for m in messages]

    # ✅ Structured and human-readable prompt
    prompt = [
        {
            "role": "system",
            "content": (
                "You are an AI assistant that analyzes past conversations.\n"
                "Your job is to help users understand what was discussed, key takeaways, and decisions made.\n"
                "Respond ONLY in clean, well-formatted Markdown.\n\n"
                "Formatting rules:\n"
                "- Use clear Markdown headings (##)\n"
                "- Use short paragraphs (max 3 lines each)\n"
                "- Use bullet points or numbered lists for key points\n"
                "- Do NOT include timestamps, IDs, or metadata\n"
                "- Keep tone factual, concise, and easy to skim\n\n"
                "Sections to include:\n"
                "## Conversation Summary\n"
                "## Key Points\n"
                "## Insights or Takeaways\n\n"
                "If question asks for details, answer directly under appropriate section."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Here’s the full conversation:\n\n"
                f"{''.join(formatted)}\n\n"
                f"Question: {question}"
            ),
        },
    ]

    # ✅ Call the LM Studio model
    response = chat_completion(prompt, max_tokens=1200, temperature=0.6)
    return response
