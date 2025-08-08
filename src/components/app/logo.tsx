import { cn } from "@/lib/utils";
import type { FC } from "react";

type LogoProps = {
  className?: string;
  size?: number;
};

export const Logo: FC<LogoProps> = ({ className, size }) => {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width={size}
        height={size}
        className={cn(className)}
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 18v-6" />
        <path d="M12 12H9.5a2.5 2.5 0 0 1 0-5h.01" />
        <path d="M12 12h2.5a2.5 2.5 0 0 0 0-5h-.01" />
    </svg>
  );
};
