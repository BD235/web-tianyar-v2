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

interface FacilityIconsProps {
  facilities: string[];
  className?: string;
}

const getFacilityIcon = (facilityName: string): JSX.Element => {
  const name = facilityName.toLowerCase();
  const cls = "w-7 h-7 mob-l:w-8 mob-l:h-8 stroke-[1.5]";

  if (name.includes("wifi")) return <Wifi className={cls} />;
  if (name.includes("renang") || name.includes("pool") || name.includes("pantai")) return <Waves className={cls} />;
  if (name.includes("makan") || name.includes("warung") || name.includes("restoran") || name.includes("kuliner")) return <Utensils className={cls} />;
  if (name.includes("parkir") || name.includes("parking")) return <Car className={cls} />;
  if (name.includes("toilet") || name.includes("mandi") || name.includes("wc")) return <Bath className={cls} />;
  if (name.includes("kemah") || name.includes("camping")) return <Tent className={cls} />;
  if (name.includes("foto") || name.includes("kamera") || name.includes("spot") || name.includes("selfie")) return <Camera className={cls} />;
  if (name.includes("ibadah") || name.includes("sholat") || name.includes("masjid") || name.includes("pura")) return <Landmark className={cls} />;
  if (name.includes("gazebo") || name.includes("istirahat") || name.includes("santai") || name.includes("pondok")) return <Umbrella className={cls} />;
  if (name.includes("sewa") || name.includes("penyewaan") || name.includes("alat") || name.includes("rental")) return <ShoppingBag className={cls} />;

  return <Info className={cls} />;
};

const FacilityCard = ({ facility }: { facility: string }) => (
  <div
    className="flex flex-col items-center justify-center shrink-0
      w-[72px] h-[72px] mob-l:w-[80px] mob-l:h-[80px]
      bg-[#F0F3F7] text-[#A0AAB4] rounded-2xl gap-1.5
      transition-colors hover:bg-[#E4E8EE]"
    title={facility}
  >
    {getFacilityIcon(facility)}
    <span className="text-[10px] mob-l:text-[11px] font-medium text-gray-700 text-center leading-tight px-1">
      {facility.split(' ')[0]}
    </span>
  </div>
);

export default function FacilityIcons({ facilities }: FacilityIconsProps) {
  if (!facilities || facilities.length === 0) return null;

  return (
    <div className="overflow-x-auto no-scrollbar w-full">
      <div className="flex gap-3 w-max pb-1">
        {facilities.map((facility, index) => (
          <FacilityCard key={index} facility={facility} />
        ))}
      </div>
    </div>
  );
}
