"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getCourseById } from "@/lib/courses";
import { UnitHeader } from "@/components/course/UnitHeader";
import { PathNode } from "@/components/course/PathNode";
import { Loader2, ArrowLeft, BookOpen, X, Trophy } from "lucide-react";
import { Unit } from "@/types/course";
import { sounds } from "@/lib/audio/soundEffects";

interface LanguageClientProps {
  languageId: string;
}

export default function LanguageClient({ languageId }: LanguageClientProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const course = getCourseById(languageId);

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeGuideUnit, setActiveGuideUnit] = useState<Unit | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/connexion");
      return;
    }

    if (user) {
      try {
        const storageKey = `codingo_completed_${user.uid}`;
        const stored: string[] = JSON.parse(
          localStorage.getItem(storageKey) || "[]"
        );
        setCompletedLessons(stored);
      } catch {
        setCompletedLessons([]);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
      </div>
    );
  }

  // Aplatir toutes les leçons du cours pour calculer la leçon courante
  const allLessons: string[] = [];
  course.units.forEach((u) => {
    u.chapters.forEach((ch) => {
      ch.lessons.forEach((l) => {
        allLessons.push(l.id);
      });
    });
  });

  // La première leçon non complétée est la leçon courante (ou la toute première par défaut)
  const currentLessonId =
    allLessons.find((id) => !completedLessons.includes(id)) || allLessons[0];

  const totalLessonsCount = allLessons.length;
  const completedCount = allLessons.filter((id) =>
    completedLessons.includes(id)
  ).length;
  const progressPercent =
    totalLessonsCount > 0
      ? Math.round((completedCount / totalLessonsCount) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#F0F9FF]">
      {/* Header Sticky */}
      <header className="sticky top-0 z-30 bg-white border-b-2 border-[#E2EEF7] shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                router.push("/apprendre");
              }}
              className="p-2 rounded-xl hover:bg-[#F0F9FF] border border-[#E2EEF7] transition-colors"
              title="Retour aux cours"
            >
              <ArrowLeft className="w-5 h-5 text-[#0B3A5B]" />
            </button>
            <div>
              <h1 className="text-lg font-black text-[#0B3A5B] leading-none">
                {course.title}
              </h1>
              <p className="text-[10px] font-bold text-[#4A7FA5] uppercase tracking-widest mt-1">
                {completedCount} / {totalLessonsCount} leçons • {progressPercent}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2EEF7]">
            <Trophy className="w-4 h-4 text-[#FFC83D]" />
            <span className="text-xs font-black text-[#0B3A5B]">
              {user.totalXp || 0} XP
            </span>
          </div>
        </div>

        {/* Barre de progression fine */}
        <div className="w-full bg-[#E2EEF7] h-1.5">
          <div
            className="bg-[#2CD98F] h-1.5 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Path */}
      <main className="max-w-xl mx-auto px-4 py-8 pb-32">
        {course.units.map((unit) => (
          <div key={unit.id} className="mb-14">
            <UnitHeader
              unit={unit}
              onOpenGuide={() => {
                sounds.playClick();
                setActiveGuideUnit(unit);
              }}
            />

            <div className="flex flex-col items-center">
              {unit.chapters.map((chapter) => (
                <div key={chapter.id} className="w-full flex flex-col items-center mb-6">
                  <div className="my-3 px-4 py-1.5 rounded-full bg-white border border-[#E2EEF7] shadow-sm text-xs font-black text-[#4A7FA5] uppercase tracking-wider">
                    {chapter.title}
                  </div>

                  {chapter.lessons.map((lesson, idx) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isCurrent = lesson.id === currentLessonId;
                    const isLocked = !isCompleted && !isCurrent;

                    return (
                      <PathNode
                        key={lesson.id}
                        id={lesson.id}
                        type={lesson.type}
                        title={lesson.title}
                        color={unit.color}
                        index={idx}
                        status={
                          isLocked
                            ? "locked"
                            : isCompleted
                            ? "completed"
                            : "current"
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Modal Guide de l'Unité */}
      {activeGuideUnit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col border-2 border-[#E2EEF7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div
              className="p-6 text-white flex items-center justify-between"
              style={{ backgroundColor: activeGuideUnit.color }}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-80">
                    Guide de l&apos;unité {activeGuideUnit.order}
                  </p>
                  <h3 className="text-xl font-black">{activeGuideUnit.title}</h3>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveGuideUnit(null);
                }}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-[#0B3A5B] text-sm leading-relaxed whitespace-pre-line font-medium">
              {activeGuideUnit.guideMarkdown || activeGuideUnit.description}
            </div>

            <div className="p-4 border-t border-[#E2EEF7] bg-[#F8FAFC] flex justify-end">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveGuideUnit(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#4CC2FF] text-[#0B3A5B] font-black shadow-[0_4px_0_0_#1B9BE0] active:translate-y-1 transition-all"
              >
                J&apos;ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
