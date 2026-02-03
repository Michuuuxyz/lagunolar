import express from "express";
import Guild from "../models/Guild";
import Warn from "../models/Warn";
import Ban from "../models/Ban";
import Log from "../models/Log";
import { io } from "../index";

const router = express.Router();

// GET /api/guilds/:guildId/config - Obter configuração do servidor
router.get("/:guildId/config", async (req, res) => {
  try {
    const { guildId } = req.params;

    let guild = await Guild.findOne({ guildId });

    // Se não existir, criar com valores padrão
    if (!guild) {
      guild = new Guild({ guildId });
      await guild.save();
    }

    res.json({
      success: true,
      data: guild,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar configuração" });
  }
});

// PATCH /api/guilds/:guildId/config - Atualizar configuração
router.patch("/:guildId/config", async (req, res) => {
  try {
    const { guildId } = req.params;
    const updates = req.body;

    console.log(`[GUILD] Atualizando config para guild ${guildId}:`, JSON.stringify(updates));

    let guild = await Guild.findOne({ guildId });

    if (!guild) {
      console.log(`[GUILD] Criando novo guild ${guildId}`);
      guild = new Guild({ guildId, ...updates });
      await guild.save();
    } else {
      console.log(`[GUILD] Guild ${guildId} encontrado, atualizando...`);

      // Atualizar campos específicos para garantir que subdocumentos sejam salvos corretamente
      if (updates.logChannel !== undefined) {
        guild.logChannel = updates.logChannel;
      }
      if (updates.enabledLogs && guild.enabledLogs) {
        // Atualizar cada campo individualmente para evitar problemas com subdocumentos
        Object.keys(updates.enabledLogs).forEach(key => {
          (guild!.enabledLogs as any)[key] = updates.enabledLogs[key];
        });
      }
      if (updates.prefix !== undefined) {
        guild.prefix = updates.prefix;
      }

      await guild.save();
    }

    console.log(`[GUILD] ✅ Config salva para guild ${guildId}. logChannel=${guild.logChannel}`);

    // Emitir evento WebSocket para notificar o bot
    io.emit("guild:config:updated", {
      guildId,
      config: {
        logChannel: guild.logChannel,
        enabledLogs: guild.enabledLogs,
        prefix: guild.prefix,
      },
    });
    console.log(`[WEBSOCKET] 📡 Evento guild:config:updated enviado para guild ${guildId}`);

    res.json({
      success: true,
      data: guild,
    });
  } catch (error) {
    console.error("[GUILD] ❌ Erro ao atualizar configuração:", error);
    res.status(500).json({ success: false, error: "Erro ao atualizar configuração" });
  }
});

// GET /api/guilds/:guildId/warnings - Obter todos os avisos do servidor
router.get("/:guildId/warnings", async (req, res) => {
  try {
    const { guildId } = req.params;

    const warns = await Warn.find({ guildId }).sort({ timestamp: -1 });

    // Agrupar por usuário
    const groupedWarns = warns.reduce((acc: any[], warn: any) => {
      const existingUser = acc.find((u) => u.userId === warn.userId);

      if (existingUser) {
        existingUser.warnings.push(warn);
        existingUser.totalWarns++;
      } else {
        acc.push({
          userId: warn.userId,
          username: `User ${warn.userId}`, // Idealmente buscar do Discord
          warnings: [warn],
          totalWarns: 1,
        });
      }

      return acc;
    }, []);

    res.json({
      success: true,
      data: groupedWarns,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar avisos" });
  }
});

// GET /api/guilds/:guildId/warnings/:userId - Obter avisos de um user específico
router.get("/:guildId/warnings/:userId", async (req, res) => {
  try {
    const { guildId, userId } = req.params;

    const warns = await Warn.find({ guildId, userId }).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: {
        userId,
        username: `User ${userId}`,
        warnings: warns,
        totalWarns: warns.length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar avisos" });
  }
});

// DELETE /api/guilds/:guildId/warnings/:warnId - Remover um aviso
router.delete("/:guildId/warnings/:warnId", async (req, res) => {
  try {
    const { guildId, warnId } = req.params;

    const warn = await Warn.findOneAndDelete({ _id: warnId, guildId });

    if (!warn) {
      return res.status(404).json({ success: false, error: "Aviso não encontrado" });
    }

    res.json({
      success: true,
      message: "Aviso removido com sucesso",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao remover aviso" });
  }
});

// GET /api/guilds/:guildId/logs - Obter logs do servidor (futuro)
router.get("/:guildId/logs", async (req, res) => {
  try {
    const { guildId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Por enquanto retorna array vazio
    // No futuro você pode criar um modelo de Log e armazenar os logs
    res.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar logs" });
  }
});

// GET /api/guilds/:guildId/bans - Obter todos os banimentos do servidor
router.get("/:guildId/bans", async (req, res) => {
  try {
    const { guildId } = req.params;
    const { active = "true" } = req.query;

    const query: any = { guildId };
    if (active === "true") {
      query.active = true;
    }

    const bans = await Ban.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bans,
      total: bans.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar banimentos" });
  }
});

// GET /api/guilds/:guildId/bans/:userId - Obter banimentos de um usuário específico
router.get("/:guildId/bans/:userId", async (req, res) => {
  try {
    const { guildId, userId } = req.params;

    const bans = await Ban.find({ guildId, userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bans,
      total: bans.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar banimentos" });
  }
});

// GET /api/guilds/:guildId/stats - Estatísticas agregadas do servidor
router.get("/:guildId/stats", async (req, res) => {
  try {
    const { guildId } = req.params;

    // Total de warns ativos
    const totalWarns = await Warn.countDocuments({ guildId });

    // Warns dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const warnsLast30Days = await Warn.countDocuments({
      guildId,
      timestamp: { $gte: thirtyDaysAgo },
    });

    // Total de bans ativos
    const totalBans = await Ban.countDocuments({ guildId, active: true });

    // Total de logs
    const totalLogs = await Log.countDocuments({ guildId });

    // Logs de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logsToday = await Log.countDocuments({
      guildId,
      createdAt: { $gte: today },
    });

    // Logs dos últimos 7 dias para sparkline
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logsSparkline: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await Log.countDocuments({
        guildId,
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });

      logsSparkline.push(count);
    }

    const warnsSparkline: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await Warn.countDocuments({
        guildId,
        timestamp: { $gte: dayStart, $lte: dayEnd },
      });

      warnsSparkline.push(count);
    }

    res.json({
      success: true,
      data: {
        totalWarns,
        warnsLast30Days,
        totalBans,
        totalLogs,
        logsToday,
        sparklines: {
          logs: logsSparkline,
          warns: warnsSparkline,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar estatísticas" });
  }
});

export default router;
