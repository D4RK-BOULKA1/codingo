import React from "react";
import { Shield, Gem } from "lucide-react";

export type LeagueTier =
  | "bronze"
  | "argent"
  | "or"
  | "saphir"
  | "rubis"
  | "emeraude"
  | "amethyste"
  | "perle"
  | "obsidienne"
  | "diamant";

interface LeagueBadgeProps {
  tier: LeagueTier;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

export const LEAGUE_CONFIG: Record<
  LeagueTier,
  { name: string; fill: string; border: string; text: string }
> = {
  bronze: { name: "Bronze", fill: "#CD7F32", border: "#8B5A2B", text: "#FFFFFF" },
  argent: { name: "Argent", fill: "#94A3B8", border: "#64748B", text: "#FFFFFF" },
  or: { name: "Or", fill: "#FFC83D", border: "#E0A81B", text: "#0B3A5B" },
  saphir: { name: "Saphir", fill: "#4CC2FF", border: "#1B9BE0", text: "#0B3A5B" },
  rubis: { name: "Rubis", fill: "#FF5353", border: "#D63030", text: "#FFFFFF" },
  emeraude: { name: "Émeraude", fill: "#2CD98F", border: "#189C63", text: "#0B3A5B" },
  amethyste: { name: "Améthyste", fill: "#A855F7", border: "#7E22CE", text: "#FFFFFF" },
  perle: { name: "Perle", fill: "#E2E8F0", border: "#94A3B8", text: "#0B3A5B" },
  obsidienne: { name: "Obsidienne", fill: "#0B3A5B", border: "#051D2E", text: "#FFFFFF" },
  diamant: { name: "Diamant", fill: "#38BDF8", border: "#0284C7", text: "#0B3A5B" },
};

export const LeagueBadge: React.FC<LeagueBadgeProps> = ({
  tier,
  size = "md",
  showName = true,
  className = "",
}) => {
  const config = LEAGUE_CONFIG[tier] || LEAGUE_CONFIG.bronze;

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  }[size];

  const textClasses = {
    sm: "text-xs font-bold",
    md: "text-sm font-extrabold",
    lg: "text-base font-extrabold",
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border-2 select-none ${className}`}
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: config.border,
      }}
      title={`Ligue ${config.name}`}
    >
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: config.fill }}
      >
        <Shield size={iconSizes - 2} className="text-white fill-white/80" />
      </div>
      {showName && (
        <span className={`${textClasses} text-[#0B3A5B]`}>
          Ligue {config.name}
        </span>
      )}
    </div>
  );
};

// Badge Spécial : Rôle Admin & Diamant Premium
interface UserRoleBadgeProps {
  isAdmin?: boolean;
  isPremium?: boolean;
  className?: string;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({
  isAdmin = false,
  isPremium = false,
  className = "",
}) => {
  if (isAdmin) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#0B3A5B] text-white text-[11px] font-black uppercase tracking-wider border border-[#051D2E] select-none ${className}`}
        title="Administrateur Certifié Codingo"
      >
        ADMIN
      </span>
    );
  }

  if (isPremium) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FFC83D] text-[#0B3A5B] text-[11px] font-black uppercase tracking-wider border border-[#E0A81B] select-none ${className}`}
        title="Membre Premium"
      >
        <Gem size={12} className="fill-[#0B3A5B] stroke-[2]" />
        DIAMANT
      </span>
    );
  }

  return null;
};
