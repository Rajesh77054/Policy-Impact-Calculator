import { HelpCircle, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MobileTooltipProps {
  content: string;
  className?: string;
  title?: string;
  icon?: "info" | "help";
  iconSize?: "sm" | "md";
}

export function MobileTooltip({ 
  content, 
  className = "", 
  title = "Information", 
  icon = "info",
  iconSize = "md"
}: MobileTooltipProps) {
  const isMobile = useIsMobile();
  
  const iconClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4"
  };
  
  const IconComponent = icon === "help" ? HelpCircle : Info;
  
  if (isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button 
            className={`text-slate-400 hover:text-slate-600 cursor-help transition-colors ${className}`}
            aria-label="Show help information"
          >
            <IconComponent className={iconClasses[iconSize]} />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-base leading-tight">{title}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-slate-600 leading-relaxed">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className={`text-slate-400 hover:text-slate-600 cursor-help transition-colors ${className}`}
            aria-label="Show help information"
          >
            <IconComponent className={iconClasses[iconSize]} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}