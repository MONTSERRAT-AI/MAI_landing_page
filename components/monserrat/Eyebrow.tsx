import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow section-eyebrow">
      <span />
      {children}
    </span>
  );
}
