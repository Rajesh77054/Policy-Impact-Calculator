
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DataFreshnessIndicatorProps {
  lastUpdated: string;
  dataSource?: string;
  maxAgeHours?: number;
  className?: string;
}

export function DataFreshnessIndicator({ 
  lastUpdated, 
  dataSource, 
  maxAgeHours = 24,
  className = ""
}: DataFreshnessIndicatorProps) {
  const updateDate = new Date(lastUpdated);
  const now = new Date();
  const hoursSinceUpdate = (now.getTime() - updateDate.getTime()) / (1000 * 60 * 60);
  
  const isStale = hoursSinceUpdate > maxAgeHours;
  const isVeryStale = hoursSinceUpdate > maxAgeHours * 7; // 7x the max age
  
  const formatTimeAgo = (hours: number): string => {
    if (hours < 1) {
      const minutes = Math.floor(hours * 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      const roundedHours = Math.floor(hours);
      return `${roundedHours} hour${roundedHours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const getVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (isVeryStale) return "destructive";
    if (isStale) return "outline";
    return "secondary";
  };

  const getIcon = () => {
    if (isVeryStale) return <AlertCircle className="h-3 w-3" />;
    if (isStale) return <Clock className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  const getTooltipContent = () => {
    return (
      <div className="text-sm">
        <div className="font-medium">Data Freshness</div>
        <div>Updated: {updateDate.toLocaleString()}</div>
        <div>Age: {formatTimeAgo(hoursSinceUpdate)}</div>
        {dataSource && <div>Source: {dataSource}</div>}
        {isVeryStale && (
          <div className="text-yellow-200 mt-1">
            ⚠️ Data may be outdated
          </div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={getVariant()} className={`text-xs ${className}`}>
            {getIcon()}
            <span className="ml-1">
              {formatTimeAgo(hoursSinceUpdate)}
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
