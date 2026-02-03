import express from "express";
import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "path";
import { getAllCommands } from "../utils/commandParser";

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
    // Obter número real de comandos
    const commands = await getAllCommands();
    const commandCount = commands.length;

    if (!client.isReady()) {
      return res.json({
        success: true,
        data: {
          servers: 0,
          users: 0,
          commands: commandCount,
          uptime: 0,
          ping: 0,
        },
      });
    }

    const guilds = client.guilds.cache;
    const users = guilds.reduce((acc: number, guild) => acc + guild.memberCount, 0);

    res.json({
      success: true,
      data: {
        servers: guilds.size,
        users: users,
        commands: commandCount,
        uptime: process.uptime() * 1000,
        ping: client.ws.ping,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar stats" });
  }
});

// GET /api/bot/commands - Lista de comandos sincronizada com o bot
router.get("/commands", async (req, res) => {
  try {
    const commands = await getAllCommands();

    res.json({
      success: true,
      data: commands,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar comandos" });
  }
});

// GET /api/bot/guilds/:guildId/channels - Buscar canais de texto de um servidor
router.get("/guilds/:guildId/channels", async (req, res) => {
  try {
    const { guildId } = req.params;

    if (!client.isReady()) {
      return res.status(503).json({
        success: false,
        error: "Bot não está conectado"
      });
    }

    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
      return res.status(404).json({
        success: false,
        error: "Servidor não encontrado"
      });
    }

    // Buscar apenas canais de texto
    const textChannels = guild.channels.cache
      .filter(channel => channel.type === 0) // 0 = GUILD_TEXT
      .map(channel => ({
        id: channel.id,
        name: channel.name,
        position: channel.position,
      }))
      .sort((a, b) => a.position - b.position);

    res.json({
      success: true,
      data: textChannels,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar canais" });
  }
});

export default router;
