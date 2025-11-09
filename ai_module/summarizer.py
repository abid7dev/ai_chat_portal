from ai_module.chat import chat_completion

def generate_summary(messages):
    """
    messages: list of dicts like:
    [{"role": "user", "content": "hi"}, {"role": "assistant", ...}]
    """
    prompt = """
You are an expert conversation summarizer.

Summarize the following conversation. Include:

- Summary in 4–6 sentences
- Key discussion points
- Important decisions made
- Action items
- Tone of the conversation

Conversation:
    """

    conversation_text = "\n".join([f"{m['role']}: {m['content']}" for m in messages])

    ai_messages = [
        {"role": "system", "content": "You summarize conversations professionally."},
        {"role": "user", "content": prompt + conversation_text}
    ]

    return chat_completion(ai_messages, max_tokens=500)
