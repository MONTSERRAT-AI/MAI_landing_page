import Header from "@/components/monserrat/Header";
import Hero from "@/components/monserrat/Hero";
import {
  AudienceMarquee,
  Problems,
  AutomationFlow,
  Process,
  ServicesBento,
} from "@/components/monserrat/LandingSections";
import MarketingScroll from "@/components/monserrat/MarketingScroll";
import ContactForm from "@/components/monserrat/ContactForm";
import { Footer } from "@/components/layout/Footer";
import { structuredData } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c"),
        }}
      />
      <main id="contenido">
        <Hero />
        <AudienceMarquee />
        <Problems />
        <AutomationFlow />
        <MarketingScroll />
        <Process />
        <ServicesBento />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
