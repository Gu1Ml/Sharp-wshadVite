const API_URL = "http://localhost:5085"; // backend Sharp

async function apiGet(endpoint) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "GET",
    credentials: "include",
  });
  return response.json();
}

async function apiPost(endpoint, data) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}