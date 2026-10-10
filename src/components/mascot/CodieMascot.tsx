import React from "react";

export type CodieMood = "waving" | "happy" | "thinking" | "encouraging" | "coach";

interface CodieMascotProps {
  mood?: CodieMood;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}

export const CodieMascot: React.FC<CodieMascotProps> = ({
  mood = "waving",
  size = "md",
  className = "",
  animate = true,
}) => {
  const pixelDimensions = {
    sm: 72,
    md: 130,
    lg: 200,
    xl: 280,
  }[size];

  return (
    <div
      className={`relative inline-block select-none ${
        animate ? "transition-transform hover:scale-105" : ""
      } ${className}`}
      style={{ width: pixelDimensions, height: pixelDimensions }}
      aria-label={`Mascotte Codie dans l'état : ${mood}`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* ================================================================
            OMBRES SOLIDES INFÉRIEURES (RELIEF 3D SANS DÉGRADÉ)
            ================================================================ */}
        {/* Ombre au sol */}
        <ellipse cx="100" cy="188" rx="60" ry="8" fill="#CBD5E1" />

        {/* Pieds / Chenilles du Robot */}
        {/* Pied Gauche */}
        <rect x="58" y="166" width="32" height="14" rx="7" fill="#1B9BE0" />
        <rect x="58" y="162" width="32" height="14" rx="7" fill="#0B3A5B" />
        <circle cx="68" cy="169" r="3" fill="#4CC2FF" />
        <circle cx="80" cy="169" r="3" fill="#4CC2FF" />

        {/* Pied Droit */}
        <rect x="110" y="166" width="32" height="14" rx="7" fill="#1B9BE0" />
        <rect x="110" y="162" width="32" height="14" rx="7" fill="#0B3A5B" />
        <circle cx="120" cy="169" r="3" fill="#4CC2FF" />
        <circle cx="132" cy="169" r="3" fill="#4CC2FF" />

        {/* ================================================================
            BRAS DU ROBOT (DÉPEND DE L'HUMEUR)
            ================================================================ */}
        {mood === "happy" && (
          <>
            {/* Bras Gauche en l'air (Célébration) */}
            <path
              d="M48 95 C30 80, 26 50, 36 38 C42 32, 54 44, 48 62"
              fill="#1B9BE0"
            />
            <path
              d="M48 91 C30 76, 26 46, 36 34 C42 28, 54 40, 48 58"
              fill="#4CC2FF"
            />
            <circle cx="36" cy="34" r="10" fill="#FFC83D" stroke="#E0A81B" strokeWidth="2" />

            {/* Bras Droit en l'air (Célébration) */}
            <path
              d="M152 95 C170 80, 174 50, 164 38 C158 32, 146 44, 152 62"
              fill="#1B9BE0"
            />
            <path
              d="M152 91 C170 76, 174 46, 164 34 C158 28, 146 40, 152 58"
              fill="#4CC2FF"
            />
            <circle cx="164" cy="34" r="10" fill="#FFC83D" stroke="#E0A81B" strokeWidth="2" />
          </>
        )}

        {mood === "waving" && (
          <>
            {/* Bras Gauche au repos */}
            <rect x="36" y="94" width="14" height="40" rx="7" fill="#1B9BE0" />
            <rect x="36" y="90" width="14" height="40" rx="7" fill="#4CC2FF" />
            <circle cx="43" cy="130" r="8" fill="#0B3A5B" />

            {/* Bras Droit levé faisant coucou */}
            <path
              d="M150 96 C165 85, 175 60, 170 42 C164 35, 154 45, 152 64"
              fill="#1B9BE0"
            />
            <path
              d="M150 92 C165 81, 175 56, 170 38 C164 31, 154 41, 152 60"
              fill="#4CC2FF"
            />
            <circle cx="170" cy="38" r="9" fill="#FFC83D" stroke="#E0A81B" strokeWidth="2" />
          </>
        )}

        {mood === "thinking" && (
          <>
            {/* Bras Gauche au repos */}
            <rect x="36" y="94" width="14" height="40" rx="7" fill="#1B9BE0" />
            <rect x="36" y="90" width="14" height="40" rx="7" fill="#4CC2FF" />
            <circle cx="43" cy="130" r="8" fill="#0B3A5B" />

            {/* Bras Droit main sous le menton */}
            <path
              d="M150 96 C162 105, 148 135, 126 128"
              stroke="#1B9BE0"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M150 92 C162 101, 148 131, 126 124"
              stroke="#4CC2FF"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="126" cy="124" r="8" fill="#0B3A5B" />
          </>
        )}

        {mood === "encouraging" && (
          <>
            {/* Bras Gauche tendu tenant un cœur de réconfort */}
            <path
              d="M48 95 C30 98, 25 118, 40 125"
              stroke="#1B9BE0"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M48 91 C30 94, 25 114, 40 121"
              stroke="#4CC2FF"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Mini Cœur dans la main gauche */}
            <path
              d="M32 118 C32 114 36 111 39 114 C42 111 46 114 46 118 C46 123 39 127 39 127 C39 127 32 123 32 118 Z"
              fill="#FF5353"
            />

            {/* Bras Droit avec pouce levé */}
            <rect x="150" y="94" width="14" height="34" rx="7" fill="#1B9BE0" />
            <rect x="150" y="90" width="14" height="34" rx="7" fill="#4CC2FF" />
            <circle cx="157" cy="124" r="8" fill="#FFC83D" stroke="#E0A81B" strokeWidth="2" />
          </>
        )}

        {mood === "coach" && (
          <>
            {/* Bras Gauche tenant un livre/console */}
            <rect x="36" y="94" width="14" height="40" rx="7" fill="#1B9BE0" />
            <rect x="36" y="90" width="14" height="40" rx="7" fill="#4CC2FF" />
            {/* Mini Livre/Tablette */}
            <rect x="24" y="112" width="22" height="26" rx="4" fill="#0B3A5B" />
            <rect x="27" y="115" width="16" height="20" rx="2" fill="#FFFFFF" />
            <path d="M30 120 H39 M30 125 H37 M30 130 H35" stroke="#4CC2FF" strokeWidth="2" strokeLinecap="round" />

            {/* Bras Droit avec pointeur */}
            <path
              d="M150 96 C165 85, 175 65, 172 50"
              stroke="#1B9BE0"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M150 92 C165 81, 175 61, 172 46"
              stroke="#4CC2FF"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="172" cy="46" r="8" fill="#FFC83D" stroke="#E0A81B" strokeWidth="2" />
          </>
        )}

        {/* ================================================================
            CORPS & TÊTE DU ROBOT (MONOBLOC HARMONIEUX)
            ================================================================ */}
        {/* Antenne */}
        <rect x="97" y="12" width="6" height="20" fill="#1B9BE0" />
        <circle cx="100" cy="12" r="8" fill="#FFC83D" stroke="#E0A81B" strokeWidth="2" />
        {/* Diode intérieure clignotante */}
        <circle cx="100" cy="12" r="3" fill="#FFFFFF" />

        {/* Ombre solide du corps */}
        <rect x="46" y="36" width="108" height="132" rx="36" fill="#1B9BE0" />

        {/* Corps principal Bleu Ciel */}
        <rect x="46" y="30" width="108" height="132" rx="36" fill="#4CC2FF" />
        <rect
          x="46"
          y="30"
          width="108"
          height="132"
          rx="36"
          stroke="#1B9BE0"
          strokeWidth="4"
        />

        {/* Écran Facial Bleu Nuit */}
        <rect x="58" y="44" width="84" height="66" rx="20" fill="#0B3A5B" />

        {/* ================================================================
            VISAGE DE CODIE SELON L'HUMEUR
            ================================================================ */}
        {mood === "waving" && (
          <>
            {/* Yeux ronds pétillants */}
            <circle cx="82" cy="74" r="8" fill="#4CC2FF" />
            <circle cx="84" cy="72" r="3" fill="#FFFFFF" />
            <circle cx="118" cy="74" r="8" fill="#4CC2FF" />
            <circle cx="120" cy="72" r="3" fill="#FFFFFF" />
            {/* Sourire amical */}
            <path
              d="M90 88 C94 94, 106 94, 110 88"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Petites joues jaunes unies */}
            <circle cx="72" cy="84" r="4" fill="#FFC83D" />
            <circle cx="128" cy="84" r="4" fill="#FFC83D" />
          </>
        )}

        {mood === "happy" && (
          <>
            {/* Yeux plissés de joie (^  ^) */}
            <path
              d="M74 76 Q82 66 90 76"
              stroke="#4CC2FF"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M110 76 Q118 66 126 76"
              stroke="#4CC2FF"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Grand sourire ouvert */}
            <path
              d="M88 86 Q100 100 112 86 Z"
              fill="#FFFFFF"
            />
            {/* Joues roses/jaunes */}
            <circle cx="70" cy="82" r="5" fill="#FFC83D" />
            <circle cx="130" cy="82" r="5" fill="#FFC83D" />
          </>
        )}

        {mood === "thinking" && (
          <>
            {/* Œil gauche normal, œil droit interrogateur */}
            <circle cx="82" cy="74" r="7" fill="#4CC2FF" />
            <circle cx="84" cy="72" r="2.5" fill="#FFFFFF" />
            {/* Sourcil interrogateur levé */}
            <path d="M110 66 Q118 60 126 66" stroke="#FFC83D" strokeWidth="3" strokeLinecap="round" />
            <circle cx="118" cy="76" r="8" fill="#4CC2FF" />
            <circle cx="120" cy="74" r="3" fill="#FFFFFF" />
            {/* Petite bouche en "o" ou dubitative */}
            <ellipse cx="100" cy="90" rx="4" ry="5" fill="#FFFFFF" />
          </>
        )}

        {mood === "encouraging" && (
          <>
            {/* Yeux doux et compréhensifs */}
            <circle cx="82" cy="74" r="8" fill="#4CC2FF" />
            <circle cx="84" cy="72" r="3" fill="#FFFFFF" />
            <circle cx="118" cy="74" r="8" fill="#4CC2FF" />
            <circle cx="120" cy="72" r="3" fill="#FFFFFF" />
            {/* Petit sourire encourageant */}
            <path
              d="M92 88 Q100 94 108 88"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="72" cy="82" r="4" fill="#FFC83D" />
            <circle cx="128" cy="82" r="4" fill="#FFC83D" />
          </>
        )}

        {mood === "coach" && (
          <>
            {/* Lunettes de professeur ou regard déterminé */}
            <rect x="70" y="66" width="22" height="16" rx="5" stroke="#FFC83D" strokeWidth="3" fill="none" />
            <rect x="108" y="66" width="22" height="16" rx="5" stroke="#FFC83D" strokeWidth="3" fill="none" />
            <path d="M92 74 H108" stroke="#FFC83D" strokeWidth="3" />
            <circle cx="81" cy="74" r="4" fill="#4CC2FF" />
            <circle cx="119" cy="74" r="4" fill="#4CC2FF" />
            {/* Sourire motivateur */}
            <path
              d="M91 90 Q100 96 109 90"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </>
        )}

        {/* ================================================================
            ZONE VENTRALE DU ROBOT (ÉCUSSON CODINGO)
            ================================================================ */}
        {/* Plaque ventrale */}
        <rect x="74" y="122" width="52" height="30" rx="8" fill="#FFFFFF" stroke="#1B9BE0" strokeWidth="2" />
        {/* Chevron de code en Jaune Accent */}
        <path
          d="M88 132 L94 137 L88 142"
          stroke="#0B3A5B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Curseur terminal clignotant */}
        <line
          x1="99"
          y1="141"
          x2="108"
          y2="141"
          stroke="#FFC83D"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
