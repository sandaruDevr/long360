import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WorkoutSessionLogger from '../components/workout/WorkoutSessionLogger';
import { useWorkout } from '../hooks/useWorkout';

const WorkoutSessionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logSession } = useWorkout();
  const workoutPlan = location.state?.workoutPlan;

  const handleClose = () => {
    navigate('/workout');
  };

  const handleComplete = async (sessionData: any) => {
    try {
      await logSession(sessionData);
      navigate('/workout');
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  return (
    <WorkoutSessionLogger
      workoutPlan={workoutPlan}
      onClose={handleClose}
      onComplete={handleComplete}
    />
  );
};

export default WorkoutSessionPage;