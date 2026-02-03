import express from "express";
import Log from "../models/Log.js";

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

export default router;
