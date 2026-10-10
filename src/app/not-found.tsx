import React from "react";
import Link from "next/link";
import { CodieMascot } from "@/components/mascot/CodieMascot";
import { Button3D } from "@/components/ui/Button3D";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="card-3d-blue max-w-md w-full p-8 md:p-10 space-y-6">
        <CodieMascot mood="thinking" size="lg" className="mx-auto" />

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-xl bg-[#FFF1F1] text-[#D63030] border border-[#FF5353] text-xs font-black uppercase tracking-wider">
            Erreur 404
          </span>
          <h1 className="text-3xl font-black text-[#0B3A5B]">
            Page introuvable !
          </h1>
          <p className="text-sm font-bold text-[#4A6B82]">
            Codie a cherché dans tout le code, mais cette page n&apos;existe pas ou a été déplacée.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Button3D
            variant="blue"
            size="md"
            href="/"
            fullWidth
            icon={<Home size={18} />}
          >
            Retourner à l&apos;accueil
          </Button3D>
          <Button3D
            variant="white"
            size="md"
            href="/cours"
            fullWidth
            icon={<ArrowLeft size={18} />}
          >
            Aller à mon cours
          </Button3D>
        </div>
      </div>
    </div>
  );
}
