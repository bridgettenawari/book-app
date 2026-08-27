const BASE_URL = "https://book-app-3f9e.onrender.com";

/**
 * Wraps fetch with the base URL, JSON headers, and credentials (so the
 * Flask session cookie is sent/received). Throws on network failure;
 * callers check `res.ok` / `data.error` themselves since the Flask API
 * returns errors as JSON with non-2xx status rather than throwing.
 */
export function apiFetch(path, options = {}) {
  return fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
}

export function apiGet(path) {
  return apiFetch(path).then((res) => res.json());
}

export function apiPost(path, body) {
  return apiFetch(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  }).then((res) => res.json());
}

export function apiPatch(path, body) {
  return apiFetch(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  }).then((res) => res.json());
}

export function apiDelete(path) {
  return apiFetch(path, { method: "DELETE" }).then((res) => res.json());
}
