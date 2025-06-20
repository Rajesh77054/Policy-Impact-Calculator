
import { Info } from "lucide-react";
import { useState } from "react";
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

interface TooltipHelpProps {
  content: string;
  className?: string;
  title?: string;
}

export function TooltipHelp({ content, className = "", title = "Help" }: TooltipHelpProps) {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className={`w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help ${className}`}>
            <Info className="w-4 h-4" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">{title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className={`w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help ${className}`} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
