import request from "supertest";
import bcrypt from "bcrypt";
import app from "../app.js";

describe("Sécurité Backend - tests globaux", () => {

  // 🔹 Test Hash mot de passe
  it("doit hashé le mot de passe lors de l'enregistrement", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "test@secure.com",
        password: "Password123!"
      });

    expect(res.statusCode).toBe(201);
    const user = res.body.user;

    expect(user.password).not.toBe("Password123!");
    expect(user.password.startsWith("$2")).toBe(true);

    const ok = await bcrypt.compare("Password123!", user.password);
    expect(ok).toBe(true);
  });

  // 🔹 Test XSS
  it("bloque les scripts XSS", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "xss@test.com",
        password: "<script>alert('XSS')</script>"
      });

    expect(res.statusCode).toBe(400);
  });

  // 🔹 Test validation inputs
  it("rejette un email invalide", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "bad-email",
        password: "Password123!"
      });

    expect(res.statusCode).toBe(400);
  });

  it("rejette un mot de passe trop faible", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "user@test.com",
        password: "123"
      });

    expect(res.statusCode).toBe(400);
  });

  // 🔹 Test injection MongoDB / SQL
  it("rejette les tentatives d'injection", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "' OR 1=1 --",
        password: "test"
      });

    expect(res.statusCode).toBe(400);
  });

});
