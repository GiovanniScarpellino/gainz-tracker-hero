import Dexie, { Table } from 'dexie';

export interface Workout {
  id?: number;
  name: string;
  date: Date;
}

export interface Exercise {
  id?: number;
  workoutId: number;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number; // in minutes
  isPr?: boolean;
}

export interface PredefinedExercise {
  id?: number;
  name: string;
  muscleGroup: string;
  defaultSets?: number;
  defaultReps?: number;
}

export interface PredefinedWorkout {
  id?: number;
  name: string;
  exercises: string[]; // Array of exercise names
}

export interface AppState {
  key: string;
  value: any;
}

export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: Date;
}

export class SportTrackerDB extends Dexie {
  workouts!: Table<Workout>;
  exercises!: Table<Exercise>;
  predefinedExercises!: Table<PredefinedExercise>;
  predefinedWorkouts!: Table<PredefinedWorkout>;
  appState!: Table<AppState>;
  personalRecords!: Table<PersonalRecord>;

  constructor() {
    super('sportTrackerDB');
    this.version(6).stores({
      workouts: '++id, name, date',
      exercises: '++id, workoutId, name',
      predefinedExercises: '++id, name, muscleGroup',
      predefinedWorkouts: '++id, name',
      appState: '&key',
      personalRecords: '&exerciseName',
    });
  }
}

export const db = new SportTrackerDB();
