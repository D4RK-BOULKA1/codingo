import { Suspense } from "react";
import LessonClient from "./LessonClient";
import { Loader2 } from "lucide-react";
import { getAllCourses } from "@/lib/courses";

export function generateStaticParams() {
  const params: { lessonId: string }[] = [];
  for (const course of getAllCourses()) {
    for (const unit of course.units) {
      for (const chapter of unit.chapters) {
        for (const lesson of chapter.lessons) {
          params.push({ lessonId: lesson.id });
        }
      }
    }
  }
  return params;
}

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { lessonId } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
        </div>
      }
    >
      <LessonClient lessonId={lessonId} />
    </Suspense>
  );
}
