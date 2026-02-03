import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

// Routes
import botRoutes from "./routes/bot";
import guildRoutes from "./routes/guild";
import logsRoutes from "./routes/logs";
import discordRoutes from "./routes/discord";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// WebSocket Server
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro ao conectar MongoDB:", err));

// Trust proxy (necessário para Railway/Vercel/outros proxies)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS - Aceitar múltiplos domínios
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://localhost:3000",
].filter(Boolean); // Remove undefined/null

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sem origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);

    // Verifica se é um domínio permitido ou preview do Vercel
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por janela
  message: "Muitas requisições, tenta novamente mais tarde.",
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/bot", botRoutes);
app.use("/api/guilds", guildRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/discord", discordRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Endpoint não encontrado" });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Erro interno do servidor" });
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log(`🔌 Bot conectado: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔌 Bot desconectado: ${socket.id}`);
  });

  socket.on("ping", () => {
    socket.emit("pong");
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
  console.log(`🔌 WebSocket Server ativo`);
});
