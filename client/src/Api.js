// Can load with either local host or deployed link
const BASE_URL = import.meta.env.VITE_API_URL || "https://book-app-3f9e.onrender.com";

const TOKEN_KEY = "access_token";

// Keep the token in memory for fast access and persist it to localStorage
let token = localStorage.getItem(TOKEN_KEY) || null;

export function setToken(newToken) {
  token = newToken;
  if (newToken) {
    localStorage.setItem(TOKEN_KEY, newToken);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getToken() {
  return token;
}

export function clearToken() {
  setToken(null);
}

// Ensures authorization only happens if the token exists
function authHeaders() {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...authHeaders(),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });

  // Handle logout
  if (res.status === 204) return {};

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  // sends error if no error was given
  if (!res.ok && !data.error) {
    data.error = `Request failed with status ${res.status}`;
  }

  return data;
}

export function apiGet(path) {
  return apiFetch(path, { method: "GET" });
}

export function apiPost(path, body) {
  return apiFetch(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiPatch(path, body) {
  return apiFetch(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete(path) {
  return apiFetch(path, { method: "DELETE" });
}