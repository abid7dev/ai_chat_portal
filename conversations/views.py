from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

from ai_module.conversation_manager import generate_ai_reply, generate_conversation_title
from ai_module.summarizer import generate_summary
from ai_module.intelligence import generate_intelligence_answer


#  1. List or create a conversation
class ConversationListCreateView(APIView):
    def get(self, request):
        conversations = Conversation.objects.all().order_by('-started_at')
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)

    def post(self, request):
        title = request.data.get('title', 'New Conversation')
        conversation = Conversation.objects.create(title=title)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# 2. Get conversation details
class ConversationDetailView(APIView):
    def get(self, request, pk):
        conversation = get_object_or_404(Conversation, pk=pk)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)


# 3. Message handling (user + assistant)
class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        return Message.objects.filter(conversation_id=self.kwargs['pk']).order_by('timestamp')

    def create(self, request, *args, **kwargs):
        conversation_id = self.kwargs['pk']
        content = request.data.get("content", "").strip()

        if not content:
            return Response({"error": "Message content is required."}, status=400)

        # Save user message
        user_msg = Message.objects.create(
            conversation_id=conversation_id, sender="user", content=content
        )

        # Fetch conversation history
        all_messages = Message.objects.filter(conversation_id=conversation_id).order_by("timestamp")

        # Generate AI reply
        ai_text = generate_ai_reply(all_messages)

        # Save AI message
        ai_msg = Message.objects.create(
            conversation_id=conversation_id, sender="assistant", content=ai_text
        )

        # Update title if needed
        conversation = Conversation.objects.get(id=conversation_id)
        if conversation.title in ["New Chat", "New Conversation", "", None]:
            context_msgs = list(all_messages)[-4:]
            conversation.title = generate_conversation_title(context_msgs)
            conversation.save()

        serializer = MessageSerializer([user_msg, ai_msg], many=True)
        return Response(serializer.data, status=201)


# 4. End conversation (generate summary)
class EndConversationView(APIView):
    def post(self, request, pk):
        conversation = get_object_or_404(Conversation, pk=pk)
        conversation.status = "ended"
        conversation.ended_at = timezone.now()

        messages = Message.objects.filter(conversation_id=pk).order_by("timestamp")
        formatted = [{"role": m.sender, "content": m.content} for m in messages]

        summary = generate_summary(formatted)
        conversation.summary = summary
        conversation.save()

        return Response({"message": "Conversation ended", "summary": summary})


# 5. Rename conversation
class ConversationRenameView(APIView):
    def patch(self, request, pk):
        conversation = get_object_or_404(Conversation, pk=pk)
        title = request.data.get("title", "").strip()

        if not title:
            return Response({"error": "Title is required."}, status=400)

        conversation.title = title
        conversation.save()
        return Response({"message": "Conversation renamed"})


#  6. Delete conversation
class ConversationDeleteView(APIView):
    def delete(self, request, pk):
        conversation = get_object_or_404(Conversation, pk=pk)
        conversation.delete()
        return Response({"message": "Conversation deleted"})

# 7. Conversation Intelligence View

class ConversationIntelligenceView(APIView):
  

    def post(self, request, pk):
        question = request.data.get("question", "").strip()

        if not question:
            return Response({"error": "Question cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        conversation = get_object_or_404(Conversation, pk=pk)

        try:
            answer = generate_intelligence_answer(conversation.id, question)
            return Response({"answer": answer})
        except Exception as e:
            return Response(
                {"error": f"AI generation failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
