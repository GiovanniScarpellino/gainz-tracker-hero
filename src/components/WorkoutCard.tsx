import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Dumbbell } from "lucide-react";

interface WorkoutCardProps {
  title: string;
  date: string;
  duration: string;
  exercises: number;
  calories?: number;
  onResume?: () => void;
}

export const WorkoutCard = ({ 
  title, 
  date, 
  duration, 
  exercises, 
  calories,
  onResume 
}: WorkoutCardProps) => {
  return (
    <Card className="p-4 bg-gradient-card border-border/50 shadow-card hover:shadow-fitness transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-fitness-primary/10 text-fitness-primary border-fitness-primary/20">
          <Dumbbell className="w-3 h-3 mr-1" />
          {exercises} exercices
        </Badge>
      </div>
      
      {calories && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Calories brûlées</span>
          <span className="font-medium text-fitness-secondary">{calories} kcal</span>
        </div>
      )}
      
      {onResume && (
        <Button 
          onClick={onResume}
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium"
        >
          Reprendre l'entraînement
        </Button>
      )}
    </Card>
  );
};