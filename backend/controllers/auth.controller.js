import bcrypt from "bcryptjs";
import { body, validationResult } from 'express-validator';
const users = []; // mémoire (OK pour projet scolaire)

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashed }; // On crée l'objet
  users.push(newUser);

  // Correction ici : on ajoute .status(201) et on renvoie l'utilisateur
  res.status(201).json({ 
    message: "Utilisateur enregistré", 
    user: newUser 
  });
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

  res.json({
    message: "Connexion réussie",
    user: { email }
  });
};
