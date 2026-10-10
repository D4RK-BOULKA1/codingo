"use client";

import { LessonType } from "@/types/course";
import { Check, Star, Lock, Gift, BookOpen } from "lucide-react";
import Link from "next/link";

interface PathNodeProps {
  id: string;
  type: LessonType;
  title: string;
  status: "locked" | "current" | "completed";
  index: number; // Pour le zigzag
  color: string;
}

export function PathNode({ id, type, title, status, index, color }: PathNodeProps) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isCurrent = status === "current";

  // Calcul du décalage horizontal pour l'effet de chemin
  const xOffsets = [0, 40, 70, 40, 0, -40, -70, -40];
  const xOffset = xOffsets[index % xOffsets.length];

  const icons = {
    lesson: isCompleted ? <Check className="w-6 h-6" /> : <Star className="w-6 h-6" />,
    quiz: <Star className="w-6 h-6" />,
    project: <Star className="w-6 h-6" />,
    chest: <Gift className="w-6 h-6" />,
    review: <BookOpen className="w-6 h-6" />,
  };

  const nodeContent = (
    <div className="flex flex-col items-center">
      <div 
        className={`
          relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200
          ${isLocked ? "bg-[#E5E7EB] shadow-[0_6px_0_0_#D1D5DB]" : ""}
          ${isCompleted ? "shadow-[0_6px_0_0_#189C63]" : ""}
          ${isCurrent ? "shadow-[0_6px_0_0_#1B9BE0] animate-bounce-slow" : ""}
        `}
        style={{ 
          backgroundColor: isLocked ? undefined : isCompleted ? "#2CD98F" : isCurrent ? color : color,
          boxShadow: isLocked ? undefined : isCompleted ? "0 6px 0 0 #189C63" : isCurrent ? `0 6px 0 0 ${color}CC` : `0 6px 0 0 ${color}AA`
        }}
      >
        <div className="text-white">
          {isLocked ? <Lock className="w-6 h-6 text-[#9CA3AF]" /> : icons[type]}
        </div>

        {isCurrent && (
          <div className="absolute -top-10 bg-white border-2 border-[#E2E8F0] rounded-xl px-3 py-1 shadow-sm whitespace-nowrap">
            <span className="text-[10px] font-black text-[#1B9BE0] uppercase">Commencer</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-[#E2E8F0] rotate-45" />
          </div>
        )}
      </div>
      <span className={`mt-3 text-xs font-black uppercase tracking-tight text-center max-w-[80px] ${isLocked ? "text-[#9CA3AF]" : "text-[#0B3A5B]"}`}>
        {title}
      </span>
    </div>
  );

  if (isLocked) {
    return (
      <div style={{ transform: `translateX(${xOffset}px)` }} className="py-4">
        {nodeContent}
      </div>
    );
  }

  return (
    <Link 
      href={`/lecon/${id}`} 
      style={{ transform: `translateX(${xOffset}px)` }}
      className="py-4 block hover:scale-105 active:scale-95 transition-transform"
    >
      {nodeContent}
    </Link>
  );
}
