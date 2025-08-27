import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { AddExerciseDialog } from '@/components/AddExerciseDialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, X, Trophy } from 'lucide-react';
import { DatePicker } from '@/components/ui/datepicker';
import { Badge } from '@/components/ui/badge';

const WorkoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const workoutId = parseInt(id || '0');

  const workout = useLiveQuery(() => db.workouts.get(workoutId), [workoutId]);
  const exercises = useLiveQuery(() => db.exercises.where('workoutId').equals(workoutId).toArray(), [workoutId]);

  const [exerciseData, setExerciseData] = useState<Record<number, any>>({});
  const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
  const [workoutDate, setWorkoutDate] = useState<Date | undefined>();

  useEffect(() => {
    if (workout) {
      setWorkoutDate(workout.date);
    }
  }, [workout]);

  useEffect(() => {
    if (exercises) {
      const data = exercises.reduce((acc, ex) => {
        acc[ex.id!] = { ...ex };
        return acc;
      }, {} as Record<number, any>);
      setExerciseData(data);
    }
  }, [exercises]);

  const handleInputChange = (exerciseId: number, field: string, value: string) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value ? parseInt(value) : undefined,
      }
    }));
  };

  const handleSaveExercise = async (exerciseId: number) => {
    const dataToSave = exerciseData[exerciseId];
    await db.exercises.update(exerciseId, dataToSave);

    const { name, weight, reps } = dataToSave;
    if (!name || !weight || !reps) return;

    const currentPr = await db.personalRecords.get(name);

    if (!currentPr || weight > currentPr.weight || (weight === currentPr.weight && reps > currentPr.reps)) {
      await db.personalRecords.put({ exerciseName: name, weight, reps, date: new Date() });
      setExerciseData(prev => ({
        ...prev,
        [exerciseId]: {
          ...prev[exerciseId],
          isPr: true,
        }
      }));
    }
  };

  const handleDeleteExercise = async (exerciseId: number) => {
    await db.exercises.delete(exerciseId);
  };

  const handleDateChange = async (date: Date | undefined) => {
    setWorkoutDate(date);
    if (date) {
      await db.workouts.update(workoutId, { date });
    }
  };

  const handleFinishWorkout = () => {
    navigate('/');
  };

  const handleAddExercises = async (exerciseIds: number[]) => {
    const predefinedExercises = await db.predefinedExercises.where('id').anyOf(exerciseIds).toArray();
    await db.exercises.bulkAdd(
      predefinedExercises.map(ex => ({
        workoutId: workoutId,
        name: ex.name,
        sets: ex.defaultSets,
        reps: ex.defaultReps,
      }))
    );
  };

  if (!workout) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <AddExerciseDialog 
        open={isAddExerciseDialogOpen} 
        onOpenChange={setIsAddExerciseDialogOpen} 
        onAddExercises={handleAddExercises} 
      />
      <div className="p-4 flex flex-col h-screen">
        <div className="flex-grow overflow-y-auto pr-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{workout.name}</CardTitle>
              <DatePicker date={workoutDate} setDate={handleDateChange} />
            </CardHeader>
            <CardContent className="space-y-4">
              {exercises?.map(exercise => (
                <Collapsible key={exercise.id} className="border-t py-4">
                  <div className="flex justify-between items-center w-full">
                    <CollapsibleTrigger className="flex items-center flex-grow">
                      <span className="font-semibold">{exercise.name}</span>
                      {exerciseData[exercise.id!]?.isPr && (
                        <Badge className="ml-2 bg-yellow-400 text-yellow-900">
                          <Trophy className="w-3 h-3 mr-1" />
                          PR
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </CollapsibleTrigger>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteExercise(exercise.id!)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CollapsibleContent className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Séries"
                        type="number"
                        value={exerciseData[exercise.id!]?.sets || ''}
                        onChange={(e) => handleInputChange(exercise.id!, 'sets', e.target.value)}
                        onBlur={() => handleSaveExercise(exercise.id!)}
                      />
                      <Input
                        placeholder="Répétitions"
                        type="number"
                        value={exerciseData[exercise.id!]?.reps || ''}
                        onChange={(e) => handleInputChange(exercise.id!, 'reps', e.target.value)}
                        onBlur={() => handleSaveExercise(exercise.id!)}
                      />
                      <Input
                        placeholder="Poids (kg)"
                        type="number"
                        value={exerciseData[exercise.id!]?.weight || ''}
                        onChange={(e) => handleInputChange(exercise.id!, 'weight', e.target.value)}
                        onBlur={() => handleSaveExercise(exercise.id!)}
                      />
                      <Input
                        placeholder="Durée (min)"
                        type="number"
                        value={exerciseData[exercise.id!]?.duration || ''}
                        onChange={(e) => handleInputChange(exercise.id!, 'duration', e.target.value)}
                        onBlur={() => handleSaveExercise(exercise.id!)}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="flex-shrink-0 pt-4">
          <Button onClick={() => setIsAddExerciseDialogOpen(true)} className="w-full" variant="outline">
            Ajouter un exercice
          </Button>
          <Button onClick={handleFinishWorkout} className="mt-4 w-full">
            Terminer la séance
          </Button>
        </div>
      </div>
    </>
  );
};

export default WorkoutPage;