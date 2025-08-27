import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExercises: (exerciseIds: number[]) => void;
}

export const AddExerciseDialog = ({ open, onOpenChange, onAddExercises }: AddExerciseDialogProps) => {
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const predefinedExercises = useLiveQuery(() => db.predefinedExercises.toArray());

  const handleSelectExercise = (exerciseId: number) => {
    setSelectedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleAddExercises = () => {
    onAddExercises(selectedExercises);
    onOpenChange(false);
    setSelectedExercises([]);
  };

  const exercisesByGroup = predefinedExercises?.reduce((acc, ex) => {
    if (!acc[ex.muscleGroup]) {
      acc[ex.muscleGroup] = [];
    }
    acc[ex.muscleGroup].push(ex);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter des exercices</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] rounded-md border p-4">
          <div className="grid gap-4">
            {exercisesByGroup && Object.entries(exercisesByGroup).map(([group, exercises]) => (
              <div key={group}>
                <h3 className="font-semibold mb-2">{group}</h3>
                <div className="grid gap-2">
                  {exercises.map(ex => (
                    <div key={ex.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`add-ex-${ex.id}`}
                        checked={selectedExercises.includes(ex.id!)}
                        onCheckedChange={() => handleSelectExercise(ex.id!)}
                      />
                      <label htmlFor={`add-ex-${ex.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {ex.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleAddExercises}>Ajouter les exercices</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
