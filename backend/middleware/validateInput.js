import validator from "validator";

export const validateEmailPassword = (req, res, next) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ error: "Mot de passe faible" });
  }

  next();
};
