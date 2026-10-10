export type ExerciseType =
  | "explanation"
  | "qcm"
  | "true_false"
  | "fill_blanks"
  | "order_code"
  | "debug"
  | "editor";

export interface Exercise {
  id: string;
  type: ExerciseType;
  title: string;
  instruction: string;
  content?: string; // Markdown or text for explanation
  code?: string; // Initial code for editor/debug
  options?: string[]; // For QCM
  correctAnswer?: string | string[]; // Single string for QCM, array for order/blanks
  explanation?: string; // Pédagogie après erreur/succès
  hints?: string[];
}

export type LessonType = "lesson" | "quiz" | "project" | "chest" | "review";

export interface Lesson {
  id: string;
  unitId: string;
  chapterId: string;
  title: string;
  order: number;
  type: LessonType;
  xpReward: number;
  exercises: Exercise[];
}

export interface Chapter {
  id: string;
  unitId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Unit {
  id: string;
  languageId: string;
  title: string;
  description: string;
  order: number;
  color: string;
  guideMarkdown?: string;
  chapters: Chapter[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  iconSvg: string;
  status: "available" | "coming_soon";
  order: number;
  units: Unit[];
}
