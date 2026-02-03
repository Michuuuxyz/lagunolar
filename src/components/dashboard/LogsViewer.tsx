"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { LogEntry } from "@/types";
import { Clock, User, FileText, Filter } from "lucide-react";

const logTypeLabels: Record<string, string> = {
  messageUpdate: "Mensagem Editada",
  messageDelete: "Mensagem Deletada",
  messageDeleteBulk: "Mensagens Deletadas em Massa",
  guildMemberAdd: "Membro Entrou",
  guildMemberRemove: "Membro Saiu",
  guildMemberUpdate: "Membro Atualizado",
  guildBanAdd: "Membro Banido",
  guildBanRemove: "Membro Desbanido",
  roleCreate: "Cargo Criado",
  roleDelete: "Cargo Deletado",
  roleUpdate: "Cargo Atualizado",
  channelCreate: "Canal Criado",
  channelDelete: "Canal Deletado",
  channelUpdate: "Canal Atualizado",
};

const logTypeColors: Record<string, string> = {
  messageUpdate: "text-yellow-500 bg-yellow-500/10",
  messageDelete: "text-red-500 bg-red-500/10",
  messageDeleteBulk: "text-red-600 bg-red-600/10",
  guildMemberAdd: "text-green-500 bg-green-500/10",
  guildMemberRemove: "text-red-500 bg-red-500/10",
  guildMemberUpdate: "text-blue-500 bg-blue-500/10",
  guildBanAdd: "text-red-600 bg-red-600/10",
  guildBanRemove: "text-green-500 bg-green-500/10",
  roleCreate: "text-green-500 bg-green-500/10",
  roleDelete: "text-red-500 bg-red-500/10",
  roleUpdate: "text-yellow-500 bg-yellow-500/10",
  channelCreate: "text-green-500 bg-green-500/10",
  channelDelete: "text-red-500 bg-red-500/10",
  channelUpdate: "text-yellow-500 bg-yellow-500/10",
};

interface LogsViewerProps {
  guildId: string;
}

export function LogsViewer({ guildId }: LogsViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [stats, setStats] = useState<{ total: number; last24h: number } | null>(null);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [guildId, filter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { logs } = await api.getGuildLogs(guildId, filter || undefined, 50, 0);
      setLogs(logs);
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.getGuildLogStats(guildId);
      setStats({ total: data.total, last24h: data.last24h });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-400">A carregar logs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-gray-400">Total de Logs</p>
                  <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-400">Últimas 24h</p>
                  <p className="text-2xl font-bold text-white">{stats.last24h.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtrar Logs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 bg-discord-dark border border-discord-lightGray rounded-md text-white"
          >
            <option value="">Todos os tipos</option>
            <optgroup label="Mensagens">
              <option value="messageUpdate">Mensagens Editadas</option>
              <option value="messageDelete">Mensagens Deletadas</option>
              <option value="messageDeleteBulk">Mensagens Deletadas em Massa</option>
            </optgroup>
            <optgroup label="Membros">
              <option value="guildMemberAdd">Membros Entraram</option>
              <option value="guildMemberRemove">Membros Saíram</option>
              <option value="guildMemberUpdate">Membros Atualizados</option>
              <option value="guildBanAdd">Banimentos</option>
              <option value="guildBanRemove">Desbanimentos</option>
            </optgroup>
            <optgroup label="Cargos">
              <option value="roleCreate">Cargos Criados</option>
              <option value="roleDelete">Cargos Deletados</option>
              <option value="roleUpdate">Cargos Atualizados</option>
            </optgroup>
            <optgroup label="Canais">
              <option value="channelCreate">Canais Criados</option>
              <option value="channelDelete">Canais Deletados</option>
              <option value="channelUpdate">Canais Atualizados</option>
            </optgroup>
          </select>
        </CardContent>
      </Card>

      {/* Lista de Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Logs</CardTitle>
          <CardDescription>
            {logs.length} log{logs.length !== 1 ? "s" : ""} encontrado{logs.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Nenhum log encontrado para este servidor.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log._id}
                  className="bg-discord-dark rounded-lg p-4 hover:bg-discord-lightGray transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            logTypeColors[log.type] || "text-gray-500 bg-gray-500/10"
                          }`}
                        >
                          {logTypeLabels[log.type] || log.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>

                      <p className="text-sm text-white mb-2">{log.action}</p>

                      {log.executor && (
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <User className="w-3 h-3" />
                          <span>Executor: {log.executor.username}</span>
                        </div>
                      )}

                      {log.target && (
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <FileText className="w-3 h-3" />
                          <span>
                            Alvo: {log.target.username || log.target.name || log.target.id}
                          </span>
                        </div>
                      )}

                      {log.changes && Object.keys(log.changes).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-primary cursor-pointer">
                            Ver detalhes
                          </summary>
                          <pre className="mt-2 text-xs bg-discord-darker p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.changes, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
