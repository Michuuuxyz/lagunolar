import express from "express";
import Guild from "../models/Guild";
import Warn from "../models/Warn";

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

export default router;
