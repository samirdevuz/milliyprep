import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      tone="brand"
      title="Sozlamalar"
      description="Profil, til, bildirishnoma va maqsad sozlamalari shu yerda bo'ladi. Tez orada ishga tushadi."
    />
  );
}
