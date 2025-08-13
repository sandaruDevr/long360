import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Play, 
  Clock, 
  Target, 
  Star,
  Bookmark,
  ChevronDown,
  Zap,
  Heart,
  Dumbbell,
  Plus,
  X
} from 'lucide-react';
import { useWorkout } from '../../hooks/useWorkout';

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string;
  tips: string;
  videoUrl?: string;
  image: string;
  rating: number;
  duration: string;
  calories: number;
}

const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Squats',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes', 'Core'],
    equipment: ['Barbell', 'Squat Rack'],
    difficulty: 'intermediate',
    instructions: 'Stand with feet shoulder-width apart, lower into squat position, drive through heels to return to start.',
    tips: 'Keep chest up and knees tracking over toes. Go as deep as mobility allows.',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.9,
    duration: '3-4 min',
    calories: 45
  },
  {
    id: '2',
    name: 'Push-ups',
    category: 'Bodyweight',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    equipment: ['None'],
    difficulty: 'beginner',
    instructions: 'Start in plank position, lower chest to ground, push back up to start position.',
    tips: 'Keep body in straight line from head to heels. Modify on knees if needed.',
    image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.7,
    duration: '2-3 min',
    calories: 25
  },
  {
    id: '3',
    name: 'Deadlifts',
    category: 'Strength',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
    equipment: ['Barbell'],
    difficulty: 'advanced',
    instructions: 'Stand with feet hip-width apart, hinge at hips to lower bar, drive hips forward to return.',
    tips: 'Keep bar close to body and maintain neutral spine throughout movement.',
    image: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.8,
    duration: '4-5 min',
    calories: 55
  },
  {
    id: '4',
    name: 'Burpees',
    category: 'Cardio',
    muscleGroups: ['Full Body'],
    equipment: ['None'],
    difficulty: 'intermediate',
    instructions: 'Drop to squat, jump back to plank, do push-up, jump feet to squat, jump up with arms overhead.',
    tips: 'Maintain good form even when fatigued. Modify by stepping instead of jumping.',
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.6,
    duration: '1-2 min',
    calories: 35
  },
  {
    id: '5',
    name: 'Plank',
    category: 'Core',
    muscleGroups: ['Core', 'Shoulders'],
    equipment: ['None'],
    difficulty: 'beginner',
    instructions: 'Hold body in straight line from head to heels, supporting weight on forearms and toes.',
    tips: 'Engage core and avoid letting hips sag or pike up.',
    image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.5,
    duration: '1-3 min',
    calories: 15
  },
  {
    id: '6',
    name: 'Dumbbell Rows',
    category: 'Strength',
    muscleGroups: ['Lats', 'Rhomboids', 'Biceps'],
    equipment: ['Dumbbells'],
    difficulty: 'intermediate',
    instructions: 'Hinge at hips, pull dumbbells to ribs, squeeze shoulder blades together.',
    tips: 'Keep core engaged and avoid using momentum to lift the weight.',
    image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.7,
    duration: '3-4 min',
    calories: 40
  },
  {
    id: '7',
    name: 'Lunges',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes'],
    equipment: ['None'],
    difficulty: 'beginner',
    instructions: 'Step forward, lower hips until both knees are at 90 degrees, push back to start.',
    tips: 'Keep upper body straight and core engaged.',
    image: 'https://images.pexels.com/photos/1552243/pexels-photo-1552243.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.6,
    duration: '2-3 min',
    calories: 30
  },
  {
    id: '8',
    name: 'Mountain Climbers',
    category: 'Cardio',
    muscleGroups: ['Core', 'Legs'],
    equipment: ['None'],
    difficulty: 'beginner',
    instructions: 'Start in plank position, drive knees alternately towards chest quickly.',
    tips: 'Keep back flat and maintain pace.',
    image: 'https://images.pexels.com/photos/1552241/pexels-photo-1552241.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.5,
    duration: '1-2 min',
    calories: 35
  },
  {
    id: '9',
    name: 'Pull-ups',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: ['Pull-up Bar'],
    difficulty: 'advanced',
    instructions: 'Hang from bar, pull body up until chin passes bar, lower down.',
    tips: 'Use controlled motion. Engage lats and core.',
    image: 'https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.8,
    duration: '3-4 min',
    calories: 40
  },
  {
    id: '10',
    name: 'Bench Press',
    category: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: ['Barbell', 'Bench'],
    difficulty: 'intermediate',
    instructions: 'Lie on bench, lower bar to chest, push back up.',
    tips: 'Keep feet flat and avoid bouncing bar.',
    image: 'https://images.pexels.com/photos/3838387/pexels-photo-3838387.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.9,
    duration: '4-5 min',
    calories: 50
  },
  {
    id: '11',
    name: 'Jumping Jacks',
    category: 'Cardio',
    muscleGroups: ['Full Body'],
    equipment: ['None'],
    difficulty: 'beginner',
    instructions: 'Jump legs out while raising arms overhead, return to start.',
    tips: 'Land softly and maintain steady rhythm.',
    image: 'https://images.pexels.com/photos/1552255/pexels-photo-1552255.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.4,
    duration: '1-2 min',
    calories: 20
  },
  {
    id: '12',
    name: 'Russian Twists',
    category: 'Core',
    muscleGroups: ['Obliques', 'Abs'],
    equipment: ['None'],
    difficulty: 'intermediate',
    instructions: 'Sit on floor, twist torso side to side with hands or weight.',
    tips: 'Keep spine straight and core tight.',
    image: 'https://images.pexels.com/photos/4325461/pexels-photo-4325461.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.5,
    duration: '2-3 min',
    calories: 25
  },
  {
    id: '13',
    name: 'Shoulder Press',
    category: 'Strength',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: ['Dumbbells'],
    difficulty: 'intermediate',
    instructions: 'Press dumbbells overhead from shoulder level, return slowly.',
    tips: 'Don’t arch back. Engage core for support.',
    image: 'https://images.pexels.com/photos/1552245/pexels-photo-1552245.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.6,
    duration: '3-4 min',
    calories: 35
  },
  {
    id: '14',
    name: 'Bicep Curls',
    category: 'Strength',
    muscleGroups: ['Biceps'],
    equipment: ['Dumbbells'],
    difficulty: 'beginner',
    instructions: 'Curl dumbbells toward shoulders, lower with control.',
    tips: 'Avoid swinging weights. Focus on muscle contraction.',
    image: 'https://images.pexels.com/photos/2261484/pexels-photo-2261484.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.7,
    duration: '2-3 min',
    calories: 20
  },
  {
    id: '15',
    name: 'Leg Press',
    category: 'Strength',
    muscleGroups: ['Quads', 'Hamstrings', 'Glutes'],
    equipment: ['Leg Press Machine'],
    difficulty: 'intermediate',
    instructions: 'Push platform with feet until legs are extended, return slowly.',
    tips: 'Do not lock knees and control movement.',
    image: 'https://images.pexels.com/photos/8411312/pexels-photo-8411312.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.8,
    duration: '4-5 min',
    calories: 45
  },
  {
    id: '16',
    name: 'High Knees',
    category: 'Cardio',
    muscleGroups: ['Legs', 'Core'],
    equipment: ['None'],
    difficulty: 'beginner',
    instructions: 'Run in place while bringing knees up to waist level.',
    tips: 'Keep core tight and pump arms for momentum.',
    image: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.5,
    duration: '1-2 min',
    calories: 30
  },
  {
    id: '17',
    name: 'Cable Chest Fly',
    category: 'Strength',
    muscleGroups: ['Chest'],
    equipment: ['Cable Machine'],
    difficulty: 'intermediate',
    instructions: 'Pull cable handles together in front of chest, return slowly.',
    tips: 'Keep elbows slightly bent and chest lifted.',
    image: 'https://images.pexels.com/photos/6456218/pexels-photo-6456218.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.6,
    duration: '3-4 min',
    calories: 35
  },
  {
    id: '18',
    name: 'Triceps Dips',
    category: 'Strength',
    muscleGroups: ['Triceps', 'Chest'],
    equipment: ['Dip Bar'],
    difficulty: 'intermediate',
    instructions: 'Lower body between bars, push back up to start.',
    tips: 'Keep body upright and elbows close.',
    image: 'https://images.pexels.com/photos/2261483/pexels-photo-2261483.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.7,
    duration: '3-4 min',
    calories: 30
  },
  {
    id: '19',
    name: 'Jump Rope',
    category: 'Cardio',
    muscleGroups: ['Full Body'],
    equipment: ['Jump Rope'],
    difficulty: 'beginner',
    instructions: 'Swing rope overhead and jump as it passes under feet.',
    tips: 'Jump low and land softly on balls of feet.',
    image: 'https://images.pexels.com/photos/39671/rope-skipping-fitness-sport-rope-39671.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.4,
    duration: '2-3 min',
    calories: 40
  },
  {
    id: '20',
    name: 'Hip Thrusts',
    category: 'Strength',
    muscleGroups: ['Glutes', 'Hamstrings'],
    equipment: ['Barbell', 'Bench'],
    difficulty: 'intermediate',
    instructions: 'Rest shoulders on bench, thrust hips upward with barbell.',
    tips: 'Drive through heels and squeeze glutes at top.',
    image: 'https://images.pexels.com/photos/3822286/pexels-photo-3822286.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.8,
    duration: '3-4 min',
    calories: 45
  },
  {
    id: '21',
    name: 'Toe Touches',
    category: 'Core',
    muscleGroups: ['Abs'],
    equipment: ['None'],
    difficulty: 'beginner',
    instructions: 'Lie on back, reach hands toward toes while lifting shoulders.',
    tips: 'Exhale as you lift and engage abs fully.',
    image: 'https://images.pexels.com/photos/3822290/pexels-photo-3822290.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.4,
    duration: '1-2 min',
    calories: 20
  },
  {
    id: '22',
    name: 'Arnold Press',
    category: 'Strength',
    muscleGroups: ['Shoulders'],
    equipment: ['Dumbbells'],
    difficulty: 'advanced',
    instructions: 'Rotate palms while pressing dumbbells overhead from front.',
    tips: 'Keep core tight and move with control.',
    image: 'https://images.pexels.com/photos/3838383/pexels-photo-3838383.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.9,
    duration: '3-4 min',
    calories: 35
  },
  {
    id: '23',
    name: 'Box Jumps',
    category: 'Plyometrics',
    muscleGroups: ['Legs', 'Core'],
    equipment: ['Box'],
    difficulty: 'intermediate',
    instructions: 'Jump onto box, land softly, step back down.',
    tips: 'Use arms to drive upward and focus on landing.',
    image: 'https://images.pexels.com/photos/1552256/pexels-photo-1552256.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.6,
    duration: '2-3 min',
    calories: 40
  },
  {
    id: '24',
    name: 'Lat Pulldown',
    category: 'Strength',
    muscleGroups: ['Lats', 'Biceps'],
    equipment: ['Pulldown Machine'],
    difficulty: 'beginner',
    instructions: 'Pull bar down to chest, release slowly.',
    tips: 'Avoid leaning back. Focus on pulling with back.',
    image: 'https://images.pexels.com/photos/6456292/pexels-photo-6456292.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.7,
    duration: '3-4 min',
    calories: 35
  },
  {
    id: '25',
    name: 'Side Plank',
    category: 'Core',
    muscleGroups: ['Obliques', 'Shoulders'],
    equipment: ['None'],
    difficulty: 'intermediate',
    instructions: 'Support body on one forearm and side of foot, hold position.',
    tips: 'Stack shoulders and keep body in line.',
    image: 'https://images.pexels.com/photos/4325464/pexels-photo-4325464.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.6,
    duration: '1-2 min',
    calories: 15
  },
  {
    id: '26',
    name: 'Wall Sit',
    category: 'Bodyweight',
    muscleGroups: ['Quads', 'Glutes'],
    equipment: ['Wall'],
    difficulty: 'beginner',
    instructions: 'Slide down wall until knees are at 90 degrees, hold.',
    tips: 'Keep back flat and thighs parallel to ground.',
    image: 'https://images.pexels.com/photos/4325467/pexels-photo-4325467.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.5,
    duration: '2-3 min',
    calories: 25
  },
  // New exercises start here
  {
    id: '27',
    name: 'Dumbbell Lunges',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes'],
    equipment: ['Dumbbells'],
    difficulty: 'intermediate',
    instructions: 'Hold dumbbells at sides, step forward into lunge position, alternate legs.',
    tips: 'Maintain upright posture and control descent.',
    image: 'https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.7,
    duration: '3-4 min',
    calories: 40
  },
  {
    id: '28',
    name: 'Bicycle Crunches',
    category: 'Core',
    muscleGroups: ['Obliques', 'Abs'],
    equipment: ['None'],
    difficulty: 'intermediate',
    instructions: 'Lie on back, bring opposite elbow to knee while extending other leg.',
    tips: 'Focus on rotational movement and controlled pace.',
    image: 'https://images.pexels.com/photos/4753926/pexels-photo-4753926.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.6,
    duration: '2-3 min',
    calories: 30
  },
  {
    id: '29',
    name: 'Seated Cable Rows',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: ['Cable Machine'],
    difficulty: 'intermediate',
    instructions: 'Sit at cable machine, pull handle to abdomen while squeezing shoulder blades.',
    tips: 'Keep back straight and avoid using momentum.',
    image: 'https://images.pexels.com/photos/6456294/pexels-photo-6456294.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.8,
    duration: '3-4 min',
    calories: 45
  },
  {
    id: '30',
    name: 'Glute Bridges',
    category: 'Strength',
    muscleGroups: ['Glutes', 'Hamstrings'],
    equipment: ['None'],
    difficulty: 'beginner',
    instructions: 'Lie on back with knees bent, lift hips toward ceiling while squeezing glutes.',
    tips: 'Avoid arching lower back excessively.',
    image: 'https://images.pexels.com/photos/3822901/pexels-photo-3822901.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.5,
    duration: '2-3 min',
    calories: 30
  },
  {
    id: '31',
    name: 'Hammer Curls',
    category: 'Strength',
    muscleGroups: ['Biceps', 'Forearms'],
    equipment: ['Dumbbells'],
    difficulty: 'beginner',
    instructions: 'Hold dumbbells with palms facing inward, curl weights toward shoulders.',
    tips: 'Keep elbows stationary and control movement.',
    image: 'https://images.pexels.com/photos/8411300/pexels-photo-8411300.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.7,
    duration: '2-3 min',
    calories: 25
  },
  {
    id: '32',
    name: 'Face Pulls',
    category: 'Strength',
    muscleGroups: ['Rear Deltoids', 'Upper Back'],
    equipment: ['Cable Machine'],
    difficulty: 'intermediate',
    instructions: 'Pull rope attachment toward face while flaring elbows outward.',
    tips: 'Focus on squeezing shoulder blades together.',
    image: 'https://images.pexels.com/photos/6456305/pexels-photo-6456305.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.6,
    duration: '3-4 min',
    calories: 35
  },
  {
    id: '33',
    name: 'Kettlebell Swings',
    category: 'Cardio',
    muscleGroups: ['Glutes', 'Hamstrings', 'Shoulders'],
    equipment: ['Kettlebell'],
    difficulty: 'advanced',
    instructions: 'Hinge at hips to swing kettlebell between legs, thrust hips to propel weight forward.',
    tips: 'Initiate movement with hips, not arms.',
    image: 'https://images.pexels.com/photos/4662434/pexels-photo-4662434.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.8,
    duration: '3-5 min',
    calories: 60
  },
  {
    id: '34',
    name: 'Calf Raises',
    category: 'Strength',
    muscleGroups: ['Calves'],
    equipment: ['None'],
    difficulty: 'beginner',
    instructions: 'Stand on edge of step, raise heels as high as possible, lower below step level.',
    tips: 'Control movement and pause at top contraction.',
    image: 'https://images.pexels.com/photos/3822908/pexels-photo-3822908.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.4,
    duration: '2-3 min',
    calories: 20
  },
  {
    id: '35',
    name: 'Superman',
    category: 'Core',
    muscleGroups: ['Lower Back', 'Glutes'],
    equipment: ['None'],
    difficulty: 'beginner',
    instructions: 'Lie face down, simultaneously lift arms, chest, and legs off ground.',
    tips: 'Hold position briefly and avoid straining neck.',
    image: 'https://images.pexels.com/photos/4753928/pexels-photo-4753928.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.5,
    duration: '2-3 min',
    calories: 20
  },
  {
    id: '36',
    name: 'Incline Bench Press',
    category: 'Strength',
    muscleGroups: ['Upper Chest', 'Shoulders', 'Triceps'],
    equipment: ['Barbell', 'Incline Bench'],
    difficulty: 'intermediate',
    instructions: 'Lie on incline bench, lower bar to upper chest, press upward.',
    tips: 'Use 30-45 degree bench angle for optimal upper chest activation.',
    image: 'https://images.pexels.com/photos/3838381/pexels-photo-3838381.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
    rating: 4.7,
    duration: '4-5 min',
    calories: 50
  }
];
const categories = ['All', 'Strength', 'Cardio', 'Bodyweight', 'Core', 'Flexibility'];
// Export exercises for use in other components
export { exercises };

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const equipmentOptions = ['All', 'None', 'Dumbbells', 'Barbell', 'Resistance Bands', 'Kettlebells'];

const WorkoutLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [showAddToPlanModal, setShowAddToPlanModal] = useState<Exercise | null>(null);
  const { workoutPlans, updatePlan } = useWorkout();

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroups.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty.toLowerCase();
    const matchesEquipment = selectedEquipment === 'All' || 
                            exercise.equipment.includes(selectedEquipment) ||
                            (selectedEquipment === 'None' && exercise.equipment.includes('None'));

    return matchesSearch && matchesCategory && matchesDifficulty && matchesEquipment;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-emerald-400 bg-emerald-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Strength': return <Dumbbell className="w-4 h-4" />;
      case 'Cardio': return <Heart className="w-4 h-4" />;
      case 'Core': return <Target className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const handleAddToWorkout = (exercise: Exercise) => {
    setShowAddToPlanModal(exercise);
  };

  const addExerciseToPlan = async (planId: string, exercise: Exercise) => {
    try {
      const plan = workoutPlans.find(p => p.id === planId);
      if (!plan) return;

      const newExercise = {
        id: Date.now().toString(),
        name: exercise.name,
        sets: 3,
        reps: exercise.difficulty === 'beginner' ? '12-15' : exercise.difficulty === 'advanced' ? '6-8' : '8-12',
        rest: '60-90 sec',
        notes: exercise.tips,
        muscleGroups: exercise.muscleGroups,
        equipment: exercise.equipment,
        instructions: exercise.instructions
      };
      const updatedExercises = [...plan.exercises, newExercise];
      await updatePlan(planId, { exercises: updatedExercises });
      setShowAddToPlanModal(null);
    } catch (error) {
      console.error('Error adding exercise to plan:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Library Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Exercise Library</h3>
            <p className="text-gray-300">Comprehensive database of exercises with detailed instructions</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{filteredExercises.length}</div>
            <div className="text-xs text-gray-400">Exercises</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises, muscle groups..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 text-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <div className="text-gray-400 text-sm">
              Showing {filteredExercises.length} of {exercises.length} exercises
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="space-y-2">
                <label className="text-white font-semibold text-sm">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-white font-semibold text-sm">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty} className="bg-gray-800">{difficulty}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-white font-semibold text-sm">Equipment</label>
                <select
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                >
                  {equipmentOptions.map(equipment => (
                    <option key={equipment} value={equipment} className="bg-gray-800">{equipment}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all group"
          >
            {/* Exercise Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={exercise.image}
                alt={exercise.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  {getCategoryIcon(exercise.category)}
                  <span className="text-white text-xs font-medium">{exercise.category}</span>
                </div>
              </div>

              {/* Bookmark Button */}
              <div className="absolute top-3 right-3">
                <motion.button 
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bookmark className="w-4 h-4 text-white" />
                </motion.button>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  className="w-12 h-12 bg-orange-500/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-orange-400/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className="w-6 h-6 text-white ml-0.5" />
                </motion.button>
              </div>
            </div>

            {/* Exercise Content */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                  {exercise.name}
                </h4>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-sm font-medium">{exercise.rating}</span>
                </div>
              </div>

              {/* Exercise Details */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{exercise.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{exercise.calories} cal</span>
                </div>
              </div>

              {/* Muscle Groups */}
              <div className="flex flex-wrap gap-1 mb-4">
                {exercise.muscleGroups.slice(0, 2).map((muscle, muscleIndex) => (
                  <span
                    key={muscleIndex}
                    className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full"
                  >
                    {muscle}
                  </span>
                ))}
                {exercise.muscleGroups.length > 2 && (
                  <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded-full">
                    +{exercise.muscleGroups.length - 2}
                  </span>
                )}
              </div>

              {/* Difficulty */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>
                <span className="text-gray-400 text-xs">
                  {exercise.equipment.join(', ')}
                </span>
              </div>

              {/* Expand/Collapse Instructions */}
              <motion.button
                onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
                className="w-full text-left text-orange-400 hover:text-orange-300 text-sm font-medium mb-3"
                whileHover={{ scale: 1.02 }}
              >
                {expandedExercise === exercise.id ? 'Hide Instructions' : 'View Instructions'}
              </motion.button>

              {/* Expanded Instructions */}
              {expandedExercise === exercise.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 mb-4"
                >
                  <div>
                    <h6 className="text-white font-semibold text-sm mb-1">Instructions</h6>
                    <p className="text-gray-300 text-sm leading-relaxed">{exercise.instructions}</p>
                  </div>
                  <div>
                    <h6 className="text-white font-semibold text-sm mb-1">Tips</h6>
                    <p className="text-gray-300 text-sm leading-relaxed">{exercise.tips}</p>
                  </div>
                </motion.div>
              )}

              {/* Action Button */}
              <motion.button
                onClick={() => handleAddToWorkout(exercise)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                <span>Add to Workout</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredExercises.length === 0 && (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-bold text-white mb-2">No exercises found</h4>
          <p className="text-gray-300 mb-4">
            Try adjusting your search terms or filters to find exercises.
          </p>
          <motion.button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSelectedEquipment('All');
            }}
            className="text-orange-400 hover:text-orange-300 font-medium"
            whileHover={{ scale: 1.05 }}
          >
            Clear all filters
          </motion.button>
        </div>
      )}

      {/* Add to Plan Modal */}
      {showAddToPlanModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl border border-white/20 p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Add Exercise</h3>
                <p className="text-gray-400">{showAddToPlanModal.name}</p>
              </div>
              <button
                onClick={() => setShowAddToPlanModal(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-gray-300 text-sm mb-4">Choose a workout plan to add this exercise to:</p>
              
              {workoutPlans.filter(p => p.isActive).length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {workoutPlans.filter(p => p.isActive).map((plan) => (
                    <motion.button
                      key={plan.id}
                      onClick={() => addExerciseToPlan(plan.id, showAddToPlanModal)}
                      className="w-full text-left bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-4 text-white transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-gray-400">
                        {plan.duration} min • {plan.exercises.length} exercises • {plan.difficulty}
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">No active workout plans found</div>
                  <button
                    onClick={() => setShowAddToPlanModal(null)}
                    className="text-orange-400 hover:text-orange-300 font-medium"
                  >
                    Create a plan first
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WorkoutLibrary;