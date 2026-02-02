import mongoose from "mongoose";

const guildSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  logChannel: {
    type: String,
    default: null,
  },
  enabledLogs: {
    messages: { type: Boolean, default: true },
    members: { type: Boolean, default: true },
    roles: { type: Boolean, default: true },
    channels: { type: Boolean, default: true },
    voice: { type: Boolean, default: true },
    reactions: { type: Boolean, default: true },
    server: { type: Boolean, default: true },
    invites: { type: Boolean, default: true },
    webhooks: { type: Boolean, default: true },
    events: { type: Boolean, default: true },
    automod: { type: Boolean, default: true },
    integrations: { type: Boolean, default: true },
  },
  prefix: {
    type: String,
    default: null,
  },
  settings: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map(),
  },
}, {
  timestamps: true,
});

export default mongoose.model("Guild", guildSchema);
