import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Mission } from "@/components/sections/mission";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Features } from "@/components/sections/features";
import { Subjects } from "@/components/sections/subjects";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { AiTutor } from "@/components/sections/ai-tutor";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { JsonLd } from "@/components/seo/json-ld";
import {
  courseJsonLd,
  faqJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Mission />
        <HowItWorks />
        <Features />
        <Subjects />
        <ProductShowcase />
        <AiTutor />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <JsonLd
        data={[organizationJsonLd, websiteJsonLd, courseJsonLd, faqJsonLd]}
      />
    </>
  );
}
