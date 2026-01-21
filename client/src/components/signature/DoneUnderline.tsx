import { ReactNode } from "react";

interface DoneUnderlineProps {
  children: ReactNode;
  className?: string;
}

export function DoneUnderline({ children, className = "" }: DoneUnderlineProps) {
  return (
    <span className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{children}</span>
      <span 
        className="absolute bottom-0 left-0 w-full h-[6px] md:h-[8px] bg-accent/30 rounded-sm -translate-y-1 
                   origin-left scale-x-[0.85] group-hover:scale-x-100 
                   transition-transform duration-200 ease-out
                   motion-reduce:transition-none motion-reduce:scale-x-100"
        aria-hidden="true"
      />
    </span>
  );
}
