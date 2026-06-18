"use client";

import { cn } from "@/lib/utils";

interface FilterPill {
  id: string;
  label: string;
}

const DEFAULT_FILTERS: FilterPill[] = [
  { id: "semua", label: "Semua" },
  { id: "alam", label: "Alam" },
  { id: "aktivitas", label: "Aktivitas" },
  { id: "budaya", label: "Budaya" },
  { id: "kuliner", label: "Kuliner" },
  { id: "penginapan", label: "Penginapan" },
  { id: "spot-foto", label: "Spot Foto" },
];

interface FilterPillsProps {
  filters?: FilterPill[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  className?: string;
}

export default function FilterPills({
  filters = DEFAULT_FILTERS,
  activeFilter,
  onFilterChange,
  className,
}: FilterPillsProps) {
  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide", className)}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
              isActive 
                ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
