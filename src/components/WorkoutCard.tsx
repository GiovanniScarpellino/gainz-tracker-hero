import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Dumbbell, X } from "lucide-react";

interface WorkoutCardProps {
  title: string;
  date: string;
  duration: string;
  exercises: number;
  onResume?: () => void;
  onDelete?: () => void;
}

export const WorkoutCard = ({ 
  title, 
  date, 
  duration, 
  exercises, 
  onResume,
  onDelete
}: WorkoutCardProps) => {
  return (
    <Card className="p-4 bg-gradient-card border-border/50 shadow-card hover:shadow-fitness transition-all duration-300 relative" onClick={onResume}>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={onDelete}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            {duration && duration !== "0 min" && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
            )}
            <Badge variant="secondary" className="bg-fitness-primary/10 text-fitness-primary border-fitness-primary/20">
              <Dumbbell className="w-3 h-3 mr-1" />
              {exercises} exercices
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};