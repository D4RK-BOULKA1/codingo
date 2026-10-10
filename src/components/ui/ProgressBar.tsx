import React from "react";

interface ProgressBarProps {
  value: number; // 0 à 100
  color?: "blue" | "green" | "yellow";
  height?: "sm" | "md" | "lg";
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = "green",
  height = "md",
  className = "",
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const colorStyles = {
    green: {
      bar: "bg-[#2CD98F]",
      shadow: "bg-[#189C63]",
    },
    blue: {
      bar: "bg-[#4CC2FF]",
      shadow: "bg-[#1B9BE0]",
    },
    yellow: {
      bar: "bg-[#FFC83D]",
      shadow: "bg-[#E0A81B]",
    },
  }[color];

  const heightClass = {
    sm: "h-3",
    md: "h-4",
    lg: "h-6",
  }[height];

  return (
    <div
      className={`w-full bg-[#E2E8F0] border-2 border-[#CBD5E1] rounded-full overflow-hidden p-0.5 relative ${heightClass} ${className}`}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 relative ${colorStyles.bar}`}
        style={{ width: `${clampedValue}%` }}
      >
        {/* Petit relief blanc unie en haut de la barre pour effet 3D flat */}
        <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/40 rounded-full" />
      </div>
    </div>
  );
};
