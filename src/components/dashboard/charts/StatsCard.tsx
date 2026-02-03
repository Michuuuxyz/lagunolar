"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  suffix?: string;
  change: number;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  sparklineData: number[];
  color?: "gold" | "warning" | "success" | "info" | "error";
}

const colorMap = {
  gold: {
    gradient: "from-reptile-gold to-reptile-amber",
    text: "text-reptile-gold",
    bg: "bg-reptile-gold/10",
    line: "#D4AF37",
  },
  warning: {
    gradient: "from-warning to-reptile-amber",
    text: "text-warning",
    bg: "bg-warning/10",
    line: "#F59E0B",
  },
  success: {
    gradient: "from-success to-reptile-gold",
    text: "text-success",
    bg: "bg-success/10",
    line: "#10B981",
  },
  info: {
    gradient: "from-info to-reptile-gold",
    text: "text-info",
    bg: "bg-info/10",
    line: "#3B82F6",
  },
  error: {
    gradient: "from-error to-warning",
    text: "text-error",
    bg: "bg-error/10",
    line: "#EF4444",
  },
};

export function StatsCard({
  title,
  value,
  suffix,
  change,
  trend,
  icon: Icon,
  sparklineData,
  color = "gold",
}: StatsCardProps) {
  const colors = colorMap[color];

  // Create SVG path for sparkline
  const createSparklinePath = () => {
    const width = 120;
    const height = 40;
    const padding = 4;

    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;

    const points = sparklineData.map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="w-4 h-4" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-success";
    if (trend === "down") return "text-error";
    return "text-gray-400";
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="relative group glass-strong rounded-xl p-6 border border-gray-800 hover:border-reptile-gold/50 transition-all duration-300 overflow-hidden"
    >
      {/* Background Glow */}
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300", colors.bg)} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <div className={cn("p-2 rounded-lg bg-gradient-to-br", colors.gradient)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Value */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {value.toLocaleString()}
            </span>
            {suffix && (
              <span className={cn("text-lg font-semibold", colors.text)}>
                {suffix}
              </span>
            )}
          </div>
        </div>

        {/* Trend & Sparkline */}
        <div className="flex items-end justify-between">
          {/* Trend Indicator */}
          <div className="flex items-center gap-1">
            <span className={cn("flex items-center gap-1", getTrendColor())}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {change !== 0 && (change > 0 ? "+" : "")}
                {change}%
              </span>
            </span>
          </div>

          {/* Mini Sparkline */}
          <div className="flex-shrink-0">
            <svg width="120" height="40" viewBox="0 0 120 40" className="opacity-60">
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colors.line} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={colors.line} stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Fill area under line */}
              <path
                d={`${createSparklinePath()} L 120,40 L 0,40 Z`}
                fill={`url(#gradient-${title})`}
              />
              {/* Line */}
              <path
                d={createSparklinePath()}
                fill="none"
                stroke={colors.line}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-reptile-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-effect" />
    </motion.div>
  );
}
