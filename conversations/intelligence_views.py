from rest_framework.views import APIView
from rest_framework.response import Response
from ai_module.chat import chat_completion
from .models import Message

class ConversationQueryView(APIView):
    """
    Ask questions about ALL past conversations.
    """

    def post(self, request):
        question = request.data.get("question")

        if not question:
            return Response({"error": "Question field is required"}, status=400)

        # ✅ 1. Get all messages from the database
        all_messages = Message.objects.all().order_by("timestamp")

        # ✅ 2. Build context string for the LLM
        context = "\n".join([
            f"Conversation {m.conversation_id} | {m.sender}: {m.content}"
            for m in all_messages
        ])

        # ✅ 3. Prepare AI Prompt
        ai_messages = [
            {"role": "system", "content": "Answer based ONLY on the messages provided."},
            {"role": "user", "content": f"""
Here are all previous conversation messages:

{context}

Question: {question}

Answer based ONLY on the above messages.
If the answer cannot be found in the data, say: 'No relevant information found.'
"""}
        ]

        # ✅ 4. Get LLM response
        answer = chat_completion(ai_messages, max_tokens=300)

        # ✅ 5. Return answer
        return Response({"answer": answer})
