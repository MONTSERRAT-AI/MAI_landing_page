import Link from "next/link";
import { MaiMark } from "@/components/monserrat/MaiMark";

export const Footer = () => (
  <footer
    className="site-footer"
    itemScope
    itemType="https://schema.org/Organization"
  >
    <div className="container">
      <div className="footer-top">
        <Link href="/#inicio" className="wordmark">
          <MaiMark width={24} height={24} />
          <span itemProp="name">MONSERRAT_AI</span>
        </Link>
        <nav className="footer-links" aria-label="Navegación del pie de página">
          <Link href="/#soluciones">Automatizaciones</Link>
          <Link href="/#como-trabajamos">Cómo trabajamos</Link>
          <Link href="/#mas-soluciones">Más servicios</Link>
          <Link href="/#contacto">Contacto</Link>
          <Link href="/privacidad">Privacidad</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} MONTSERRATAI · NIT 1.011.083.308-1
        </span>
        <span>
          <span itemProp="address">Bogotá D.C., Colombia</span> ·{" "}
          <a href="mailto:jpcardozo@montserratai.com.co" itemProp="email">
            jpcardozo@montserratai.com.co
          </a>{" "}
          ·{" "}
          <a href="tel:+573043906303" itemProp="telephone">
            +57 304 390 6303
          </a>
        </span>
      </div>
    </div>
  </footer>
);
