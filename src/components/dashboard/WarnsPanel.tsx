"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { UserWarnings } from "@/types";
import toast from "react-hot-toast";
import { AlertTriangle, Trash2, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface WarnsPanelProps {
  guildId: string;
}

export function WarnsPanel({ guildId }: WarnsPanelProps) {
  const [warnings, setWarnings] = useState<UserWarnings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWarnings();
  }, [guildId]);

  const fetchWarnings = async () => {
    try {
      const data = await api.getGuildWarnings(guildId);
      setWarnings(data);
    } catch (error) {
      console.error("Erro ao buscar warnings:", error);
      toast.error("Erro ao carregar avisos");
    } finally {
      setLoading(false);
    }
  };

  const handleClearWarn = async (warnId: string) => {
    if (!confirm("Tens a certeza que queres remover este aviso?")) return;

    try {
      await api.clearWarning(guildId, warnId);
      toast.success("Aviso removido!");
      fetchWarnings();
    } catch (error) {
      toast.error("Erro ao remover aviso");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-400">A carregar avisos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Avisos do Servidor</CardTitle>
          <CardDescription>
            Lista de todos os avisos ativos no servidor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {warnings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum aviso registado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {warnings.map((userWarn) => (
                <div key={userWarn.userId} className="bg-discord-dark rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold text-white">{userWarn.username}</div>
                        <div className="text-sm text-gray-400">
                          {userWarn.totalWarns} {userWarn.totalWarns === 1 ? "aviso" : "avisos"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {userWarn.warnings.map((warn) => (
                      <div
                        key={warn._id}
                        className="bg-discord-darker rounded p-3 flex items-start justify-between"
                      >
                        <div className="flex-1">
                          <div className="text-sm text-gray-300 mb-1">{warn.reason}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(warn.timestamp)} • ID: {warn.moderatorId}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleClearWarn(warn._id)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
