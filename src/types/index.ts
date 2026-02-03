// Discord Types
export interface DiscordUser {
  id: string;
  username: string;
  global_name?: string; // Nome de exibição global do Discord
  avatar: string | null;
  email?: string;
  verified?: boolean;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
  memberCount?: number;
}

// Bot Types
export interface BotStats {
  servers: number;
  users: number;
  commands: number;
  uptime: number;
  ping: number;
}

export interface Command {
  name: string;
  description: string;
  category: "Fun" | "Info" | "Moderation";
  usage?: string;
  permissions?: string[];
}

// Guild Configuration
export interface GuildConfig {
  guildId: string;
  logChannel: string | null;
  enabledLogs: {
    messages: boolean;
    members: boolean;
    roles: boolean;
    channels: boolean;
    voice: boolean;
    reactions: boolean;
    server: boolean;
    invites: boolean;
    webhooks: boolean;
    events: boolean;
    automod: boolean;
    integrations: boolean;
  };
  prefix: string | null;
  settings: Record<string, any>;
}

// Warns System
export interface Warn {
  _id: string;
  guildId: string;
  userId: string;
  moderatorId: string;
  reason: string;
  timestamp: Date;
}

export interface UserWarnings {
  userId: string;
  username: string;
  warnings: Warn[];
  totalWarns: number;
}

// Log Entry
export interface LogEntry {
  _id: string;
  guildId: string;
  type: string;
  action: string;
  executor?: {
    id: string;
    username: string;
    avatar?: string;
  };
  target?: {
    id: string;
    username?: string;
    name?: string;
  };
  changes?: Record<string, any>;
  reason?: string;
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Ban Data
export interface BanData {
  userId: string;
  username: string;
  userTag: string;
  reason: string;
  moderatorId: string;
  timestamp: Date;
  active: boolean;
}

// Session Types
export interface Session {
  user: DiscordUser;
  guilds?: DiscordGuild[];
  accessToken: string;
}
