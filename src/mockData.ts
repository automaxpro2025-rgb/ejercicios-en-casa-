import { Routine, Category, UserProfile, AppSettings } from './types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'fuerza',
    name: 'Fuerza de Élite',
    description: 'Incrementa tu masa muscular, mejora tu postura y gana poder real con rutinas de resistencia.',
    icon: 'Dumbbell',
    count: 3,
    color: 'from-amber-500/20 to-orange-600/20 text-orange-400 border-orange-500/30'
  },
  {
    id: 'hiit',
    name: 'Cardio HIIT',
    description: 'Rutinas explosivas de alta intensidad diseñadas para derretir grasa y maximizar tu capacidad aeróbica.',
    icon: 'Flame',
    count: 2,
    color: 'from-rose-500/20 to-red-600/20 text-rose-400 border-rose-500/30'
  },
  {
    id: 'core',
    name: 'Abs & Core',
    description: 'Fortalece tu centro, estabiliza tu columna y esculpe abdominales de acero con rutinas específicas.',
    icon: 'Shield',
    count: 2,
    color: 'from-violet-500/20 to-purple-600/20 text-purple-400 border-purple-500/30'
  },
  {
    id: 'movilidad',
    name: 'Movilidad & Flex',
    description: 'Estiramientos profundos, yoga activo y liberación articular para acelerar la recuperación física.',
    icon: 'Activity',
    count: 2,
    color: 'from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/30'
  }
];

export const MOCK_COURSES: Routine[] = [
  {
    id: 'fuerza-total-bento',
    title: 'Fuerza Funcional de Cuerpo Completo',
    description: 'Gana poder explosivo y resistencia muscular usando tu propio peso y pesas ligeras en casa.',
    longDescription: 'Diseñado por Coach Carlos Méndez, este programa une principios de calistenia avanzada y entrenamiento con pesas para crear un cuerpo armónico, ágil y libre de lesiones. Enfoque total en el estímulo de piernas, pectoral, espalda y estabilizadores.',
    coach: {
      name: 'Carlos Méndez',
      role: 'Especialista en Biomecánica y Fuerza',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=300&q=80',
      bio: 'Ex-atleta olímpico y preparador físico certificado con más de 12 años esculpiendo físicos de alto rendimiento.'
    },
    durationMinutes: 25,
    level: 'Intermedio',
    category: 'fuerza',
    caloriesEstimate: 320,
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    equipmentNeeded: ['Mancuernas', 'Esterilla', 'Silla/Banco'],
    exercises: [
      {
        id: 'fz-pushup',
        name: 'Flexiones de Pecho Guiadas (Push-ups)',
        instructions: 'Mantén los codos a 45 grados de tu torso. Aprieta el abdomen y los glúteos para mantener una línea recta desde la cabeza hasta los talones. Baja de forma controlada hasta que el pecho roce el suelo y empuja explosivamente.',
        duration: 40, // 40 seconds
        reps: null,
        sets: 3,
        restAfter: 20,
        muscleGroup: 'Pecho, Tríceps, Deltoides Anterior',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-push-ups-in-the-gym-41793-large.mp4',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
        equipment: ['Peso Corporal']
      },
      {
        id: 'fz-squat',
        name: 'Sentadillas de Poder (Goblet Squat)',
        instructions: 'Sujeta una mancuerna verticalmente frente a tu pecho. Abre los pies al ancho de tus hombros. Desciende empujando la cadera hacia atrás y las rodillas hacia afuera. Mantén la espalda recta y sube con fuerza desde los talones.',
        duration: 45,
        reps: null,
        sets: 3,
        restAfter: 15,
        muscleGroup: 'Cuádriceps, Glúteos, Femorales',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-squats-with-dumbbells-41804-large.mp4',
        imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
        equipment: ['Mancuerna']
      },
      {
        id: 'fz-row',
        name: 'Remo Alterno con Mancuernas',
        instructions: 'Flexiona las caderas manteniendo la columna neutra y el pecho erguido. Sujeta ambas mancuernas con las palmas mirándose entre sí. Tira del peso llevando los codos hacia tus bolsillos traseros, contrayendo las escápulas.',
        duration: 45,
        reps: null,
        sets: 3,
        restAfter: 20,
        muscleGroup: 'Espalda Alta, Dorsal Ancho, Bíceps',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athletic-man-lifting-dumbbells-41813-large.mp4',
        imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&w=600&q=80',
        equipment: ['Mancuernas']
      }
    ]
  },
  {
    id: 'hiit-explosivo-metabolico',
    title: 'Quema de Grasa HIIT Extremo',
    description: 'Maximiza el gasto calórico diario en tiempo récord con intervalos atléticos sin equipo.',
    longDescription: 'La entrenadora Sofía Valenzuela te guiará en un circuito metabólico intenso de 15 minutos que elevará tu ritmo cardíaco, desencadenando el efecto EPOC para que sigas quemando calorías incluso horas después de entrenar.',
    coach: {
      name: 'Sofía Valenzuela',
      role: 'Coach de HIIT y Atletismo de Alta Intensidad',
      avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=300&q=80',
      bio: 'Especialista en acondicionamiento metabólico con pasión por empujar los límites mentales y físicos de forma divertida.'
    },
    durationMinutes: 15,
    level: 'Avanzado',
    category: 'hiit',
    caloriesEstimate: 410,
    coverImage: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80',
    equipmentNeeded: ['Esterilla', 'Ninguno'],
    exercises: [
      {
        id: 'ht-ropes',
        name: 'Cuerdas de Batalla / Battle Ropes',
        instructions: 'Establece una base sólida con piernas semi-flexionadas. Agarra las cuerdas firmemente y comienza a agitar los brazos alternando para crear ondas fluidas. Mantén el core apretado al 100%.',
        duration: 30,
        reps: null,
        sets: 4,
        restAfter: 15,
        muscleGroup: 'Hombros, Core, Cardiovascular',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-out-with-battle-ropes-in-the-gym-41799-large.mp4',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        equipment: ['Cuerdas de batalla']
      },
      {
        id: 'ht-burpees',
        name: 'Burpees Atléticos de Cuerpo Completo',
        instructions: 'Desde una posición de pie, agáchate y apoya las manos. Salta con los pies hacia atrás en una tabla, haz una flexión, regresa los pies al pecho de un salto y salta en el aire estirando las manos hacia arriba.',
        duration: 40,
        reps: null,
        sets: 4,
        restAfter: 20,
        muscleGroup: 'Sistema Cardiovascular, Piernas, Pecho',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-man-running-on-treadmill-41802-large.mp4', // Cardio representativo
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
        equipment: ['Peso Corporal']
      }
    ]
  },
  {
    id: 'core-abdominal-acero',
    title: 'Pilares de Acero: Definición y Core',
    description: 'Estabiliza tus caderas, define tus abdominales y fortalece tu espalda baja de forma segura.',
    longDescription: 'El entrenador Marcus Thorne ha diseñado un programa basado en la biomecánica de la columna de McGill para desafiar tu core sin forzar las lumbares. Ideal para aliviar el dolor de espalda baja y pulir los oblicuos.',
    coach: {
      name: 'Marcus Thorne',
      role: 'Fisioterapeuta y Entrenador de Core',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Especializado en rehabilitación de columna y biomecánica deportiva, Marcus ayuda a desarrollar cores estables y sin dolor.'
    },
    durationMinutes: 12,
    level: 'Principiante',
    category: 'core',
    caloriesEstimate: 160,
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    equipmentNeeded: ['Esterilla'],
    exercises: [
      {
        id: 'cr-plank',
        name: 'Plancha Estática Activa (Dead Bug / Plank)',
        instructions: 'Apoya los antebrazos en el suelo alineados con los hombros. Empuja los talones hacia atrás y aprieta el abdomen como si fueras a recibir un golpe. No permitas que la cadera caiga ni se eleve.',
        duration: 45,
        reps: null,
        sets: 3,
        restAfter: 15,
        muscleGroup: 'Recto Abdominal, Transverso, Core',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-push-ups-in-the-gym-41793-large.mp4',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
        equipment: ['Esterilla']
      }
    ]
  },
  {
    id: 'movilidad-yoga-fluidez',
    title: 'Restauración Articular y Movilidad Activa',
    description: 'Elimina la rigidez muscular acumulada por el trabajo sentado o entrenamientos intensos.',
    longDescription: 'La maestra yogui Elena Rostova te acompaña en una secuencia de posturas dinámicas enfocadas en abrir caderas, estirar hombros y liberar la tensión del cuello. Tu sesión perfecta para descansar activamente el domingo.',
    coach: {
      name: 'Elena Rostova',
      role: 'Instructora de Yoga y Movilidad Funcional',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Elena fusiona el yoga Ashtanga con estiramientos de fisioterapia para recuperar rangos de movimiento naturales y fluidos.'
    },
    durationMinutes: 18,
    level: 'Principiante',
    category: 'movilidad',
    caloriesEstimate: 110,
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    equipmentNeeded: ['Esterilla'],
    exercises: [
      {
        id: 'mv-yoga',
        name: 'Flow de Cobra y Perro Boca Abajo',
        instructions: 'Fluye de forma pausada entre la postura de la cobra para abrir el pecho y el abdomen, hacia la posición de perro boca abajo empujando los talones al suelo e introduciendo la cabeza entre los hombros.',
        duration: 50,
        reps: null,
        sets: 3,
        restAfter: 10,
        muscleGroup: 'Columna, Femorales, Espalda, Hombros',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-on-mats-in-a-gym-41797-large.mp4',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
        equipment: ['Esterilla']
      }
    ]
  }
];

export const MOCK_USER: UserProfile = {
  name: 'Adrián Mendoza',
  email: 'automax.pro2025@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  weightKg: 78,
  heightCm: 176,
  goal: 'Ganar Masa Muscular y Perder Grasa',
  fitnessLevel: 'Intermedio'
};

export const DEFAULT_SETTINGS: AppSettings = {
  darkMode: true,
  soundEnabled: true,
  voiceGuide: true,
  countdownTimer: 8, // 8 seconds of preparation before starting the exercise
  notifications: true,
  language: 'es'
};
