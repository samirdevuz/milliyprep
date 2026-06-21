import type { Metadata } from "next";
import { OnboardingProvider } from "@/lib/onboarding/store";

export const metadata: Metadata = {
  title: "Onboarding · MilliyPrep",
  description:
    "Sizga shaxsiy o'quv reja tuzish uchun bir nechta savolga javob bering.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}
