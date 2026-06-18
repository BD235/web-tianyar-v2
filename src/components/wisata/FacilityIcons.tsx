import {
  Wifi,
  Car,
  Utensils,
  Bath,
  Tent,
  Waves,
  Info,
} from "lucide-react";
import { JSX } from "react";

// Tipe data untuk properti komponen
interface FacilityIconsProps {
  facilities: string[];
  className?: string;
}

// Fungsi bantu untuk mencocokkan nama fasilitas dengan Ikon Lucide
const getFacilityIcon = (facilityName: string): JSX.Element => {
  const name = facilityName.toLowerCase();
  
  if (name.includes("wifi")) return <Wifi className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("renang") || name.includes("pool")) return <Waves className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("makan") || name.includes("restoran") || name.includes("dinner")) return <Utensils className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("parkir") || name.includes("parking")) return <Car className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("toilet") || name.includes("mandi") || name.includes("tub")) return <Bath className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("kemah") || name.includes("camping")) return <Tent className="w-8 h-8 stroke-[1.5]" />;
  
  // Ikon default jika tidak ada yang cocok
  return <Info className="w-8 h-8 stroke-[1.5]" />;
};

export default function FacilityIcons({ facilities, className = "" }: FacilityIconsProps) {
  if (!facilities || facilities.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {facilities.map((facility, index) => (
        <div 
          key={index} 
          className="flex flex-col items-center justify-center w-[88px] h-[88px] bg-[#F7F9FC] text-[#A0AAB4] rounded-2xl gap-2 hover:bg-[#EFF3F8] transition-colors"
          title={facility} // Muncul tooltip saat di-hover
        >
          {getFacilityIcon(facility)}
          <span className="text-[11px] font-medium text-center leading-tight px-1">{facility}</span>
        </div>
      ))}
    </div>
  );
}
