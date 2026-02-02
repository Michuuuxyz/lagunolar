"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, Server, Settings, ExternalLink } from "lucide-react";
import { getGuildIconUrl, hasPermission, PERMISSIONS } from "@/lib/utils";
import type { DiscordGuild } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (session?.accessToken) {
      fetchGuilds();
    }
  }, [session, status]);

  const fetchGuilds = async () => {
    try {
      const response = await axios.get("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      // Filtrar apenas servidores onde o user tem permissão de administrador ou gestão
      const manageableGuilds = response.data.filter((guild: DiscordGuild) =>
        hasPermission(guild.permissions, PERMISSIONS.ADMINISTRATOR) ||
        hasPermission(guild.permissions, PERMISSIONS.MANAGE_GUILD)
      );

      setGuilds(manageableGuilds);
    } catch (error) {
      console.error("Erro ao buscar servidores:", error);
      toast.error("Erro ao carregar servidores");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-white">Olá, </span>
            <span className="text-primary">{session?.user?.username}</span>
          </h1>
          <p className="text-gray-400 text-lg">Seleciona um servidor para começar a configurar</p>
        </div>

        {guilds.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhum servidor disponível</CardTitle>
              <CardDescription>
                Não tens servidores com permissões de administrador ou gestão.
                <br />
                Adiciona o bot a um servidor onde tenhas estas permissões.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href={process.env.NEXT_PUBLIC_BOT_INVITE} target="_blank" rel="noopener noreferrer">
                <Button>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Adicionar Bot
                </Button>
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guilds.map((guild) => {
              const iconUrl = getGuildIconUrl(guild);

              return (
                <Card
                  key={guild.id}
                  className="hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => router.push(`/dashboard/${guild.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      {iconUrl ? (
                        <img src={iconUrl} alt={guild.name} className="w-16 h-16 rounded-full" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Server className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl truncate">{guild.name}</CardTitle>
                        {guild.owner && (
                          <span className="text-xs text-yellow-500">Proprietário</span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full group">
                      <Settings className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                      Configurar
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
