import { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  color: string;
  bg: string;
}

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userProfile: { name: string; avatar: string };
  setUserProfile: (profile: { name: string; avatar: string }) => void;
  notifications: Notification[];
}

export default function Navbar({ currentView, setCurrentView, userProfile, setUserProfile, notifications }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editAvatar, setEditAvatar] = useState(userProfile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = () => {
    setUserProfile({ name: editName, avatar: editAvatar });
    setShowProfile(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const navLinks = [
    { id: 'masterPlan', label: 'Plan Maestro' },
    { id: 'weekDetail', label: 'Desafíos' },
    { id: 'customRoutines', label: 'Rutinas Personalizadas' },
    { id: 'bioHacks', label: 'Bio-Hacks' },
    { id: 'progress', label: 'Progreso' }
  ];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-surface-border px-4 md:px-10 py-4 bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
      <div
        className="flex items-center gap-4 text-white cursor-pointer"
        onClick={() => setCurrentView("masterPlan")}
      >
        <div className="size-8 text-primary">
          <span className="material-symbols-outlined text-3xl">
            fitness_center
          </span>
        </div>
        <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">
          SixPackCreator
        </h2>
      </div>
      <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map(link => (
            <a
              key={link.id}
              className={`font-medium leading-normal transition-colors ${currentView === link.id ? "text-primary font-bold border-b-2 border-primary pb-0.5" : "text-slate-300 hover:text-white"}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentView(link.id);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4 relative">
          <button
            className="text-white relative hover:text-primary transition-colors"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
              setShowMobileMenu(false);
            }}
          >
            <span className="material-symbols-outlined">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 size-2 bg-primary rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-12 right-0 md:right-12 w-[300px] md:w-80 bg-card-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-border-dark flex justify-between items-center bg-background-dark">
                <h3 className="text-white font-bold">Notificaciones</h3>
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">{notifications.length} Nuevas</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-4 border-b border-border-dark hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                    <div className={`size-8 rounded-full ${notif.bg} flex items-center justify-center shrink-0`}>
                      <span className={`material-symbols-outlined ${notif.color} text-sm`}>{notif.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium mb-1">{notif.title}</p>
                      <p className="text-xs text-slate-400 whitespace-normal">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-2">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-8 md:size-10 border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors"
            style={{
              backgroundImage: `url("${userProfile.avatar}")`,
            }}
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
              setShowMobileMenu(false);
            }}
          ></div>

          {/* Profile Dropdown/Modal */}
          {showProfile && (
            <div className="absolute top-12 right-0 w-72 bg-card-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden z-50 p-4">
              <h3 className="text-white font-bold mb-4">Mi Perfil</h3>
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div
                    className="size-20 rounded-full bg-cover bg-center border-2 border-primary/50 relative group cursor-pointer"
                    style={{ backgroundImage: `url("${editAvatar}")` }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white">photo_camera</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-2 rounded-lg transition-colors text-sm mt-3"
                >
                  Guardar Cambios
                </button>
                <div className="border-t border-border-dark mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full hover:bg-red-500/10 text-red-500 font-bold py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white hover:text-primary transition-colors ml-2"
            onClick={() => {
              setShowMobileMenu(!showMobileMenu);
              setShowProfile(false);
              setShowNotifications(false);
            }}
          >
            <span className="material-symbols-outlined text-2xl">{showMobileMenu ? 'close' : 'menu'}</span>
          </button>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="absolute top-12 right-0 w-64 bg-card-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden z-50 lg:hidden">
              <nav className="flex flex-col py-2">
                {navLinks.map(link => (
                  <a
                    key={link.id}
                    className={`px-6 py-4 font-medium transition-colors ${currentView === link.id ? "text-primary bg-primary/10 border-l-4 border-primary" : "text-slate-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent"}`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView(link.id);
                      setShowMobileMenu(false);
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
