import express from "express";
import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// Discord client para obter stats
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

if (process.env.DISCORD_BOT_TOKEN) {
  client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
}

// GET /api/bot/stats - Estatísticas do bot
router.get("/stats", async (req, res) => {
  try {
    if (!client.isReady()) {
      return res.json({
        success: true,
        data: {
          servers: 0,
          users: 0,
          commands: 0,
          uptime: 0,
          ping: 0,
        },
      });
    }

    const guilds = client.guilds.cache;
    const users = guilds.reduce((acc, guild) => acc + guild.memberCount, 0);

    res.json({
      success: true,
      data: {
        servers: guilds.size,
        users: users,
        commands: 15, // Número fixo ou ler dos arquivos
        uptime: process.uptime() * 1000,
        ping: client.ws.ping,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar stats" });
  }
});

// GET /api/bot/commands - Lista de comandos
router.get("/commands", async (req, res) => {
  try {
    // Aqui você pode ler os comandos do diretório do bot ou manter uma lista fixa
    const commands = [
      // Fun
      { name: "joke", description: "Conta uma piada aleatória", category: "Fun" },
      { name: "roast", description: "Dá um roast num user", category: "Fun", usage: "/roast @user" },
      { name: "8ball", description: "Faz uma pergunta à bola mágica", category: "Fun", usage: "/8ball [pergunta]" },
      { name: "calculator", description: "Calculadora interativa", category: "Fun" },
      // Info
      { name: "userinfo", description: "Informações de um utilizador", category: "Info", usage: "/userinfo [@user]" },
      { name: "serverinfo", description: "Informações do servidor", category: "Info" },
      { name: "avatar", description: "Mostra o avatar de alguém", category: "Info", usage: "/avatar [@user]" },
      { name: "ping", description: "Verifica a latência do bot", category: "Info" },
      { name: "help", description: "Lista de comandos", category: "Info" },
      { name: "info", description: "Informações do bot", category: "Info" },
      // Moderation
      { name: "warn", description: "Avisa um utilizador", category: "Moderation", usage: "/warn @user [razão]", permissions: ["MODERATE_MEMBERS"] },
      { name: "ban", description: "Bane um utilizador", category: "Moderation", usage: "/ban @user [razão]", permissions: ["BAN_MEMBERS"] },
      { name: "kick", description: "Expulsa um utilizador", category: "Moderation", usage: "/kick @user [razão]", permissions: ["KICK_MEMBERS"] },
      { name: "mute", description: "Silencia um utilizador", category: "Moderation", usage: "/mute @user [duração] [razão]", permissions: ["MODERATE_MEMBERS"] },
      { name: "clear", description: "Limpa mensagens", category: "Moderation", usage: "/clear [quantidade]", permissions: ["MANAGE_MESSAGES"] },
    ];

    res.json({
      success: true,
      data: commands,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar comandos" });
  }
});

export default router;
