import { Suspense } from "react";
import PublicProfilClient from "./PublicProfilClient";
import { Loader2 } from "lucide-react";

export function generateStaticParams() {
  return [{ username: "boulka-admin" }, { username: "user" }];
}

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F0F9FF]">
          <Loader2 className="w-8 h-8 animate-spin text-[#4CC2FF]" />
        </div>
      }
    >
      <PublicProfilClient username={username} />
    </Suspense>
  );
}
