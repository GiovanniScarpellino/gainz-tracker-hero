import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkoutCard } from "@/components/WorkoutCard";
import { StatsCard } from "@/components/StatsCard";
import { Plus, Flame, Dumbbell, Target, Trophy, Calendar } from "lucide-react";

const Dashboard = () => {
  const [currentStreak, setCurrentStreak] = useState(7);

  // Mock data pour la démo
  const recentWorkouts = [
    {
      title: "Push Day - Pectoraux & Triceps",
      date: "Aujourd'hui",
      duration: "45 min",
      exercises: 6,
      calories: 320
    },
    {
      title: "Pull Day - Dos & Biceps", 
      date: "Hier",
      duration: "52 min",
      exercises: 5,
      calories: 298
    },
    {
      title: "Legs Day - Jambes & Fessiers",
      date: "Il y a 2 jours", 
      duration: "38 min",
      exercises: 4,
      calories: 285
    }
  ];

  const stats = [
    { title: "Séances cette semaine", value: 4, unit: "/6", icon: <Calendar className="w-5 h-5" />, trend: 12 },
    { title: "Calories brûlées", value: "1,203", unit: "kcal", icon: <Flame className="w-5 h-5" />, trend: 8 },
    { title: "Records battus", value: 3, unit: "PRs", icon: <Trophy className="w-5 h-5" />, trend: 25 },
    { title: "Volume total", value: "2.8", unit: "tonnes", icon: <Dumbbell className="w-5 h-5" />, trend: 15 }
  ];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Salut, Champion! 💪
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

      {/* Objectif du jour */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-fitness-accent" />
          <h2 className="text-lg font-semibold text-foreground">Objectif du jour</h2>
        </div>
        <div className="bg-gradient-accent p-4 rounded-xl">
          <div className="flex items-center justify-between text-primary-foreground">
            <div>
              <p className="font-medium">Push Day - Pectoraux</p>
              <p className="text-sm opacity-80">6 exercices • ~45 min</p>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
            >
              Commencer
            </Button>
          </div>
        </div>
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
          {recentWorkouts.map((workout, index) => (
            <WorkoutCard
              key={index}
              title={workout.title}
              date={workout.date}
              duration={workout.duration}
              exercises={workout.exercises}
              calories={workout.calories}
              onResume={index === 0 ? () => console.log("Resume workout") : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;