from django.urls import path

from .views import (
    ConversationDeleteView,
    ConversationIntelligenceView,
    ConversationListCreateView,
    ConversationDetailView,
    EndConversationView,
    MessageListCreateView,
    ConversationRenameView,
    ConversationIntelligenceView
)

urlpatterns = [
    path('conversations/', ConversationListCreateView.as_view(), name='conversation-list-create'),
    path('conversations/<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('conversations/<int:pk>/end/', EndConversationView.as_view(), name='end-conversation'),
    path('conversations/<int:pk>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
    path('conversations/<int:pk>/delete/', ConversationDeleteView.as_view(), name='conversation-delete'),
    path("conversations/<int:pk>/rename/", ConversationRenameView.as_view()),
    path("conversations/<int:pk>/end/", EndConversationView.as_view()),
    path("conversations/<int:pk>/intelligence/", ConversationIntelligenceView.as_view()),
]

