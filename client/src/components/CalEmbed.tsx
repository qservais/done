import { useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const CAL_LINK = "madebydone/30min";

declare global {
  interface Window {
    Cal?: any;
  }
}

interface CalPopupButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  children?: React.ReactNode;
}

export function CalPopupButton({ 
  className = "", 
  variant = "default",
  children 
}: CalPopupButtonProps) {
  useEffect(() => {
    // Load Cal.com embed script
    if (!document.getElementById("cal-embed-script")) {
      const script = document.createElement("script");
      script.id = "cal-embed-script";
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (window.Cal) {
          window.Cal("init", { origin: "https://cal.com" });
          window.Cal("ui", {
            theme: "light",
            styles: { branding: { brandColor: "#395af6" } },
            hideEventTypeDetails: false,
          });
        }
      };
    }
  }, []);

  const openCalPopup = () => {
    if (window.Cal) {
      window.Cal("modal", {
        calLink: CAL_LINK,
        config: { layout: "month_view", theme: "light" },
      });
    } else {
      // Fallback: open in new tab
      window.open(`https://cal.com/${CAL_LINK}`, "_blank");
    }
  };

  return (
    <Button 
      size="lg" 
      variant={variant}
      className={className}
      onClick={openCalPopup}
      data-testid="button-cal-popup"
    >
      {children || (
        <>
          <Calendar className="w-5 h-5 mr-2" />
          Prendre rendez-vous
        </>
      )}
    </Button>
  );
}
