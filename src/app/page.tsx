import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Commands } from "@/components/landing/Commands";
import Link from "next/link";
import { Github, Heart } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Commands />

      {/* Footer */}
      <footer className="bg-discord-darker border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Laguno Bot</h3>
              <p className="text-gray-400">
                O bot Discord mais completo para o teu servidor
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-gray-400 hover:text-primary">
                  Dashboard
                </Link>
                <Link href="/#features" className="block text-gray-400 hover:text-primary">
                  Funcionalidades
                </Link>
                <Link href="/#commands" className="block text-gray-400 hover:text-primary">
                  Comandos
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Suporte</h3>
              <div className="space-y-2">
                <a
                  href={process.env.NEXT_PUBLIC_BOT_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-primary"
                >
                  Adicionar Bot
                </a>
                <a
                  href="https://discord.gg/your-server"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-primary"
                >
                  Servidor Discord
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p className="flex items-center justify-center gap-2">
              Feito com <Heart className="w-4 h-4 text-red-500" /> por Laguno Team
            </p>
            <p className="mt-2 text-sm">© 2026 Laguno Bot. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
