import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  BookOpen, 
  Monitor,
  MapPin,
  Scale,
  Gavel,
  ShieldAlert,
  Fingerprint,
  TrafficCone,
  Library,
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Star, 
  Timer as TimerIcon, 
  RotateCcw,
  Play,
  Trophy,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { DISCIPLINES, Question, Subject, Discipline, MOCK_EXAM_STRUCTURE } from './types';
import { generateQuestions, generateMockExam } from './services/geminiService';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';

// --- Components ---

const Header = ({ onBack, title, subtitle }: { onBack?: () => void, title: string, subtitle?: string }) => (
  <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-blue-900/30 p-4 mb-6">
    <div className="max-w-4xl mx-auto flex items-center gap-4">
      {onBack && (
        <button 
          onClick={onBack}
          className="p-2 hover:bg-blue-900/20 rounded-full transition-colors text-blue-400"
        >
          <ArrowLeft size={24} />
        </button>
      )}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-blue-400 font-medium">{subtitle}</p>}
      </div>
    </div>
  </header>
);

const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <motion.div
    whileHover={onClick ? { scale: 1.01, backgroundColor: 'rgba(30, 58, 138, 0.2)' } : {}}
    whileTap={onClick ? { scale: 0.99 } : {}}
    onClick={onClick}
    className={cn(
      "bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 transition-all",
      onClick && "cursor-pointer hover:border-blue-700/50",
      className
    )}
  >
    {children}
  </motion.div>
);

const Timer = ({ isActive }: { isActive: boolean }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-blue-400 font-mono text-lg bg-blue-900/10 px-3 py-1 rounded-full border border-blue-900/30">
      <TimerIcon size={18} />
      {formatTime(seconds)}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'home' | 'subjects' | 'quiz' | 'results'>('home');
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(10);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isMockExam, setIsMockExam] = useState(false);
  const [mockExamProgress, setMockExamProgress] = useState(0);
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [showGabarito, setShowGabarito] = useState(false);
  const [premiumParticles, setPremiumParticles] = useState<{id: number, x: number, y: number, size: number, blur: number, color: string, type: string}[]>([]);
  const [sunParticles, setSunParticles] = useState<{id: number, x: number, y: number, emoji: string, duration: number, delay: number, blur: number, opacity: number}[]>([]);
  const [globalFloatingEmojis, setGlobalFloatingEmojis] = useState<{id: number, x: number, emoji: string, duration: number, size: number, drift: number}[]>([]);
  const [titleEmblemParticles, setTitleEmblemParticles] = useState<{id: number, x: number, y: number, emoji: string, duration: number, drift: number}[]>([]);

  const triggerTitleAnimation = (count = 2, isAuto = false) => {
    const colors = ['#3B82F6', '#60A5FA', '#0A3D91', '#FFFFFF'];
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i + (isAuto ? 1000 : 0),
      x: (Math.random() - 0.5) * (isAuto ? 180 : 260),
      y: isAuto ? -100 - Math.random() * 100 : (Math.random() - 1) * 150,
      size: Math.random() * 5 + 3,
      blur: Math.random() > 0.5 ? Math.random() * 4 : 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.random() > 0.7 ? 'line' : 'dot'
    }));
    
    setPremiumParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setPremiumParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 4000);
  };

  useEffect(() => {
    // Global floating emojis generator
    const globalEmojiInterval = setInterval(() => {
      const emojis = ['👮', '🚔', '🚨', '📚', '🛡️'];
      const id = Date.now();
      const newEmoji = {
        id,
        x: Math.random() * 100, // 0 to 100% width
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        duration: 5, // Exact 5 seconds
        size: 16 + Math.random() * 8, // 16px to 24px
        drift: (Math.random() - 0.5) * 15 // Lateral drift
      };
      
      setGlobalFloatingEmojis(prev => [...prev.slice(-4), newEmoji]); // Keep max 5 emojis
      
      setTimeout(() => {
        setGlobalFloatingEmojis(prev => prev.filter(e => e.id !== id));
      }, 6000);
    }, 3000); // Every 3 seconds

    return () => clearInterval(globalEmojiInterval);
  }, []);

  useEffect(() => {
    if (view === 'home') {
      const interval = setInterval(() => {
        const emojis = ['🛡️', '📚', '🎯', '🚔'];
        const count = Math.floor(Math.random() * 3) + 2; // 2 to 4
        const newParticles = Array.from({ length: count }).map((_, i) => ({
          id: Date.now() + i,
          x: (Math.random() - 0.5) * 240, // Around the title
          y: (Math.random() - 0.5) * 30,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          duration: 2 + Math.random(), // 2 to 3 seconds
          drift: (Math.random() - 0.5) * 50
        }));

        setTitleEmblemParticles(prev => [...prev, ...newParticles]);

        setTimeout(() => {
          setTitleEmblemParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 3500);
      }, 2000 + Math.random() * 2000); // 2 to 4 seconds

      return () => clearInterval(interval);
    }
  }, [view]);

  useEffect(() => {
    if (view === 'home') {
      const interval = setInterval(() => {
        triggerTitleAnimation(Math.floor(Math.random() * 2) + 2, true);
      }, 4000);

      // Sun particles generator
      const sunInterval = setInterval(() => {
        const emojis = ['👮', '🚔', '🚨', '📚'];
        const id = Date.now();
        const newParticle = {
          id,
          x: Math.random() > 0.5 ? -100 : 100, // Start from left or right
          y: (Math.random() - 0.5) * 200,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          duration: 4 + Math.random() * 2,
          delay: Math.random() * 2,
          blur: Math.random() > 0.5 ? Math.random() * 2 : 0,
          opacity: 0.3 + Math.random() * 0.2
        };
        
        setSunParticles(prev => [...prev.slice(-5), newParticle]); // Keep max 6 particles
        
        setTimeout(() => {
          setSunParticles(prev => prev.filter(p => p.id !== id));
        }, 7000);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearInterval(sunInterval);
      };
    }
  }, [view]);

  const handleSelectDiscipline = (discipline: Discipline) => {
    setSelectedDiscipline(discipline);
    setView('subjects');
  };

  const handleSelectSubject = (subject: Subject) => {
    setQuestions([]); // Limpa questões anteriores ao trocar de assunto
    setSelectedSubject(subject);
    setView('quiz');
  };

  const [error, setError] = useState<string | null>(null);

  const startQuiz = async (qAmount: number) => {
    if (!selectedSubject) return;
    setAmount(qAmount);
    setLoading(true);
    setIsMockExam(false);
    setError(null);
    try {
      const data = await generateQuestions(selectedSubject.title, qAmount, selectedDiscipline?.id || '');
      setQuestions(data);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowExplanation(false);
      setScore(0);
    } catch (err) {
      setError("Erro ao gerar questões. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const startMockExam = async () => {
    setView('quiz');
    setLoading(true);
    setIsMockExam(true);
    setMockExamProgress(0);
    setMarkedForReview([]);
    setError(null);
    try {
      const data = await generateMockExam((progress) => {
        setMockExamProgress(progress);
      });
      setQuestions(data);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowExplanation(false);
      setScore(0);
    } catch (err) {
      setError("Erro ao gerar simulado completo. Tente novamente.");
      setTimeout(() => setView('home'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, alternativeId: string) => {
    if (answers[questionId]) return; // Prevent changing answer
    setAnswers(prev => ({ ...prev, [questionId]: alternativeId }));
    
    const question = questions.find(q => q.id === questionId);
    if (question?.correctAlternativeId === alternativeId) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      setView('results');
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const resetQuiz = () => {
    setView('home');
    setSelectedDiscipline(null);
    setSelectedSubject(null);
    setQuestions([]);
    setAnswers({});
  };

  // --- Renderers ---

  const renderHome = () => (
    <div className="max-w-4xl mx-auto p-4 space-y-6 relative overflow-hidden min-h-[80vh]">
      {/* Sun Background Element */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      {/* Sun Floating Emojis */}
      <div className="absolute top-0 left-0 w-full h-[400px] pointer-events-none -z-5 overflow-hidden">
        <AnimatePresence>
          {sunParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                x: particle.x > 0 ? '120%' : '-20%', 
                y: 150 + particle.y, 
                opacity: 0,
                scale: 0.8
              }}
              animate={{ 
                x: particle.x > 0 ? '-20%' : '120%',
                y: 100 + particle.y,
                opacity: particle.opacity,
                scale: [0.8, 1, 0.8]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: particle.duration, 
                delay: particle.delay,
                ease: "linear"
              }}
              style={{ 
                filter: `blur(${particle.blur}px)`,
                position: 'absolute'
              }}
              className="text-2xl"
            >
              {particle.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center justify-center py-10 space-y-4 relative z-10 w-full overflow-hidden">
        <div className="relative flex flex-col items-center">
          <AnimatePresence>
            {titleEmblemParticles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ x: particle.x, y: particle.y, opacity: 0, scale: 0.5 }}
                animate={{ 
                  y: particle.y - 100, 
                  x: particle.x + particle.drift,
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.8]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: particle.duration, ease: "easeOut" }}
                className="absolute pointer-events-none text-lg z-[-1]"
                style={{ left: '50%', top: '50%' }}
              >
                {particle.emoji}
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.h2 
          animate={{ 
            scale: [1, 1.03, 1],
            textShadow: [
              "0 0 10px rgba(59, 130, 246, 0.3)",
              "0 0 25px rgba(59, 130, 246, 0.6)",
              "0 0 10px rgba(59, 130, 246, 0.3)"
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          whileTap={{ scale: 1.05 }}
          onClick={() => triggerTitleAnimation(5)}
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white uppercase cursor-pointer relative select-none group overflow-hidden px-4 font-display font-black max-w-[95vw] mx-auto text-center"
        >
          <span className="relative z-10 transition-all">
            Preparação <span className="text-blue-500">GM Manaus</span>
          </span>
          
          {/* Scan Line Effect */}
          <motion.div
            initial={{ x: '-150%' }}
            animate={{ x: '250%' }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 7,
              ease: "easeInOut"
            }}
            className="absolute inset-0 z-20 pointer-events-none"
          >
            <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
          </motion.div>

          <AnimatePresence>
            {premiumParticles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 0.6, 0.6, 0], 
                  scale: [0, 1, 1, 0.5], 
                  x: particle.x, 
                  y: particle.y,
                }}
                transition={{ 
                  duration: 3.5, 
                  ease: "easeOut" 
                }}
                style={{ 
                  width: particle.type === 'line' ? 1 : particle.size,
                  height: particle.type === 'line' ? particle.size * 2 : particle.size,
                  backgroundColor: particle.color,
                  filter: `blur(${particle.blur}px)`,
                  borderRadius: particle.type === 'line' ? '2px' : '50%',
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
              />
            ))}
          </AnimatePresence>
        </motion.h2>
      </div>
        <p className="text-zinc-400 max-w-md mx-auto text-center px-4">
          Treine com inteligência artificial focada no padrão da banca Consulplan.
        </p>
      </div>

      <div className="grid gap-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Simulado Completo</h3>
        <Card 
          onClick={startMockExam} 
          className="bg-blue-600 border-blue-500 hover:bg-blue-500 hover:border-blue-400 flex items-center justify-between group py-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-lg text-white">
              <Trophy size={28} />
            </div>
            <div>
              <span className="text-xl font-black text-white uppercase tracking-tight">Simulado Consulplan</span>
              <p className="text-blue-100 text-sm font-medium">60 Questões • 100 Pontos • Todas as Matérias</p>
            </div>
          </div>
          <Play className="text-white animate-pulse" fill="currentColor" />
        </Card>

        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1 mt-4">DISCIPLINAS - QUESTÕES</h3>
        {DISCIPLINES.map((discipline) => (
          <Card key={discipline.id} onClick={() => handleSelectDiscipline(discipline)} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-900/20 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                {discipline.icon === 'BookOpen' ? <BookOpen size={24} /> : 
                 discipline.icon === 'Monitor' ? <Monitor size={24} /> : 
                 discipline.icon === 'MapPin' ? <MapPin size={24} /> :
                 discipline.icon === 'Scale' ? <Scale size={24} /> :
                 discipline.icon === 'Gavel' ? <Gavel size={24} /> :
                 discipline.icon === 'ShieldAlert' ? <ShieldAlert size={24} /> :
                 discipline.icon === 'Fingerprint' ? <Fingerprint size={24} /> :
                 discipline.icon === 'TrafficCone' ? <TrafficCone size={24} /> :
                 <Library size={24} />}
              </div>
              <span className="text-lg font-semibold text-white">{discipline.title}</span>
            </div>
            <ChevronRight className="text-zinc-600 group-hover:text-blue-500 transition-colors" />
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Header 
        onBack={() => setView('home')} 
        title={selectedDiscipline?.title || ''} 
        subtitle="Selecione um assunto"
      />
      <div className="grid gap-3">
        {selectedDiscipline?.subjects.map((subject) => (
          <Card key={subject.id} onClick={() => handleSelectSubject(subject)} className="flex items-center justify-between py-4">
            <span className="text-zinc-200 font-medium">{subject.title}</span>
            <ChevronRight size={18} className="text-zinc-600" />
          </Card>
        ))}
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">
              {isMockExam ? `Gerando Simulado (${Math.round(mockExamProgress)}%)...` : 'Gerando questões inéditas...'}
            </h3>
            <p className="text-zinc-500">Nossa IA está simulando o padrão Consulplan para você.</p>
            {error && <p className="text-red-500 font-bold mt-4">{error}</p>}
          </div>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="max-w-xl mx-auto p-4 space-y-8">
          <Header onBack={() => setView('subjects')} title={selectedSubject?.title || ''} />
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto text-blue-500">
              <Play size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Pronto para começar?</h3>
              <p className="text-zinc-400">Escolha a quantidade de questões para este simulado.</p>
              {error && <p className="text-red-500 font-bold mt-4">{error}</p>}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[10, 30, 50].map(n => (
                <button
                  key={n}
                  onClick={() => startQuiz(n)}
                  className="py-3 px-4 bg-zinc-800 hover:bg-blue-600 text-white font-bold rounded-xl transition-all"
                >
                  {n} Questões
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = answers[currentQuestion.id];
    const isMarked = markedForReview.includes(currentQuestion.id);

    return (
      <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6">
        <div className="flex items-center justify-between sticky top-0 z-20 bg-black/90 py-4 border-b border-zinc-800 mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => { setView('home'); setQuestions([]); }} className="text-zinc-400 hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                {isMockExam ? `Simulado Consulplan • Questão ${currentQuestionIndex + 1} de 60` : `Questão ${currentQuestionIndex + 1} de ${questions.length}`}
              </span>
              <div className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <Timer isActive={!showGabarito && (isMockExam ? true : !answers[questions[questions.length - 1]?.id])} />
        </div>

        {isMockExam && (
          <div className="grid grid-cols-10 gap-1 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800 overflow-x-auto">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isMarkedReview = markedForReview.includes(q.id);
              const isCurrent = idx === currentQuestionIndex;
              
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={cn(
                    "w-8 h-8 rounded text-[10px] font-bold transition-all flex items-center justify-center",
                    isCurrent ? "bg-blue-600 text-white ring-2 ring-blue-400" :
                    isMarkedReview ? "bg-yellow-600 text-white" :
                    isAnswered ? "bg-green-900/40 text-green-400 border border-green-900" :
                    "bg-zinc-800 text-zinc-500 border border-zinc-700"
                  )}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="space-y-4 border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                    currentQuestion.level === 'Fácil' ? "bg-green-900/30 text-green-400" :
                    currentQuestion.level === 'Médio' ? "bg-yellow-900/30 text-yellow-400" :
                    "bg-red-900/30 text-red-400"
                  )}>
                    Nível: {currentQuestion.level}
                  </span>
                  {isMockExam && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-blue-900/30 text-blue-400">
                      {DISCIPLINES.find(d => d.id === currentQuestion.disciplineId)?.title}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {isMockExam && (
                    <button 
                      onClick={() => {
                        setMarkedForReview(prev => 
                          prev.includes(currentQuestion.id) 
                            ? prev.filter(id => id !== currentQuestion.id) 
                            : [...prev, currentQuestion.id]
                        );
                      }}
                      className={cn("flex items-center gap-1 text-[10px] font-bold uppercase transition-colors", isMarked ? "text-yellow-500" : "text-zinc-600")}
                    >
                      <Info size={14} />
                      {isMarked ? 'Revisar' : 'Marcar'}
                    </button>
                  )}
                  <button 
                    onClick={() => toggleFavorite(currentQuestion.id)}
                    className={cn("transition-colors", favorites.includes(currentQuestion.id) ? "text-yellow-500" : "text-zinc-600")}
                  >
                    <Star size={20} fill={favorites.includes(currentQuestion.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
              
              {currentQuestion.textContext && (
                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-zinc-300 italic text-sm leading-relaxed whitespace-pre-wrap mb-4">
                  {currentQuestion.textContext}
                </div>
              )}
              
              <h4 className="text-lg font-medium text-white leading-relaxed">
                {currentQuestion.statement}
              </h4>
            </Card>

            <div className="grid gap-3">
              {currentQuestion.alternatives.map((alt) => {
                const isSelected = userAnswer === alt.id;
                const isCorrect = alt.id === currentQuestion.correctAlternativeId;
                const showResult = isMockExam ? showGabarito : !!userAnswer;

                return (
                  <button
                    key={alt.id}
                    disabled={showResult}
                    onClick={() => {
                      if (isMockExam) {
                        setAnswers(prev => ({ ...prev, [currentQuestion.id]: alt.id }));
                      } else {
                        handleAnswer(currentQuestion.id, alt.id);
                      }
                    }}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl border transition-all text-left group",
                      !showResult && !isSelected && "bg-zinc-900 border-zinc-800 hover:border-blue-500 hover:bg-blue-900/10",
                      !showResult && isSelected && "bg-blue-900/20 border-blue-600 text-blue-100",
                      showResult && isCorrect && "bg-green-900/20 border-green-600 text-green-100",
                      showResult && isSelected && !isCorrect && "bg-red-900/20 border-red-600 text-red-100",
                      showResult && !isSelected && !isCorrect && "bg-zinc-900/50 border-zinc-800 opacity-50"
                    )}
                  >
                    <span className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold border",
                      !showResult && !isSelected && "bg-zinc-800 border-zinc-700 text-zinc-400 group-hover:border-blue-500 group-hover:text-blue-400",
                      !showResult && isSelected && "bg-blue-600 border-blue-500 text-white",
                      showResult && isCorrect && "bg-green-600 border-green-500 text-white",
                      showResult && isSelected && !isCorrect && "bg-red-600 border-red-500 text-white",
                      showResult && !isSelected && !isCorrect && "bg-zinc-800 border-zinc-700 text-zinc-500"
                    )}>
                      {alt.id}
                    </span>
                    <span className="pt-1">{alt.text}</span>
                    {showResult && isCorrect && <CheckCircle2 className="ml-auto text-green-500 flex-shrink-0" size={20} />}
                    {showResult && isSelected && !isCorrect && <XCircle className="ml-auto text-red-500 flex-shrink-0" size={20} />}
                  </button>
                );
              })}
            </div>

            {(showExplanation || (isMockExam && showGabarito)) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-blue-900/10 border border-blue-900/30 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-bold">
                    <Info size={18} />
                    Explicação Detalhada
                  </div>
                  <div className="text-zinc-300 text-sm leading-relaxed prose prose-invert max-w-none">
                    <ReactMarkdown>{currentQuestion.explanation}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-3">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all"
                >
                  Anterior
                </button>
              )}
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(prev => prev + 1);
                    if (!isMockExam) setShowExplanation(false);
                  }}
                  className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Próxima Questão
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (isMockExam) {
                      setView('results');
                    } else {
                      setView('results');
                    }
                  }}
                  className="flex-[2] py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Finalizar Simulado
                  <CheckCircle2 size={20} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const renderResults = () => {
    const correctAnswers = questions.filter(q => answers[q.id] === q.correctAlternativeId).length;
    const totalQuestions = questions.length;
    const percentage = (correctAnswers / totalQuestions) * 100;

    // Mock Exam specific calculations
    let totalScore = 0;
    const disciplineBreakdown: Record<string, { correct: number, total: number, score: number, maxScore: number }> = {};

    if (isMockExam) {
      questions.forEach(q => {
        const discipline = DISCIPLINES.find(d => d.id === q.disciplineId);
        if (!discipline) return;

        const config = MOCK_EXAM_STRUCTURE.find(s => s.disciplineId === q.disciplineId);
        const weight = config?.weight || 1.5;

        if (!disciplineBreakdown[discipline.id]) {
          disciplineBreakdown[discipline.id] = { correct: 0, total: 0, score: 0, maxScore: 0 };
        }

        disciplineBreakdown[discipline.id].total += 1;
        disciplineBreakdown[discipline.id].maxScore += weight;

        if (answers[q.id] === q.correctAlternativeId) {
          disciplineBreakdown[discipline.id].correct += 1;
          disciplineBreakdown[discipline.id].score += weight;
          totalScore += weight;
        }
      });
    }

    const sortedDisciplines = Object.entries(disciplineBreakdown)
      .map(([id, stats]) => ({
        id,
        title: DISCIPLINES.find(d => d.id === id)?.title || '',
        percentage: (stats.correct / stats.total) * 100,
        ...stats
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const bestDiscipline = sortedDisciplines[0];
    const worstDiscipline = sortedDisciplines[sortedDisciplines.length - 1];

    return (
      <div className="max-w-4xl mx-auto p-4 py-12 space-y-8">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block p-4 bg-blue-600 rounded-full shadow-lg shadow-blue-900/40"
          >
            <Trophy size={48} className="text-white" />
          </motion.div>
          <h2 className="text-3xl font-black text-white">
            {isMockExam ? 'Simulado Concluído!' : 'Quiz Finalizado!'}
          </h2>
          <p className="text-zinc-400">
            {isMockExam 
              ? 'Confira seu desempenho detalhado por disciplina abaixo' 
              : `Você finalizou o estudo de ${selectedSubject?.title}.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center p-6 space-y-2 border-t-4 border-t-blue-600">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pontuação Total</span>
            <div className="text-4xl font-black text-white">
              {isMockExam ? totalScore.toFixed(1) : correctAnswers}
              <span className="text-lg text-zinc-500 font-normal ml-1">
                / {isMockExam ? '100' : totalQuestions}
              </span>
            </div>
          </Card>
          <Card className="text-center p-6 space-y-2 border-t-4 border-t-green-600">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Acertos</span>
            <div className="text-4xl font-black text-green-500">
              {correctAnswers}
              <span className="text-lg text-zinc-500 font-normal ml-1">questões</span>
            </div>
          </Card>
          <Card className="text-center p-6 space-y-2 border-t-4 border-t-purple-600">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Aproveitamento</span>
            <div className="text-4xl font-black text-purple-500">
              {percentage.toFixed(1)}%
            </div>
          </Card>
        </div>

        {isMockExam && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={24} />
              <h3 className="text-xl font-bold text-white">Desempenho por Disciplina</h3>
            </div>
            
            <div className="grid gap-4">
              {sortedDisciplines.map((item) => (
                <Card key={item.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{item.title}</span>
                    <span className={cn(
                      "text-sm font-bold px-2 py-1 rounded",
                      item.percentage >= 70 ? "bg-green-900/30 text-green-400" :
                      item.percentage >= 50 ? "bg-yellow-900/30 text-yellow-400" :
                      "bg-red-900/30 text-red-400"
                    )}>
                      {item.score.toFixed(1)} / {item.maxScore.toFixed(1)} pts ({item.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        item.percentage >= 70 ? "bg-green-500" :
                        item.percentage >= 50 ? "bg-yellow-500" :
                        "bg-red-500"
                      )}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-900/10 border border-green-900/30 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-green-400 font-bold">
                  <CheckCircle2 size={20} />
                  Ponto Forte
                </div>
                <p className="text-sm text-zinc-300">
                  Você teve um excelente desempenho em <span className="text-white font-bold">{bestDiscipline?.title}</span>. Continue mantendo esse nível!
                </p>
              </div>
              <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold">
                  <AlertCircle size={20} />
                  Ponto de Atenção
                </div>
                <p className="text-sm text-zinc-300">
                  Sua menor pontuação foi em <span className="text-white font-bold">{worstDiscipline?.title}</span>. Recomendamos revisar os assuntos desta disciplina.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              setShowGabarito(true);
              setCurrentQuestionIndex(0);
              setView('quiz');
            }}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <BookOpen size={20} />
            Ver Gabarito Comentado
          </button>
          
          <button
            onClick={() => {
              if (isMockExam) {
                startMockExam();
              } else {
                startQuiz(amount);
              }
            }}
            className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            {isMockExam ? 'Refazer Simulado (Novas Questões)' : 'Gerar Novas Questões'}
          </button>

          <button
            onClick={() => {
              setView('home');
              setQuestions([]);
              setAnswers({});
              setScore(0);
              setCurrentQuestionIndex(0);
            }}
            className="w-full py-4 bg-transparent border border-zinc-800 hover:bg-zinc-900 text-zinc-400 font-bold rounded-xl transition-all"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-blue-500/30 relative overflow-x-hidden">
      {/* Global Background Floating Emojis - emoji-background */}
      <div className="emoji-background fixed inset-0 pointer-events-none z-[-20] overflow-hidden w-full h-full">
        <AnimatePresence>
          {globalFloatingEmojis.map((emoji) => (
            <motion.div
              key={emoji.id}
              initial={{ 
                x: `${emoji.x}%`, 
                y: '110vh', 
                opacity: 0,
                scale: 1
              }}
              animate={{ 
                y: '-10vh',
                opacity: [0, 0.3, 0],
                x: `${emoji.x + emoji.drift}%`
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: emoji.duration, 
                ease: "linear",
                times: [0, 0.5, 1]
              }}
              style={{ 
                fontSize: emoji.size,
                position: 'absolute'
              }}
            >
              {emoji.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {view === 'home' && renderHome()}
      {view === 'subjects' && renderSubjects()}
      {view === 'quiz' && renderQuiz()}
      {view === 'results' && renderResults()}
    </div>
  );
}
