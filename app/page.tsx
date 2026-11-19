import Header from "@/components/monserrat/Header";
import Hero from "@/components/monserrat/Hero";
import {
  CaseStudies,
  Faq,
  PlatformBlock,
  Process,
  ServicesBento,
  Solutions,
} from "@/components/monserrat/LandingSections";
import Journey from "@/components/monserrat/Journey";
import Marketing from "@/components/monserrat/Marketing";
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
        <CaseStudies />
        <Solutions />
        <Journey>
          <PlatformBlock />
        </Journey>
        <Process />
        <Marketing />
        <ServicesBento />
        <Faq />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
