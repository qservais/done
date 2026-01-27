interface CalEmbedProps {
  calLink?: string;
  className?: string;
}

export function CalEmbed({ calLink = "madebydone/30min", className = "" }: CalEmbedProps) {
  return (
    <div className={`w-full rounded-2xl overflow-hidden ${className}`}>
      <iframe
        src={`https://cal.com/${calLink}?embed=true&theme=light&layout=month_view`}
        title="Réserver un rendez-vous"
        className="w-full border-0 rounded-2xl bg-white"
        style={{ minHeight: "600px", height: "100%" }}
        loading="lazy"
      />
    </div>
  );
}
