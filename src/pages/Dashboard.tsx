import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkoutCard } from "@/components/WorkoutCard";
import { StatsCard } from "@/components/StatsCard";
import { Plus, Flame, Dumbbell, Trophy, Calendar } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewWorkoutDialog } from "@/components/NewWorkoutDialog";
import { DeleteWorkoutDialog } from "@/components/DeleteWorkoutDialog";

const Dashboard = () => {
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isNewWorkoutDialogOpen, setIsNewWorkoutDialogOpen] = useState(false);
  const [isDeleteWorkoutDialogOpen, setIsDeleteWorkoutDialogOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  const allWorkouts = useLiveQuery(() => db.workouts.orderBy('date').reverse().toArray());
  const allExercises = useLiveQuery(() => db.exercises.toArray());

  const allPersonalRecords = useLiveQuery(() => db.personalRecords.toArray());

  useEffect(() => {
    const calculateStreak = (workouts: any[]): number => {
      if (!workouts || workouts.length === 0) {
        return 0;
      }

      const sortedDates = workouts.map(w => new Date(w.date))
                                  .sort((a, b) => b.getTime() - a.getTime())
                                  .map(d => d.setHours(0,0,0,0));

      const uniqueDates = [...new Set(sortedDates)];

      const today = new Date();
      today.setHours(0,0,0,0);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0,0,0,0);

      if (uniqueDates[0] < yesterday.getTime()) {
          return 0;
      }

      let streak = 1;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
          const current = new Date(uniqueDates[i]);
          const next = new Date(uniqueDates[i+1]);

          const diff = (current.getTime() - next.getTime()) / (1000 * 3600 * 24);
          if (diff === 1) {
              streak++;
          } else {
              break;
          }
      }

      return streak;
    };

    if (allWorkouts) {
      setCurrentStreak(calculateStreak(allWorkouts));
    }
  }, [allWorkouts]);

  useEffect(() => {
    const getWorkoutsDetails = async () => {
      if (allWorkouts) {
        const detailedWorkouts = await Promise.all(
          allWorkouts.map(async (workout) => {
            const exercises = await db.exercises
              .where("workoutId")
              .equals(workout.id!)
              .toArray();
            const duration = exercises.reduce(
              (sum, ex) => sum + (ex.duration || 0),
              0
            );

            return {
              ...workout,
              exercises: exercises.length,
              duration: `${duration} min`,
            };
          })
        );
        setRecentWorkouts(detailedWorkouts);
      }
    };
    getWorkoutsDetails();
  }, [allWorkouts]);

  useEffect(() => {
    if (allWorkouts && allExercises && allPersonalRecords) {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const workoutsThisWeek = allWorkouts.filter(w => new Date(w.date) >= startOfWeek);

      const prsThisWeek = allPersonalRecords.filter(pr => new Date(pr.date) >= startOfWeek);

      const totalVolume = allExercises.reduce((sum, ex) => sum + (ex.weight || 0) * (ex.reps || 0) * (ex.sets || 0), 0) / 1000; // in tonnes

      setStats([
        { title: "Séances cette semaine", value: workoutsThisWeek.length, unit: "/3", icon: <Calendar className="w-5 h-5" /> },
        { title: "Records battus", value: prsThisWeek.length, unit: "PRs", icon: <Trophy className="w-5 h-5" /> },
        { title: "Volume total", value: totalVolume.toFixed(1), unit: "tonnes", icon: <Dumbbell className="w-5 h-5" /> }
      ]);
    }
  }, [allWorkouts, allExercises, allPersonalRecords, recentWorkouts]);

  const handleDeleteWorkout = async () => {
    if (workoutToDelete) {
      await db.workouts.delete(workoutToDelete);
      await db.exercises.where("workoutId").equals(workoutToDelete).delete();
      setWorkoutToDelete(null);
    }
    setIsDeleteWorkoutDialogOpen(false);
  };

  const openDeleteDialog = (workoutId: number) => {
    setWorkoutToDelete(workoutId);
    setIsDeleteWorkoutDialogOpen(true);
  };

  return (
    <>
      <NewWorkoutDialog open={isNewWorkoutDialogOpen} onOpenChange={setIsNewWorkoutDialogOpen} />
      <DeleteWorkoutDialog 
        open={isDeleteWorkoutDialogOpen} 
        onOpenChange={setIsDeleteWorkoutDialogOpen} 
        onConfirm={handleDeleteWorkout} 
      />
      <div className="min-h-screen bg-background p-4 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Salut 💪
            </h1>
            <div className="flex items-center gap-2">
              <Badge className="bg-fitness-primary/10 text-fitness-primary border-fitness-primary/20">
                <Flame className="w-3 h-3 mr-1" />
                {currentStreak} jours de suite
              </Badge>
            </div>
          </div>
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-fitness"
            onClick={() => setIsNewWorkoutDialogOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle séance
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              unit={stat.unit}
              trend={stat.trend}
              icon={stat.icon}
              gradient={index === 0}
            />
          ))}
        </div>

        {/* Dernières séances */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Dernières séances</h2>
            <Button variant="ghost" size="sm" className="text-fitness-primary">
              Voir tout
            </Button>
          </div>
          <div className="space-y-3">
            {recentWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                title={workout.name}
                date={new Date(workout.date).toLocaleDateString()}
                duration={workout.duration}
                exercises={workout.exercises}
                onResume={() => navigate(`/workout/${workout.id}`)}
                onDelete={() => openDeleteDialog(workout.id!)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
