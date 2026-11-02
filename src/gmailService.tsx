import { auth } from "./firebaseClient";

const API_URL = "http://localhost:5000";

async function getAuthHeaders() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const idToken = await user.getIdToken();

  return {
    Authorization: `Bearer ${idToken}`,
  };
}

export async function connectGmail() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/gmail/login`, {
    method: "POST",
    headers,
  });

  if (!response.ok) {
    throw new Error("Unable to start Gmail authentication.");
  }

  const data = await response.json();

  window.location.assign(data.url);
}

export async function getEmails() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/api/gmail`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch emails.");
  }

  return response.json();
}