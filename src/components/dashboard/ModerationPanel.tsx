"use client";

import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import type { UserWarnings, BanData } from "@/types";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  Trash2,
  User,
  Search,
  Shield,
  Ban,
  ChevronDown,
  ChevronUp,
  Loader2,
  Calendar,
  UserX,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface ModerationPanelProps {
  guildId: string;
}

type Tab = "warns" | "bans";

export function ModerationPanel({ guildId }: ModerationPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("warns");
  const [warnings, setWarnings] = useState<UserWarnings[]>([]);
  const [bans, setBans] = useState<BanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (activeTab === "warns") {
      fetchWarnings();
    } else {
      fetchBans();
    }
  }, [guildId, activeTab]);

  const fetchWarnings = async () => {
    try {
      setLoading(true);
      const data = await api.getGuildWarnings(guildId);
      setWarnings(data);
    } catch (error) {
      console.error("Erro ao buscar warnings:", error);
      toast.error("Erro ao carregar avisos");
    } finally {
      setLoading(false);
    }
  };

  const fetchBans = async () => {
    try {
      setLoading(true);
      const data = await api.getGuildBans(guildId);
      setBans(data);
    } catch (error) {
      console.error("Erro ao buscar bans:", error);
      toast.error("Erro ao carregar banimentos");
    } finally {
      setLoading(false);
    }
  };

  const handleClearWarn = async (warnId: string) => {
    if (!confirm("Tem certeza que deseja remover este aviso?")) return;

    try {
      await api.clearWarning(guildId, warnId);
      toast.success("Aviso removido!");
      fetchWarnings();
    } catch (error) {
      toast.error("Erro ao remover aviso");
    }
  };

  const toggleUserExpanded = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const filteredWarnings = warnings.filter((w) =>
    w.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBans = bans.filter(
    (b) =>
      b.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userTag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWarns = warnings.reduce((sum, w) => sum + w.totalWarns, 0);
  const activeBans = bans.filter((b) => b.active).length;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-4xl font-bold text-gradient-gold mb-2">Moderação</h1>
        <p className="text-gray-400">Gerencie avisos e banimentos do servidor</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-warning to-reptile-amber">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total de Warns</p>
              <p className="text-2xl font-bold text-white">{totalWarns}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-error to-warning">
              <Ban className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Banimentos Ativos</p>
              <p className="text-2xl font-bold text-white">{activeBans}</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-5 border border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-reptile-gold to-reptile-amber">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Usuários com Warns</p>
              <p className="text-2xl font-bold text-white">{warnings.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs & Search */}
      <motion.div variants={fadeInUp} className="glass-strong rounded-xl p-6 border border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex gap-2 bg-bg-card rounded-lg p-1">
            <button
              onClick={() => setActiveTab("warns")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === "warns"
                  ? "bg-gradient-to-r from-warning to-reptile-amber text-white shadow-gold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Warns
              <Badge variant={activeTab === "warns" ? "secondary" : "outline"} size="sm">
                {totalWarns}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("bans")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === "bans"
                  ? "bg-gradient-to-r from-error to-warning text-white shadow-gold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Ban className="w-4 h-4" />
              Bans
              <Badge variant={activeTab === "bans" ? "secondary" : "outline"} size="sm">
                {activeBans}
              </Badge>
            </button>
          </div>

          {/* Search */}
          <div className="w-full md:w-64">
            <Input
              icon={<Search className="w-4 h-4" />}
              placeholder="Buscar usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 className="w-8 h-8 animate-spin text-reptile-gold" />
              <span className="ml-3 text-gray-400">Carregando...</span>
            </motion.div>
          ) : activeTab === "warns" ? (
            <motion.div
              key="warns"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {filteredWarnings.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">
                    {searchTerm ? "Nenhum warn encontrado" : "Nenhum warn registrado"}
                  </p>
                </div>
              ) : (
                filteredWarnings.map((userWarn) => (
                  <div
                    key={userWarn.userId}
                    className="glass rounded-lg border border-gray-800 hover:border-gray-700 transition-colors overflow-hidden"
                  >
                    {/* User Header */}
                    <button
                      onClick={() => toggleUserExpanded(userWarn.userId)}
                      className="w-full flex items-center justify-between p-4 hover:bg-bg-card transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-warning/20">
                          <User className="w-5 h-5 text-warning" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-white">{userWarn.username}</p>
                          <p className="text-sm text-gray-400">
                            {userWarn.totalWarns} {userWarn.totalWarns === 1 ? "warn" : "warns"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="warning">
                          {userWarn.totalWarns}
                        </Badge>
                        {expandedUsers.has(userWarn.userId) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Warns List */}
                    <AnimatePresence>
                      {expandedUsers.has(userWarn.userId) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-800"
                        >
                          <div className="p-4 space-y-2 bg-bg-darker">
                            {userWarn.warnings.map((warn) => (
                              <div
                                key={warn._id}
                                className="flex items-start justify-between p-3 rounded-lg bg-bg-card border border-gray-800"
                              >
                                <div className="flex-1">
                                  <p className="text-white text-sm mb-2">{warn.reason}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {formatDate(warn.timestamp)}
                                    </span>
                                    <span>Mod: {warn.moderatorId}</span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleClearWarn(warn._id)}
                                  className="text-error hover:text-error hover:bg-error/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="bans"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {filteredBans.length === 0 ? (
                <div className="text-center py-12">
                  <Ban className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">
                    {searchTerm ? "Nenhum ban encontrado" : "Nenhum banimento registrado"}
                  </p>
                </div>
              ) : (
                filteredBans.map((ban) => (
                  <div
                    key={ban.userId}
                    className={`glass rounded-lg p-4 border transition-colors ${
                      ban.active ? "border-error/50 bg-error/5" : "border-gray-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          ban.active ? "bg-error/20" : "bg-gray-800"
                        }`}>
                          <UserX className={`w-5 h-5 ${
                            ban.active ? "text-error" : "text-gray-400"
                          }`} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{ban.username}</p>
                          <p className="text-sm text-gray-400">{ban.userTag}</p>
                          <p className="text-sm text-gray-300 mt-2">{ban.reason}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(ban.timestamp)}
                            </span>
                            <span>Mod: {ban.moderatorId}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={ban.active ? "error" : "outline"}>
                        {ban.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
