import os
import requests
import random

# The LM Studio API endpoint
AI_BASE_URL = os.getenv("AI_BASE_URL", "http://192.168.31.148:1234")
AI_MODEL = os.getenv("AI_MODEL", "llama-3.2-3b-instruct-q4_k_m")

def chat_completion(messages, max_tokens=2000, temperature=0.7):
   

    url = f"{AI_BASE_URL}/v1/chat/completions"

    formatting_system_prompt = {
        "role": "system",
        "content": (
            "You are an advanced AI assistant. "
            "Always reply using beautifully formatted Markdown. "
            "Formatting rules:\n"
            "- Use clear headings (## Title)\n"
            "- Keep paragraphs short (2–4 lines max)\n"
            "- Use bullet points for lists\n"
            "- Use spacing between sections\n"
            "- Never create long walls of text\n"
            "- Use tables when information fits naturally\n"
            "- Use **bold** for key terms\n"
            "- Use callout style blocks when useful\n"
            "- Use clean emoji styling sparingly (✅, ⚠️, 💡, 🔍)\n"
            "- Always show examples in fenced code blocks ```\n\n"
            "At the end of every reply, include a short and natural follow-up question "
            "or a few topic suggestions to keep the conversation going. Examples:\n"
            "- 'Would you like me to expand on this?'\n"
            "- 'Want to explore a related topic?'\n"
            "- 'Would you like some examples or practical applications?'\n"
            "- 'Here are a few topics we could discuss next...'\n\n"
            "Never output raw HTML. "
            "Never respond in one single large paragraph. "
            "Your goal is readability, clarity, and a conversational tone."
        ),
    }

    closing_suggestions = [
        "Would you like to dive deeper into this topic?",
        "Want me to suggest related concepts?",
        "Should I give you a few examples or comparisons?",
        "Would you like me to summarize key takeaways?",
        "Curious about how this connects to another field?",
        "Would you like to explore next steps or similar topics?"
    ]

    enhanced_messages = [formatting_system_prompt] + messages

    payload = {
        "model": AI_MODEL,
        "messages": enhanced_messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
    }

    response = requests.post(url, json=payload)
    response.raise_for_status()

    data = response.json()
    content = data["choices"][0]["message"]["content"]

    follow_up = f"\n\n💬 {random.choice(closing_suggestions)}"
    return content.strip() + follow_up
