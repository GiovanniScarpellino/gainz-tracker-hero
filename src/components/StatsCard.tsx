import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  icon?: React.ReactNode;
  gradient?: boolean;
}

export const StatsCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  icon, 
  gradient = false 
}: StatsCardProps) => {
  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-fitness-success";
    if (trend < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card className={`p-4 ${gradient ? 'bg-gradient-primary' : 'bg-gradient-card'} border-border/50 shadow-card`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${gradient ? 'text-primary-foreground/80' : 'text-muted-foreground'} mb-1`}>
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${gradient ? 'text-primary-foreground' : 'text-foreground'}`}>
              {value}
            </span>
            {unit && (
              <span className={`text-sm font-medium ${gradient ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                {unit}
              </span>
            )}
          </div>
          
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend > 0 ? (
                <TrendingUp className="w-3 h-3 text-fitness-success" />
              ) : trend < 0 ? (
                <TrendingDown className="w-3 h-3 text-destructive" />
              ) : null}
              <span className={`text-xs font-medium ${getTrendColor(trend)}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`p-2 rounded-lg ${gradient ? 'bg-primary-foreground/10' : 'bg-fitness-primary/10'}`}>
            <div className={gradient ? 'text-primary-foreground' : 'text-fitness-primary'}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};