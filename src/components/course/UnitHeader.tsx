"use client";

import { Unit } from "@/types/course";
import { BookOpen } from "lucide-react";
import { Button3D } from "@/components/ui/Button3D";

interface UnitHeaderProps {
  unit: Unit;
  onOpenGuide: () => void;
}

export function UnitHeader({ unit, onOpenGuide }: UnitHeaderProps) {
  return (
    <div 
      className="w-full p-6 rounded-2xl text-white mb-8 relative overflow-hidden"
      style={{ backgroundColor: unit.color }}
    >
      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">
          Unité {unit.order}
        </p>
        <h2 className="text-2xl font-black mb-2">{unit.title}</h2>
        <p className="text-sm font-bold opacity-90 mb-6 max-w-md">
          {unit.description}
        </p>
        
        <Button3D 
          variant="white" 
          onClick={onOpenGuide}
          className="flex items-center gap-2 text-xs py-2 px-4"
        >
          <BookOpen className="w-4 h-4" />
          GUIDE DE L&apos;UNITÉ
        </Button3D>
      </div>

      {/* Déco d'arrière-plan simpliste (flat) */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BookOpen className="w-32 h-32 rotate-12" />
      </div>
    </div>
  );
}
