import {
  Wifi,
  Car,
  Utensils,
  Bath,
  Tent,
  Waves,
  Info,
  Camera,
  Landmark,
  Umbrella,
  ShoppingBag,
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
  if (name.includes("renang") || name.includes("pool") || name.includes("pantai")) return <Waves className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("makan") || name.includes("warung") || name.includes("restoran") || name.includes("kuliner")) return <Utensils className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("parkir") || name.includes("parking")) return <Car className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("toilet") || name.includes("mandi") || name.includes("wc")) return <Bath className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("kemah") || name.includes("camping")) return <Tent className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("foto") || name.includes("kamera") || name.includes("spot") || name.includes("selfie")) return <Camera className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("ibadah") || name.includes("sholat") || name.includes("masjid") || name.includes("pura")) return <Landmark className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("gazebo") || name.includes("istirahat") || name.includes("santai") || name.includes("pondok")) return <Umbrella className="w-8 h-8 stroke-[1.5]" />;
  if (name.includes("sewa") || name.includes("penyewaan") || name.includes("alat") || name.includes("rental")) return <ShoppingBag className="w-8 h-8 stroke-[1.5]" />;
  
  // Ikon default jika tidak ada yang cocok (misal: Pusat Informasi)
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
