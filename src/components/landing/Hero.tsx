"use client";

import { Button } from "../ui/Button";
import Link from "next/link";
import { ArrowRight, Bot, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Bot className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Bot Discord Multifuncional</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Conhece o </span>
            <span className="text-primary">Laguno</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            O bot Discord mais completo para moderação, diversão e gestão do teu servidor.
            Com sistema de logs avançado e comandos personalizáveis.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href={process.env.NEXT_PUBLIC_BOT_INVITE || "#"} target="_blank">
            <Button size="lg" className="text-lg px-8 py-6">
              <Zap className="w-5 h-5 mr-2" />
              Adicionar ao Discord
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Abrir Dashboard
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="bg-discord-gray border border-gray-800 rounded-lg p-6 hover:border-primary transition-colors">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-gray-400">Online sempre</div>
          </div>
          <div className="bg-discord-gray border border-gray-800 rounded-lg p-6 hover:border-primary transition-colors">
            <div className="text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-gray-400">Comandos</div>
          </div>
          <div className="bg-discord-gray border border-gray-800 rounded-lg p-6 hover:border-primary transition-colors">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-gray-400">Grátis</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
