import { useState, useEffect } from 'react';

interface WeekDetailProps {
  onBack: () => void;
  weekId: string;
  weeksData: any[];
  completedDays: string[];
  onDayComplete: (dayId: string, weekId: string) => void;
  onNavigateToWeek: (weekId: string) => void;
}

export default function WeekDetail({ onBack, weekId, weeksData, completedDays, onDayComplete, onNavigateToWeek }: WeekDetailProps) {
  const week = weeksData.find(w => w.id === weekId);
  const [showCongrats, setShowCongrats] = useState(false);
  
  if (!week) return <div>Week not found</div>;

  const totalDays = week.days.length;
  const completedDaysInWeek = week.days.filter((d: any) => completedDays.includes(d.id)).length;
  const isWeekCompleted = completedDaysInWeek === totalDays;

  useEffect(() => {
    if (isWeekCompleted) {
      setShowCongrats(true);
    } else {
      setShowCongrats(false);
    }
  }, [isWeekCompleted]);

  const handleNextWeek = () => {
    const currentIndex = weeksData.findIndex(w => w.id === weekId);
    if (currentIndex < weeksData.length - 1) {
      onNavigateToWeek(weeksData[currentIndex + 1].id);
    }
  };

  return (
    <div className="w-full max-w-[1100px] flex flex-col gap-8">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <a
          className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
          onClick={onBack}
        >
          Inicio
        </a>
        <span className="material-symbols-outlined text-slate-600 text-xs">
          chevron_right
        </span>
        <a
          className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
          onClick={onBack}
        >
          Desafíos
        </a>
        <span className="material-symbols-outlined text-slate-600 text-xs">
          chevron_right
        </span>
        <span className="text-primary font-medium">Semana {week.number}</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary text-xs font-bold uppercase tracking-wider">
              Fase {Math.ceil(week.number / 4)}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
            Semana {week.number}: {week.title}
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
            {week.description}
          </p>
        </div>

        {/* Week Progress / Medals */}
        <div className="flex items-center gap-4 bg-card-dark p-4 rounded-xl border border-border-dark">
          <div className="flex flex-col items-center gap-1 relative">
            <span
              className={`material-symbols-outlined text-4xl ${isWeekCompleted ? 'text-green-500' : 'text-primary animate-bounce'}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              military_tech
            </span>
            <span className={`text-xs font-bold uppercase ${isWeekCompleted ? 'text-green-500' : 'text-primary'}`}>
              Sem {week.number}
            </span>
            {!isWeekCompleted && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-dark border border-border-dark hover:border-primary/50 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
              bolt
            </span>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              Dificultad
            </p>
          </div>
          <p className="text-white text-3xl font-bold">{week.number > 2 ? 'Alta' : 'Media'}</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
            <div className="bg-primary h-1.5 rounded-full w-[85%]"></div>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-dark border border-border-dark hover:border-primary/50 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
              schedule
            </span>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              Duración Est.
            </p>
          </div>
          <p className="text-white text-3xl font-bold">45 min</p>
          <p className="text-xs text-slate-500">Por sesión diaria</p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-dark border border-border-dark hover:border-primary/50 transition-colors group">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
              fitness_center
            </span>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              Equipo
            </p>
          </div>
          <p className="text-white text-3xl font-bold">Pesas Libres</p>
          <p className="text-xs text-slate-500">Mancuernas y Barra</p>
        </div>
      </div>

      {/* Routines Section */}
      <section className="mt-4">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Tus Rutinas de la Semana
          </h2>
          <p className="text-slate-400 text-sm hidden sm:block">
            Completa las {totalDays} para desbloquear el premio
          </p>
        </div>
        <div className="grid gap-6">
          {week.days.map((day: any) => (
            <DayCard 
              key={day.id} 
              day={day} 
              isCompleted={completedDays.includes(day.id)} 
              onComplete={() => onDayComplete(day.id, weekId)} 
            />
          ))}
        </div>
      </section>

      {/* Congratulation & Next Week Section */}
      {showCongrats && (
        <section className="bg-gradient-to-br from-green-500/20 to-primary/20 border border-green-500/30 rounded-2xl p-8 text-center mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="size-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-5xl text-green-500">emoji_events</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">¡Felicidades!</h2>
          <p className="text-slate-300 text-lg mb-6 max-w-xl mx-auto">
            Has completado todos los entrenamientos de la Semana {week.number}. Tu dedicación está dando frutos.
            {week.number < weeksData.length ? ' La siguiente semana ya está desbloqueada.' : ''}
          </p>
          {week.number < weeksData.length ? (
            <button 
              onClick={handleNextWeek}
              className="bg-primary hover:bg-primary-dark text-black font-bold py-3 px-8 rounded-xl transition-colors inline-flex items-center gap-2"
            >
              Ir a la Semana {week.number + 1}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          ) : (
            <div className="mt-6 p-6 bg-primary/10 rounded-xl border border-primary/30 inline-block">
               <h3 className="text-2xl font-black text-primary mb-2">¡Programa Completado!</h3>
               <p className="text-white text-lg">Gracias por elegir SixPackCreator. Has completado las 12 semanas de transformación. ¡Estamos muy orgullosos de tu progreso y dedicación!</p>
            </div>
          )}
        </section>
      )}

      {/* Modal Mockup (Teaser) */}
      {!showCongrats && (
        <section className="bg-gradient-to-t from-background-dark to-transparent py-12 px-4 flex justify-center sticky bottom-0 z-40 pointer-events-none">
          <div className="pointer-events-auto max-w-md w-full bg-card-dark border border-primary rounded-2xl p-6 shadow-2xl transform translate-y-4 hover:translate-y-0 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-primary to-primary-dark p-3 rounded-xl shadow-lg shrink-0">
                <span className="material-symbols-outlined text-white text-3xl">
                  science
                </span>
              </div>
              <div className="flex flex-col">
                <div className="text-primary text-xs font-bold uppercase tracking-widest mb-1">
                  Premio al completar
                </div>
                <h3 className="text-white font-bold text-lg leading-tight mb-1">
                  Nuevo Bio-Hack: Ayuno de Dopamina
                </h3>
                <p className="text-slate-400 text-sm leading-snug">
                  Restablece tus receptores neuronales para maximizar el enfoque
                  en el entrenamiento.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Progreso Semana {week.number}</span>
                <span className="text-primary">{completedDaysInWeek}/{totalDays} Rutinas</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full transition-all duration-1000" style={{ width: `${(completedDaysInWeek / totalDays) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function DayCard({ day, isCompleted, onComplete }: { day: any, isCompleted: boolean, onComplete: () => void }) {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <article className={`relative overflow-hidden rounded-2xl bg-card-dark border transition-all duration-300 shadow-lg ${isCompleted ? 'border-green-500/50' : 'border-border-dark hover:border-primary'}`}>
      <div className="p-6 md:p-8 flex flex-col justify-center z-20">
        <div className="flex justify-between items-start mb-2">
          <span className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-2 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}>DÍA {day.dayNumber}</span>
          <div className="flex items-center gap-1 text-slate-400 text-sm">
            <span className="material-symbols-outlined text-lg">timer</span>
            <span>{Math.floor(day.duration / 60)} min</span>
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{day.title}</h3>
        <p className="text-slate-400 mb-4 text-sm md:text-base">{day.description}</p>
        
        {isStarted && (
          <div className="mb-6 bg-background-dark/50 p-4 rounded-lg border border-border-dark">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">info</span>
              Instrucciones
            </h4>
            <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">
              {day.instructions}
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-auto">
          {!isCompleted ? (
            <div className="flex items-center gap-4 w-full flex-wrap">
              {!isStarted ? (
                <button onClick={() => setIsStarted(true)} className="bg-primary hover:bg-primary-dark text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined">play_arrow</span> Iniciar Entrenamiento
                </button>
              ) : (
                <>
                  <button onClick={() => setIsStarted(false)} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">
                    <span className="material-symbols-outlined">close</span> Cancelar
                  </button>
                  <button onClick={onComplete} className="ml-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">
                    <span className="material-symbols-outlined">done</span> Marcar como Concluido
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-green-500 font-bold flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
              <span className="material-symbols-outlined">check_circle</span> Completado
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
