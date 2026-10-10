import { Suspense } from "react";
import LiguesClient from "./LiguesClient";
import { Loader2 } from "lucide-react";

export function generateStaticParams() {
  return [];
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF]">
          <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
        </div>
      }
    >
      <LiguesClient />
    </Suspense>
  );
}
