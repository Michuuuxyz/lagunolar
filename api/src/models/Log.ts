import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  executor: {
    id: String,
    username: String,
    avatar: String,
  },
  target: {
    id: String,
    username: String,
    name: String,
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
  },
  reason: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Índices compostos
logSchema.index({ guildId: 1, createdAt: -1 });
logSchema.index({ guildId: 1, type: 1, createdAt: -1 });

export default mongoose.model("Log", logSchema);
