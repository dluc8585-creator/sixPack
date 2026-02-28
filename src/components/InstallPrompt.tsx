import { useState, useEffect } from 'react';

// Interfaz para el evento de instalación de PWA (BeforeInstallPromptEvent)
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed',
        platform: string
    }>;
    prompt(): Promise<void>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detectar si es iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIOSDevice);

        // Detectar si ya está en modo standalone (instalada)
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        const handler = (e: Event) => {
            // Previene el mini-banner automático del navegador
            e.preventDefault();
            // Guardamos el evento para usarlo cuando el usuario haga clic
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Detectar si la app fue instalada exitosamente
        const onAppInstalled = () => {
            setIsInstalled(true);
            setShowBanner(false);
            setDeferredPrompt(null);
        };
        window.addEventListener('appinstalled', onAppInstalled);

        // Para iOS, mostramos el banner manualmente si no está instalada
        if (isIOSDevice && !isStandalone) {
            // Damos un pequeño delay para no molestar de entrada
            const timer = setTimeout(() => setShowBanner(true), 3000);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('beforeinstallprompt', handler);
                window.removeEventListener('appinstalled', onAppInstalled);
            };
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', onAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            // En iOS no podemos disparar el prompt, solo dar instrucciones
            return;
        }

        if (!deferredPrompt) return;

        // Mostramos el diálogo de instalación nativo
        await deferredPrompt.prompt();

        // Esperamos la elección del usuario
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        }

        // Limpiamos el evento
        setDeferredPrompt(null);
        setShowBanner(false);
    };

    const handleDismiss = () => {
        setShowBanner(false);
    };

    // Si ya está instalada, no mostramos nada
    if (isInstalled) return null;

    // Si no es iOS y no hay prompt (ej. desktop que no soporta o ya denegó), no mostramos nada a menos que hayamos forzado el banner
    if (!isIOS && !deferredPrompt && !showBanner) return null;

    // Banner flotante colapsado (botón circular)
    if (!showBanner) {
        return (
            <button
                onClick={() => setShowBanner(true)}
                className="fixed bottom-4 right-4 bg-primary text-black p-3 rounded-full shadow-xl hover:scale-105 transition-transform z-50 flex items-center justify-center group"
                title="Instalar App"
            >
                <span className="material-symbols-outlined">download</span>
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap group-hover:ml-2 font-bold text-sm">
                    {isIOS ? '¿Cómo instalar?' : 'Instalar App'}
                </span>
            </button>
        );
    }

    // Banner expandido
    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-[#181411] border border-primary/30 p-5 rounded-2xl shadow-2xl z-[100] flex flex-col gap-4 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-3xl">
                            {isIOS ? 'ios_share' : 'download'}
                        </span>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-base">Instalar SixPackCreator</h4>
                        <p className="text-[#8c8c88] text-xs leading-relaxed">
                            {isIOS
                                ? 'En iPhone/iPad: Pulsa el botón "Compartir" y luego "Añadir a pantalla de inicio".'
                                : 'Añade la app a tu pantalla de inicio para acceso rápido y modo offline.'}
                        </p>
                    </div>
                </div>
                <button onClick={handleDismiss} className="text-[#8c8c88] hover:text-white transition-colors p-1">
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            </div>

            {!isIOS ? (
                <div className="flex gap-2 mt-1">
                    <button
                        onClick={handleInstallClick}
                        className="flex-1 bg-primary hover:bg-[#ff8f1a] text-black font-bold py-2.5 rounded-lg text-sm transition-colors"
                    >
                        Instalar Ahora
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="px-4 text-[#8c8c88] hover:text-white border border-white/10 rounded-lg text-sm transition-colors"
                    >
                        Más tarde
                    </button>
                </div>
            ) : (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
                        <span className="material-symbols-outlined text-sm text-primary">info</span>
                        <span>Instrucciones para iOS:</span>
                    </div>
                    <ol className="text-xs text-[#8c8c88] space-y-2 list-decimal ml-4">
                        <li>Pulsa el icono <span className="text-primary font-bold">Compartir</span> (flecha hacia arriba)</li>
                        <li>Baja y busca <span className="text-white font-medium">"Añadir a pantalla de inicio"</span></li>
                        <li>¡Listo! Aparecerá como una App más.</li>
                    </ol>
                </div>
            )}
        </div>
    );
}

