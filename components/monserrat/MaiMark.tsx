import type { SVGProps } from "react";

export function MaiMark({
  width = 32,
  height = 32,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M32 3C41 1 44 9 51 13C59 17 63 22 60 32C63 41 56 46 51 51C46 60 39 60 32 60C23 64 18 57 12 52C3 47 4 40 3 32C0 23 8 18 12 12C18 4 24 5 32 3Z"
        fill="#E60A2F"
      />
      <rect x="23" y="25" width="6" height="13" rx="3" fill="white" />
      <rect x="36" y="25" width="6" height="13" rx="3" fill="white" />
    </svg>
  );
}
