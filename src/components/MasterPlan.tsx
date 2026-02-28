interface MasterPlanProps {
  onNavigate: (weekId: string) => void;
  completedDays: string[];
  weeksData: any[];
}

export default function MasterPlan({ onNavigate, completedDays, weeksData }: MasterPlanProps) {
  const isWeekUnlocked = (weekIndex: number) => {
    if (weekIndex === 0) return true;
    const previousWeek = weeksData[weekIndex - 1];
    const previousWeekDays = previousWeek.days.map((d: any) => d.id);
    return previousWeekDays.every((dayId: string) => completedDays.includes(dayId));
  };

  const isWeekCompleted = (week: any) => {
    const weekDays = week.days.map((d: any) => d.id);
    return weekDays.every((dayId: string) => completedDays.includes(dayId));
  };

  const totalDays = weeksData.reduce((acc, week) => acc + week.days.length, 0);
  const progressPercent = totalDays === 0 ? 0 : Math.round((completedDays.length / totalDays) * 100);

  return (
    <div className="w-full max-w-[960px] flex flex-col gap-8">
      {/* Hero Header */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Plan Maestro de 12 Semanas
            </h1>
            <p className="text-text-muted text-lg font-normal">
              Tu camino científico hacia un Core de Élite.
            </p>
          </div>
        </div>
        {/* Global Progress Bar */}
        <div className="bg-surface-dark rounded-xl p-6 border border-surface-border shadow-lg">
          <div className="flex gap-6 justify-between mb-3">
            <p className="text-white text-base font-medium">Progreso Total</p>
            <p className="text-primary text-base font-bold">{progressPercent}%</p>
          </div>
          <div className="relative h-4 w-full bg-[#54473b]/30 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-text-muted text-sm mt-3 text-right">
            Fase 1: Fundación Anatómica
          </p>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[60px_1fr] gap-x-6">
        {/* Left Column: Timeline Line */}
        <div className="hidden md:flex flex-col items-center pt-8 relative">
          <div className="absolute top-8 bottom-8 w-[2px] bg-surface-border z-0"></div>
        </div>

        {/* Right Column: Content Cards */}
        <div className="flex flex-col gap-6">
          {weeksData.map((week, index) => {
            const unlocked = isWeekUnlocked(index);
            const completed = isWeekCompleted(week);

            if (unlocked) {
              return (
                <div key={week.id} className="relative group cursor-pointer" onClick={() => onNavigate(week.id)}>
                  <div className={`hidden md:flex absolute -left-[84px] top-8 z-10 size-12 items-center justify-center rounded-full border-4 border-background-dark ${completed ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-primary shadow-[0_0_15px_rgba(242,127,13,0.4)]'}`}>
                    <span className="material-symbols-outlined text-background-dark font-bold">
                      {completed ? 'done_all' : 'check'}
                    </span>
                  </div>
                  <div className={`flex flex-col md:flex-row gap-6 bg-surface-dark p-6 rounded-xl border shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-colors ${completed ? 'border-green-500/50 hover:border-green-500' : 'border-primary/30 hover:border-primary/60'}`}>
                    <div className="flex-1 flex flex-col gap-4">
                      <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${completed ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                          Semana {week.number} • {completed ? 'Completado' : 'Desbloqueado'}
                        </div>
                        <h3 className="text-white text-2xl font-bold mb-1">
                          {week.title}
                        </h3>
                        <p className="text-text-muted text-sm leading-relaxed">
                          {week.description}
                        </p>
                      </div>
                      <button className={`mt-2 w-full md:w-fit flex items-center justify-center gap-2 text-[#181411] font-bold py-3 px-6 rounded-lg transition-all duration-200 ${completed ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary-dark'}`}>
                        <span className="material-symbols-outlined">{completed ? 'visibility' : 'play_arrow'}</span>
                        {completed ? 'Ver Desafíos' : 'Comenzar Desafío'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={week.id} className="relative opacity-60 hover:opacity-100 transition-opacity duration-300">
                  <div className="hidden md:flex absolute -left-[84px] top-8 z-10 size-12 items-center justify-center rounded-full bg-surface-dark border-4 border-background-dark border-surface-border">
                    <span className="material-symbols-outlined text-text-muted">
                      lock
                    </span>
                  </div>
                  <div className="bg-background-dark border border-surface-border p-6 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-bold">
                        Semana {week.number}: {week.title}
                      </h3>
                      <p className="text-text-muted text-sm">
                        Prerrequisito: Completar Semana {week.number - 1}
                      </p>
                    </div>
                    <div className="size-10 flex items-center justify-center rounded-full bg-surface-dark">
                      <span className="material-symbols-outlined text-text-muted">
                        lock
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          })}

          {/* Divider */}
          <div className="relative py-4 flex items-center gap-4">
            <div className="h-px bg-surface-border flex-1"></div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Fase 2: Construcción de Potencia
            </span>
            <div className="h-px bg-surface-border flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
