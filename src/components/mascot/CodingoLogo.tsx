import React from "react";

interface CodingoLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export const CodingoLogo: React.FC<CodingoLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
}) => {
  const iconDimensions = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 60,
  }[size];

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Emblème Vectoriel 3D Plat */}
      <svg
        width={iconDimensions}
        height={iconDimensions}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105 active:scale-95"
        aria-label="Logo Codingo"
      >
        {/* Ombre solide 3D inférieure */}
        <rect x="4" y="10" width="56" height="50" rx="18" fill="#1B9BE0" />
        
        {/* Corps principal Bleu Ciel */}
        <rect x="4" y="6" width="56" height="50" rx="18" fill="#4CC2FF" />
        <rect
          x="4"
          y="6"
          width="56"
          height="50"
          rx="18"
          stroke="#1B9BE0"
          strokeWidth="3"
        />

        {/* Écran intérieur Bleu Nuit */}
        <rect x="12" y="14" width="40" height="34" rx="10" fill="#0B3A5B" />

        {/* Chevrons de Code Vectoriels & Curseur */}
        {/* Symbole "<" en Jaune Accent */}
        <path
          d="M24 23L17 31L24 39"
          stroke="#FFC83D"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Symbole "/" blanc */}
        <path
          d="M29 39L33 23"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Symbole ">" en Jaune Accent */}
        <path
          d="M38 23L45 31L38 39"
          stroke="#FFC83D"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Antenne supérieure avec diode */}
        <rect x="30" y="1" width="4" height="6" fill="#1B9BE0" />
        <circle cx="32" cy="2" r="3" fill="#FFC83D" stroke="#E0A81B" strokeWidth="1.5" />
      </svg>

      {/* Typographie de marque */}
      {showText && (
        <span
          className={`font-extrabold tracking-tight text-[#0B3A5B] ${textSizes}`}
          style={{ letterSpacing: "-0.03em" }}
        >
          Codingo
        </span>
      )}
    </div>
  );
};
