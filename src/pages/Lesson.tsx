import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { ArrowLeft, Heart, Zap, CheckCircle2, XCircle, ChevronRight, BookOpen, HelpCircle, Trophy } from 'lucide-react';
import type { Question } from '../lib/data';

type Phase = 'content' | 'quiz' | 'result';

export default function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { paths, currentUser, completeLesson, isLessonCompleted } = useStore();

  const [phase, setPhase] = useState<Phase>('content');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  // Find lesson
  let foundLesson: any = null;
  let foundUnit: any = null;
  for (const path of paths) {
    for (const unit of path.units) {
      for (const lesson of unit.lessons) {
        if (lesson.id === lessonId) {
          foundLesson = lesson;
          foundUnit = unit;
        }
      }
    }
  }

  if (!foundLesson || !currentUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Lesson not found</p>
          <button onClick={() => navigate('/learn')} className="mt-4 text-[#22c55e] font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  const lesson = foundLesson;
  const unit = foundUnit;
  const questions: Question[] = lesson.questions;
  const currentQuestion = questions[currentQ];
  const totalQ = questions.length;
  const progressPct = phase === 'quiz' ? (currentQ / totalQ) * 100 : phase === 'result' ? 100 : 0;
  const alreadyCompleted = isLessonCompleted(lesson.id);

  const handleAnswer = (optionIndex: number) => {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);
    setShowExplanation(true);

    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setCorrect(c => c + 1);
    } else {
      setHearts(h => Math.max(0, h - 1));
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= totalQ || hearts === 0) {
      // End quiz
      const score = Math.round((correct / totalQ) * 100);
      const xp = hearts === 0 ? Math.round(lesson.xpReward * 0.3) : score >= 80 ? lesson.xpReward : Math.round(lesson.xpReward * 0.6);
      setXpGained(xp);
      completeLesson(lesson.id, score, xp);
      setPhase('result');
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setAnswered(false);
      setShowExplanation(false);
    }
  };

  const finalScore = Math.round((correct / totalQ) * 100);
  const passed = finalScore >= 60 && hearts > 0;

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h3 key={i} className="text-white font-black text-lg mt-4 mb-1">{line.replace(/\*\*/g, '')}</h3>;
      }
      if (line.startsWith('- **')) {
        const parts = line.replace('- **', '').split('**');
        return <p key={i} className="text-gray-300 text-sm py-0.5 flex gap-2"><span className="text-[#22c55e] mt-0.5">▸</span><span><strong className="text-white">{parts[0]}</strong>{parts[1]}</span></p>;
      }
      if (line.startsWith('- ')) {
        return <p key={i} className="text-gray-300 text-sm py-0.5 flex gap-2"><span className="text-[#22c55e] mt-0.5">▸</span><span>{line.slice(2)}</span></p>;
      }
      if (line.match(/^\d+\./)) {
        const num = line.match(/^(\d+\.)/)?.[1];
        const rest = line.replace(/^\d+\.\s*/, '');
        const parts = rest.split('**');
        return (
          <p key={i} className="text-gray-300 text-sm py-0.5 flex gap-2">
            <span className="text-[#22c55e] font-bold min-w-[20px]">{num}</span>
            <span>{parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white">{p}</strong> : p)}</span>
          </p>
        );
      }
      if (line.startsWith('> ')) {
        return <blockquote key={i} className="border-l-2 border-[#22c55e] pl-3 my-2 text-gray-300 text-sm italic">{line.slice(2)}</blockquote>;
      }
      if (line === '') return <div key={i} className="h-2" />;
      const parts = line.split('**');
      return (
        <p key={i} className="text-gray-300 text-sm leading-relaxed">
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white">{p}</strong> : p)}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/95 backdrop-blur border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate('/learn')} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition">
            <ArrowLeft size={20} />
          </button>

          {/* Progress bar */}
          <div className="flex-1 h-3 bg-[#1a1a24] rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${unit.color}, ${unit.accentColor})` }}
            />
          </div>

          {phase === 'quiz' && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart key={i} size={18} className={i < hearts ? 'text-red-400 fill-red-400' : 'text-gray-700 fill-gray-700'} />
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          {/* CONTENT PHASE */}
          {phase === 'content' && (
            <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${unit.color}, ${unit.accentColor})` }}
                >
                  {lesson.icon}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: unit.color }}>{unit.title}</div>
                  <h1 className="text-2xl font-black text-white">{lesson.title}</h1>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Zap size={14} className="text-yellow-400" />
                  <span>{lesson.xpReward} XP reward</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <BookOpen size={14} className="text-blue-400" />
                  <span>~{lesson.estimatedMinutes} min</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <HelpCircle size={14} className="text-purple-400" />
                  <span>{totalQ} questions</span>
                </div>
                {alreadyCompleted && (
                  <div className="flex items-center gap-1.5 text-xs text-[#22c55e]">
                    <CheckCircle2 size={14} />
                    <span>Completed</span>
                  </div>
                )}
              </div>

              <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 mb-6 space-y-1">
                {renderContent(lesson.content)}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPhase('quiz')}
                className="w-full font-black py-4 rounded-2xl text-black text-lg shadow-lg flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${unit.color}, ${unit.accentColor})`, boxShadow: `0 8px 24px ${unit.color}40` }}
              >
                Start Quiz <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          )}

          {/* QUIZ PHASE */}
          {phase === 'quiz' && currentQuestion && (
            <motion.div key={`quiz-${currentQ}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: unit.color }}>Question {currentQ + 1} of {totalQ}</span>
              </div>

              <h2 className="text-xl font-black text-white mb-6 leading-snug">{currentQuestion.question}</h2>

              <div className="space-y-3 mb-6">
                {currentQuestion.options?.map((option, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === currentQuestion.correctAnswer;
                  let style = 'bg-[#12121a] border-white/10 text-gray-200 hover:border-white/30';
                  if (answered) {
                    if (isCorrect) style = 'bg-green-500/20 border-green-500 text-green-300';
                    else if (isSelected && !isCorrect) style = 'bg-red-500/20 border-red-500 text-red-300';
                    else style = 'bg-[#12121a] border-white/5 text-gray-500';
                  } else if (isSelected) {
                    style = 'border-white/40 text-white';
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={!answered ? { scale: 1.01 } : {}}
                      whileTap={!answered ? { scale: 0.99 } : {}}
                      onClick={() => handleAnswer(i)}
                      disabled={answered}
                      className={`w-full border-2 rounded-xl px-5 py-4 text-left font-medium transition-all flex items-center justify-between ${style}`}
                    >
                      <span>{option}</span>
                      {answered && isCorrect && <CheckCircle2 size={20} className="text-green-400 flex-shrink-0" />}
                      {answered && isSelected && !isCorrect && <XCircle size={20} className="text-red-400 flex-shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-4 mb-5 border ${
                      selected === currentQuestion.correctAnswer
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {selected === currentQuestion.correctAnswer
                        ? <CheckCircle2 size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                        : <XCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />}
                      <div>
                        <p className={`font-bold text-sm mb-1 ${selected === currentQuestion.correctAnswer ? 'text-green-300' : 'text-red-300'}`}>
                          {selected === currentQuestion.correctAnswer ? 'Correct! 🎉' : 'Not quite!'}
                        </p>
                        <p className="text-gray-300 text-sm">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {answered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full font-black py-4 rounded-2xl text-black text-lg shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${unit.color}, ${unit.accentColor})` }}
                >
                  {currentQ + 1 >= totalQ || hearts === 0 ? 'See Results' : 'Next Question'} →
                </motion.button>
              )}
            </motion.div>
          )}

          {/* RESULT PHASE */}
          {phase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                className="text-7xl mb-6"
              >
                {passed ? '🎉' : '💪'}
              </motion.div>

              <h2 className="text-3xl font-black text-white mb-2">
                {passed ? 'Lesson Complete!' : 'Keep Practicing!'}
              </h2>
              <p className="text-gray-400 mb-8">
                {passed ? 'Amazing work! You\'ve mastered this lesson.' : 'You can do it! Try again to improve your score.'}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#12121a] border border-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-black text-[#22c55e]">{finalScore}%</div>
                  <div className="text-xs text-gray-500 mt-1">Score</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#12121a] border border-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-black text-yellow-400 flex items-center justify-center gap-1">
                    <Zap size={24} />{xpGained}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">XP Earned</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#12121a] border border-white/10 rounded-2xl p-4">
                  <div className="text-3xl font-black text-red-400 flex items-center justify-center gap-1">
                    {hearts}<Heart size={22} className="fill-red-400" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Hearts Left</div>
                </motion.div>
              </div>

              {passed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-2 justify-center">
                    <Trophy size={18} className="text-yellow-400" />
                    <p className="text-[#22c55e] font-bold text-sm">Next lesson unlocked!</p>
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3">
                {!passed && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setPhase('content'); setCurrentQ(0); setSelected(null); setAnswered(false); setHearts(3); setCorrect(0); setShowExplanation(false); }}
                    className="flex-1 bg-[#1a1a24] border border-white/10 text-white font-black py-4 rounded-2xl"
                  >
                    Try Again
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/learn')}
                  className="flex-1 font-black py-4 rounded-2xl text-black shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${unit.color}, ${unit.accentColor})` }}
                >
                  Continue Path
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
