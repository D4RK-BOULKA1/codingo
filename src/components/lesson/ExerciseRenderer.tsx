"use client";

import { useEffect, useState } from "react";
import { Exercise } from "@/types/course";
import { CodeEditorSandbox } from "./CodeEditorSandbox";
import { sounds } from "@/lib/audio/soundEffects";
import { ArrowDown, ArrowUp, Shuffle } from "lucide-react";

interface ExerciseRendererProps {
  exercise: Exercise;
  answer: any;
  onChangeAnswer: (val: any) => void;
  status: "idle" | "correct" | "incorrect";
}

export function ExerciseRenderer({
  exercise,
  answer,
  onChangeAnswer,
  status,
}: ExerciseRendererProps) {
  switch (exercise.type) {
    case "explanation":
      return (
        <div className="bg-[#F0F9FF] border-2 border-[#4CC2FF] rounded-3xl p-6 text-[#0B3A5B] leading-relaxed space-y-4 shadow-sm">
          <p className="whitespace-pre-line text-base font-medium">
            {exercise.content}
          </p>
        </div>
      );

    case "qcm":
    case "true_false":
      return (
        <div className="grid gap-3">
          {exercise.options?.map((option) => {
            const isSelected = answer === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  if (status === "idle") {
                    sounds.playClick();
                    onChangeAnswer(option);
                  }
                }}
                className={`
                  w-full p-4 text-left rounded-2xl border-2 font-bold transition-all
                  ${
                    isSelected
                      ? "border-[#1B9BE0] bg-[#F0F9FF] text-[#1B9BE0] shadow-[0_4px_0_0_#1B9BE0]"
                      : "border-[#E2EEF7] text-[#0B3A5B] hover:border-[#4CC2FF] shadow-[0_4px_0_0_#E2EEF7] active:translate-y-1"
                  }
                `}
              >
                {option}
              </button>
            );
          })}
        </div>
      );

    case "fill_blanks": {
      // Extraction des trous du content [mot]
      const textParts = (exercise.content || "").split(/\[.*?\]/);
      const matches = (exercise.content || "").match(/\[(.*?)\]/g) || [];
      const currentAnswers = Array.isArray(answer)
        ? answer
        : typeof answer === "string"
        ? answer.split(",").map((s) => s.trim())
        : [];

      const handleSlotChange = (index: number, val: string) => {
        const next = [...currentAnswers];
        next[index] = val.trim();
        onChangeAnswer(next);
      };

      return (
        <div className="space-y-6">
          <div className="bg-[#F8FAFC] border-2 border-[#E2EEF7] rounded-2xl p-5 leading-loose text-base font-bold text-[#0B3A5B]">
            {textParts.map((part, i) => (
              <span key={i}>
                {part}
                {i < matches.length && (
                  <input
                    type="text"
                    value={currentAnswers[i] || ""}
                    placeholder="?"
                    onChange={(e) => handleSlotChange(i, e.target.value)}
                    className="inline-block mx-1 px-3 py-1 text-center font-mono font-black text-sm bg-white border-2 border-[#4CC2FF] rounded-xl text-[#0B3A5B] focus:outline-none focus:ring-2 focus:ring-[#1B9BE0] shadow-sm w-32"
                  />
                )}
              </span>
            ))}
          </div>

          <div>
            <label className="text-xs font-black text-[#4A7FA5] uppercase tracking-wider block mb-2">
              Ou saisis tes réponses dans l&apos;ordre (séparées par une virgule) :
            </label>
            <input
              type="text"
              value={currentAnswers.join(", ")}
              onChange={(e) =>
                onChangeAnswer(e.target.value.split(",").map((s) => s.trim()))
              }
              placeholder="ex: balises, contenu"
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#E2EEF7] text-[#0B3A5B] font-bold focus:border-[#4CC2FF] focus:outline-none shadow-sm"
            />
          </div>
        </div>
      );
    }

    case "order_code":
      return (
        <OrderCodeExercise
          exercise={exercise}
          answer={answer}
          onChangeAnswer={onChangeAnswer}
        />
      );

    case "editor":
    case "debug":
      return (
        <CodeEditorSandbox
          initialCode={exercise.code || ""}
          value={answer ?? exercise.code ?? ""}
          onChange={onChangeAnswer}
          placeholder="Écris ton code ici..."
        />
      );

    default:
      return <p className="text-red-500">Type d&apos;exercice inconnu</p>;
  }
}

/**
 * Composant de réorganisation interactive du code par tuiles
 */
function OrderCodeExercise({
  exercise,
  answer,
  onChangeAnswer,
}: {
  exercise: Exercise;
  answer: any;
  onChangeAnswer: (val: any) => void;
}) {
  const [items, setItems] = useState<string[]>(() => {
    if (Array.isArray(answer) && answer.length > 0) return answer;
    // Initialiser avec les options mélangées
    const initial = [...(exercise.options || [])];
    return initial.sort(() => Math.random() - 0.5);
  });

  useEffect(() => {
    onChangeAnswer(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const moveItem = (index: number, direction: "up" | "down") => {
    sounds.playClick();
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black text-[#4A7FA5] uppercase tracking-wider">
          Déplace les blocs de code pour obtenir le bon ordre :
        </p>
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setItems([...items].sort(() => Math.random() - 0.5));
          }}
          className="text-xs font-bold text-[#1B9BE0] hover:text-[#0B3A5B] flex items-center gap-1"
        >
          <Shuffle className="w-3.5 h-3.5" /> Mélanger
        </button>
      </div>

      <div className="space-y-2">
        {items.map((line, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white border-2 border-[#E2EEF7] shadow-[0_3px_0_0_#CBD5E1] hover:border-[#4CC2FF] transition-all"
          >
            <code className="text-xs md:text-sm font-mono font-bold text-[#0B3A5B]">
              {line}
            </code>
            <div className="flex items-center gap-1 ml-3">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => moveItem(idx, "up")}
                className="p-1.5 rounded-lg border border-[#E2EEF7] text-[#4A7FA5] hover:text-[#0B3A5B] disabled:opacity-30 disabled:hover:text-[#4A7FA5]"
                title="Monter"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={idx === items.length - 1}
                onClick={() => moveItem(idx, "down")}
                className="p-1.5 rounded-lg border border-[#E2EEF7] text-[#4A7FA5] hover:text-[#0B3A5B] disabled:opacity-30 disabled:hover:text-[#4A7FA5]"
                title="Descendre"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
