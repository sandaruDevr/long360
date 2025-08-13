import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import ScrollIndicator from './components/ScrollIndicator';
import MobileNavigation from './components/MobileNavigation';
import Footer from './components/Footer';
import SideNavigation from './components/SideNavigation';
import DashboardPage from './pages/DashboardPage';
import SleepPage from './pages/SleepPage';
import NutritionPage from './pages/NutritionPage';
import SupplementsPage from './pages/SupplementsPage';
import WorkoutPage from './pages/WorkoutPage';
import AICoachPage from './pages/AICoachPage';
import AIDoctorPage from './pages/AIDoctorPage';
import WorkoutSessionPage from './pages/WorkoutSessionPage';
import AuthPage from './pages/AuthPage';
import SettingsPage from './pages/SettingsPage';
import UpgradePlanPage from './pages/UpgradePlanPage';
import DiseaseRiskPage from './pages/DiseaseRiskPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [currentPage, setCurrentPage] = React.useState('home');

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : (
          <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-50 to-slate-100">
            <Header />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <PricingSection />
            <ScrollIndicator />
            <MobileNavigation />
            <Footer />
          </div>
        )
      } />
      
      <Route path="/auth" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
      } />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
            <SideNavigation currentPage="dashboard" onPageChange={setCurrentPage} />
            <div className="flex-1 ml-64">
              <DashboardPage />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/ai-coach" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
            <SideNavigation currentPage="ai-coach" onPageChange={setCurrentPage} />
            <div className="flex-1 ml-64">
              <AICoachPage />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/ai-doctor" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
            <SideNavigation currentPage="ai-doctor" onPageChange={setCurrentPage} />
            <div className="flex-1 ml-64">
              <AIDoctorPage />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/disease-risk" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
            <SideNavigation currentPage="disease-risk" onPageChange={setCurrentPage} />
            <div className="flex-1 ml-64">
              <DiseaseRiskPage />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/sleep" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
            <SideNavigation currentPage="sleep" onPageChange={setCurrentPage} />
            <div className="flex-1 ml-64">
              <SleepPage />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/nutrition" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
            <SideNavigation currentPage="nutrition" onPageChange={setCurrentPage} />
            <div className="flex-1 ml-64">
              <NutritionPage />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/supplements" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
            <SideNavigation currentPage="supplements" onPageChange={setCurrentPage} />
            <div className="flex-1 ml-64">
              <SupplementsPage />
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/workout" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
            <SideNavigation currentPage="workout" onPageChange={setCurrentPage} />
            <div className="flex-1 ml-64">
              <WorkoutPage />
            </div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
            <SideNavigation currentPage="settings" onPageChange={setCurrentPage} />
            <div className="flex-1 ml-64">
              <SettingsPage />
            </div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="/upgrade" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
            <SideNavigation currentPage="upgrade" onPageChange={setCurrentPage} />
            <div className="flex-1 ml-64">
              <UpgradePlanPage />
            </div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="/workout-session" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <WorkoutSessionPage />
          </div>
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;