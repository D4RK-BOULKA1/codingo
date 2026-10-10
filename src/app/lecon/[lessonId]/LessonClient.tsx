"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getLessonById } from "@/lib/courses";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { LessonFooter } from "@/components/lesson/LessonFooter";
import { ExerciseRenderer } from "@/components/lesson/ExerciseRenderer";
import { sounds } from "@/lib/audio/soundEffects";
import { Loader2, Award, Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface LessonClientProps {
  lessonId: string;
}

export default function LessonClient({ lessonId }: LessonClientProps) {
  const { user, isLoading, updateProfileData } = useAuth();
  const router = useRouter();
  const data = getLessonById(lessonId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [answer, setAnswer] = useState<any>(null);
  const [tempHearts, setTempHearts] = useState(5);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedXp, setEarnedXp] = useState(10);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/connexion");
    }
    if (user) {
      setTempHearts(user.hearts);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
      </div>
    );
  }

  const { lesson, unit } = data;
  const currentExercise = lesson.exercises[currentIndex];
  const progress = currentIndex / lesson.exercises.length;

  const normalizeCode = (str: string) => {
    return (str || "")
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/"/g, "'")
      .trim()
      .toLowerCase();
  };

  const handleCheck = () => {
    if (!currentExercise) return;

    let isCorrect = false;

    if (currentExercise.type === "explanation") {
      isCorrect = true;
    } else if (
      currentExercise.type === "qcm" ||
      currentExercise.type === "true_false"
    ) {
      isCorrect = String(answer).trim() === String(currentExercise.correctAnswer).trim();
    } else if (currentExercise.type === "fill_blanks") {
      const correctArr = Array.isArray(currentExercise.correctAnswer)
        ? currentExercise.correctAnswer
        : [currentExercise.correctAnswer];
      const userArr = Array.isArray(answer)
        ? answer
        : String(answer || "").split(",").map((s) => s.trim());

      isCorrect =
        correctArr.length === userArr.length &&
        correctArr.every(
          (c, idx) =>
            String(c).trim().toLowerCase() ===
            String(userArr[idx] || "").trim().toLowerCase()
        );
    } else if (currentExercise.type === "order_code") {
      const correctArr = Array.isArray(currentExercise.correctAnswer)
        ? currentExercise.correctAnswer
        : [currentExercise.correctAnswer];
      const userArr = Array.isArray(answer)
        ? answer
        : String(answer || "").split("\n").map((s) => s.trim());

      isCorrect =
        correctArr.length === userArr.length &&
        correctArr.every(
          (c, idx) =>
            normalizeCode(String(c)) === normalizeCode(String(userArr[idx] || ""))
        );
    } else if (
      currentExercise.type === "editor" ||
      currentExercise.type === "debug"
    ) {
      isCorrect =
        normalizeCode(answer) ===
        normalizeCode(String(currentExercise.correctAnswer));
    }

    if (isCorrect) {
      sounds.playSuccess();
      setStatus("correct");
    } else {
      sounds.playError();
      setStatus("incorrect");
      if (!user.isPremium) {
        setTempHearts((h) => Math.max(0, h - 1));
        fetch("/api/hearts/deduct", { method: "POST" });
      }
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex < lesson.exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setStatus("idle");
      setAnswer(null);
    } else {
      // Leçon terminée !
      setIsFinished(true);
      sounds.playLevelUp();

      confetti({
        particleCount: 160,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#4CC2FF", "#FFC83D", "#2CD98F", "#FF6B35"],
      });

      const baseReward = lesson.xpReward || 10;
      const xp = user.isPremium ? baseReward * 2 : baseReward;
      setEarnedXp(xp);

      // Persistance locale de la progression
      try {
        const storageKey = `codingo_completed_${user.uid}`;
        const currentCompleted: string[] = JSON.parse(
          localStorage.getItem(storageKey) || "[]"
        );
        if (!currentCompleted.includes(lesson.id)) {
          currentCompleted.push(lesson.id);
          localStorage.setItem(storageKey, JSON.stringify(currentCompleted));
        }
      } catch {}

      // Mise à jour profil utilisateur
      updateProfileData({
        totalXp: (user.totalXp || 0) + xp,
        leagueXp: (user.leagueXp || 0) + xp,
        gems: (user.gems || 0) + 5,
      });
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#F0F9FF] flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl border-2 border-[#E2EEF7] p-8 shadow-[0_8px_0_0_#CBD5E1] flex flex-col items-center">
          <div className="w-24 h-24 bg-[#FFC83D] rounded-full flex items-center justify-center mb-6 shadow-[0_6px_0_0_#E0A81B] animate-bounce-slow">
            <Award className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-black text-[#0B3A5B] mb-2">
            Leçon Réussie !
          </h1>
          <p className="text-base text-[#4A7FA5] font-bold mb-6">
            {lesson.title}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mb-8">
            <div className="bg-[#FFFBEB] border-2 border-[#FFC83D] rounded-2xl p-4 flex flex-col items-center">
              <span className="text-xs font-black uppercase text-[#B45309] tracking-wider mb-1">
                Expérience
              </span>
              <div className="flex items-center gap-1.5 text-2xl font-black text-[#D97706]">
                <Sparkles className="w-5 h-5" />
                +{earnedXp} XP
              </div>
            </div>

            <div className="bg-[#F0FDF4] border-2 border-[#2CD98F] rounded-2xl p-4 flex flex-col items-center">
              <span className="text-xs font-black uppercase text-[#15803D] tracking-wider mb-1">
                Gemmes
              </span>
              <div className="flex items-center gap-1.5 text-2xl font-black text-[#16A34A]">
                <CheckCircle2 className="w-5 h-5" />
                +5 Gemmes
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              router.push(`/apprendre/${unit.languageId}`);
            }}
            className="w-full py-4 rounded-2xl bg-[#4CC2FF] text-[#0B3A5B] font-black shadow-[0_6px_0_0_#1B9BE0] active:shadow-none active:translate-y-1.5 transition-all text-base tracking-wider uppercase"
          >
            Continuer le parcours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LessonHeader
        progress={progress}
        hearts={tempHearts}
        isPremium={user.isPremium}
      />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 pb-32 overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#4A7FA5] bg-[#F0F9FF] px-2.5 py-1 rounded-lg border border-[#E2EEF7]">
            {unit.title}
          </span>
          <span className="text-xs font-bold text-[#94B8D0]">
            Exercice {currentIndex + 1} / {lesson.exercises.length}
          </span>
        </div>

        <h2 className="text-2xl font-black text-[#0B3A5B] mb-4">
          {currentExercise.title}
        </h2>

        <div className="space-y-6">
          <p className="text-base md:text-lg font-bold text-[#4A7FA5]">
            {currentExercise.instruction}
          </p>

          <ExerciseRenderer
            exercise={currentExercise}
            answer={answer}
            onChangeAnswer={setAnswer}
            status={status}
          />
        </div>
      </main>

      <LessonFooter
        status={status}
        onCheck={handleCheck}
        onNext={handleNext}
        disabled={
          status === "idle" &&
          !answer &&
          currentExercise.type !== "explanation"
        }
        explanation={status !== "idle" ? currentExercise.explanation : undefined}
      />
    </div>
  );
}
