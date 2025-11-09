from .chat import chat_completion


def generate_ai_reply(conversation_messages):
    """Generate the assistant's response for an ongoing conversation."""
    formatted_messages = [
        {"role": msg.sender, "content": msg.content}
        for msg in conversation_messages
    ]
    return chat_completion(formatted_messages, max_tokens=1500)


def generate_conversation_title(context_messages):
    """Generate a short, 4-word title summarizing the conversation topic."""
    full_text = "\n\n".join([m.content for m in context_messages])

    prompt = [
        {
            "role": "user",
            "content": (
                "Summarize the main topic of this conversation into a concise title.\n"
                "Rules: max 4 words, no punctuation, no quotes, no emojis.\n\n"
                f"Conversation:\n{full_text}"
            ),
        }
    ]

    raw_title = chat_completion(prompt, max_tokens=20).strip()

    clean_title = (
        raw_title.replace('"', "")
        .replace("'", "")
        .replace(":", "")
        .replace(".", "")
        .replace("#", "")
        .strip()
    )

    return " ".join(clean_title.split()[:4]) or "New Conversation"
