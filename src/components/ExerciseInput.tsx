import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Target, Weight } from "lucide-react";

interface Set {
  reps: number;
  weight: number;
}

interface ExerciseInputProps {
  exerciseName: string;
  sets: Set[];
  onSetsChange: (sets: Set[]) => void;
  onRemove: () => void;
}

export const ExerciseInput = ({ 
  exerciseName, 
  sets, 
  onSetsChange, 
  onRemove 
}: ExerciseInputProps) => {
  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet = lastSet ? { ...lastSet } : { reps: 12, weight: 20 };
    onSetsChange([...sets, newSet]);
  };

  const removeSet = (index: number) => {
    onSetsChange(sets.filter((_, i) => i !== index));
  };

  const updateSet = (index: number, field: keyof Set, value: number) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    onSetsChange(newSets);
  };

  return (
    <Card className="p-4 bg-gradient-card border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{exerciseName}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRemove}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {sets.map((set, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <Badge variant="outline" className="min-w-[60px] justify-center">
              Set {index + 1}
            </Badge>
            
            <div className="flex items-center gap-2 flex-1">
              <Target className="w-4 h-4 text-fitness-primary" />
              <Label htmlFor={`reps-${index}`} className="text-sm">Reps</Label>
              <Input
                id={`reps-${index}`}
                type="number"
                value={set.reps}
                onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value) || 0)}
                className="w-16 h-8 text-center"
                min="1"
              />
            </div>
            
            <div className="flex items-center gap-2 flex-1">
              <Weight className="w-4 h-4 text-fitness-secondary" />
              <Label htmlFor={`weight-${index}`} className="text-sm">kg</Label>
              <Input
                id={`weight-${index}`}
                type="number"
                value={set.weight}
                onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || 0)}
                className="w-16 h-8 text-center"
                step="0.5"
                min="0"
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeSet(index)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        ))}
        
        <Button 
          onClick={addSet} 
          variant="outline"
          className="w-full border-dashed border-fitness-primary/30 hover:border-fitness-primary/50 text-fitness-primary hover:bg-fitness-primary/5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une série
        </Button>
      </div>
    </Card>
  );
};