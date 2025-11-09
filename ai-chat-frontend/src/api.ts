const BASE_URL = "http://127.0.0.1:8000/api";

export async function createConversation() {
  const res = await fetch(`${BASE_URL}/conversations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "New Chat" }),
  });
  return res.json();
}

export async function getAllConversations() {
  const res = await fetch(`${BASE_URL}/conversations/`);
  return res.json();
}

export async function getConversation(id: number) {
  const res = await fetch(`${BASE_URL}/conversations/${id}/`);
  return res.json();
}

export async function sendMessage(
  conversationId: number,
  sender: string,
  content: string
) {
  const res = await fetch(
    `${BASE_URL}/conversations/${conversationId}/messages/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, content }),
    }
  );
  return res.json();
}

export async function deleteConversation(id: number) {
  await fetch(`${BASE_URL}/conversations/${id}/delete/`, {
    method: "DELETE",
  });
}
export async function renameConversation(id: number, title: string) {
  await fetch(`${BASE_URL}/conversations/${id}/rename/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
}
export async function endConversation(conversationId: number) {
  const res = await fetch(`${BASE_URL}/conversations/${conversationId}/end/`, {
    method: "POST"
  });
  return res.json();  // ✅ important! we need summary returned
}

export async function askIntelligence(conversationId: number, question: string) {
  const res = await fetch(`${BASE_URL}/conversations/${conversationId}/intelligence/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch intelligence result");
  }

  return await res.json();
}
