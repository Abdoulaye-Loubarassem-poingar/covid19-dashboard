// src/auth/authService.js

export function hashPassword(password) {
  return crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password)
  ).then(buffer =>
    Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

export async function register(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.username === username)) {
    throw new Error("Utilisateur déjà existant");
  }

  const hashed = await hashPassword(password);
  users.push({ username, password: hashed });

  localStorage.setItem("users", JSON.stringify(users));
}

export async function login(username, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const hashed = await hashPassword(password);

  const user = users.find(
    u => u.username === username && u.password === hashed
  );

  if (!user) throw new Error("Identifiants invalides");

  localStorage.setItem("session", JSON.stringify({ username }));
}

export function logout() {
  localStorage.removeItem("session");
}

export function getSession() {
  return JSON.parse(localStorage.getItem("session"));
}
