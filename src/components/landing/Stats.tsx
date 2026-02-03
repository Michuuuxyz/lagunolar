"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, Activity, Zap, Shield, Users, Command } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface CounterProps {
  from: number;
  to: number;
  duration?: number;
}

function Counter({ from, to, duration = 2 }: CounterProps) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      ease: "easeOut",
    });

    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, rounded, to, duration]);

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return <span>{formatNumber(displayValue)}</span>;
}

const mainStats = [
  {
    icon: Users,
    label: "Servidores Ativos",
    value: 15420,
    suffix: "+",
    gradient: "from-reptile-gold to-reptile-amber",
  },
  {
    icon: Command,
    label: "Comandos Executados",
    value: 2847500,
    suffix: "+",
    gradient: "from-reptile-amber to-reptile-bronze",
  },
  {
    icon: Zap,
    label: "Uptime",
    value: 99.9,
    suffix: "%",
    gradient: "from-reptile-bronze to-reptile-gold",
  },
  {
    icon: Activity,
    label: "Latência Média",
    value: 42,
    suffix: "ms",
    gradient: "from-reptile-gold to-reptile-amber",
  },
];

const topCommands = [
  { name: "/moderation warn", uses: 89420, percentage: 100 },
  { name: "/fun meme", uses: 76890, percentage: 86 },
  { name: "/info server", uses: 65230, percentage: 73 },
  { name: "/moderation ban", uses: 54120, percentage: 61 },
  { name: "/utility avatar", uses: 48760, percentage: 55 },
];

export function Stats() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-4 overflow-hidden">
      {/* Dark Background */}
      <div className="absolute inset-0 bg-bg-darker" />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Glow Effects */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-reptile-gold/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-reptile-amber/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

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
              Estatísticas em Tempo Real
            </span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-gradient-gold">
            Números que Impressionam
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Milhões de comandos executados, milhares de servidores confiando no Laguno
          </motion.p>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {mainStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="relative group glass-strong rounded-xl p-6 border border-gray-800 hover:border-reptile-gold/50 transition-all duration-300"
            >
              {/* Icon with Gradient */}
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.gradient} mb-4 shadow-gold`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>

              {/* Counter */}
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {isInView && <Counter from={0} to={stat.value} duration={2.5} />}
                <span className="text-reptile-gold ml-1">{stat.suffix}</span>
              </div>

              <p className="text-gray-400 text-sm">{stat.label}</p>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-reptile-gold/0 via-reptile-gold/5 to-reptile-amber/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Top Commands Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="glass-strong rounded-xl p-8 border border-gray-800"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-gradient-to-br from-reptile-gold to-reptile-amber">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Comandos Mais Usados</h3>
              <p className="text-gray-400 text-sm">Top 5 da última semana</p>
            </div>
          </div>

          <div className="space-y-4">
            {topCommands.map((command, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-reptile-gold font-bold text-lg">#{index + 1}</span>
                    <span className="text-white font-mono text-sm">{command.name}</span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {isInView && <Counter from={0} to={command.uses} duration={2} />} usos
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${command.percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-reptile-gold via-reptile-amber to-reptile-bronze rounded-full shadow-gold"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Uptime Timeline */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-8 glass-strong rounded-xl p-8 border border-gray-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-success to-reptile-gold">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Uptime Últimos 30 Dias</h3>
              <p className="text-gray-400 text-sm">99.9% de disponibilidade garantida</p>
            </div>
          </div>

          <div className="flex gap-1">
            {Array.from({ length: 30 }).map((_, index) => {
              const uptime = Math.random() > 0.001 ? 100 : 95; // 99.9% uptime simulation
              return (
                <motion.div
                  key={index}
                  initial={{ height: 0, opacity: 0 }}
                  whileInView={{ height: "100%", opacity: 1 }}
                  transition={{ delay: index * 0.02, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="flex-1 h-16 rounded-t"
                  style={{
                    background: uptime === 100
                      ? "linear-gradient(to top, #10B981, #D4AF37)"
                      : "linear-gradient(to top, #F59E0B, #FF8C00)",
                  }}
                  title={`Dia ${index + 1}: ${uptime}%`}
                />
              );
            })}
          </div>

          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>Há 30 dias</span>
            <span>Hoje</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
