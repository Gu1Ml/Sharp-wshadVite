const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5085";

const defaultOptions = {
  credentials: "include", // mantém cookies/session se o backend usar
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  if (response.ok) {
    if (isJson) return response.json();
    return null;
  }

  // Tenta extrair mensagem de erro
  let payload = null;
  try {
    payload = isJson ? await response.json() : await response.text();
  } catch (e) {
    payload = await response.text().catch(() => null);
  }

  // Tratamento especial para 401
  if (response.status === 401) {
    // opcional: logout automático ou redirecionamento
    // window.location.href = "/login";
    const err = new Error("Não autorizado (401)");
    err.status = 401;
    err.payload = payload;
    throw err;
  }

  const err = new Error(payload?.Erro || payload?.message || `HTTP ${response.status}`);
  err.status = response.status;
  err.payload = payload;
  throw err;
}

function buildUrl(path) {
  // aceita path com ou sem leading slash
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${p}`;
}

export async function get(path) {
  const url = buildUrl(path);
  const response = await fetch(url, {
    method: "GET",
    ...defaultOptions,
  });
  return handleResponse(response);
}

export async function post(path, body) {
  const url = buildUrl(path);
  const response = await fetch(url, {
    method: "POST",
    ...defaultOptions,
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse(response);
}

export async function put(path, body) {
  const url = buildUrl(path);
  const response = await fetch(url, {
    method: "PUT",
    ...defaultOptions,
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse(response);
}

export async function del(path) {
  const url = buildUrl(path);
  const response = await fetch(url, {
    method: "DELETE",
    ...defaultOptions,
  });
  return handleResponse(response);
}

// For file upload (multipart/form-data)
export async function upload(path, formData) {
  const url = buildUrl(path);
  const response = await fetch(url, {
    method: "POST",
    credentials: defaultOptions.credentials,
    body: formData,
    // Do not set Content-Type: browser adds the boundary
  });
  return handleResponse(response);
}

export default { get, post, put, del, upload };