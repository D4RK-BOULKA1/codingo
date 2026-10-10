"use client";

import { X, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface LessonHeaderProps {
  progress: number; // 0 to 1
  hearts: number;
  isPremium?: boolean;
}

export function LessonHeader({ progress, hearts, isPremium }: LessonHeaderProps) {
  const router = useRouter();

  return (
    <header className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
      <button
        onClick={() => {
          if (confirm("Es-tu sûr de vouloir quitter ? Ta progression dans cette leçon sera perdue.")) {
            router.back();
          }
        }}
        className="p-2 rounded-xl hover:bg-[#F0F9FF] transition-colors"
      >
        <X className="w-6 h-6 text-[#4A7FA5]" />
      </button>

      <div className="flex-1 h-3 bg-[#E2EEF7] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#4CC2FF] transition-all duration-300 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-1.5 min-w-[60px] justify-end">
        <Heart className={`w-6 h-6 ${hearts > 0 ? "text-[#FF5353] fill-[#FF5353]" : "text-[#E2EEF7] fill-[#E2EEF7]"}`} />
        <span className={`font-black text-lg ${hearts > 0 ? "text-[#FF5353]" : "text-[#4A7FA5]"}`}>
          {isPremium ? "∞" : hearts}
        </span>
      </div>
    </header>
  );
}
