import axios, { AxiosInstance } from "axios";
import type { ApiResponse, BotStats, GuildConfig, Command, UserWarnings, LogEntry } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  setAuthToken(token: string) {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Bot Stats
  async getBotStats(): Promise<BotStats> {
    const { data } = await this.client.get<ApiResponse<BotStats>>("/api/bot/stats");
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }

  // Commands
  async getCommands(): Promise<Command[]> {
    const { data } = await this.client.get<ApiResponse<Command[]>>("/api/bot/commands");
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }

  // Guild Config
  async getGuildConfig(guildId: string): Promise<GuildConfig> {
    const { data } = await this.client.get<ApiResponse<GuildConfig>>(`/api/guilds/${guildId}/config`);
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }

  async updateGuildConfig(guildId: string, config: Partial<GuildConfig>): Promise<GuildConfig> {
    const { data } = await this.client.patch<ApiResponse<GuildConfig>>(
      `/api/guilds/${guildId}/config`,
      config
    );
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }

  // Warnings
  async getGuildWarnings(guildId: string): Promise<UserWarnings[]> {
    const { data } = await this.client.get<ApiResponse<UserWarnings[]>>(
      `/api/guilds/${guildId}/warnings`
    );
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }

  async getUserWarnings(guildId: string, userId: string): Promise<UserWarnings> {
    const { data } = await this.client.get<ApiResponse<UserWarnings>>(
      `/api/guilds/${guildId}/warnings/${userId}`
    );
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }

  async clearWarning(guildId: string, warnId: string): Promise<void> {
    const { data } = await this.client.delete<ApiResponse>(
      `/api/guilds/${guildId}/warnings/${warnId}`
    );
    if (!data.success) throw new Error(data.error);
  }

  // Logs
  async getGuildLogs(guildId: string, limit = 50, offset = 0): Promise<LogEntry[]> {
    const { data } = await this.client.get<ApiResponse<LogEntry[]>>(
      `/api/guilds/${guildId}/logs`,
      {
        params: { limit, offset },
      }
    );
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }

  // User Guilds
  async getUserGuilds(accessToken: string): Promise<any[]> {
    const { data } = await this.client.get("/api/discord/guilds", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }
}

export const api = new ApiClient();
