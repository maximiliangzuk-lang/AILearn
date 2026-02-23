import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, Star, Flame, Gem, Heart, Trophy, Settings, ChevronRight, Zap } from 'lucide-react';

const UNLOCK_COST = 50; // gems to skip

export default function LearningPath() {
  const { currentUser, paths, isLessonUnlocked, isLessonCompleted, getLessonProgress, spendGems, unlockLesson } = useStore();
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [unlockModal, setUnlockModal] = useState<{ lessonId: string; title: string } | null>(null);
  const [unlockResult, setUnlockResult] = useState<'success' | 'fail' | null>(null);

  if (!currentUser) { navigate('/'); return null; }

  const path = paths[0];
  if (!path) return null;

  // Flatten all lessons with unit info for the snake path
  const allLessons = path.units.flatMap(unit =>
    unit.lessons.map(lesson => ({ lesson, unit }))
  );

  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter(({ lesson }) => isLessonCompleted(lesson.id)).length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleLessonClick = (lessonId: string, lessonTitle: string) => {
    if (isLessonUnlocked(lessonId)) {
      navigate(`/lesson/${lessonId}`);
    } else {
      setUnlockModal({ lessonId, title: lessonTitle });
    }
  };

  const handleUnlock = () => {
    if (!unlockModal) return;
    const success = spendGems(UNLOCK_COST);
    if (success) {
      unlockLesson(unlockModal.lessonId);
      setUnlockResult('success');
      setTimeout(() => { setUnlockModal(null); setUnlockResult(null); }, 1500);
    } else {
      setUnlockResult('fail');
      setTimeout(() => setUnlockResult(null), 2000);
    }
  };

  // Build snake path positions
  const getPosition = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const isEvenRow = row % 2 === 0;
    const x = isEvenRow ? col : 2 - col;
    return { x, row };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/95 backdrop-blur border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center">
              <img src="/mascot.png" alt="" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-black text-white text-lg">AI<span className="text-[#22c55e]">Learn</span></span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#1a1a24] px-3 py-1.5 rounded-full">
              <Flame size={16} className="text-orange-400" />
              <span className="text-white font-bold text-sm">{currentUser.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1a1a24] px-3 py-1.5 rounded-full">
              <Gem size={16} className="text-cyan-400" />
              <span className="text-white font-bold text-sm">{currentUser.gems}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1a1a24] px-3 py-1.5 rounded-full">
              <Heart size={16} className="text-red-400" />
              <span className="text-white font-bold text-sm">{currentUser.hearts}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {currentUser.isAdmin && (
              <button onClick={() => navigate('/admin')} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition">
                <Settings size={18} />
              </button>
            )}
            <button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22c55e] to-[#3b82f6] flex items-center justify-center text-black font-black text-sm">
              {currentUser.username[0].toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pb-20">
        {/* Path Header */}
        <div className="py-6">
          <div className="bg-gradient-to-r from-[#22c55e]/10 to-[#3b82f6]/10 border border-white/10 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-black text-white">{path.title}</h2>
                <p className="text-gray-400 text-sm mt-0.5">{path.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-[#22c55e]">{progressPct}%</div>
                <div className="text-xs text-gray-500">{completedCount}/{totalLessons} done</div>
              </div>
            </div>
            <div className="h-2 bg-[#1a1a24] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#22c55e] to-[#3b82f6] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Units & Lessons Snake Path */}
        <div className="space-y-8">
          {path.units.map((unit, unitIndex) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: unitIndex * 0.1 }}
            >
              {/* Unit Header */}
              <div
                className="relative rounded-2xl p-4 mb-6 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${unit.color}20, ${unit.accentColor}10)`, border: `1px solid ${unit.color}30` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${unit.color}, ${unit.accentColor})` }}
                  >
                    {unit.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: unit.color }}>Unit {unitIndex + 1}</div>
                    <h3 className="font-black text-white text-lg leading-tight">{unit.title}</h3>
                    <p className="text-gray-400 text-xs">{unit.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: unit.color }}>
                      {unit.lessons.filter(l => isLessonCompleted(l.id)).length}/{unit.lessons.length}
                    </div>
                    <div className="text-xs text-gray-500">lessons</div>
                  </div>
                </div>
              </div>

              {/* Lessons Snake Layout */}
              <div className="relative">
                {/* Connecting line */}
                {unit.lessons.length > 1 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {unit.lessons.map((_, i) => {
                      if (i === unit.lessons.length - 1) return null;
                      const pos1 = getPosition(i);
                      const pos2 = getPosition(i + 1);
                      const x1 = (pos1.x / 2) * 100 + 16.67;
                      const x2 = (pos2.x / 2) * 100 + 16.67;
                      const y1 = pos1.row * 88 + 44;
                      const y2 = pos2.row * 88 + 44;
                      return (
                        <svg key={i} className="absolute inset-0 w-full" style={{ height: unit.lessons.length * 88 }} viewBox={`0 0 100 ${unit.lessons.length * 88}`} preserveAspectRatio="none">
                          <line x1={`${x1}%`} y1={y1} x2={`${x2}%`} y2={y2} stroke={`${unit.color}30`} strokeWidth="2" strokeDasharray="4 4" />
                        </svg>
                      );
                    })}
                  </div>
                )}

                <div
                  className="grid grid-cols-3 gap-y-6"
                  style={{ minHeight: Math.ceil(unit.lessons.length / 3) * 88 }}
                >
                  {unit.lessons.map((lesson, lessonIndex) => {
                    const pos = getPosition(lessonIndex);
                    const isEvenRow = pos.row % 2 === 0;
                    const unlocked = isLessonUnlocked(lesson.id);
                    const completed = isLessonCompleted(lesson.id);
                    const lessonProg = getLessonProgress(lesson.id);
                    const isActive = unlocked && !completed;

                    // Position in grid: snake pattern
                    const gridCol = isEvenRow ? pos.x + 1 : 3 - pos.x;

                    return (
                      <motion.div
                        key={lesson.id}
                        style={{ gridColumn: gridCol }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: unitIndex * 0.1 + lessonIndex * 0.05, type: 'spring', stiffness: 300 }}
                        className="flex flex-col items-center"
                      >
                        <div className="relative">
                          {/* Active pulse */}
                          {isActive && (
                            <motion.div
                              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute inset-0 rounded-2xl"
                              style={{ background: unit.color, filter: 'blur(8px)' }}
                            />
                          )}

                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handleLessonClick(lesson.id, lesson.title)}
                            onMouseEnter={() => setTooltip(lesson.id)}
                            onMouseLeave={() => setTooltip(null)}
                            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-all ${
                              completed
                                ? 'bg-gradient-to-br from-[#22c55e] to-[#16a34a] shadow-green-500/30'
                                : isActive
                                ? `shadow-lg`
                                : 'bg-[#1a1a24] border-2 border-white/10'
                            }`}
                            style={isActive ? { background: `linear-gradient(135deg, ${unit.color}, ${unit.accentColor})`, boxShadow: `0 8px 24px ${unit.color}40` } : {}}
                          >
                            {completed ? (
                              <CheckCircle2 size={28} className="text-white" />
                            ) : unlocked ? (
                              <span>{lesson.icon}</span>
                            ) : (
                              <Lock size={22} className="text-gray-600" />
                            )}

                            {/* Score badge */}
                            {completed && lessonProg && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Star size={10} className="text-black fill-black" />
                              </div>
                            )}
                          </motion.button>
                        </div>

                        {/* Tooltip */}
                        <AnimatePresence>
                          {tooltip === lesson.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute z-20 mt-1 bg-[#1a1a24] border border-white/10 rounded-xl p-3 shadow-xl w-44 pointer-events-none"
                              style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
                            >
                              <p className="text-white font-bold text-xs">{lesson.title}</p>
                              <p className="text-gray-400 text-xs mt-0.5">{lesson.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-yellow-400 flex items-center gap-1"><Zap size={10} /> {lesson.xpReward} XP</span>
                                <span className="text-xs text-gray-500">{lesson.estimatedMinutes}min</span>
                              </div>
                              {!unlocked && !currentUser.isAdmin && (
                                <div className="mt-1.5 flex items-center gap-1 text-xs text-cyan-400">
                                  <Gem size={10} /> Skip for {UNLOCK_COST} gems
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <p className="text-xs text-gray-400 text-center mt-2 max-w-[70px] leading-tight font-medium">{lesson.title}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom XP display */}
        <div className="mt-10 bg-[#12121a] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-yellow-400" />
              <span className="text-white font-bold">Your Progress</span>
            </div>
            <button onClick={() => navigate('/profile')} className="text-[#22c55e] text-sm font-bold flex items-center gap-1">
              View Profile <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1a1a24] rounded-xl p-3 text-center">
              <div className="text-xl font-black text-[#22c55e]">{currentUser.totalXP}</div>
              <div className="text-xs text-gray-500">Total XP</div>
            </div>
            <div className="bg-[#1a1a24] rounded-xl p-3 text-center">
              <div className="text-xl font-black text-orange-400">{currentUser.streak}</div>
              <div className="text-xs text-gray-500">Day Streak</div>
            </div>
            <div className="bg-[#1a1a24] rounded-xl p-3 text-center">
              <div className="text-xl font-black text-purple-400">{completedCount}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Unlock Modal */}
      <AnimatePresence>
        {unlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setUnlockModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#12121a] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              {unlockResult === 'success' ? (
                <div className="text-center py-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-5xl mb-3">🎉</motion.div>
                  <p className="text-white font-black text-lg">Lesson Unlocked!</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-5">
                    <div className="w-16 h-16 bg-[#1a1a24] rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Lock size={28} className="text-gray-400" />
                    </div>
                    <h3 className="text-white font-black text-lg">Lesson Locked</h3>
                    <p className="text-gray-400 text-sm mt-1">"{unlockModal.title}"</p>
                    <p className="text-gray-500 text-sm mt-2">Complete the previous lesson to unlock, or spend gems to skip.</p>
                  </div>

                  {unlockResult === 'fail' && (
                    <p className="text-red-400 text-sm text-center mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      Not enough gems! You need {UNLOCK_COST} gems.
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setUnlockModal(null)} className="flex-1 bg-[#1a1a24] text-gray-300 font-bold py-3 rounded-xl hover:bg-white/10 transition">
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUnlock}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black py-3 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                    >
                      <Gem size={16} /> {UNLOCK_COST} Gems
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
