import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const CAL_LINK = "madebydone/30min";
const CAL_NAMESPACE = "30min";

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
    (async function () {
      try {
        const cal = await getCalApi({ namespace: CAL_NAMESPACE });
        cal("ui", { 
          hideEventTypeDetails: false, 
          layout: "month_view",
          theme: "light",
          styles: { branding: { brandColor: "#395af6" } }
        });
      } catch (e) {
        console.warn("Cal.com initialization failed:", e);
      }
    })();
  }, []);

  const openCalPopup = async () => {
    try {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal("modal", {
        calLink: CAL_LINK,
        config: { layout: "month_view" },
      });
    } catch (e) {
      console.warn("Cal.com modal failed, using fallback:", e);
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

interface CalInlineProps {
  className?: string;
}

export function CalInline({ className = "" }: CalInlineProps) {
  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi({ namespace: CAL_NAMESPACE });
        cal("ui", { 
          hideEventTypeDetails: false, 
          layout: "month_view" 
        });
      } catch (e) {
        console.warn("Cal.com initialization failed:", e);
      }
    })();
  }, []);

  return (
    <Cal 
      namespace={CAL_NAMESPACE}
      calLink={CAL_LINK}
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
      className={className}
      data-testid="cal-inline-embed"
    />
  );
}
