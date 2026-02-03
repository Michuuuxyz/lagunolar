"use client";

import { Shield, MessageSquare, BarChart3, Settings, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const features = [
  {
    icon: Shield,
    title: "Moderação Avançada",
    description: "Sistema completo de moderação com warns, bans, mutes e logs detalhados.",
    gradient: "from-reptile-gold via-reptile-amber to-reptile-bronze",
  },
  {
    icon: BarChart3,
    title: "Analytics em Tempo Real",
    description: "Acompanhe estatísticas do servidor em tempo real com gráficos interativos.",
    gradient: "from-reptile-amber via-reptile-gold to-reptile-bronze",
  },
  {
    icon: MessageSquare,
    title: "Sistema de Logs",
    description: "Regista todas as ações do servidor: mensagens, membros, roles e muito mais.",
    gradient: "from-reptile-bronze via-reptile-amber to-reptile-gold",
  },
  {
    icon: Settings,
    title: "Totalmente Configurável",
    description: "Dashboard intuitiva para configurar o bot ao teu gosto.",
    gradient: "from-reptile-gold via-reptile-bronze to-reptile-amber",
  },
  {
    icon: Users,
    title: "Gestão de Membros",
    description: "Informações detalhadas de membros e ferramentas de gerenciamento avançadas.",
    gradient: "from-reptile-amber via-reptile-bronze to-reptile-gold",
  },
  {
    icon: Zap,
    title: "Performance Extrema",
    description: "Resposta instantânea com latência média de menos de 50ms.",
    gradient: "from-reptile-bronze via-reptile-gold to-reptile-amber",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-darker via-bg-dark to-bg-darker" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-reptile-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-reptile-amber/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4">
            <span className="text-reptile-gold text-sm font-semibold tracking-wider uppercase">
              Recursos Premium
            </span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-gradient-gold">
            Tudo que Você Precisa
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ferramentas profissionais para gerenciar seu servidor Discord com excelência
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group relative glass rounded-xl p-6 border border-gray-800 hover:border-reptile-gold/50 transition-all duration-300 overflow-hidden"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-reptile-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-effect" />

              {/* Icon Container with Gradient */}
              <div className="relative mb-6">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-gold`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-reptile-gold/20 to-reptile-amber/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>

              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-reptile-gold transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-reptile-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
