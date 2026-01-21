interface MadeByDoneBadgeProps {
  className?: string;
  variant?: "outline" | "subtle";
}

export function MadeByDoneBadge({ className = "", variant = "outline" }: MadeByDoneBadgeProps) {
  const variants = {
    outline: "border border-accent/40 text-accent bg-transparent hover:border-accent hover:bg-accent/5",
    subtle: "border-none bg-accent/10 text-accent hover:bg-accent/15",
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1
        px-2 py-0.5
        text-[10px] font-medium tracking-wide
        rounded-full
        transition-all duration-200 ease-out
        motion-reduce:transition-none
        ${variants[variant]}
        ${className}
      `}
    >
      made by <span className="font-bold">done</span>
    </span>
  );
}
