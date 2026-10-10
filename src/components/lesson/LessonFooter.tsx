"use client";

import { Button3D } from "@/components/ui/Button3D";
import { CheckCircle2, XCircle } from "lucide-react";

interface LessonFooterProps {
  status: "idle" | "correct" | "incorrect";
  onCheck: () => void;
  onNext: () => void;
  disabled?: boolean;
  explanation?: string;
}

export function LessonFooter({ status, onCheck, onNext, disabled, explanation }: LessonFooterProps) {
  const isCorrect = status === "correct";
  const isIncorrect = status === "incorrect";
  const isChecked = isCorrect || isIncorrect;

  return (
    <footer 
      className={`
        fixed bottom-0 left-0 right-0 py-6 px-4 border-t-2 transition-colors duration-300
        ${isCorrect ? "bg-[#D7FFEB] border-[#2CD98F]" : isIncorrect ? "bg-[#FFDFDF] border-[#FF5353]" : "bg-white border-[#E2EEF7]"}
      `}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          {isCorrect && (
            <div className="flex items-center gap-3 text-[#189C63]">
              <CheckCircle2 className="w-8 h-8" />
              <div>
                <p className="font-black text-lg">Excellent !</p>
                {explanation && <p className="text-sm font-bold opacity-80">{explanation}</p>}
              </div>
            </div>
          )}
          {isIncorrect && (
            <div className="flex items-center gap-3 text-[#D63030]">
              <XCircle className="w-8 h-8" />
              <div>
                <p className="font-black text-lg">Oups, pas tout à fait...</p>
                {explanation && <p className="text-sm font-bold opacity-80">{explanation}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="w-full sm:w-auto min-w-[200px]">
          {!isChecked ? (
            <Button3D
              variant="blue"
              fullWidth
              onClick={onCheck}
              disabled={disabled}
            >
              VÉRIFIER
            </Button3D>
          ) : (
            <Button3D
              variant={isCorrect ? "green" : "red"}
              fullWidth
              onClick={onNext}
            >
              CONTINUER
            </Button3D>
          )}
        </div>
      </div>
    </footer>
  );
}
