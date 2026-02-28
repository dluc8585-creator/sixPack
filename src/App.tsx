import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MasterPlan from './components/MasterPlan';
import WeekDetail from './components/WeekDetail';
import AIAssistant from './components/AIAssistant';
import BioHacks from './components/BioHacks';
import Progress from './components/Progress';
import { WEEKS_DATA } from './data';
import AuthForm from './AuthForm';
import UserRoutines from './components/UserRoutines';
import LandingPage from './components/LandingPage';
import InstallPrompt from './components/InstallPrompt';
import { supabase } from './supabaseClient';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState('masterPlan');
  const [selectedWeekId, setSelectedWeekId] = useState('week1');
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('sixpackcreator_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Usuario',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw7RSlBk8x-vBaqZ_uXC7g2jGQhgx9oOAY2ghN9gZx17RtihHGvpu6K7lRXRTb3T8tbD2t16eB_jhUL69GZqvoUbcGmmAadj67EQMv9C2fDmy0Z_awb-Oj1vs20BMJ0pH5wexECgG2grhlAP8xtSge9csi4vR_h6QfOgt3L6IGPCzW0H3wHJthAxDYkHcjJmDiuTb4hdiB42NgkEs5rxU4JigUM_7iSQ01S7sYqfwBloVecq9S5QeYqLViAuIfhrW177ObnYGHM0g',
    };
  });

  useEffect(() => {
    localStorage.setItem('sixpackcreator_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: '¡Bienvenido!',
      message: 'Estás listo para comenzar tu transformación. Revisa el Plan Maestro.',
      time: 'Ahora',
      icon: 'military_tech',
      color: 'text-primary',
      bg: 'bg-primary/20',
    },
  ]);

  const handleNavigateToWeek = (weekId: string) => {
    setSelectedWeekId(weekId);
    setCurrentView('weekDetail');
  };

  const handleDayComplete = (dayId: string, weekId: string) => {
    if (!completedDays.includes(dayId)) {
      const newCompletedDays = [...completedDays, dayId];
      setCompletedDays(newCompletedDays);

      const week = WEEKS_DATA.find((w) => w.id === weekId);
      if (week) {
        const weekDays = week.days.map((d) => d.id);
        const isNowCompleted = weekDays.every((id) => newCompletedDays.includes(id));
        if (isNowCompleted) {
          setNotifications((prev) => [
            {
              id: Date.now(),
              title: `¡Semana ${week.number} Completada!`,
              message: `Has finalizado todos los ejercicios de la semana ${week.number}. ¡Sigue así!`,
              time: 'Ahora',
              icon: 'emoji_events',
              color: 'text-green-500',
              bg: 'bg-green-500/20',
            },
            ...prev,
          ]);
        }
      }
    }
  };

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsAuthLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#181411]">
        <div className="text-white text-xl animate-pulse">Cargando...</div>
      </div>
    );
  }

  // 🔹 Flujo de Landing Page y Login
  if (!isAuthenticated) {
    if (showLanding) {
      return (
        <>
          <LandingPage onEnterApp={() => setShowLanding(false)} />
          <InstallPrompt />
        </>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-[#181411]">
        <div className="w-full max-w-md p-6">
          <button
            onClick={() => setShowLanding(true)}
            className="mb-6 text-[#8c8c88] hover:text-white flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Volver al inicio
          </button>
          <AuthForm onLogin={() => setIsAuthenticated(true)} />
        </div>
        <InstallPrompt />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        notifications={notifications}
      />
      <main className="flex-1 flex flex-col justify-center items-center py-8 px-4 sm:px-6 lg:px-8 w-full">
        {currentView === 'masterPlan' && (
          <div className="w-full max-w-5xl">
            <MasterPlan onNavigate={handleNavigateToWeek} completedDays={completedDays} weeksData={WEEKS_DATA} />
          </div>
        )}
        {currentView === 'weekDetail' && (
          <div className="w-full max-w-5xl">
            <WeekDetail
              onBack={() => setCurrentView('masterPlan')}
              weekId={selectedWeekId}
              weeksData={WEEKS_DATA}
              completedDays={completedDays}
              onDayComplete={handleDayComplete}
              onNavigateToWeek={handleNavigateToWeek}
            />
          </div>
        )}
        {currentView === 'customRoutines' && (
          <div className="w-full max-w-5xl">
            <UserRoutines />
          </div>
        )}
        {currentView === 'bioHacks' && (
          <div className="w-full max-w-5xl">
            <BioHacks />
          </div>
        )}
        {currentView === 'progress' && (
          <div className="w-full max-w-5xl">
            <Progress completedDays={completedDays} />
          </div>
        )}
      </main>
      <AIAssistant />
      <InstallPrompt />
    </div>
  );
}