import axios, { AxiosInstance } from "axios";
import type { ApiResponse, BotStats, GuildConfig, Command, UserWarnings, LogEntry, BanData } from "@/types";

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

  // Bans
  async getGuildBans(guildId: string): Promise<BanData[]> {
    const { data } = await this.client.get<ApiResponse<BanData[]>>(
      `/api/guilds/${guildId}/bans`
    );
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }

  // Guild Info & Stats
  async getGuildInfo(guildId: string): Promise<{ id: string; name: string; icon: string | null; memberCount: number }> {
    const { data } = await this.client.get<ApiResponse<any>>(
      `/api/bot/guilds/${guildId}/info`
    );
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }

  async getGuildStats(guildId: string): Promise<{
    totalWarns: number;
    warnsLast30Days: number;
    totalBans: number;
    totalLogs: number;
    logsToday: number;
    sparklines: { logs: number[]; warns: number[] };
  }> {
    const { data } = await this.client.get<ApiResponse<any>>(
      `/api/guilds/${guildId}/stats`
    );
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }

  async getRecentLogs(guildId: string, limit: number = 10): Promise<any[]> {
    const { data } = await this.client.get<ApiResponse<any[]>>(
      `/api/logs/${guildId}/recent?limit=${limit}`
    );
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }

  async getActivityData(guildId: string): Promise<any[]> {
    const { data } = await this.client.get<ApiResponse<any[]>>(
      `/api/logs/${guildId}/activity`
    );
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }

  // Logs
  async getGuildLogs(guildId: string, type?: string, limit = 100, skip = 0): Promise<{ logs: LogEntry[], total: number }> {
    const params: any = { limit, skip };
    if (type) params.type = type;

    const { data } = await this.client.get<ApiResponse<{ logs: LogEntry[], total: number, limit: number, skip: number }>>(
      `/api/logs/${guildId}`,
      { params }
    );
    if (!data.success) throw new Error(data.error);
    return { logs: data.data!.logs, total: data.data!.total };
  }

  async getGuildLogStats(guildId: string): Promise<{ total: number, last24h: number, byType: { type: string, count: number }[] }> {
    const { data } = await this.client.get<ApiResponse<{ total: number, last24h: number, byType: { type: string, count: number }[] }>>(
      `/api/logs/${guildId}/stats`
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

  // Guild Channels
  async getGuildChannels(guildId: string): Promise<{ id: string; name: string; position: number }[]> {
    const { data } = await this.client.get<ApiResponse<{ id: string; name: string; position: number }[]>>(
      `/api/bot/guilds/${guildId}/channels`
    );
    if (!data.success) throw new Error(data.error);
    return data.data!;
  }
}

export const api = new ApiClient();
