import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Routine {
    id: string;
    title: string;
    description: string;
    exercises: any;
    created_at: string;
}

const DAYS_OF_WEEK = [
    { id: 'L', label: 'L' },
    { id: 'M', label: 'M' },
    { id: 'X', label: 'X' },
    { id: 'J', label: 'J' },
    { id: 'V', label: 'V' },
    { id: 'S', label: 'S' },
    { id: 'D', label: 'D' },
];

export default function UserRoutines() {
    const [routines, setRoutines] = useState<Routine[]>([]);

    // Formulario completo
    const [title, setTitle] = useState('');
    const [weight, setWeight] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);

    const fetchRoutines = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('rutinas')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) console.log(error);
        else setRoutines(data || []);
    };

    const addRoutine = async () => {
        if (!title.trim()) return;
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        const { error } = await supabase.from('rutinas').insert([
            {
                user_id: user.id,
                title,
                description,
                exercises: {
                    weight,
                    sets,
                    reps,
                    days: selectedDays
                },
            },
        ]);

        if (error) {
            alert('Error al crear rutina: ' + error.message);
        } else {
            setTitle('');
            setWeight('');
            setSets('');
            setReps('');
            setDescription('');
            setSelectedDays([]);
            fetchRoutines();
        }
        setLoading(false);
    };

    const toggleDay = (dayId: string) => {
        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter(d => d !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    const deleteRoutine = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta rutina?')) return;

        const { error } = await supabase.from('rutinas').delete().eq('id', id);

        if (error) {
            alert('Error al eliminar: ' + error.message);
        } else {
            setRoutines(routines.filter(r => r.id !== id));
        }
    };

    const toggleCompletedDay = async (routineId: string, dayId: string, currentCompleted: string[]) => {
        const isCompleted = currentCompleted.includes(dayId);
        const newCompleted = isCompleted
            ? currentCompleted.filter(d => d !== dayId)
            : [...currentCompleted, dayId];

        const routine = routines.find(r => r.id === routineId);
        if (!routine) return;

        const updatedExercises = {
            ...routine.exercises,
            completed_days: newCompleted
        };

        const { error } = await supabase
            .from('rutinas')
            .update({ exercises: updatedExercises })
            .eq('id', routineId);

        if (error) {
            alert('Error al actualizar: ' + error.message);
        } else {
            setRoutines(routines.map(r =>
                r.id === routineId
                    ? { ...r, exercises: updatedExercises }
                    : r
            ));
        }
    };

    const resetCompletedDays = async (routineId: string) => {
        const routine = routines.find(r => r.id === routineId);
        if (!routine) return;

        const updatedExercises = {
            ...routine.exercises,
            completed_days: []
        };

        const { error } = await supabase
            .from('rutinas')
            .update({ exercises: updatedExercises })
            .eq('id', routineId);

        if (error) {
            alert('Error al resetear: ' + error.message);
        } else {
            setRoutines(routines.map(r =>
                r.id === routineId
                    ? { ...r, exercises: updatedExercises }
                    : r
            ));
        }
    };

    useEffect(() => {
        fetchRoutines();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Rutinas Personalizadas</h1>
                <p className="text-[#8c8c88] text-sm">Crea y gestiona tus propios entrenamientos (opcional).</p>
            </div>

            {/* Formulario de Nueva Rutina */}
            <div className="p-6 md:p-8 rounded-2xl shadow-xl mb-12" style={{ backgroundColor: '#1d1510', border: '1px solid #31251c' }}>
                <h3 className="text-xl font-bold text-white mb-6">Agregar Nueva Rutina</h3>

                <div className="space-y-6">
                    {/* Fila 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nombre del Ejercicio (Requerido)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-gray-200 transition-colors"
                            style={{ backgroundColor: '#140f0c', border: '1px solid #31251c' }}
                        />
                        <input
                            type="text"
                            placeholder="Peso (Ej: 20kg) - Opcional"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-gray-200 transition-colors"
                            style={{ backgroundColor: '#140f0c', border: '1px solid #31251c' }}
                        />
                    </div>

                    {/* Fila 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Cantidad de Series - Opcional"
                            value={sets}
                            onChange={(e) => setSets(e.target.value)}
                            className="w-full p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-gray-200 transition-colors"
                            style={{ backgroundColor: '#140f0c', border: '1px solid #31251c' }}
                        />
                        <input
                            type="text"
                            placeholder="Cantidad de Repeticiones - Opcional"
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            className="w-full p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-gray-200 transition-colors"
                            style={{ backgroundColor: '#140f0c', border: '1px solid #31251c' }}
                        />
                    </div>

                    {/* Días */}
                    <div>
                        <p className="text-sm text-[#8c8c88] font-bold mb-3">Días de entrenamiento:</p>
                        <div className="flex gap-4 flex-wrap">
                            {DAYS_OF_WEEK.map((day) => {
                                const isSelected = selectedDays.includes(day.id);
                                return (
                                    <button
                                        key={day.id}
                                        onClick={() => toggleDay(day.id)}
                                        className={`size-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isSelected
                                            ? 'bg-[#181411] text-primary border border-primary'
                                            : 'bg-[#140f0c] text-[#8c8c88] border border-[#31251c] hover:border-gray-500'
                                            }`}
                                    >
                                        {day.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notas */}
                    <textarea
                        placeholder="Notas adicionales - Opcional"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-gray-200 transition-colors resize-none"
                        style={{ backgroundColor: '#140f0c', border: '1px solid #31251c' }}
                    />

                    {/* Botón de Guardado */}
                    <button
                        onClick={addRoutine}
                        disabled={loading || !title.trim()}
                        className="w-full py-4 rounded-xl font-bold text-gray-900 transition-opacity disabled:opacity-50 hover:opacity-90 flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#ee7b03' }}
                    >
                        <span className="material-symbols-outlined text-[20px] font-bold">add_circle</span>
                        {loading ? 'Guardando...' : 'Guardar Rutina'}
                    </button>
                </div>
            </div>

            {/* Listado de rutinas / Estado vacío */}
            <div>
                {routines.length === 0 ? (
                    <div className="w-full border-dashed border p-12 rounded-2xl flex flex-col items-center justify-center text-center"
                        style={{ backgroundColor: '#140f0c', borderColor: '#31251c' }}>
                        <span className="material-symbols-outlined text-4xl mb-4 text-[#8c8c88]">note_add</span>
                        <p className="text-gray-300 font-medium mb-1">No has agregado ninguna rutina personalizada aún.</p>
                        <p className="text-[#8c8c88] text-sm">Usa el formulario de arriba para crear tu primera rutina.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {routines.map((r) => (
                            <div key={r.id} className="p-6 rounded-2xl shadow-md transition-colors group flex flex-col md:flex-row justify-between md:items-center gap-4 border"
                                style={{ backgroundColor: '#1d1510', borderColor: '#31251c' }}>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors mb-2">{r.title}</h3>

                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#8c8c88] mb-3">
                                        {r.exercises?.weight && (
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">fitness_center</span>
                                                Peso: <strong className="text-gray-300">{r.exercises.weight}</strong>
                                            </span>
                                        )}
                                        {r.exercises?.sets && (
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">layers</span>
                                                Series: <strong className="text-gray-300">{r.exercises.sets}</strong>
                                            </span>
                                        )}
                                        {r.exercises?.reps && (
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px]">repeat</span>
                                                Reps: <strong className="text-gray-300">{r.exercises.reps}</strong>
                                            </span>
                                        )}
                                    </div>

                                    {r.exercises?.days && r.exercises.days.length > 0 && (
                                        <div className="flex flex-col gap-2 mb-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-500">Días:</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => resetCompletedDays(r.id)}
                                                        className="text-xs text-[#8c8c88] hover:text-white transition-colors bg-[#140f0c] px-2 py-1 rounded border border-[#31251c]"
                                                    >
                                                        Resetear
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                {r.exercises.days.map((d: string) => {
                                                    const isCompleted = r.exercises.completed_days?.includes(d);
                                                    return (
                                                        <button
                                                            key={d}
                                                            onClick={() => toggleCompletedDay(r.id, d, r.exercises.completed_days || [])}
                                                            className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors cursor-pointer border ${isCompleted
                                                                ? 'bg-green-500/20 text-green-500 border-green-500/50 hover:bg-green-500/30'
                                                                : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
                                                                }`}
                                                            title={isCompleted ? "Marcar como incompleto" : "Marcar como completado"}
                                                        >
                                                            {d}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {r.description && (
                                        <p className="text-sm text-gray-400 bg-[#140f0c] p-3 rounded-lg border border-[#31251c] mb-3">
                                            <span className="font-bold text-gray-500 block mb-1">Notas:</span>
                                            {r.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-row md:flex-col items-end justify-between shrink-0 gap-4 md:gap-2">
                                    <div className="text-xs text-[#8c8c88] flex items-center">
                                        <span className="material-symbols-outlined text-[14px] mr-1">schedule</span>
                                        {new Date(r.created_at).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={() => deleteRoutine(r.id)}
                                        className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                                        title="Eliminar rutina"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}