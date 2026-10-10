import React from "react";
import { Heart, Infinity as InfinityIcon } from "lucide-react";

interface HeartDisplayProps {
  hearts: number;
  maxHearts?: number;
  isPremium?: boolean;
  timeLeftFormatted?: string | null; // ex: "04:32:15"
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export const HeartDisplay: React.FC<HeartDisplayProps> = ({
  hearts,
  maxHearts = 5,
  isPremium = false,
  timeLeftFormatted,
  size = "md",
  className = "",
  onClick,
}) => {
  const iconSize = {
    sm: 18,
    md: 22,
    lg: 26,
  }[size];

  const textClass = {
    sm: "text-xs font-bold",
    md: "text-sm font-extrabold",
    lg: "text-base font-extrabold",
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 transition-transform active:scale-95 ${
        hearts === 0 && !isPremium
          ? "bg-[#FFF1F1] border-[#FF5353] text-[#D63030]"
          : "bg-white border-[#E2E8F0] text-[#0B3A5B]"
      } ${onClick ? "cursor-pointer hover:border-[#CBD5E1]" : ""} ${className}`}
      title={
        isPremium
          ? "Cœurs illimités (Abonnement Premium)"
          : `${hearts}/${maxHearts} cœurs restants${
              timeLeftFormatted ? ` • Recharge dans ${timeLeftFormatted}` : ""
            }`
      }
    >
      <div className="relative flex items-center justify-center">
        <Heart
          size={iconSize}
          className={`${
            isPremium
              ? "fill-[#FFC83D] text-[#E0A81B]"
              : hearts > 0
              ? "fill-[#FF5353] text-[#D63030]"
              : "fill-none text-[#CBD5E1]"
          } transition-colors`}
        />
      </div>

      {isPremium ? (
        <span className="flex items-center text-[#E0A81B] font-black">
          <InfinityIcon size={iconSize - 2} className="stroke-[3]" />
        </span>
      ) : (
        <div className="flex items-baseline gap-1.5">
          <span className={textClass}>
            {hearts}
          </span>
          {hearts < maxHearts && timeLeftFormatted && (
            <span className="text-[11px] font-semibold text-[#64748B]">
              {timeLeftFormatted}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
