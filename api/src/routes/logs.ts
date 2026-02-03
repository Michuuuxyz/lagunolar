import express from "express";
import Log from "../models/Log";

const router = express.Router();

// GET /api/logs/:guildId - Buscar logs de um servidor
router.get("/:guildId", async (req, res) => {
  try {
    const { guildId } = req.params;
    const { type, limit = 100, skip = 0 } = req.query;

    const query: any = { guildId };

    if (type) {
      query.type = type;
    }

    const logs = await Log.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .lean();

    const total = await Log.countDocuments(query);

    res.json({
      success: true,
      data: {
        logs,
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar logs" });
  }
});

// GET /api/logs/:guildId/stats - Estatísticas de logs
router.get("/:guildId/stats", async (req, res) => {
  try {
    const { guildId } = req.params;

    const total = await Log.countDocuments({ guildId });

    // Contar por tipo
    const byType = await Log.aggregate([
      { $match: { guildId } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Logs recentes (últimas 24h)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const last24h = await Log.countDocuments({
      guildId,
      createdAt: { $gte: yesterday },
    });

    res.json({
      success: true,
      data: {
        total,
        last24h,
        byType: byType.map(item => ({
          type: item._id,
          count: item.count,
        })),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar estatísticas" });
  }
});

// GET /api/logs/:guildId/recent - Logs recentes para feed de atividades
router.get("/:guildId/recent", async (req, res) => {
  try {
    const { guildId } = req.params;
    const { limit = 10 } = req.query;

    const logs = await Log.find({ guildId })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar logs recentes" });
  }
});

// GET /api/logs/:guildId/activity - Dados de atividade dos últimos 7 dias
router.get("/:guildId/activity", async (req, res) => {
  try {
    const { guildId } = req.params;

    // Últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Agregar por dia e tipo
    const activity = await Log.aggregate([
      {
        $match: {
          guildId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$type",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.date": 1 },
      },
    ]);

    // Organizar dados por dia
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const result: any[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = days[date.getDay()];

      const dayData = {
        date: dayName,
        messages: 0,
        joins: 0,
        warns: 0,
        commands: 0,
      };

      // Contar eventos deste dia
      activity.forEach((item) => {
        if (item._id.date === dateStr) {
          const type = item._id.type;
          if (type.includes("message")) dayData.messages += item.count;
          else if (type.includes("Member")) dayData.joins += item.count;
          else if (type.includes("warn")) dayData.warns += item.count;
          else if (type.includes("command")) dayData.commands += item.count;
        }
      });

      result.push(dayData);
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao buscar atividade" });
  }
});

export default router;
