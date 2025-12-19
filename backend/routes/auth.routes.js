import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validateEmailPassword } from "../middleware/validateInput.js";
import { sanitizeInput } from "../middleware/sanitize.js";

const router = express.Router();

router.post(
  "/register",
  sanitizeInput,
  validateEmailPassword,
  register
);

router.post(
  "/login",
  sanitizeInput,
  validateEmailPassword,
  login
);

export default router;
