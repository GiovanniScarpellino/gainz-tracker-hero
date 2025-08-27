import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useLiveQuery } from 'dexie-react-hooks';
import { db, PredefinedWorkout } from '@/lib/db';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NewWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewWorkoutDialog = ({ open, onOpenChange }: NewWorkoutDialogProps) => {
  const navigate = useNavigate();
  const predefinedWorkouts = useLiveQuery(() => db.predefinedWorkouts.toArray());

  const handleSelectWorkout = async (workout: PredefinedWorkout) => {
    const predefinedExercises = await db.predefinedExercises.where('name').anyOf(workout.exercises).toArray();

    const newWorkoutId = await db.workouts.add({
      name: workout.name,
      date: new Date(),
    });

    await db.exercises.bulkAdd(
      predefinedExercises.map(ex => ({
        workoutId: newWorkoutId,
        name: ex.name,
        sets: ex.defaultSets,
        reps: ex.defaultReps,
      }))
    );

    onOpenChange(false);
    navigate(`/workout/${newWorkoutId}`);
  };

  const handleBlankWorkout = async () => {
    const newWorkoutId = await db.workouts.add({
      name: "Séance personnalisée",
      date: new Date(),
    });
    onOpenChange(false);
    navigate(`/workout/${newWorkoutId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Démarrer une nouvelle séance</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] rounded-md border p-4">
          <div className="grid gap-4">
            {predefinedWorkouts && predefinedWorkouts.length > 0 ? (
              predefinedWorkouts.map(workout => (
                <Card key={workout.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleSelectWorkout(workout)}>
                  <CardHeader>
                    <CardTitle>{workout.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                Aucun programme prédéfini. Vous pouvez commencer une séance vide et y ajouter des exercices.
              </p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={handleBlankWorkout}>Commencer une séance vide</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};