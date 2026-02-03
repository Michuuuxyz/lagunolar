import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/discord/guilds - Proxy para buscar servidores do Discord
router.get("/guilds", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Token de autenticação não fornecido"
      });
    }

    const accessToken = authHeader.substring(7); // Remove "Bearer "

    // Fazer request para Discord API
    const { data: guilds } = await axios.get("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Filtrar apenas servidores onde o usuário tem permissões de administrador ou gerenciar servidor
    const MANAGE_GUILD = 0x0000000000000020; // 32
    const ADMINISTRATOR = 0x0000000000000008; // 8

    const managedGuilds = guilds.filter((guild: any) => {
      const permissions = parseInt(guild.permissions);
      return (permissions & ADMINISTRATOR) === ADMINISTRATOR || (permissions & MANAGE_GUILD) === MANAGE_GUILD;
    });

    res.json({
      success: true,
      data: managedGuilds
    });
  } catch (error: any) {
    console.error("[DISCORD API] Erro ao buscar guilds:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        error: "Token de acesso inválido ou expirado"
      });
    }

    res.status(500).json({
      success: false,
      error: "Erro ao buscar servidores do Discord"
    });
  }
});

export default router;
