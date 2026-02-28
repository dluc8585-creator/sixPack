import React from 'react';

export default function BioHacks() {
  const hacks = [
    {
      id: 1,
      title: 'Ayuno de Dopamina',
      description: 'Restablece tus receptores neuronales para maximizar el enfoque en el entrenamiento.',
      icon: 'psychology',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      content: 'El ayuno de dopamina implica abstenerse temporalmente de estímulos altamente gratificantes (redes sociales, comida chatarra, videojuegos) para "reiniciar" la sensibilidad del cerebro a la dopamina. Esto puede aumentar la motivación natural para actividades que requieren esfuerzo, como el entrenamiento intenso.'
    },
    {
      id: 2,
      title: 'Exposición al Frío',
      description: 'Acelera la recuperación muscular y fortalece el sistema inmunológico.',
      icon: 'ac_unit',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      content: 'Las duchas frías o baños de hielo (10-15 grados Celsius durante 3-5 minutos) después del entrenamiento pueden reducir la inflamación y el dolor muscular de aparición tardía (DOMS). Además, estimulan la liberación de endorfinas y mejoran la circulación.'
    },
    {
      id: 3,
      title: 'Optimización del Sueño',
      description: 'Maximiza la hormona del crecimiento y la recuperación del sistema nervioso central.',
      icon: 'bedtime',
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      content: 'El 90% de la recuperación ocurre mientras duermes. Asegura 7-9 horas de sueño de calidad. Mantén la habitación oscura, fresca (18-20°C) y evita pantallas al menos 1 hora antes de dormir. Considera suplementar con Magnesio Bisglicinato.'
    },
    {
      id: 4,
      title: 'Respiración Diafragmática',
      description: 'Activa el sistema nervioso parasimpático para reducir el estrés y el cortisol.',
      icon: 'air',
      color: 'text-teal-500',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20',
      content: 'Practica la respiración 4-7-8 (inhala 4s, sostén 7s, exhala 8s) post-entrenamiento. Esto ayuda a cambiar tu cuerpo del estado de "lucha o huida" (simpático) al estado de "descanso y digestión" (parasimpático), acelerando el inicio de la recuperación.'
    }
  ];

  return (
    <div className="w-full max-w-[1100px] flex flex-col gap-8">
      <div className="flex flex-col gap-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
          <span className="material-symbols-outlined text-primary text-sm">science</span>
          <span className="text-primary text-xs font-bold uppercase tracking-wider">
            Optimización Avanzada
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
          Bio-Hacks
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
          Técnicas respaldadas por la ciencia para llevar tu recuperación, enfoque y rendimiento al siguiente nivel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {hacks.map((hack) => (
          <div key={hack.id} className="bg-card-dark border border-border-dark rounded-2xl p-6 hover:border-primary/50 transition-colors group">
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-xl ${hack.bg} ${hack.border} border shrink-0`}>
                <span className={`material-symbols-outlined text-3xl ${hack.color}`}>
                  {hack.icon}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{hack.title}</h3>
                <p className="text-slate-400 text-sm">{hack.description}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border-dark">
              <p className="text-slate-300 text-sm leading-relaxed">
                {hack.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
