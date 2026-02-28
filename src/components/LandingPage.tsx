import { motion, Variants } from 'framer-motion';

interface LandingPageProps {
    onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    const features = [
        {
            icon: 'fitness_center',
            title: 'Plan Maestro',
            description: 'Sigue un programa estructurado diseñado para mutar tu cuerpo en semanas.',
        },
        {
            icon: 'local_fire_department',
            title: 'Desafíos Diarios',
            description: 'Supera tus propios límites cada día con rutinas intensas y retadoras.',
        },
        {
            icon: 'tune',
            title: '100% Personalizable',
            description: 'Adapta los pesos, series y días para que el plan funcione para ti.',
        },
        {
            icon: 'psychology',
            title: 'Bio-Hacks',
            description: 'Secretos de recuperación, nutrición y descanso para maximizar resultados.',
        }
    ];

    return (
        <div className="min-h-screen bg-[#181411] text-white flex flex-col font-sans overflow-x-hidden relative">
            {/* Background decorations */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
            <div className="absolute top-1/4 -right-64 size-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -left-64 size-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="w-full px-6 py-6 md:px-12 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">fitness_center</span>
                    </div>
                    <span className="text-xl font-black tracking-tight">SixPackCreator</span>
                </div>
                <button
                    onClick={onEnterApp}
                    className="text-sm font-bold bg-[#1d1510] border border-[#31251c] px-5 py-2.5 rounded-full hover:bg-white/5 transition-colors"
                >
                    Iniciar Sesión
                </button>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex w-full max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 z-10 flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
                <motion.div
                    className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-wider mb-8">
                        Tu Transformación Comienza Hoy
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6">
                        Forja el Físico que <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ee7b03] to-[#ffaa4a]">Siempre Quisiste</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg md:text-xl text-[#8c8c88] mb-10 max-w-2xl leading-relaxed">
                        La plataforma definitiva para esculpir tu cuerpo. Planes maestros, rutinas guiadas, registro de progreso y todo el conocimiento para mutar de verdad.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button
                            onClick={onEnterApp}
                            className="px-10 py-5 bg-[#ee7b03] hover:bg-[#ff8f1a] text-black font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 text-lg flex items-center justify-center gap-2 group"
                        >
                            Comenzar Ahora
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-5 bg-[#140f0c] hover:bg-[#1d1510] border border-[#31251c] text-white font-bold rounded-2xl transition-all text-lg flex items-center justify-center gap-2"
                        >
                            Ver Más
                        </button>
                    </motion.div>
                </motion.div>
            </main>

            {/* Features Grid */}
            <div id="features" className="w-full bg-[#181411] border-t border-[#31251c] mt-24 py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6 md:px-12">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Todo lo que necesitas</h2>
                        <p className="text-[#8c8c88] text-lg max-w-2xl mx-auto">Un ecosistema completo diseñado específicamente para garantizar resultados e hipertrofia.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-[#140f0c] border border-[#31251c] p-8 rounded-3xl hover:border-primary/50 transition-colors group"
                            >
                                <div className="size-14 rounded-2xl bg-[#1d1510] border border-[#31251c] flex items-center justify-center mb-6 text-[#8c8c88] group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                    <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-[#8c8c88] leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Final CTA */}
            <div className="w-full py-24 relative z-10">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-br from-[#1d1510] to-[#140f0c] border border-primary/30 p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />

                        <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10">¿Estás Listo Para <br />El Siguiente Nivel?</h2>
                        <p className="text-xl text-[#8c8c88] mb-10 max-w-xl mx-auto relative z-10">Únete ahora y accede al master plan que cambiará tu físico para siempre.</p>

                        <button
                            onClick={onEnterApp}
                            className="px-12 py-6 bg-primary hover:bg-[#ff8f1a] text-black font-black rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-xl text-xl relative z-10"
                        >
                            Crear Mi Cuenta Gratis
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full border-t border-[#31251c] py-8 text-center text-[#8c8c88] text-sm relative z-10">
                <p>© {new Date().getFullYear()} SixPackCreator. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}
