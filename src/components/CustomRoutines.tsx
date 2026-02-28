import { useState } from 'react';

const DAYS_OF_WEEK = [
  { id: 'L', name: 'Lunes' },
  { id: 'M', name: 'Martes' },
  { id: 'X', name: 'Miércoles' },
  { id: 'J', name: 'Jueves' },
  { id: 'V', name: 'Viernes' },
  { id: 'S', name: 'Sábado' },
  { id: 'D', name: 'Domingo' }
];

export interface Routine {
  id: string;
  name: string;
  weight?: string;
  sets?: string;
  reps?: string;
  days: string[];
  notes?: string;
  completedDays: string[];
}

interface CustomRoutinesProps {
  routines: Routine[];
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
}

export default function CustomRoutines({ routines, setRoutines }: CustomRoutinesProps) {
  const [formData, setFormData] = useState<Partial<Routine>>({ days: [] });

  const handleDayToggleForm = (dayId: string) => {
    const currentDays = formData.days || [];
    if (currentDays.includes(dayId)) {
      setFormData({ ...formData, days: currentDays.filter(d => d !== dayId) });
    } else {
      setFormData({ ...formData, days: [...currentDays, dayId] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setRoutines([...routines, { ...formData, id: Date.now().toString(), completedDays: [] } as Routine]);
    setFormData({ days: [] });
  };

  const toggleRoutineDay = (routineId: string, dayId: string) => {
    setRoutines(routines.map(r => {
      if (r.id === routineId) {
        const isCompleted = r.completedDays.includes(dayId);
        return {
          ...r,
          completedDays: isCompleted 
            ? r.completedDays.filter(d => d !== dayId)
            : [...r.completedDays, dayId]
        };
      }
      return r;
    }));
  };

  const resetRoutineDays = (routineId: string) => {
    setRoutines(routines.map(r => r.id === routineId ? { ...r, completedDays: [] } : r));
  };

  const deleteRoutine = (routineId: string) => {
    setRoutines(routines.filter(r => r.id !== routineId));
  };

  return (
    <div className="w-full max-w-[960px] flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">Rutinas Personalizadas</h1>
        <p className="text-slate-400 text-lg font-normal">Crea y gestiona tus propios entrenamientos (opcional).</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-card-dark p-6 rounded-xl border border-border-dark flex flex-col gap-4 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-2">Agregar Nueva Rutina</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Nombre del Ejercicio (Requerido)" 
            className="bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            value={formData.name || ''}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <input 
            type="text" 
            placeholder="Peso (Ej: 20kg) - Opcional" 
            className="bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            value={formData.weight || ''}
            onChange={e => setFormData({...formData, weight: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Cantidad de Series - Opcional" 
            className="bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            value={formData.sets || ''}
            onChange={e => setFormData({...formData, sets: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Cantidad de Repeticiones - Opcional" 
            className="bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            value={formData.reps || ''}
            onChange={e => setFormData({...formData, reps: e.target.value})}
          />
        </div>
        
        <div className="flex flex-col gap-2 mt-2">
          <span className="text-slate-400 text-sm font-medium">Días de entrenamiento:</span>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map(day => (
              <button
                key={day.id}
                type="button"
                onClick={() => handleDayToggleForm(day.id)}
                className={`size-10 rounded-full font-bold text-sm transition-colors border ${
                  formData.days?.includes(day.id)
                    ? 'bg-primary border-primary text-black'
                    : 'bg-background-dark border-border-dark text-slate-400 hover:border-primary/50'
                }`}
              >
                {day.id}
              </button>
            ))}
          </div>
        </div>

        <textarea 
          placeholder="Notas adicionales - Opcional"
          className="bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-white resize-none h-24 focus:outline-none focus:border-primary transition-colors mt-2"
          value={formData.notes || ''}
          onChange={e => setFormData({...formData, notes: e.target.value})}
        />
        <button type="submit" className="mt-2 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">add_circle</span>
          Guardar Rutina
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routines.map(routine => (
          <div key={routine.id} className="bg-card-dark p-6 rounded-xl border border-border-dark hover:border-primary/50 transition-colors flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">fitness_center</span>
                {routine.name}
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => resetRoutineDays(routine.id)}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium bg-background-dark px-2 py-1 rounded border border-border-dark"
                  title="Reiniciar días completados"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Reset
                </button>
                <button 
                  onClick={() => deleteRoutine(routine.id)}
                  className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-xs font-medium bg-red-500/10 px-2 py-1 rounded border border-red-500/20"
                  title="Eliminar rutina"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Borrar
                </button>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              {routine.weight && (
                <div className="flex justify-between items-center border-b border-border-dark/50 pb-2">
                  <span className="text-slate-400 text-sm uppercase tracking-wider">Peso</span>
                  <span className="text-white font-medium">{routine.weight}</span>
                </div>
              )}
              {routine.sets && (
                <div className="flex justify-between items-center border-b border-border-dark/50 pb-2">
                  <span className="text-slate-400 text-sm uppercase tracking-wider">Series</span>
                  <span className="text-white font-medium">{routine.sets}</span>
                </div>
              )}
              {routine.reps && (
                <div className="flex justify-between items-center border-b border-border-dark/50 pb-2">
                  <span className="text-slate-400 text-sm uppercase tracking-wider">Repeticiones</span>
                  <span className="text-white font-medium">{routine.reps}</span>
                </div>
              )}
              {routine.notes && (
                <div className="pt-2">
                  <span className="text-slate-400 text-sm uppercase tracking-wider block mb-1">Notas</span>
                  <p className="text-slate-300 italic text-sm bg-background-dark p-3 rounded-lg">{routine.notes}</p>
                </div>
              )}
            </div>

            {routine.days && routine.days.length > 0 && (
              <div className="mt-auto pt-4 border-t border-border-dark/50">
                <span className="text-slate-400 text-sm uppercase tracking-wider block mb-3">Progreso Semanal</span>
                <div className="flex flex-wrap gap-2">
                  {routine.days.map(dayId => {
                    const isCompleted = routine.completedDays.includes(dayId);
                    return (
                      <button
                        key={dayId}
                        onClick={() => toggleRoutineDay(routine.id, dayId)}
                        className={`flex items-center justify-center size-10 rounded-full font-bold text-sm transition-colors border ${
                          isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-background-dark border-border-dark text-slate-400 hover:border-primary/50'
                        }`}
                      >
                        {isCompleted ? <span className="material-symbols-outlined text-sm">check</span> : dayId}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
        {routines.length === 0 && (
          <div className="col-span-full bg-card-dark/50 border border-dashed border-border-dark rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">note_add</span>
            <p className="text-slate-400">No has agregado ninguna rutina personalizada aún.</p>
            <p className="text-slate-500 text-sm mt-1">Usa el formulario de arriba para crear tu primera rutina.</p>
          </div>
        )}
      </div>
    </div>
  );
}
