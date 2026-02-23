import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Gem, Heart, Zap, Star, BookOpen, Target, LogOut, Shield } from 'lucide-react';

export default function Profile() {
  const { currentUser, paths, isLessonCompleted, getLessonProgress, logout } = useStore();
  const navigate = useNavigate();

  if (!currentUser) { navigate('/'); return null; }

  const path = paths[0];
  const allLessons = path?.units.flatMap(u => u.lessons.map(l => ({ lesson: l, unit: u }))) ?? [];
  const completedLessons = allLessons.filter(({ lesson }) => isLessonCompleted(lesson.id));
  const completionPct = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0;

  const level = Math.floor(currentUser.totalXP / 200) + 1;
  const xpInLevel = currentUser.totalXP % 200;
  const xpToNext = 200;

  const achievements = [
    { id: 'first', icon: '🎯', title: 'First Steps', desc: 'Complete your first lesson', earned: completedLessons.length >= 1 },
    { id: 'five', icon: '⭐', title: 'On a Roll', desc: 'Complete 5 lessons', earned: completedLessons.length >= 5 },
    { id: 'streak3', icon: '🔥', title: 'On Fire', desc: 'Maintain a 3-day streak', earned: currentUser.streak >= 3 },
    { id: 'streak7', icon: '🌟', title: 'Week Warrior', desc: 'Maintain a 7-day streak', earned: currentUser.streak >= 7 },
    { id: 'xp500', icon: '💎', title: 'XP Hunter', desc: 'Earn 500 total XP', earned: currentUser.totalXP >= 500 },
    { id: 'perfect', icon: '🏆', title: 'Perfectionist', desc: 'Score 100% on any lesson', earned: completedLessons.some(({ lesson }) => (getLessonProgress(lesson.id)?.score ?? 0) >= 100) },
    { id: 'unit1', icon: '🧠', title: 'AI Basics', desc: 'Complete Unit 1', earned: path?.units[0]?.lessons.every(l => isLessonCompleted(l.id)) ?? false },
    { id: 'halfway', icon: '🚀', title: 'Halfway There', desc: 'Complete 50% of the path', earned: completionPct >= 50 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/95 backdrop-blur border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate('/learn')} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-black text-lg flex-1">Profile</h1>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-bold px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pb-20 py-6 space-y-6">
        {/* Hero Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#12121a] to-[#1a1a24] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#3b82f6] flex items-center justify-center text-3xl font-black text-black shadow-lg">
                {currentUser.username[0].toUpperCase()}
              </div>
              {currentUser.isAdmin && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Shield size={14} className="text-black" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white">{currentUser.username}</h2>
                {currentUser.isAdmin && <span className="text-xs bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded-full font-bold">ADMIN</span>}
              </div>
              <p className="text-gray-400 text-sm">{currentUser.email}</p>
              <p className="text-gray-500 text-xs mt-1">Member since {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Level */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[#22c55e]">Level {level}</span>
              <span className="text-xs text-gray-500">{xpInLevel} / {xpToNext} XP</span>
            </div>
            <div className="h-3 bg-[#1a1a24] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(xpInLevel / xpToNext) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#22c55e] to-[#3b82f6] rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-white font-black mb-3">Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Zap size={20} className="text-yellow-400" />, value: currentUser.totalXP, label: 'Total XP', color: 'text-yellow-400' },
              { icon: <Flame size={20} className="text-orange-400" />, value: currentUser.streak, label: 'Day Streak', color: 'text-orange-400' },
              { icon: <BookOpen size={20} className="text-blue-400" />, value: completedLessons.length, label: 'Lessons Done', color: 'text-blue-400' },
              { icon: <Target size={20} className="text-purple-400" />, value: `${completionPct}%`, label: 'Path Progress', color: 'text-purple-400' },
              { icon: <Gem size={20} className="text-cyan-400" />, value: currentUser.gems, label: 'Gems', color: 'text-cyan-400' },
              { icon: <Heart size={20} className="text-red-400" />, value: currentUser.hearts, label: 'Hearts', color: 'text-red-400' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-[#12121a] border border-white/10 rounded-xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-[#1a1a24] rounded-lg flex items-center justify-center">{stat.icon}</div>
                <div>
                  <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-black">Achievements</h3>
            <span className="text-xs text-gray-500">{achievements.filter(a => a.earned).length}/{achievements.length} earned</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((ach, i) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className={`border rounded-xl p-4 flex items-center gap-3 transition-all ${
                  ach.earned
                    ? 'bg-[#12121a] border-[#22c55e]/30 shadow-sm shadow-green-500/10'
                    : 'bg-[#0d0d14] border-white/5 opacity-50'
                }`}
              >
                <div className={`text-2xl ${!ach.earned && 'grayscale'}`}>{ach.icon}</div>
                <div>
                  <p className={`font-bold text-sm ${ach.earned ? 'text-white' : 'text-gray-600'}`}>{ach.title}</p>
                  <p className="text-xs text-gray-500">{ach.desc}</p>
                </div>
                {ach.earned && <Star size={14} className="text-yellow-400 fill-yellow-400 ml-auto flex-shrink-0" />}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Lessons */}
        {completedLessons.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-white font-black mb-3">Completed Lessons</h3>
            <div className="space-y-2">
              {completedLessons.map(({ lesson, unit }, i) => {
                const prog = getLessonProgress(lesson.id);
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    className="bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${unit.color}40, ${unit.accentColor}20)` }}
                    >
                      {lesson.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{lesson.title}</p>
                      <p className="text-gray-500 text-xs">{unit.title}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-black" style={{ color: unit.color }}>{prog?.score ?? 0}%</div>
                      <div className="text-xs text-gray-600">+{prog?.xpEarned ?? 0} XP</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
