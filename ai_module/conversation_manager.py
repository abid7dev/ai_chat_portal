from .chat import chat_completion
import re


def generate_ai_reply(conversation_messages):
    formatted_messages = [
        {"role": msg.sender, "content": msg.content}
        for msg in conversation_messages
    ]
    return chat_completion(formatted_messages, max_tokens=1500)


def generate_conversation_title(context_messages):

    full_text = "\n\n".join([m.content for m in context_messages])
    full_text = re.sub(r"\s+", " ", full_text).strip()

    prompt = [
        {
            "role": "user",
            "content": (
                "Generate a short, natural English title for this chat conversation.\n"
                "Rules:\n"
                "- 2 to 4 words max\n"
                "- Sound natural and grammatically correct (e.g. 'C++ Basics', 'C# Fundamentals', 'Discussing Cars')\n"
                "- Preserve technical symbols like + or #\n"
                "- Do NOT include markdown formatting (#, ##, **, etc.), emojis, or filler words like 'Main', 'Chat', 'Discussion', 'Topic'\n"
                "- Capitalize each main word\n\n"
                f"Conversation:\n{full_text}"
            ),
        }
    ]

    raw_title = chat_completion(prompt, max_tokens=15).strip()

    # --- CLEANING STAGE ---
    # Remove markdown headers or bullets (##, #, *, -, etc.)
    clean_title = re.sub(r"^[#*\-\s]+", "", raw_title)

    # Keep only alphanumeric, spaces, +, and #
    clean_title = re.sub(r"[^A-Za-z0-9+# ]+", "", clean_title)

    # Normalize multiple spaces
    clean_title = re.sub(r"\s+", " ", clean_title).strip()

    # Remove filler words
    blacklist = {"discussion", "chat", "main", "want", "topic", "talk"}
    words = [w for w in clean_title.split() if w.lower() not in blacklist][:4]

    # Smart capitalization (preserve symbols like C++ / C#)
    def smart_cap(word):
        if any(ch in word for ch in "+#"):
            return word
        return word.capitalize()

    title = " ".join(smart_cap(w) for w in words)

    return title or "New Chat"
