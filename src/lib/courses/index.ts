import { Course } from "@/types/course";
import { htmlUnit1 } from "./content/html/unit1";
import { htmlUnit2 } from "./content/html/unit2";
import { cssUnit1 } from "./content/css/unit1";
import { cssUnit2 } from "./content/css/unit2";
import { jsUnit1 } from "./content/javascript/unit1";

export const courses: Course[] = [
  {
    id: "html",
    title: "HTML",
    description: "Apprends à structurer des pages web modernes.",
    iconSvg: "H",
    status: "available",
    order: 1,
    units: [htmlUnit1, htmlUnit2],
  },
  {
    id: "css",
    title: "CSS",
    description: "Donne du style, des couleurs et du dynamisme à tes créations.",
    iconSvg: "C",
    status: "available",
    order: 2,
    units: [cssUnit1, cssUnit2],
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Rends tes sites interactifs et dynamiques.",
    iconSvg: "JS",
    status: "available",
    order: 3,
    units: [jsUnit1],
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function getAllCourses(): Course[] {
  return courses;
}

export function getLessonById(id: string): { lesson: import("@/types/course").Lesson; unit: import("@/types/course").Unit } | undefined {
  for (const course of courses) {
    for (const unit of course.units) {
      for (const chapter of unit.chapters) {
        const lesson = chapter.lessons.find((l) => l.id === id);
        if (lesson) return { lesson, unit };
      }
    }
  }
  return undefined;
}
