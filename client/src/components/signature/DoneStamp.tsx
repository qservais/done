interface DoneStampProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function DoneStamp({ className = "", size = "md" }: DoneStampProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-[8px]",
    md: "w-12 h-12 md:w-14 md:h-14 text-[10px] md:text-xs",
    lg: "w-16 h-16 text-sm",
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        border-2 border-current rounded-full
        font-bold tracking-widest uppercase
        text-foreground/15
        -rotate-12
        select-none pointer-events-none
        motion-reduce:opacity-100
        ${className}
      `}
      aria-hidden="true"
    >
      DONE
    </div>
  );
}
