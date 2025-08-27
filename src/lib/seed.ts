import { db } from './db';

const LATEST_SEED_VERSION = 4;

const exercises = {
  jourA: [
    { name: 'Développé couché barre', muscleGroup: 'Pectoraux', defaultSets: 4, defaultReps: 7 },
    { name: 'Développé incliné haltères ou barre', muscleGroup: 'Pectoraux', defaultSets: 3, defaultReps: 9 },
    { name: 'Dips (barres parallèles ou entre 2 bancs)', muscleGroup: 'Triceps', defaultSets: 3, defaultReps: 10 },
    { name: 'Élévations latérales haltères', muscleGroup: 'Épaules', defaultSets: 3, defaultReps: 14 },
    { name: 'Extension triceps à la poulie', muscleGroup: 'Triceps', defaultSets: 3, defaultReps: 14 },
  ],
  jourB: [
    { name: 'Tractions pronation', muscleGroup: 'Dos', defaultSets: 4, defaultReps: 8 },
    { name: 'Rowing barre ou haltères', muscleGroup: 'Dos', defaultSets: 3, defaultReps: 10 },
    { name: 'Soulevé de terre jambes tendues (SDT JT)', muscleGroup: 'Ischios', defaultSets: 3, defaultReps: 9 },
    { name: 'Curl biceps barre ou haltères', muscleGroup: 'Biceps', defaultSets: 3, defaultReps: 11 },
    { name: 'Facepull (poulie ou élastique)', muscleGroup: 'Épaules', defaultSets: 3, defaultReps: 14 },
  ],
  jourC: [
    { name: 'Squat barre', muscleGroup: 'Jambes', defaultSets: 4, defaultReps: 7 },
    { name: 'Fentes avant', muscleGroup: 'Jambes', defaultSets: 3, defaultReps: 11 },
    { name: 'Leg curl machine', muscleGroup: 'Ischios', defaultSets: 3, defaultReps: 9 },
    { name: 'Mollets debout', muscleGroup: 'Jambes', defaultSets: 3, defaultReps: 18 },
    { name: 'Planche / gainage', muscleGroup: 'Gainage', defaultSets: 3, defaultReps: 45 },
    { name: 'Abdos type relevé de jambes suspendu ou crunch lesté', muscleGroup: 'Gainage', defaultSets: 3, defaultReps: 15 },
  ]
};

const seedV3 = async () => {
  // This seed will restore the workouts with the correct names
  await db.predefinedExercises.clear();
  await db.predefinedWorkouts.clear();

  await db.predefinedExercises.bulkAdd(Object.values(exercises).flat());

  await db.predefinedWorkouts.bulkAdd([
    {
      name: 'Pecs / Triceps / Épaules',
      exercises: exercises.jourA.map(e => e.name),
    },
    {
      name: 'Dos / Biceps',
      exercises: exercises.jourB.map(e => e.name),
    },
    {
      name: 'Jambes / Gainage',
      exercises: exercises.jourC.map(e => e.name),
    },
  ]);
};

const seedV4 = async () => {
  // This seed will update the reps to be a single number
  const exercisesToUpdate = Object.values(exercises).flat();
  for (const exercise of exercisesToUpdate) {
    await db.predefinedExercises.where('name').equals(exercise.name).modify({ defaultReps: exercise.defaultReps });
  }
};

export const seedDatabase = async () => {
  const currentVersion = await db.appState.get('seedVersion');
  const currentSeedVersion = currentVersion ? currentVersion.value : 0;

  if (currentSeedVersion >= LATEST_SEED_VERSION) {
    return;
  }

  if (currentSeedVersion < 3) {
    await seedV3();
  }
  if (currentSeedVersion < 4) {
    await seedV4();
  }

  await db.appState.put({ key: 'seedVersion', value: LATEST_SEED_VERSION });
};