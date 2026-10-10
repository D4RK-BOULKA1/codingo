import { Suspense } from "react";
import LanguageClient from "./LanguageClient";
import { Loader2 } from "lucide-react";

export function generateStaticParams() {
  return [{ languageId: "html" }, { languageId: "css" }, { languageId: "javascript" }, { languageId: "python" }];
}

interface PageProps {
  params: Promise<{ languageId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { languageId } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF]">
          <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
        </div>
      }
    >
      <LanguageClient languageId={languageId} />
    </Suspense>
  );
}
