import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronRight, BookOpen, Layers, FileText, Save } from 'lucide-react';

type Tab = 'overview' | 'add-unit' | 'add-lesson';

export default function AdminPanel() {
  const { currentUser, paths, addUnit, addLesson } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  // Add Unit Form
  const [unitForm, setUnitForm] = useState({
    title: '', description: '', icon: '📚', color: '#22c55e', accentColor: '#16a34a'
  });

  // Add Lesson Form
  const [lessonForm, setLessonForm] = useState({
    unitId: '',
    title: '', description: '', icon: '📖', xpReward: 30, estimatedMinutes: 8,
    content: '',
    questions: [
      { id: 'q1', type: 'multiple-choice', question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }
    ] as any[]
  });

  if (!currentUser?.isAdmin) { navigate('/learn'); return null; }

  const path = paths[0];

  const handleAddUnit = () => {
    if (!unitForm.title.trim()) return;
    const newUnit = {
      id: `unit-${Date.now()}`,
      ...unitForm,
      lessons: []
    };
    addUnit(path.id, newUnit);
    setSuccess('Unit added successfully!');
    setUnitForm({ title: '', description: '', icon: '📚', color: '#22c55e', accentColor: '#16a34a' });
    setTimeout(() => setSuccess(''), 3000);
    setTab('overview');
  };

  const handleAddLesson = () => {
    if (!lessonForm.title.trim() || !lessonForm.unitId || !lessonForm.content.trim()) return;
    const newLesson = {
      id: `lesson-${Date.now()}`,
      title: lessonForm.title,
      description: lessonForm.description,
      icon: lessonForm.icon,
      xpReward: lessonForm.xpReward,
      estimatedMinutes: lessonForm.estimatedMinutes,
      content: lessonForm.content,
      questions: lessonForm.questions.filter(q => q.question.trim())
    };
    addLesson(path.id, lessonForm.unitId, newLesson);
    setSuccess('Lesson added successfully!');
    setLessonForm({
      unitId: '',
      title: '', description: '', icon: '📖', xpReward: 30, estimatedMinutes: 8,
      content: '',
      questions: [{ id: 'q1', type: 'multiple-choice', question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]
    });
    setTimeout(() => setSuccess(''), 3000);
    setTab('overview');
  };

  const addQuestion = () => {
    setLessonForm(f => ({
      ...f,
      questions: [...f.questions, {
        id: `q${f.questions.length + 1}`,
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }]
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setLessonForm(f => ({
      ...f,
      questions: f.questions.map((q, i) => i === index ? { ...q, [field]: value } : q)
    }));
  };

  const updateQuestionOption = (qIndex: number, optIndex: number, value: string) => {
    setLessonForm(f => ({
      ...f,
      questions: f.questions.map((q, i) => i === qIndex ? { ...q, options: q.options.map((o: string, j: number) => j === optIndex ? value : o) } : q)
    }));
  };

  const removeQuestion = (index: number) => {
    setLessonForm(f => ({ ...f, questions: f.questions.filter((_, i) => i !== index) }));
  };

  const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#f97316', '#ec4899'];
  const ICONS = ['📚', '🤖', '🧠', '💡', '🔬', '⚡', '🎯', '🌐', '🔮', '📊', '🛠️', '🎓', '🚀', '💎', '🔐', '📝'];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/95 backdrop-blur border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate('/learn')} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-black text-lg flex-1">Admin Panel</h1>
          <span className="text-xs bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-2 py-1 rounded-full font-bold">ADMIN</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pb-20 py-6">
        {/* Success Toast */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl px-4 py-3 mb-4 text-sm font-bold">
              ✅ {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([['overview', 'Overview', <Layers size={15} />], ['add-unit', 'Add Unit', <Plus size={15} />], ['add-lesson', 'Add Lesson', <FileText size={15} />]] as const).map(([t, label, icon]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t ? 'bg-[#22c55e] text-black shadow-lg shadow-green-500/20' : 'bg-[#12121a] border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#22c55e]/10 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-[#22c55e]" />
                </div>
                <div>
                  <h2 className="text-white font-black">{path.title}</h2>
                  <p className="text-gray-400 text-sm">{path.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#1a1a24] rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-[#22c55e]">{path.units.length}</div>
                  <div className="text-xs text-gray-500">Units</div>
                </div>
                <div className="bg-[#1a1a24] rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-blue-400">{path.units.reduce((s, u) => s + u.lessons.length, 0)}</div>
                  <div className="text-xs text-gray-500">Lessons</div>
                </div>
                <div className="bg-[#1a1a24] rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-purple-400">{path.units.reduce((s, u) => s + u.lessons.reduce((ls, l) => ls + l.questions.length, 0), 0)}</div>
                  <div className="text-xs text-gray-500">Questions</div>
                </div>
              </div>
            </div>

            <h3 className="text-white font-black mb-3">Curriculum Structure</h3>
            <div className="space-y-3">
              {path.units.map((unit) => (
                <div key={unit.id} className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `linear-gradient(135deg, ${unit.color}, ${unit.accentColor})` }}>
                      {unit.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-bold">{unit.title}</p>
                      <p className="text-gray-500 text-xs">{unit.lessons.length} lessons</p>
                    </div>
                    {expandedUnit === unit.id ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                  </button>

                  <AnimatePresence>
                    {expandedUnit === unit.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
                          {unit.lessons.map((lesson, li) => (
                            <div key={lesson.id} className="flex items-center gap-3 bg-[#1a1a24] rounded-xl px-3 py-2.5">
                              <span className="text-lg">{lesson.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-bold truncate">{lesson.title}</p>
                                <p className="text-gray-500 text-xs">{lesson.questions.length} questions · {lesson.xpReward} XP</p>
                              </div>
                              <span className="text-xs text-gray-600">#{li + 1}</span>
                            </div>
                          ))}
                          {unit.lessons.length === 0 && (
                            <p className="text-gray-600 text-sm text-center py-2">No lessons yet</p>
                          )}
                          <button
                            onClick={() => { setLessonForm(f => ({ ...f, unitId: unit.id })); setTab('add-lesson'); }}
                            className="w-full flex items-center justify-center gap-2 text-sm text-[#22c55e] font-bold py-2 border border-[#22c55e]/20 rounded-xl hover:bg-[#22c55e]/5 transition"
                          >
                            <Plus size={14} /> Add Lesson to this Unit
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ADD UNIT TAB */}
        {tab === 'add-unit' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-white font-black text-lg">New Unit</h3>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Unit Title *</label>
                <input
                  value={unitForm.title}
                  onChange={e => setUnitForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g., Computer Vision"
                  className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#22c55e]/60 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                <input
                  value={unitForm.description}
                  onChange={e => setUnitForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of this unit"
                  className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#22c55e]/60 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setUnitForm(f => ({ ...f, icon }))}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition ${
                        unitForm.icon === icon ? 'bg-[#22c55e]/20 border-2 border-[#22c55e]' : 'bg-[#1a1a24] border border-white/10 hover:border-white/30'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Color Theme</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setUnitForm(f => ({ ...f, color, accentColor: color }))}
                      className={`w-8 h-8 rounded-lg transition ${
                        unitForm.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#12121a]' : ''
                      }`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="border-t border-white/5 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preview</p>
                <div
                  className="rounded-xl p-3 flex items-center gap-3"
                  style={{ background: `${unitForm.color}15`, border: `1px solid ${unitForm.color}30` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `linear-gradient(135deg, ${unitForm.color}, ${unitForm.accentColor})` }}>
                    {unitForm.icon}
                  </div>
                  <div>
                    <p className="text-white font-bold">{unitForm.title || 'Unit Title'}</p>
                    <p className="text-gray-400 text-xs">{unitForm.description || 'Description'}</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddUnit}
              disabled={!unitForm.title.trim()}
              className="w-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-black font-black py-4 rounded-2xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} /> Save Unit
            </motion.button>
          </motion.div>
        )}

        {/* ADD LESSON TAB */}
        {tab === 'add-lesson' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-white font-black text-lg">New Lesson</h3>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Target Unit *</label>
                <select
                  value={lessonForm.unitId}
                  onChange={e => setLessonForm(f => ({ ...f, unitId: e.target.value }))}
                  className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#22c55e]/60 transition"
                >
                  <option value="">Select a unit...</option>
                  {path.units.map(u => (
                    <option key={u.id} value={u.id}>{u.icon} {u.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Title *</label>
                  <input
                    value={lessonForm.title}
                    onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Lesson title"
                    className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#22c55e]/60 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                  <input
                    value={lessonForm.description}
                    onChange={e => setLessonForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Short desc"
                    className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#22c55e]/60 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">XP Reward</label>
                  <input
                    type="number"
                    value={lessonForm.xpReward}
                    onChange={e => setLessonForm(f => ({ ...f, xpReward: parseInt(e.target.value) || 30 }))}
                    className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#22c55e]/60 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Minutes</label>
                  <input
                    type="number"
                    value={lessonForm.estimatedMinutes}
                    onChange={e => setLessonForm(f => ({ ...f, estimatedMinutes: parseInt(e.target.value) || 8 }))}
                    className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#22c55e]/60 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Icon</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ICONS.slice(0, 8).map(icon => (
                      <button
                        key={icon}
                        onClick={() => setLessonForm(f => ({ ...f, icon }))}
                        className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition ${
                          lessonForm.icon === icon ? 'bg-[#22c55e]/20 border border-[#22c55e]' : 'bg-[#1a1a24] border border-white/10'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Content *</label>
                <textarea
                  value={lessonForm.content}
                  onChange={e => setLessonForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Write the lesson content here. Use **bold** for emphasis, - for bullet points, 1. for numbered lists."
                  rows={6}
                  className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#22c55e]/60 transition resize-none font-mono text-sm"
                />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-black">Quiz Questions</h3>
                <button onClick={addQuestion} className="flex items-center gap-2 text-sm text-[#22c55e] font-bold px-3 py-1.5 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl hover:bg-[#22c55e]/20 transition">
                  <Plus size={14} /> Add Question
                </button>
              </div>

              {lessonForm.questions.map((q, qi) => (
                <div key={qi} className="bg-[#12121a] border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-400">Question {qi + 1}</span>
                    {lessonForm.questions.length > 1 && (
                      <button onClick={() => removeQuestion(qi)} className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Question Text *</label>
                    <input
                      value={q.question}
                      onChange={e => updateQuestion(qi, 'question', e.target.value)}
                      placeholder="What is...?"
                      className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#22c55e]/60 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Answer Options</label>
                    <div className="space-y-2">
                      {q.options.map((opt: string, oi: number) => (
                        <div key={oi} className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuestion(qi, 'correctAnswer', oi)}
                            className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                              q.correctAnswer === oi ? 'border-[#22c55e] bg-[#22c55e]' : 'border-gray-600 hover:border-gray-400'
                            }`}
                          >
                            {q.correctAnswer === oi && <div className="w-2 h-2 bg-black rounded-full" />}
                          </button>
                          <input
                            value={opt}
                            onChange={e => updateQuestionOption(qi, oi, e.target.value)}
                            placeholder={`Option ${oi + 1}${q.correctAnswer === oi ? ' (correct)' : ''}`}
                            className={`flex-1 bg-[#1a1a24] border rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none transition text-sm ${
                              q.correctAnswer === oi ? 'border-[#22c55e]/50 focus:border-[#22c55e]' : 'border-white/10 focus:border-white/30'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Explanation</label>
                    <input
                      value={q.explanation}
                      onChange={e => updateQuestion(qi, 'explanation', e.target.value)}
                      placeholder="Why is this the correct answer?"
                      className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#22c55e]/60 transition"
                    />
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddLesson}
              disabled={!lessonForm.title.trim() || !lessonForm.unitId || !lessonForm.content.trim()}
              className="w-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-black font-black py-4 rounded-2xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} /> Save Lesson
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
