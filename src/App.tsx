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

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="https://gy5o3gfa7n2ynprvvvvu2d22jnydfs7gt4exvmmgvjjiqx72hthq.arweave.net/NjrtmKD7dYa-Na1rTQ9aS3Ayy-afCXqxhqpSiF_6PM8" 
              alt="Soundness.xyz Logo" 
              className="w-16 h-16 rounded-xl"
            />
          </div>
          <p className="text-gray-400 text-lg font-serif">Role Rotation Monitor</p>
          <div className="flex items-center justify-center mt-4 text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>{currentTime.toLocaleTimeString('id-ID')}</span>
          </div>
        </div>

        {/* Current Role - Hero Section */}
        <div className={`${currentRole.bgColor} rounded-3xl p-8 mb-12 shadow-2xl shadow-purple-500/20 border backdrop-blur-sm ring-1 ring-purple-500/30`}>
          <div className="text-center">
            <div className="text-6xl mb-4">{currentRole.emoji}</div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">Role Hari Ini</h2>
            <div className={`text-6xl font-bold ${currentRole.color} mb-4`}>
              {currentRole.name}
            </div>
            <p className="text-gray-400 text-lg">
              {formatDate(new Date())}
            </p>
            <div className="mt-6 flex items-center justify-center">
              <div className="bg-black/40 backdrop-blur-sm rounded-full px-6 py-2 flex items-center border border-gray-700 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-500/30">
                <RotateCcw className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-300 font-medium">Reset otomatis setiap hari</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Previous Roles */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-2xl shadow-indigo-500/20 p-6 border border-gray-800 ring-1 ring-indigo-500/30">
            <div className="flex items-center mb-6">
              <Calendar className="w-5 h-5 text-gray-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">Riwayat Role</h3>
            </div>
            <div className="space-y-3">
              {previousRoles.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-800/70 transition-all duration-200 shadow-md shadow-gray-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:ring-1 hover:ring-blue-500/30">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{item.role.emoji}</span>
                    <div>
                      <div className={`font-semibold ${item.role.color}`}>
                        {item.role.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatShortDate(item.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-600">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Roles */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-2xl shadow-emerald-500/20 p-6 border border-gray-800 ring-1 ring-emerald-500/30">
            <div className="flex items-center mb-6">
              <Calendar className="w-5 h-5 text-gray-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">Jadwal Mendatang</h3>
            </div>
            <div className="space-y-3">
              {upcomingRoles.map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:shadow-cyan-500/30 hover:ring-1 hover:ring-cyan-500/40 ${item.role.bgColor} backdrop-blur-sm shadow-md shadow-gray-500/10`}>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{item.role.emoji}</span>
                    <div>
                      <div className={`font-semibold ${item.role.color}`}>
                        {item.role.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatShortDate(item.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-500">
                    {index === 0 && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium border border-yellow-500/30">
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
        <div className="mt-12 bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-2xl shadow-orange-500/20 p-6 border border-gray-800 ring-1 ring-orange-500/30">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Semua Role</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {roles.map((role, index) => (
              <div key={index} className={`${role.bgColor} rounded-lg p-4 text-center border backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 hover:ring-1 hover:ring-purple-500/40 shadow-md shadow-gray-500/10`}>
                <div className="text-3xl mb-2">{role.emoji}</div>
                <div className={`font-semibold ${role.color}`}>{role.name}</div>
                <div className="text-xs text-gray-500 mt-1">Role {index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 space-y-4">
          
          <p className="text-sm mt-2">Role rotation: Zippy → Bloop → Blu → Wava → Echo → (repeat)</p>
          
          {/* Build by and Social Links */}
          <div className="mt-6 space-y-4">
            <p className="text-gray-400">
              Build by  <span className="font-semibold text-white">XBerry</span>
            </p>
              
            <div className="flex items-center justify-center space-x-6">
                <a 
                  href="https://github.com/dlzvy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                >
                  
                  <span className="text-sm font-medium">GitHub</span>
                </a>
                
                <a 
                  href="https://x.com/XBerryAO" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                >
                  
                  <span className="text-sm font-medium">X</span>
                </a>
                
                <a 
                  href="https://t.me/dlzvy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                >
                  
                  <span className="text-sm font-medium">Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default App;