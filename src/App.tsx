import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, RotateCcw, ChevronRight } from 'lucide-react';

interface RoleData {
  name: string;
  color: string;
  bgColor: string;
  emoji: string;
}

const roles: RoleData[] = [
  { name: 'Zippy', color: 'text-purple-400', bgColor: 'bg-purple-900/20 border-purple-500/30', emoji: '' },
  { name: 'Bloop', color: 'text-blue-400', bgColor: 'bg-blue-900/20 border-blue-500/30', emoji: '' },
  { name: 'Blu', color: 'text-cyan-400', bgColor: 'bg-cyan-900/20 border-cyan-500/30', emoji: '' },
  { name: 'Wava', color: 'text-emerald-400', bgColor: 'bg-emerald-900/20 border-emerald-500/30', emoji: '' },
  { name: 'Echo', color: 'text-orange-400', bgColor: 'bg-orange-900/20 border-orange-500/30', emoji: '' }
];

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Menghitung index role berdasarkan hari
  // Role rotation: Zippy → Bloop → Blu → Wava → Echo → (repeat)
  const getRoleForDate = (date: Date): RoleData => {
    // Konversi ke WIB timezone untuk konsistensi
    const wibOffset = 7 * 60; // WIB is UTC+7
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const wibTime = new Date(utc + (wibOffset * 60000));
    
    // Ambil tanggal dalam format YYYY-MM-DD untuk WIB
    const year = wibTime.getFullYear();
    const month = wibTime.getMonth();
    const day = wibTime.getDate();
    
    // Buat date object untuk midnight WIB
    const wibDate = new Date(year, month, day);
    
    // Reference: 22 Agustus 2025 = Blu (index 2)
    const referenceDate = new Date(2025, 7, 22); // Month is 0-indexed, so 7 = August
    const bluIndex = 2;
    
    // Hitung selisih hari
    const timeDiff = wibDate.getTime() - referenceDate.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Hitung index role
    let roleIndex = (bluIndex + dayDiff) % roles.length;
    if (roleIndex < 0) {
      roleIndex += roles.length;
    }
    
    return roles[roleIndex];
  };

  const getCurrentRole = (): RoleData => {
    // Gunakan waktu WIB untuk menentukan role hari ini
    const now = new Date();
    return getRoleForDate(now);
  };

  const getUpcomingRoles = (days: number = 7): Array<{date: Date, role: RoleData}> => {
    const upcoming = [];
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      upcoming.push({
        date,
        role: getRoleForDate(date)
      });
    }
    return upcoming;
  };

  const getPreviousRoles = (days: number = 3): Array<{date: Date, role: RoleData}> => {
    const previous = [];
    for (let i = days; i >= 1; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      previous.push({
        date,
        role: getRoleForDate(date)
      });
    }
    return previous;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatShortDate = (date: Date): string => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const currentRole = getCurrentRole();
  const upcomingRoles = getUpcomingRoles();
  const previousRoles = getPreviousRoles();

  // Animated background particles
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 via-black to-cyan-950 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle}
            className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-full blur-2xl animate-pulse"></div>
            <img 
              src="https://gy5o3gfa7n2ynprvvvvu2d22jnydfs7gt4exvmmgvjjiqx72hthq.arweave.net/NjrtmKD7dYa-Na1rTQ9aS3Ayy-afCXqxhqpSiF_6PM8" 
              alt="Soundness.xyz Logo" 
              className="w-20 h-20 rounded-xl relative z-10 shadow-2xl shadow-purple-500/50 ring-2 ring-purple-400/50 hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 font-serif">
            Soundness.xyz
          </h1>
          <p className="text-gray-300 text-xl font-serif bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">Role Rotation Monitor</p>
          <div className="flex items-center justify-center mt-4 text-gray-400 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-600/50">
            <Clock className="w-4 h-4 mr-2" />
            <span className="font-mono">{currentTime.toLocaleTimeString('id-ID')}</span>
          </div>
        </div>

        {/* Current Role - Hero Section */}
        <div className={`${currentRole.bgColor} rounded-3xl p-8 mb-12 shadow-2xl shadow-purple-500/30 border backdrop-blur-sm ring-2 ring-purple-400/50 relative overflow-hidden transition-all duration-1000 hover:scale-[1.02] hover:shadow-3xl hover:shadow-purple-500/40 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 animate-pulse"></div>
          
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce" style={{ animationDuration: '3s' }}>{currentRole.emoji}</div>
            <h2 className="text-3xl font-semibold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">Role Hari Ini</h2>
            <div className={`text-7xl font-bold ${currentRole.color} mb-6 drop-shadow-2xl animate-pulse`}>
              {currentRole.name}
            </div>
            <p className="text-gray-300 text-xl font-medium">
              {formatDate(new Date())}
            </p>
            <div className="mt-8 flex items-center justify-center">
              <div className="bg-gradient-to-r from-black/50 to-gray-900/50 backdrop-blur-sm rounded-full px-8 py-3 flex items-center border border-gray-600/50 shadow-xl shadow-cyan-500/30 ring-2 ring-cyan-400/30 hover:ring-cyan-300/50 transition-all duration-300">
                <RotateCcw className="w-5 h-5 mr-3 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-gray-200 font-semibold">Reset otomatis setiap hari jam 00:00 WIB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Previous Roles */}
          <div className={`bg-gradient-to-br from-gray-900/70 to-indigo-900/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-indigo-500/30 p-6 border border-gray-700/50 ring-2 ring-indigo-400/40 transition-all duration-1000 hover:shadow-indigo-500/50 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-indigo-400 mr-3" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Riwayat Role</h3>
            </div>
            <div className="space-y-3">
              {previousRoles.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-gray-800/60 to-gray-700/40 border border-gray-600/50 hover:from-gray-700/70 hover:to-gray-600/50 transition-all duration-300 shadow-lg shadow-gray-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:ring-2 hover:ring-blue-400/40 hover:scale-[1.02] group">
                  <div className="flex items-center">
                    <span className="text-3xl mr-4 group-hover:scale-110 transition-transform duration-300">{item.role.emoji}</span>
                    <div>
                      <div className={`font-bold text-lg ${item.role.color} drop-shadow-lg`}>
                        {item.role.name}
                      </div>
                      <div className="text-sm text-gray-400 font-medium">
                        {formatShortDate(item.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-500 group-hover:text-blue-400 transition-colors duration-300">
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Roles */}
          <div className={`bg-gradient-to-br from-gray-900/70 to-emerald-900/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-emerald-500/30 p-6 border border-gray-700/50 ring-2 ring-emerald-400/40 transition-all duration-1000 hover:shadow-emerald-500/50 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-emerald-400 mr-3" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Jadwal Mendatang</h3>
            </div>
            <div className="space-y-3">
              {upcomingRoles.map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-5 rounded-xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:shadow-cyan-500/40 hover:ring-2 hover:ring-cyan-400/50 ${item.role.bgColor} backdrop-blur-sm shadow-lg shadow-gray-500/20 group`}>
                  <div className="flex items-center">
                    <span className="text-3xl mr-4 group-hover:scale-110 transition-transform duration-300">{item.role.emoji}</span>
                    <div>
                      <div className={`font-bold text-lg ${item.role.color} drop-shadow-lg`}>
                        {item.role.name}
                      </div>
                      <div className="text-sm text-gray-400 font-medium">
                        {formatShortDate(item.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-500">
                    {index === 0 && (
                      <span className="text-xs bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-300 px-3 py-1 rounded-full font-bold border border-yellow-400/50 shadow-lg shadow-yellow-500/30 animate-pulse">
                        Besok
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Role Legend */}
        <div className={`mt-12 bg-gradient-to-br from-gray-900/70 to-orange-900/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-orange-500/30 p-8 border border-gray-700/50 ring-2 ring-orange-400/40 transition-all duration-1000 hover:shadow-orange-500/50 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent mb-8 text-center">Semua Role</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {roles.map((role, index) => (
              <div key={index} className={`${role.bgColor} rounded-xl p-6 text-center border backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/40 hover:ring-2 hover:ring-purple-400/50 shadow-lg shadow-gray-500/20 group cursor-pointer`}>
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{role.emoji}</div>
                <div className={`font-bold text-lg ${role.color} drop-shadow-lg`}>{role.name}</div>
                <div className="text-xs text-gray-400 mt-2 font-medium">Role {index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center mt-12 text-gray-400 space-y-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          <p className="text-lg font-medium bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
            Role rotation: <span className="text-purple-400">Zippy</span> → <span className="text-blue-400">Bloop</span> → <span className="text-cyan-400">Blu</span> → <span className="text-emerald-400">Wava</span> → <span className="text-orange-400">Echo</span> → (repeat)
          </p>
          
          {/* Build by and Social Links */}
          <div className="mt-8 space-y-6">
            <p className="text-lg">
              Build by <span className="font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">XBerry</span>
            </p>
              
            <div className="flex items-center justify-center space-x-8">
                <a 
                  href="https://github.com/dlzvy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-all duration-300 hover:scale-125 transform bg-gray-800/50 px-4 py-2 rounded-full border border-gray-600/50 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/30"
                >
                  
                  <span className="text-sm font-bold">GitHub</span>
                </a>
                
                <a 
                  href="https://x.com/XBerryAO" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-125 transform bg-gray-800/50 px-4 py-2 rounded-full border border-gray-600/50 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  
                  <span className="text-sm font-bold">X</span>
                </a>
                
                <a 
                  href="https://t.me/dlzvy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-125 transform bg-gray-800/50 px-4 py-2 rounded-full border border-gray-600/50 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/30"
                >
                  
                  <span className="text-sm font-bold">Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default App;