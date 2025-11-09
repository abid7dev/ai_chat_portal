from django.db import models

class Conversation(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, default='active')  # active or ended
    summary = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title or f"Conversation {self.id}"


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=50, choices=(('user', 'User'), ('ai', 'AI')))
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.content[:30]}"
