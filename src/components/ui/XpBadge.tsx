import React from "react";
import { Zap } from "lucide-react";

interface XpBadgeProps {
  xp: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const XpBadge: React.FC<XpBadgeProps> = ({
  xp,
  size = "md",
  className = "",
}) => {
  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  const textClass = {
    sm: "text-xs font-bold",
    md: "text-sm font-black",
    lg: "text-base font-black",
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-[#E0A81B] text-[#0B3A5B] ${className}`}
      title={`${xp} points d'expérience`}
    >
      <Zap
        size={iconSize}
        className="fill-[#FFC83D] text-[#E0A81B] stroke-[2.5]"
      />
      <span className={textClass}>{xp} XP</span>
    </div>
  );
};
