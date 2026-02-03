import mongoose from "mongoose";

const banSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  moderatorId: {
    type: String,
    default: null,
  },
  reason: {
    type: String,
    default: "Sem motivo fornecido",
  },
  banId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    default: "Usuário Desconhecido",
  },
  userTag: {
    type: String,
    default: null,
  },
  moderatorTag: {
    type: String,
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

banSchema.index({ guildId: 1, userId: 1 });

export default mongoose.model("Ban", banSchema);
