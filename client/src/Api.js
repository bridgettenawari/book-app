// Can load with either local host or deployed link
const BASE_URL = import.meta.env.VITE_API_URL || "https://book-app-3f9e.onrender.com";



async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // Handle 204 (logout) with no body
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
