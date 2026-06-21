import { HelpCircle } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function HelpPage() {
  return (
    <ComingSoon
      icon={HelpCircle}
      tone="accent"
      title="Yordam markazi"
      description="Ko'p so'raladigan savollar, qo'llanmalar va qo'llab-quvvatlash xizmati shu yerda bo'ladi. Tez orada ishga tushadi."
    />
  );
}
