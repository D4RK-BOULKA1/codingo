import React from "react";
import { Flame, Snowflake } from "lucide-react";

interface StreakBadgeProps {
  days: number;
  isFrozen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  days,
  isFrozen = false,
  size = "md",
  className = "",
  onClick,
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
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 transition-transform active:scale-95 ${
        isFrozen
          ? "border-[#4CC2FF] text-[#0B3A5B]"
          : days > 0
          ? "border-[#E0A81B] text-[#0B3A5B]"
          : "border-[#E2E8F0] text-[#64748B]"
      } ${onClick ? "cursor-pointer hover:border-[#CBD5E1]" : ""} ${className}`}
      title={
        isFrozen
          ? `Série de ${days} jours protégée par un gel`
          : `Série active : ${days} jours consécutifs`
      }
    >
      {isFrozen ? (
        <Snowflake
          size={iconSize}
          className="text-[#1B9BE0] stroke-[2.5]"
        />
      ) : (
        <Flame
          size={iconSize}
          className={`${
            days > 0
              ? "fill-[#FFC83D] text-[#E0A81B]"
              : "fill-none text-[#CBD5E1]"
          } stroke-[2.5]`}
        />
      )}
      <span className={textClass}>{days}</span>
    </div>
  );
};
