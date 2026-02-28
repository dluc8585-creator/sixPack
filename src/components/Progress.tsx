import React from 'react';

export default function Progress({ completedDays }: { completedDays: string[] }) {
  const totalRoutines = 36; // 12 weeks * 3 days
  const completedCount = completedDays.length;
  const progressPercent = Math.round((completedCount / totalRoutines) * 100);
  
  // Calculate current streak (mock logic for now, assuming consecutive days if completed)
  const currentStreak = completedCount > 0 ? Math.min(completedCount, 5) : 0;

  return (
    <div className="w-full max-w-[1100px] flex flex-col gap-8">
      <div className="flex flex-col gap-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
          <span className="material-symbols-outlined text-primary text-sm">monitoring</span>
          <span className="text-primary text-xs font-bold uppercase tracking-wider">
            Métricas de Rendimiento
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
          Tu Progreso
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
          Visualiza tus estadísticas, consistencia y evolución a lo largo del programa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Stat 1 */}
        <div className="bg-card-dark border border-border-dark rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-primary">local_fire_department</span>
          </div>
          <h3 className="text-4xl font-black text-white mb-1">{currentStreak} <span className="text-xl text-slate-400 font-medium">días</span></h3>
          <p className="text-slate-400 text-sm uppercase tracking-wider font-bold">Racha Actual</p>
        </div>

        {/* Stat 2 */}
        <div className="bg-card-dark border border-border-dark rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-green-500">task_alt</span>
          </div>
          <h3 className="text-4xl font-black text-white mb-1">{completedCount} <span className="text-xl text-slate-400 font-medium">/ {totalRoutines}</span></h3>
          <p className="text-slate-400 text-sm uppercase tracking-wider font-bold">Rutinas Completadas</p>
        </div>

        {/* Stat 3 */}
        <div className="bg-card-dark border border-border-dark rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="size-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-blue-500">fitness_center</span>
          </div>
          <h3 className="text-4xl font-black text-white mb-1">{completedCount * 45} <span className="text-xl text-slate-400 font-medium">min</span></h3>
          <p className="text-slate-400 text-sm uppercase tracking-wider font-bold">Tiempo Entrenado</p>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="bg-card-dark border border-border-dark rounded-2xl p-8 mt-4">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Progreso General del Programa</h3>
            <p className="text-slate-400 text-sm">Plan de 12 Semanas</p>
          </div>
          <span className="text-3xl font-black text-primary">{progressPercent}%</span>
        </div>
        <div className="w-full bg-background-dark rounded-full h-4 overflow-hidden border border-border-dark">
          <div 
            className="bg-gradient-to-r from-primary-dark to-primary h-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Calendar Mockup */}
      <div className="bg-card-dark border border-border-dark rounded-2xl p-8 mt-4">
        <h3 className="text-xl font-bold text-white mb-6">Actividad Reciente</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {[...Array(14)].map((_, i) => {
            const isCompleted = i < currentStreak;
            return (
              <div 
                key={i} 
                className={`shrink-0 size-12 rounded-xl flex items-center justify-center border ${
                  isCompleted 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-background-dark border-border-dark text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {isCompleted ? 'check' : 'remove'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
