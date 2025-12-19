import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";


const app = express();

// Sécurité & middleware
app.use(cors({ origin: ["http://localhost:5173", "https://covid19-dashboard-bvn1j0oup.vercel.app"] }));
app.use(express.json());
app.use(helmet());

// Routes
app.use("/auth", authRoutes);

// Test serveur
app.get("/", (req, res) => {
  res.json({ message: "Backend COVID OK" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend lancé sur http://localhost:${PORT}`);
});
