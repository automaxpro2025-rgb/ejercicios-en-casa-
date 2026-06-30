export interface Exercise {
  id: string;
  name: string;
  instructions: string;
  duration: number; // in seconds, 0 means rep-based
  reps: number | null; // e.g., 12 reps, or null if timed
  sets: number;
  restAfter: number; // rest time in seconds after each set
  muscleGroup: string;
  videoUrl: string; // fallback preview or animated vector / high-res placeholder loop
  imageUrl: string;
  equipment: string[];
}

export interface Coach {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  coach: Coach;
  durationMinutes: number;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: string; // e.g., 'fuerza', 'hiit', 'movilidad', 'core'
  caloriesEstimate: number;
  coverImage: string;
  exercises: Exercise[];
  equipmentNeeded: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon identifier
  count: number;
  color: string;
}

export interface WorkoutHistory {
  id: string;
  routineId: string;
  routineTitle: string;
  completedAt: string; // ISO String
  durationMinutes: number;
  caloriesBurned: number;
}

export interface UserProgress {
  completedRoutines: string[]; // routineIds
  routineSessions: { [routineId: string]: number }; // routineId -> completion count
  savedRoutines: string[]; // routineIds
  totalWorkoutMinutes: number;
  totalCaloriesBurned: number;
  streakDays: number;
  lastWorkoutDate: string | null; // ISO Date string for streak calculation
  history: WorkoutHistory[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  weightKg: number;
  heightCm: number;
  goal: string;
  fitnessLevel: 'Principiante' | 'Intermedio' | 'Avanzado';
}

export interface AppSettings {
  darkMode: boolean;
  soundEnabled: boolean; // beep sounds on countdown
  voiceGuide: boolean; // speech synthesis to say exercise names
  countdownTimer: number; // pre-start preparation in seconds (e.g. 5, 10, 15)
  notifications: boolean; // push notifications reminder toggle
  language: 'es' | 'en';
}

export type ScreenType =
  | 'welcome'
  | 'home'
  | 'categories'
  | 'courses'
  | 'course-detail'
  | 'player'
  | 'profile'
  | 'settings'
  | 'admin'
  | 'routines'
  | 'routine-detail'
  | 'workout-active';
