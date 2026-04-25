import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shuffle,
  Bookmark,
  BookMarked,
  Rotate3d,
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
  AlertCircle,
  Printer,
  PenTool,
  Zap,
  Sparkles,
  FileText,
  Download,
  Shield,
  Palette,
  Cpu,
  Target,
  LayoutGrid,
  Brain,
  Pencil,
  Languages,
  Video,
  ExternalLink,
  Search,
  Scroll,
  History,
  Award,
  TreePine,
  HandMetal,
  Users,
  Landmark,
  Flag,
  Building2,
  Globe,
  HeartPulse,
  Vote,
  Heart,
  Lock,
  FileCheck,
  VenetianMask,
  Car,
  Map,
  Navigation
} from 'lucide-react';
import { DISCIPLINES, Question, Subject, Discipline, MOCK_EXAM_STRUCTURE, FlashCard, FlashCardMode } from './types';
import { generateQuestions, generateMockExam, generateReview, generateFlashCards } from './services/geminiService';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';

// --- Components ---

const Logo = ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) => {
  const isSm = size === "sm";
  const isLg = size === "lg";
  
  return (
    <div className={cn("flex flex-col items-center justify-center text-center select-none", className)}>
      {/* Main Brand: BIZU */}
      <h2 className={cn(
        "font-black text-white uppercase tracking-[-0.05em] leading-none transition-all duration-500",
        isSm ? "text-xl mt-0" : isLg ? "text-8xl mt-2" : "text-5xl mt-1"
      )}>
        BIZU
      </h2>

      {/* Sub Brand: QUESTÕES */}
      <div className={cn("flex items-center gap-2 w-full justify-center", isLg ? "mt-2" : "mt-1")}>
        <div className="h-[1px] flex-1 bg-white/20" />
        <h3 className={cn(
          "font-black text-white/60 uppercase tracking-[0.5em] transition-all duration-500 whitespace-nowrap",
          isSm ? "text-[5px]" : isLg ? "text-[16px]" : "text-[10px]"
        )}>
          QUESTÕES
        </h3>
        <div className="h-[1px] flex-1 bg-white/20" />
      </div>

      {/* Lightning Bolt */}
      <div className={cn("text-brand-primary", isSm ? "mt-1" : "mt-4")}>
        <Zap size={isSm ? 10 : isLg ? 28 : 18} fill="currentColor" />
      </div>

      {/* Slogan */}
      {isLg && (
        <p className="text-[12px] font-black text-brand-text-muted uppercase tracking-[0.8em] mt-8 opacity-40">
          QUEM TREINA PASSA
        </p>
      )}
    </div>
  );
};

const Header = ({ onBack, title, subtitle, setView, view }: { onBack?: () => void, title: string, subtitle?: string, setView: (v: any) => void, view: string }) => (
  <header className="sticky top-0 z-20 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border p-3 mb-6">
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-brand-card rounded-xl transition-colors text-brand-primary"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-black text-white tracking-tighter uppercase">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-[9px] font-bold text-brand-text-muted uppercase tracking-widest">{subtitle}</p>
          )}
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-1">
        {[
          { id: 'landing', label: 'Portal', icon: LayoutGrid },
          { id: 'home', label: 'Gerar Questões', icon: Play },
          { id: 'disciplines', label: 'Disciplinas', icon: Library },
          { id: 'essay-perfect', label: 'Redação Perfeita', icon: PenTool },
          { id: 'portuguese-lessons', label: 'Português', icon: Languages },
          { id: 'legislation-lessons', label: 'Legislação', icon: Gavel },
          { id: 'constitutional-lessons', label: 'Constitucional', icon: Scale },
          { id: 'human-rights-lessons', label: 'Direitos Humanos', icon: Globe },
          { id: 'traffic-legislation-lessons', label: 'Trânsito', icon: Car },
          { id: 'flashcards', label: 'Flash Cards', icon: Zap },
          { id: 'extras', label: 'Extras', icon: LayoutGrid },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all",
              view === item.id ? "text-brand-primary bg-brand-primary/10 border-b-2 border-brand-primary rounded-none px-2" : "text-brand-text-muted hover:text-white hover:bg-brand-card"
            )}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button className="p-2 text-brand-text-muted hover:text-white transition-colors">
          <Info size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold text-xs">
          ES
        </div>
      </div>
    </div>
  </header>
);

const Card = ({ children, className, onClick, noPadding }: { children: React.ReactNode, className?: string, onClick?: () => void, noPadding?: boolean }) => (
  <motion.div
    whileHover={onClick ? { y: -2, backgroundColor: '#1A1A1A' } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
    className={cn(
      "bg-brand-card border border-brand-border rounded-[12px] transition-all duration-200 shadow-lg",
      !noPadding && "p-5",
      onClick && "cursor-pointer hover:border-brand-primary/30",
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

const DisciplineIcon = ({ icon, size = 24, className = "" }: { icon: string, size?: number, className?: string }) => {
  const props = { size, className };
  switch (icon) {
    case 'BookOpen': return <BookOpen {...props} />;
    case 'Monitor': return <Monitor {...props} />;
    case 'MapPin': return <MapPin {...props} />;
    case 'Scale': return <Scale {...props} />;
    case 'Gavel': return <Gavel {...props} />;
    case 'ShieldAlert': return <ShieldAlert {...props} />;
    case 'Fingerprint': return <Fingerprint {...props} />;
    case 'TrafficCone': return <TrafficCone {...props} />;
    default: return <Library {...props} />;
  }
};

const DisciplineModal = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedId,
  searchTerm,
  setSearchTerm
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSelect: (d: Discipline) => void, 
  selectedId?: string,
  searchTerm: string,
  setSearchTerm: (s: string) => void
}) => {
  if (!isOpen) return null;

  const categories = [
    { name: 'Básicas', ids: ['portugues', 'informatica', 'geografia_historia_regional', 'etica_direitos_humanos'] },
    { name: 'Direito', ids: ['direito_constitucional', 'direito_penal', 'direito_penal_2', 'direito_processual_penal'] },
    { name: 'Legislação', ids: ['legislacao_transito', 'legislacao_especifica'] }
  ];

  const filteredDisciplines = DISCIPLINES.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-brand-card border border-brand-border w-full max-w-2xl max-h-[85vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-card/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/20 rounded-lg text-brand-primary">
                <Library size={20} />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Escolha sua disciplina</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-brand-bg rounded-full transition-colors text-brand-text-muted hover:text-white"
            >
              <XCircle size={24} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 pb-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-brand-text-muted group-focus-within:text-brand-primary transition-colors">
                <BookOpen size={18} />
              </div>
              <input 
                type="text"
                placeholder="Buscar disciplina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl py-4 pl-12 pr-4 text-sm font-medium text-white placeholder:text-[#888] focus:ring-2 focus:ring-white/30 focus:border-white outline-none transition-all"
              />
            </div>
          </div>

          {/* Disciplines List */}
          <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-8 scrollbar-thin scrollbar-thumb-brand-border">
            {categories.map(cat => {
              const catDisciplines = filteredDisciplines.filter(d => cat.ids.includes(d.id));
              if (catDisciplines.length === 0) return null;

              return (
                <div key={cat.name} className="space-y-4">
                  <h3 className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.2em] px-2">{cat.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catDisciplines.map(d => (
                      <motion.button
                        key={d.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onSelect(d);
                          onClose();
                        }}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left relative group",
                          selectedId === d.id 
                            ? "bg-brand-primary/10 border-brand-primary shadow-[0_0_20px_rgba(58,134,255,0.1)]" 
                            : "bg-brand-bg/40 border-brand-border hover:border-brand-primary/50 hover:bg-brand-bg/60"
                        )}
                      >
                        <div className={cn(
                          "p-3 rounded-xl transition-all",
                          selectedId === d.id 
                            ? "bg-brand-primary text-white" 
                            : "bg-brand-card text-brand-text-muted group-hover:text-brand-primary"
                        )}>
                          <DisciplineIcon icon={d.icon} size={20} />
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm font-bold transition-colors",
                            selectedId === d.id ? "text-white" : "text-brand-text-muted group-hover:text-white"
                          )}>{d.title}</p>
                          <p className="text-[9px] font-bold text-brand-text-muted/60 uppercase mt-0.5">{d.subjects.length} Assuntos</p>
                        </div>
                        {selectedId === d.id && (
                          <div className="absolute right-4 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-lg">
                            <CheckCircle2 size={12} strokeWidth={3} />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredDisciplines.length === 0 && (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-brand-card rounded-full flex items-center justify-center mx-auto text-brand-text-muted">
                  <Library size={32} />
                </div>
                <p className="text-brand-text-muted font-bold uppercase text-xs tracking-widest">Nenhuma disciplina encontrada</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const SubjectModal = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedId,
  searchTerm,
  setSearchTerm,
  subjects
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSelect: (s: Subject | null) => void, 
  selectedId?: string,
  searchTerm: string,
  setSearchTerm: (s: string) => void,
  subjects: Subject[]
}) => {
  if (!isOpen) return null;

  const filteredSubjects = subjects.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-brand-card border border-brand-border w-full max-w-2xl max-h-[85vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-card/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-secondary/20 rounded-lg text-brand-secondary">
                <BookOpen size={20} />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Escolha o assunto</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-brand-bg rounded-full transition-colors text-brand-text-muted hover:text-white">
              <XCircle size={24} />
            </button>
          </div>

          <div className="p-6 pb-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-brand-text-muted group-focus-within:text-brand-secondary transition-colors">
                <BookOpen size={18} />
              </div>
              <input 
                type="text"
                placeholder="Buscar assunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-white placeholder:text-brand-text-muted focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-3 scrollbar-thin scrollbar-thumb-brand-border">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                onSelect(null);
                onClose();
              }}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                !selectedId 
                  ? "bg-brand-secondary/10 border-brand-secondary shadow-[0_0_20px_rgba(255,159,28,0.1)]" 
                  : "bg-brand-bg/40 border-brand-border hover:border-brand-secondary/50 hover:bg-brand-bg/60"
              )}
            >
              <span className={cn(
                "text-sm font-bold transition-colors",
                !selectedId ? "text-white" : "text-brand-text-muted group-hover:text-white"
              )}>Todos os Assuntos</span>
              {!selectedId && <CheckCircle2 size={18} className="text-brand-secondary" />}
            </motion.button>

            {filteredSubjects.map(s => (
              <motion.button
                key={s.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  onSelect(s);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                  selectedId === s.id 
                    ? "bg-brand-secondary/10 border-brand-secondary shadow-[0_0_20px_rgba(255,159,28,0.1)]" 
                    : "bg-brand-bg/40 border-brand-border hover:border-brand-secondary/50 hover:bg-brand-bg/60"
                )}
              >
                <span className={cn(
                  "text-sm font-bold transition-colors",
                  selectedId === s.id ? "text-white" : "text-brand-text-muted group-hover:text-white"
                )}>{s.title}</span>
                {selectedId === s.id && <CheckCircle2 size={18} className="text-brand-secondary" />}
              </motion.button>
            ))}

            {filteredSubjects.length === 0 && (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-brand-card rounded-full flex items-center justify-center mx-auto text-brand-text-muted">
                  <BookOpen size={32} />
                </div>
                <p className="text-brand-text-muted font-bold uppercase text-xs tracking-widest">Nenhum assunto encontrado</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const BancaModal = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedBanca 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSelect: (b: string) => void, 
  selectedBanca: string 
}) => {
  if (!isOpen) return null;

  const bancas = [
    { id: 'Consulplan', name: 'Consulplan (Padrão)', icon: Sparkles },
    { id: 'FGV', name: 'FGV', icon: Zap },
    { id: 'CESPE', name: 'CESPE / CEBRASPE', icon: ShieldAlert },
    { id: 'FCC', name: 'FCC', icon: Gavel }
  ];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-brand-card border border-brand-border w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-card/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/20 rounded-lg text-brand-primary">
                <Zap size={20} />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Banca Organizadora</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-brand-bg rounded-full transition-colors text-brand-text-muted hover:text-white">
              <XCircle size={24} />
            </button>
          </div>

          <div className="p-6 space-y-3">
            {bancas.map(b => (
              <motion.button
                key={b.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSelect(b.id);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group",
                  selectedBanca === b.id 
                    ? "bg-brand-primary/10 border-brand-primary shadow-[0_0_20px_rgba(58,134,255,0.1)]" 
                    : "bg-brand-bg/40 border-brand-border hover:border-brand-primary/50 hover:bg-brand-bg/60"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl transition-all",
                  selectedBanca === b.id 
                    ? "bg-brand-primary text-white" 
                    : "bg-brand-card text-brand-text-muted group-hover:text-brand-primary"
                )}>
                  <b.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "text-sm font-bold transition-colors",
                    selectedBanca === b.id ? "text-white" : "text-brand-text-muted group-hover:text-white"
                  )}>{b.name}</p>
                </div>
                {selectedBanca === b.id && (
                  <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center text-black">
                    <CheckCircle2 size={14} strokeWidth={3} />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const TRAFFIC_LEGISLATION_LESSONS = [
  { id: "trf-01", title: "Lei nº 9.503/1997 (Código de Trânsito Brasileiro - CTB)", url: "https://www.youtube.com/results?search_query=C%C3%B3digo+de+Tr%C3%A2nsito+Brasileiro+aula", icon: Car },
  { id: "trf-02", title: "Resolução CONTRAN nº 985/2022 (Manual de Fiscalização)", url: "https://www.youtube.com/results?search_query=Manual+Brasileiro+de+Fiscaliza%C3%A7%C3%A3o+de+Tr%C3%A2nsito+aula", icon: Navigation },
];

const HUMAN_RIGHTS_LESSONS = [
  { id: "hr-01", title: "Teoria Geral dos Direitos Humanos", url: "https://www.youtube.com/results?search_query=Teoria+geral+dos+direitos+humanos+aula", icon: Brain },
  { id: "hr-02", title: "Afirmação Histórica dos Direitos Humanos", url: "https://www.youtube.com/results?search_query=afirma%C3%A7%C3%A3o+hist%C3%B3rica+dos+direitos+humanos+aula", icon: History },
  { id: "hr-03", title: "Direitos Humanos e Resp. do Estado", url: "https://www.youtube.com/results?search_query=direitos+humanos+responsabilidade+do+estado+aula", icon: ShieldAlert },
  { id: "hr-04", title: "Tratados Internacionais de Direitos Humanos", url: "https://www.youtube.com/results?search_query=tratados+internacionais+direitos+humanos+aula", icon: Scroll },
  { id: "hr-05", title: "Declaração Universal dos Direitos Humanos", url: "https://www.youtube.com/results?search_query=declara%C3%A7%C3%A3o+universal+dos+direitos+humanos+aula", icon: Globe },
  { id: "hr-06", title: "Convenção Americana de Direitos Humanos", url: "https://www.youtube.com/results?search_query=pacto+de+s%C3%A3o+jos%C3%A9+da+costa+rica+aula", icon: Scale },
  { id: "hr-07", title: "Declaração de Pequim (Direitos das Mulheres)", url: "https://www.youtube.com/results?search_query=declara%C3%A7%C3%A3o+de+pequim+aula", icon: Star },
  { id: "hr-08", title: "Convenção sobre Genocídio", url: "https://www.youtube.com/results?search_query=conven%C3%A7%C3%A3o+genoc%C3%ADdio+aula", icon: Gavel },
  { id: "hr-09", title: "Lei nº 12.288/2010 (Igualdade Racial)", url: "https://www.youtube.com/results?search_query=Estatuto+da+Igualdade+Racial+aula", icon: Users },
  { id: "hr-10", title: "Lei nº 7.716/1989 (Preconceito de Raça/Cor)", url: "https://www.youtube.com/results?search_query=Lei+7716+racismo+aula", icon: ShieldAlert },
  { id: "hr-11", title: "Lei nº 10.741/2003 (Estatuto do Idoso)", url: "https://www.youtube.com/results?search_query=Estatuto+do+Idoso+crimes+aula", icon: Info },
  { id: "hr-12", title: "Decreto nº 6.153/2025 (Ética Manaus)", url: "https://www.youtube.com/results?search_query=C%C3%B3digo+de+Conduta+%C3%89tica+Manaus+aula", icon: HandMetal },
];

const CONSTITUTIONAL_LESSONS = [
  { id: "const-01", title: "Princípios Fundamentais (arts. 1º ao 4º)", url: "https://www.youtube.com/results?search_query=Princ%C3%ADpios+Fundamentais+CF+88+aula", icon: Star },
  { id: "const-02", title: "Direitos e Deveres Individuais e Coletivos", url: "https://www.youtube.com/results?search_query=direitos+e+deveres+individuais+e+coletivos+CF+88+aula", icon: Users },
  { id: "const-03", title: "Direitos Sociais", url: "https://www.youtube.com/results?search_query=direitos+sociais+CF+88+aula", icon: HeartPulse },
  { id: "const-04", title: "Nacionalidade", url: "https://www.youtube.com/results?search_query=nacionalidade+CF+88+aula", icon: Flag },
  { id: "const-05", title: "Direitos Políticos", url: "https://www.youtube.com/results?search_query=direitos+pol%C3%ADticos+CF+88+aula", icon: Vote },
  { id: "const-06", title: "Partidos Políticos", url: "https://www.youtube.com/results?search_query=partidos+pol%C3%ADticos+CF+88+aula", icon: Users },
  { id: "const-07", title: "Organização Político-Administrativa", url: "https://www.youtube.com/results?search_query=organiza%C3%A7%C3%A3o+pol%C3%ADtico+administrativa+CF+88+aula", icon: LayoutGrid },
  { id: "const-08", title: "União (arts. 20 a 24 da CF/88)", url: "https://www.youtube.com/results?search_query=Uni%C3%A3o+CF+88+arts+20+24+aula", icon: Landmark },
  { id: "const-09", title: "Estados Federados (arts. 25 a 28)", url: "https://www.youtube.com/results?search_query=Estados+Federados+CF+88+aula", icon: MapPin },
  { id: "const-10", title: "Municípios (arts. 29 a 31 da CF/88)", url: "https://www.youtube.com/results?search_query=Munic%C3%ADpios+CF+88+aula", icon: Building2 },
  { id: "const-11", title: "Administração Pública e Servidores", url: "https://www.youtube.com/results?search_query=Administra%C3%A7%C3%A3o+P%C3%BAblica+CF+88+aula", icon: FileText },
  { id: "const-12", title: "Organização dos Poderes (arts. 44 a 135)", url: "https://www.youtube.com/results?search_query=Organiza%C3%A7%C3%A3o+dos+Poderes+CF+88+aula", icon: Gavel },
  { id: "const-13", title: "Defesa do Estado e Inst. Democráticas", url: "https://www.youtube.com/results?search_query=Defesa+do+Estado+CF+88+aula", icon: Shield },
  { id: "const-14", title: "Ordem Social (Seguridade Social)", url: "https://www.youtube.com/results?search_query=Ordem+Social+CF+88+Seguridade+Social+aula", icon: Heart },
];

const LEGISLATION_LESSONS = [
  { id: "leg-01", title: "Lei nº 13.022/2014 (Estatuto Geral das Guardas)", url: "https://www.youtube.com/results?search_query=Lei+13.022+2014+guardas+municipais+aula", icon: Shield },
  { id: "leg-02", title: "Lei Complementar nº 16/2021 (Estatuto da Guarda Manaus)", url: "https://www.youtube.com/results?search_query=Estatuto+Guarda+Municipal+Manaus+Lei+16+2021+aula", icon: Scroll },
  { id: "leg-03", title: "Lei nº 13.675/2018 (Sistema Único de Segurança - SUSP)", url: "https://www.youtube.com/results?search_query=Lei+13.675+2018+SUSP+aula", icon: ShieldAlert },
  { id: "leg-04", title: "Lei nº 10.826/2003 (Estatuto do Desarmamento)", url: "https://www.youtube.com/results?search_query=Estatuto+do+Desarmamento+aula+Lei+10.826", icon: Target },
  { id: "leg-05", title: "Lei nº 8.429/1992 (Improbidade Administrativa)", url: "https://www.youtube.com/results?search_query=Improbidade+Administrativa+Lei+8.429+aula", icon: Gavel },
  { id: "leg-06", title: "Lei nº 12.527/2011 (Lei de Acesso à Informação)", url: "https://www.youtube.com/results?search_query=Lei+de+Acesso+%C3%A0+Informa%C3%A7%C3%A3o+aula", icon: Search },
  { id: "leg-07", title: "Lei nº 13.709/2018 (LGPD)", url: "https://www.youtube.com/results?search_query=LGPD+Lei+13.709+aula", icon: Fingerprint },
  { id: "leg-08", title: "Lei nº 13.869/2019 (Abuso de Autoridade)", url: "https://www.youtube.com/results?search_query=Lei+13.869+2019+abuso+de+autoridade+aula", icon: ShieldAlert },
  { id: "leg-09", title: "Lei nº 8.069/1990 (ECA - Crimes)", url: "https://www.youtube.com/results?search_query=ECA+crimes+aula+Lei+8.069", icon: Users },
  { id: "leg-10", title: "Lei nº 8.072/1990 (Crimes Hediondos)", url: "https://www.youtube.com/results?search_query=Crimes+Hediondos+Lei+8.072+aula", icon: AlertCircle },
  { id: "leg-11", title: "Lei nº 9.455/1997 (Lei de Tortura)", url: "https://www.youtube.com/results?search_query=Lei+de+Tortura+9.455+aula", icon: Info },
  { id: "leg-12", title: "Lei nº 11.343/2006 (Lei de Drogas)", url: "https://www.youtube.com/results?search_query=Lei+de+Drogas+11.343+aula", icon: Zap },
  { id: "leg-13", title: "Lei nº 11.340/2006 (Lei Maria da Penha)", url: "https://www.youtube.com/results?search_query=Lei+Maria+da+Penha+aula", icon: Shield },
  { id: "leg-14", title: "Lei nº 9.605/1998 (Crimes Ambientais)", url: "https://www.youtube.com/results?search_query=Crimes+Ambientais+Lei+9.605+aula", icon: TreePine },
  { id: "leg-15", title: "Lei Orgânica do Município de Manaus", url: "https://www.youtube.com/results?search_query=Lei+Org%C3%A2nica+de+Manaus+aula", icon: Landmark },
  { id: "leg-16", title: "Lei nº 1.118/1971 (Estatuto Servidor Manaus)", url: "https://www.youtube.com/results?search_query=Estatuto+Servidor+Manaus+Lei+1118+1971+aula", icon: History },
  { id: "leg-17", title: "Lei Municipal nº 1997/2015 (Proc. Administrativo)", url: "https://www.youtube.com/results?search_query=Processo+Administrativo+Manaus+Lei+1997+2015+aula", icon: FileText },
  { id: "leg-18", title: "Decreto nº 4.157/2018 (Acesso Informação Manaus)", url: "https://www.youtube.com/results?search_query=Decreto+4157+2018+Manaus+acesso+informa%C3%A7%C3%A3o+aula", icon: Search },
];

const PORTUGUESE_LESSONS = [
  { id: "pt-01", title: "Compreensão e Interpretação de Textos", url: "https://www.youtube.com/results?search_query=interpretação+de+texto+para+concurso+aula", icon: BookOpen },
  { id: "pt-02", title: "Tipologia Textual", url: "https://www.youtube.com/results?search_query=tipologia+textual+concurso+aula", icon: FileText },
  { id: "pt-03", title: "Ortografia Oficial", url: "https://www.youtube.com/results?search_query=ortografia+oficial+para+concurso+aula", icon: Pencil },
  { id: "pt-04", title: "Acentuação Gráfica", url: "https://www.youtube.com/results?search_query=acentuação+gráfica+concurso+aula", icon: Zap },
  { id: "pt-05", title: "Emprego das Classes de Palavras", url: "https://www.youtube.com/results?search_query=classes+de+palavras+concurso+aula", icon: Library },
  { id: "pt-06", title: "Emprego da Crase", url: "https://www.youtube.com/results?search_query=crase+concurso+aula+completa", icon: Sparkles },
  { id: "pt-07", title: "Sintaxe da Oração e do Período", url: "https://www.youtube.com/results?search_query=sintaxe+da+oração+e+período+concurso", icon: Brain },
  { id: "pt-08", title: "Sintaxe de Colocação", url: "https://www.youtube.com/results?search_query=colocação+pronominal+concurso+aula", icon: Languages },
  { id: "pt-09", title: "Pontuação", url: "https://www.youtube.com/results?search_query=pontuação+para+concurso+aula", icon: Info },
  { id: "pt-10", title: "Concordância Nominal e Verbal", url: "https://www.youtube.com/results?search_query=concordância+nominal+e+verbal+concurso", icon: Target },
  { id: "pt-11", title: "Regência Nominal e Verbal", url: "https://www.youtube.com/results?search_query=regência+nominal+e+verbal+concurso", icon: Shield },
  { id: "pt-12", title: "Semântica", url: "https://www.youtube.com/results?search_query=semântica+para+concurso+aula", icon: Search },
];

const LESSONS = [
  {
    category: "Língua Portuguesa",
    items: [
      { id: "lp-01", title: "Compreensão e Interpretação de Textos" },
      { id: "lp-02", title: "Ortografia Oficial e Acentuação" },
      { id: "lp-03", title: "Morfologia (Classes de Palavras)" },
      { id: "lp-04", title: "Sintaxe da Oração e do Período" },
      { id: "lp-05", title: "Pontuação e Concordância" },
      { id: "lp-06", title: "Regência e Crase" },
    ]
  },
  {
    category: "Noções de Informática",
    items: [
      { id: "inf-01", title: "Sistema Operacional Windows 10/11" },
      { id: "inf-02", title: "Suite Microsoft Office (Word, Excel)" },
      { id: "inf-03", title: "Conceitos de Internet e Navegadores" },
      { id: "inf-04", title: "Segurança da Informação e Antivírus" },
      { id: "inf-05", title: "Correio Eletrônico e Nuvem" },
    ]
  },
  {
    category: "Direito Constitucional",
    items: [
      { id: "dc-01", title: "Princípios Fundamentais (Art. 1º ao 4º)" },
      { id: "dc-02", title: "Direitos e Deveres Individuais (Art. 5º)" },
      { id: "dc-03", title: "Nacionalidade e Direitos Políticos" },
      { id: "dc-04", title: "Organização do Estado (Municípios)" },
      { id: "dc-05", title: "Segurança Pública (Art. 144)" },
    ]
  },
  {
    category: "Legislação Específica (Guarda)",
    items: [
      { id: "le-01", title: "Lei 13.022/2014 (Estatuto das Guardas)" },
      { id: "le-02", title: "Estatuto da Guarda Municipal de Manaus" },
      { id: "le-03", title: "Lei de Abuso de Autoridade (13.869/19)" },
      { id: "le-04", title: "Estatuto do Desarmamento (10.826/03)" },
      { id: "le-05", title: "Lei Maria da Penha (11.340/06)" },
    ]
  },
  {
    category: "Noções de Direito Penal",
    items: [
      { id: "dp-01", title: "Infração Penal e Tipicidade" },
      { id: "dp-02", title: "Crimes contra a Pessoa" },
      { id: "dp-03", title: "Crimes contra o Patrimônio" },
      { id: "dp-04", title: "Crimes contra a Administração Pública" },
      { id: "dp-05", title: "Legítima Defesa e Estado de Necessidade" },
    ]
  }
];

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'home' | 'subjects' | 'quiz' | 'results' | 'review' | 'essay-perfect' | 'disciplines' | 'mock-exams' | 'extras' | 'portuguese-lessons' | 'legislation-lessons' | 'constitutional-lessons' | 'human-rights-lessons' | 'traffic-legislation-lessons' | 'flashcards'>('landing');
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('completed_lessons');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
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
  const [gabaritoInput, setGabaritoInput] = useState('');
  const [showGabaritoInput, setShowGabaritoInput] = useState(false);
  const [reviewContent, setReviewContent] = useState<string>('');
  const [essayDraft, setEssayDraft] = useState<string[]>(Array(30).fill(''));
  const [guidedEssay, setGuidedEssay] = useState<{
    theme: string;
    description: string;
    structure: string;
    arguments: string[];
    keywords: string[];
    fullModel?: {
      intro: string;
      dev1: string;
      dev2: string;
      concl: string;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
  const [disciplineSearch, setDisciplineSearch] = useState('');
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [isBancaModalOpen, setIsBancaModalOpen] = useState(false);

  // Flashcards state
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [flashcardSelectedDiscipline, setFlashcardSelectedDiscipline] = useState<Discipline | null>(null);
  const [flashcardSelectedSubject, setFlashcardSelectedSubject] = useState<Subject | null>(null);
  const [isFlashcardDisciplineModalOpen, setIsFlashcardDisciplineModalOpen] = useState(false);
  const [isFlashcardSubjectModalOpen, setIsFlashcardSubjectModalOpen] = useState(false);
  const [flashcardAmount, setFlashcardAmount] = useState<number>(20);
  const [flashcardMode, setFlashcardMode] = useState<FlashCardMode>('Pergunta e resposta');
  const [flashcardStats, setFlashcardStats] = useState({
    studied: 0,
    favorites: 0,
    pending: 0,
    accuracy: 0
  });
  const [favoriteFlashcards, setFavoriteFlashcards] = useState<string[]>([]);
  const [learnedFlashcards, setLearnedFlashcards] = useState<string[]>([]);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);

  // New Dashboard Selectors
  const [selectedBanca, setSelectedBanca] = useState('Consulplan');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [stats, setStats] = useState({
    doneToday: 0,
    accuracy: 0,
    avgTime: '00:00'
  });

  useEffect(() => {
    // Check if API key is missing
    const key = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!key || key === "") {
      setApiKeyMissing(true);
    }
  }, []);

  const handleSelectDiscipline = (discipline: Discipline) => {
    setSelectedDiscipline(discipline);
    setSelectedSubjectIds([]);
    setIsSelectionMode(false);
    setView('subjects');
  };

  const handleSelectSubject = (subject: Subject) => {
    setQuestions([]); // Limpa questões anteriores ao trocar de assunto
    setSelectedSubject(subject);
    setView('quiz');
  };

  const startReview = async (subject: Subject) => {
    setSelectedSubject(subject);
    setView('review');
    setLoading(true);
    setError(null);
    try {
      const subjectTitle = subject.id === 'all' ? undefined : subject.title;
      const content = await generateReview(selectedDiscipline?.title || '', subjectTitle);
      setReviewContent(content);
    } catch (err: any) {
      console.error("Erro ao gerar revisão:", err);
      const msg = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
      if (msg.includes("403") || msg.includes("permission")) {
        setError("Erro de Permissão (403): A chave da API não tem permissão para este modelo.");
      } else {
        setError(`Erro ao gerar revisão: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (qAmount: number, customSubjects?: string[]) => {
    setAmount(qAmount);
    setLoading(true);
    setIsMockExam(false);
    setIsSelectionMode(false);
    setSelectedSubjectIds([]);
    setError(null);
    try {
      const isDisciplineWide = !selectedSubject && (!customSubjects || customSubjects.length === 0);
      const subjectTitle = customSubjects && customSubjects.length > 0 
        ? customSubjects 
        : (selectedSubject?.title || selectedDiscipline?.title || "Geral");
      
      const data = await generateQuestions(subjectTitle as any, qAmount, selectedDiscipline?.id || '', isDisciplineWide);
      setQuestions(data);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowExplanation(false);
      setScore(0);
    } catch (err: any) {
      console.error("Erro ao gerar questões:", err);
      const msg = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
      if (msg.includes("403") || msg.includes("permission")) {
        setError("Erro de Permissão (403): A chave da API não tem permissão para este modelo.");
      } else {
        setError(`Erro ao gerar questões: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const startMockExam = async () => {
    setView('quiz');
    setLoading(true);
    setIsMockExam(true);
    setIsSelectionMode(false);
    setSelectedSubjectIds([]);
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

  const processGabaritoInput = () => {
    // Expected format: "1-A, 2-B" or "1 A 2 B" or "1A 2B" or just a string of letters if they are careful
    // Robust regex to find Question Number + Letter
    const regex = /(\d+)\s*[-:\s]*\s*([A-D])/gi;
    let match;
    const newAnswers = { ...answers };
    let found = false;
    
    while ((match = regex.exec(gabaritoInput)) !== null) {
      const qIndex = parseInt(match[1]) - 1;
      const letter = match[2].toUpperCase();
      
      if (questions[qIndex]) {
        newAnswers[questions[qIndex].id] = letter;
        found = true;
      }
    }

    if (!found) {
      // Fallback: try just finding individual letters if they just typed A B C D...
      const letters = gabaritoInput.match(/[A-D]/gi);
      if (letters) {
        letters.forEach((letter, idx) => {
          if (questions[idx]) {
            newAnswers[questions[idx].id] = letter.toUpperCase();
          }
        });
      }
    }
    
    setAnswers(newAnswers);
    setGabaritoInput('');
    setShowGabaritoInput(false);
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

  const exportQuestionPDF = (question: Question) => {
    const discipline = DISCIPLINES.find(d => d.id === question.disciplineId)?.title || 'Geral';
    const content = `CONCURSO: GUARDA MUNICIPAL DE MANAUS
DISCIPLINA: ${discipline.toUpperCase()}
NÍVEL: ${question.level.toUpperCase()}
--------------------------------------------------

QUESTÃO:
${question.textContext ? question.textContext + '\n\n' : ''}${question.statement}

ALTERNATIVAS:
${question.alternatives.map(alt => `${alt.id}) ${alt.text}`).join('\n')}

--------------------------------------------------
Gerado por: App Simulado GMM
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questao-${question.id.substring(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetQuiz = () => {
    setView('home');
    setSelectedDiscipline(null);
    setSelectedSubject(null);
    setQuestions([]);
    setAnswers({});
  };

  // --- Renderers ---

  const renderFlashCards = () => {
    const handleGenerateFlashcards = async () => {
      setIsGeneratingFlashcards(true);
      setError(null);
      try {
        let subjectsForGen: string | string[] = 'all';
        let disciplineId = 'all';

        if (flashcardSelectedDiscipline) {
          disciplineId = flashcardSelectedDiscipline.id;
          if (flashcardSelectedSubject) {
            subjectsForGen = flashcardSelectedSubject.title;
          } else {
            subjectsForGen = flashcardSelectedDiscipline.subjects.map(s => s.title);
          }
        } else {
          subjectsForGen = DISCIPLINES.map(d => d.title);
        }
        
        const newCards = await generateFlashCards(
          disciplineId,
          subjectsForGen,
          flashcardAmount,
          flashcardMode
        );
        setFlashcards(newCards);
        setCurrentFlashcardIndex(0);
        setIsFlashcardFlipped(false);
      } catch (err: any) {
        setError(err.message || 'Erro ao gerar flashcards');
      } finally {
        setIsGeneratingFlashcards(false);
      }
    };

    const handleFlip = () => setIsFlashcardFlipped(!isFlashcardFlipped);
    
    const handleNext = () => {
      if (currentFlashcardIndex < flashcards.length - 1) {
        setCurrentFlashcardIndex(currentFlashcardIndex + 1);
        setIsFlashcardFlipped(false);
      }
    };

    const handlePrev = () => {
      if (currentFlashcardIndex > 0) {
        setCurrentFlashcardIndex(currentFlashcardIndex - 1);
        setIsFlashcardFlipped(false);
      }
    };

    const toggleFavorite = (id: string) => {
      setFavoriteFlashcards(prev => 
        prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
      );
    };

    const toggleLearned = (id: string) => {
      setLearnedFlashcards(prev => 
        prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]
      );
    };

    const exportPDF = () => {
      const content = flashcards.map((c, i) => `
CARD ${i + 1}
FRENTE: ${c.front}
VERSO: ${c.back}
EXPLICAÇÃO: ${c.explanation}
BIZU: ${c.bizu}
-------------------`).join('\n');
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flashcards-${flashcardSelectedDiscipline?.title || 'geral'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    if (flashcards.length > 0) {
      const currentCard = flashcards[currentFlashcardIndex];
      const progress = ((currentFlashcardIndex + 1) / flashcards.length) * 100;

      return (
        <div className="max-w-4xl mx-auto space-y-8 pb-32 px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Estudo Ativo <span className="text-brand-primary">Cards</span></h2>
            <button 
              onClick={() => setFlashcards([])}
              className="px-4 py-2 bg-brand-card hover:bg-brand-bg border border-brand-border rounded-xl text-brand-text-muted text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Configurar Novo
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center space-y-1 bg-brand-bg border-brand-border">
              <p className="text-[8px] font-black text-brand-text-muted uppercase tracking-widest">Estudados</p>
              <p className="text-2xl font-black text-white">{learnedFlashcards.length}</p>
            </Card>
            <Card className="p-4 text-center space-y-1 bg-brand-bg border-brand-border">
              <p className="text-[8px] font-black text-brand-text-muted uppercase tracking-widest">Favoritos</p>
              <p className="text-2xl font-black text-brand-primary">{favoriteFlashcards.length}</p>
            </Card>
            <Card className="p-4 text-center space-y-1 bg-brand-bg border-brand-border">
              <p className="text-[8px] font-black text-brand-text-muted uppercase tracking-widest">Pendentes</p>
              <p className="text-2xl font-black text-zinc-500">{flashcards.length - learnedFlashcards.length}</p>
            </Card>
            <Card className="p-4 text-center space-y-1 bg-brand-bg border-brand-border">
              <p className="text-[8px] font-black text-brand-text-muted uppercase tracking-widest">Domínio</p>
              <p className="text-2xl font-black text-green-500">{Math.round((learnedFlashcards.length / flashcards.length) * 100)}%</p>
            </Card>
          </div>

          <div className="relative perspective-1000 min-h-[450px]">
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Progress Bar */}
              <div className="w-full max-w-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Card {currentFlashcardIndex + 1} de {flashcards.length}</span>
                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-brand-card rounded-full overflow-hidden border border-brand-border">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-brand-primary"
                  />
                </div>
              </div>

              {/* Flashcard */}
              <div 
                className="relative w-full max-w-lg cursor-pointer perspective-1000"
                style={{ height: '400px' }}
                onClick={handleFlip}
              >
                <div 
                  className={cn(
                    "w-full h-full relative transition-all duration-700 preserve-3d shadow-2xl",
                    isFlashcardFlipped ? "rotate-y-180" : ""
                  )}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-brand-card border-2 border-brand-border rounded-[32px] p-8 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="p-4 bg-brand-primary/10 rounded-2xl text-brand-primary">
                      <Brain size={40} />
                    </div>
                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">FRENTE</span>
                    <h3 className="text-2xl font-black text-white leading-tight">{currentCard.front}</h3>
                    <p className="text-brand-text-muted text-xs font-bold animate-pulse uppercase tracking-widest mt-8">Clique para virar</p>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-zinc-900 border-2 border-brand-primary/30 rounded-[32px] p-8 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em]">VERSO / RESPOSTA</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(currentCard.id); }}
                            className={cn("p-2 rounded-lg transition-all", favoriteFlashcards.includes(currentCard.id) ? "bg-red-500/20 text-red-500" : "bg-white/5 text-zinc-500")}
                          >
                            <Heart size={16} fill={favoriteFlashcards.includes(currentCard.id) ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-bold text-white leading-relaxed">{currentCard.back}</p>
                        {currentCard.explanation && (
                          <p className="text-sm text-zinc-400 font-medium border-l-2 border-zinc-700 pl-4">{currentCard.explanation}</p>
                        )}
                      </div>
                    </div>

                    {currentCard.bizu && (
                      <div className="mt-6 bg-brand-primary/10 border border-brand-primary/20 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap size={16} className="text-brand-primary" fill="currentColor" />
                          <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">BIZU DE PROVA</span>
                        </div>
                        <p className="text-xs font-bold text-brand-primary/90 leading-relaxed italic">
                          {currentCard.bizu}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6">
                <button 
                  onClick={handlePrev}
                  disabled={currentFlashcardIndex === 0}
                  className="p-4 bg-brand-card hover:bg-brand-bg rounded-2xl border border-brand-border text-white disabled:opacity-20 transition-all"
                >
                  <ArrowLeft size={24} />
                </button>

                <div 
                  onClick={() => toggleLearned(currentCard.id)}
                  className={cn(
                    "px-8 py-5 rounded-[24px] border-2 font-black uppercase tracking-widest transition-all shadow-xl cursor-pointer flex items-center gap-3",
                    learnedFlashcards.includes(currentCard.id) 
                      ? "bg-green-600/20 border-green-500 text-green-500"
                      : "bg-brand-primary border-brand-primary text-black hover:scale-105 active:scale-95"
                  )}
                >
                  {learnedFlashcards.includes(currentCard.id) ? (
                    <>
                      <CheckCircle2 size={24} />
                      Concluído
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={24} />
                      Marcar Como Aprendido
                    </>
                  )}
                </div>

                <button 
                  onClick={handleNext}
                  disabled={currentFlashcardIndex === flashcards.length - 1}
                  className="p-4 bg-brand-card hover:bg-brand-bg rounded-2xl border border-brand-border text-white disabled:opacity-20 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setFlashcards([...flashcards].sort(() => Math.random() - 0.5))}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest transition-all"
                >
                  <Shuffle size={14} />
                  Embaralhar
                </button>
                <button 
                  onClick={exportPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest transition-all"
                >
                  <Download size={14} />
                  Exportar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-12 pb-32 px-4">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary mx-auto shadow-2xl shadow-brand-primary/20"
          >
            <Brain size={40} />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Memorização <span className="text-brand-primary">Inteligente</span></h2>
            <p className="text-brand-text-muted font-bold text-sm uppercase tracking-widest">Estudo ativo com Flash Cards focado na Guarda Municipal de Manaus</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Main Config Card */}
          <Card className="bg-brand-card border-brand-border p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-brand-border pb-6">
              <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center text-brand-primary">
                <Rotate3d size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Configurar Cards</h3>
                <p className="text-xs text-brand-text-muted">Selecione o conteúdo e modo de estudo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Disciplina</label>
                  {flashcardSelectedDiscipline && (
                    <button 
                      onClick={() => {
                        setFlashcardSelectedDiscipline(null);
                        setFlashcardSelectedSubject(null);
                      }}
                      className="text-[9px] font-black text-brand-primary uppercase tracking-widest hover:underline"
                    >
                      Restaurar Todas
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => setIsFlashcardDisciplineModalOpen(true)}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-sm font-bold text-left flex items-center justify-between hover:border-brand-primary/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {flashcardSelectedDiscipline ? (
                      <>
                        <div className="text-brand-primary">
                          <DisciplineIcon icon={flashcardSelectedDiscipline.icon} size={18} />
                        </div>
                        <span className="text-white">{flashcardSelectedDiscipline.title}</span>
                      </>
                    ) : (
                      <span className="text-brand-text-muted">Todas as Disciplinas</span>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-brand-text-muted group-hover:text-brand-primary transition-colors" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Assunto</label>
                <button 
                  onClick={() => {
                    if (!flashcardSelectedDiscipline) {
                      setError("Selecione uma disciplina primeiro.");
                      return;
                    }
                    setIsFlashcardSubjectModalOpen(true);
                  }}
                  disabled={!flashcardSelectedDiscipline}
                  className={cn(
                    "w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-sm font-bold text-left flex items-center justify-between transition-all group",
                    !flashcardSelectedDiscipline ? "opacity-50 cursor-not-allowed" : "hover:border-brand-secondary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("transition-colors", flashcardSelectedSubject ? "text-brand-secondary" : "text-brand-text-muted")}>
                      <BookOpen size={18} />
                    </div>
                    <span className={cn(flashcardSelectedSubject ? "text-white" : "text-brand-text-muted")}>
                      {flashcardSelectedSubject ? flashcardSelectedSubject.title : "Toda a Matéria (Todos os Assuntos)"}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-brand-text-muted group-hover:text-brand-secondary transition-colors" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Modo de Geração</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Conceito e definição', 'Pergunta e resposta', 'Decoreba rápida', 'Pegadinhas de prova', 'Revisão final', 'Modo Misto'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setFlashcardMode(mode as FlashCardMode)}
                      className={cn(
                        "py-3 px-2 rounded-xl text-[9px] font-bold uppercase transition-all border text-center flex items-center justify-center gap-1",
                        flashcardMode === mode 
                          ? "bg-white/10 border-white text-white" 
                          : "bg-brand-bg border-brand-border text-brand-text-muted hover:border-white/30"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Quantidade de Cards</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 30, 50].map(n => (
                    <button
                      key={n}
                      onClick={() => setFlashcardAmount(n)}
                      className={cn(
                        "py-2.5 rounded-xl text-xs font-bold transition-all border",
                        flashcardAmount === n 
                          ? "bg-brand-primary border-brand-primary text-black" 
                          : "bg-brand-bg border-brand-border text-brand-text-muted hover:border-brand-primary/50"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGenerateFlashcards}
                disabled={isGeneratingFlashcards}
                className="w-full py-5 bg-brand-primary hover:bg-[#E5E5E5] text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                {isGeneratingFlashcards ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Gerando Bizus...
                  </>
                ) : (
                  <>
                    <Rotate3d size={24} className="group-hover:rotate-180 transition-transform duration-700" />
                    Gerar Flash Cards
                  </>
                )}
              </button>

              {favoriteFlashcards.length > 0 && (
                <button
                  onClick={() => {
                    const favs = flashcards.filter(c => favoriteFlashcards.includes(c.id));
                    if (favs.length > 0) {
                      setFlashcards(favs);
                      setCurrentFlashcardIndex(0);
                      setIsFlashcardFlipped(false);
                    }
                  }}
                  className="w-full py-4 border border-brand-primary text-brand-primary hover:bg-brand-primary/10 font-bold uppercase text-[10px] tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Heart size={14} fill="currentColor" />
                  Revisar Favoritos ({favoriteFlashcards.length})
                </button>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-center font-bold text-xs uppercase tracking-widest">{error}</p>
            )}
          </Card>

          {/* Info Card */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-brand-text-muted uppercase tracking-widest">Informações</h2>
            
            <Card className="bg-brand-card border-brand-border p-6 space-y-8">
              <div className="space-y-4">
                <div className="p-4 bg-brand-bg rounded-xl border border-brand-border space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/20 rounded-lg text-brand-primary">
                      <Brain size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase">O que são flashcards?</h4>
                    </div>
                  </div>
                  <p className="text-xs text-brand-text-muted leading-relaxed">
                    Flashcards são pequenos cartões com uma pergunta na frente e a resposta no verso. 
                    É uma das técnicas mais eficazes de <span className="text-brand-primary font-bold">REPETIÇÃO ESPAÇADA</span> para memorização de longo prazo.
                  </p>
                </div>

                <div className="p-4 bg-brand-bg rounded-xl border border-brand-border space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-secondary/20 rounded-lg text-brand-secondary">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase">Modo Bizu</h4>
                    </div>
                  </div>
                  <p className="text-xs text-brand-text-muted leading-relaxed">
                    Nossa IA foca no padrão <span className="text-brand-secondary font-bold">CONSULPLAN</span>, destacando exatamente o que costuma cair de forma direta e objetiva.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Modals for Flashcards selection */}
        <DisciplineModal 
          isOpen={isFlashcardDisciplineModalOpen}
          onClose={() => setIsFlashcardDisciplineModalOpen(false)}
          onSelect={(d) => {
            setFlashcardSelectedDiscipline(d);
            setFlashcardSelectedSubject(null);
          }}
          selectedId={flashcardSelectedDiscipline?.id}
          searchTerm={disciplineSearch}
          setSearchTerm={setDisciplineSearch}
        />

        <SubjectModal 
          isOpen={isFlashcardSubjectModalOpen}
          onClose={() => setIsFlashcardSubjectModalOpen(false)}
          onSelect={setFlashcardSelectedSubject}
          selectedId={flashcardSelectedSubject?.id}
          searchTerm={subjectSearch}
          setSearchTerm={setSubjectSearch}
          subjects={flashcardSelectedDiscipline?.subjects || []}
        />
      </div>
    );
  };

  const renderLanding = () => (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brand-bg relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[120px]" />
      
      <div className="max-w-4xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-10"
          >
            <Logo size="lg" />
          </motion.div>
        </div>

        <div className="space-y-12">
          {/* Section: Municipais */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-brand-primary/20" />
              <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] whitespace-nowrap">Municipais</h3>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-brand-primary/20" />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-1 gap-6"
            >
              <Card 
                onClick={() => setView('mock-exams')}
                className="group p-6 bg-brand-card/90 hover:bg-brand-card border-brand-border/50 hover:border-blue-900/50 transition-all cursor-pointer relative overflow-hidden min-h-[220px] flex items-center shadow-2xl"
              >
                {/* Vector-style background decoration */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-brand-card to-blue-950/20 flex items-center justify-center pointer-events-none">
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-colors duration-500" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-900/5 rounded-full blur-2xl group-hover:bg-blue-900/10 transition-colors duration-500" />
                  
                  <div className="relative transform rotate-12 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700 group-hover:scale-110 group-hover:rotate-0">
                    <Shield size={200} className="text-blue-500" strokeWidth={0.5} />
                  </div>
                </div>

                <div className="relative z-10 w-full flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-500/10 backdrop-blur-xl rounded-full flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xl shrink-0">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
                      <Shield size={10} className="text-blue-400" />
                      <span className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em]">Concurso 2026</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors leading-none">GUARDA MUNICIPAL <br/><span className="text-blue-400 uppercase">DE MANAUS</span></h3>
                    
                    <p className="text-xs text-brand-text-muted mt-2 font-bold uppercase tracking-widest leading-relaxed">
                      Cronograma completo, simulados especializados e bizus focados no edital 2026.
                    </p>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                      <div className="space-y-1.5">
                        <h4 className="text-blue-400 text-[7px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">Básicas</h4>
                        <div className="flex flex-wrap gap-1 focus:outline-none">
                          {['Português', 'Informática', 'Geografia', 'História', 'Ética/DH'].map(s => (
                            <span key={s} className="text-brand-text-muted text-[6px] font-bold uppercase bg-white/5 border border-white/10 px-1 py-0.5 rounded transition-all cursor-default hover:text-blue-300 hover:border-blue-500/30">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-blue-400 text-[7px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">Direito</h4>
                        <div className="flex flex-wrap gap-1">
                          {['Constitucional', 'Penal I', 'Penal II', 'Proc. Penal'].map(s => (
                            <span key={s} className="text-brand-text-muted text-[6px] font-bold uppercase bg-white/5 border border-white/10 px-1 py-0.5 rounded transition-all cursor-default hover:text-blue-300 hover:border-blue-500/30">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-blue-400 text-[7px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">Legislação</h4>
                        <div className="flex flex-wrap gap-1">
                          {['Trânsito', 'Específica'].map(s => (
                            <span key={s} className="text-brand-text-muted text-[6px] font-bold uppercase bg-white/5 border border-white/10 px-1 py-0.5 rounded transition-all cursor-default hover:text-blue-300 hover:border-blue-500/30">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between opacity-30">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[6px] font-bold text-white uppercase tracking-widest">Sincronizado Edital</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap size={8} className="text-blue-400" />
                        <span className="text-[6px] font-bold text-white uppercase tracking-widest italic">Prepare-se IA</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-brand-text-muted group-hover:text-blue-400 group-hover:translate-x-1 transition-all" size={24} />
                </div>
              </Card>

              {/* Nova Aba: FLASH CARDS */}
              <Card 
                onClick={() => setView('flashcards')}
                className="group p-6 bg-brand-card/90 hover:bg-brand-card border-brand-border/50 hover:border-brand-primary/50 transition-all cursor-pointer relative overflow-hidden min-h-[160px] flex items-center shadow-2xl"
              >
                {/* Background Decoration */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-brand-card to-brand-primary/5 flex items-center justify-center pointer-events-none">
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/10 transition-colors duration-500" />
                  <div className="relative transform rotate-12 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700 group-hover:scale-110 group-hover:rotate-0">
                    <Zap size={200} className="text-brand-primary" strokeWidth={0.5} />
                  </div>
                </div>

                <div className="relative z-10 w-full flex items-center gap-6">
                  <div className="w-16 h-16 bg-brand-primary/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/20 group-hover:bg-brand-primary group-hover:text-black group-hover:scale-110 transition-all duration-300 shadow-xl shrink-0">
                    <Zap size={32} fill="currentColor" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-2">
                      <Sparkles size={10} className="text-brand-primary" />
                      <span className="text-[8px] font-black text-brand-primary uppercase tracking-[0.2em]">Memorização Ativa</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight group-hover:text-brand-primary transition-colors leading-none">FLASH CARDS <br/><span className="text-brand-primary uppercase">INTELIGENTES</span></h3>
                    <p className="text-xs text-brand-text-muted mt-2 font-bold uppercase tracking-widest leading-relaxed">
                      Transforme assuntos complexos em bizus memoráveis. <br/>
                      <span className="text-brand-primary/50 text-[10px]">Focado no edital GMM</span>
                    </p>
                  </div>
                  <ChevronRight className="text-brand-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all" size={32} />
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Section: Polícia */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-brand-primary/20" />
              <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] whitespace-nowrap">Polícia</h3>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-brand-primary/20" />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid md:grid-cols-1 gap-6"
            >
              <Card 
                onClick={() => setView('home')}
                className="group p-6 bg-brand-card/90 hover:bg-brand-card border-brand-border/50 hover:border-red-900/50 transition-all cursor-pointer relative overflow-hidden min-h-[220px] flex items-center shadow-2xl"
              >
                {/* Vector-style background decoration (Penal Theme) */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-brand-card to-red-950/20 flex items-center justify-center pointer-events-none">
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/10 transition-colors duration-500" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-900/5 rounded-full blur-2xl group-hover:bg-red-900/10 transition-colors duration-500" />
                  
                  <div className="relative transform rotate-12 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700 group-hover:scale-110 group-hover:rotate-0">
                    <VenetianMask size={200} className="text-red-500" strokeWidth={0.5} />
                  </div>
                </div>

                <div className="relative z-10 w-full flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-500/10 backdrop-blur-xl rounded-full flex items-center justify-center text-red-500 border border-red-500/20 group-hover:bg-red-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xl shrink-0">
                    <Lock size={24} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 mb-2">
                      <Shield size={10} className="text-red-500" />
                      <span className="text-[8px] font-black text-red-500 uppercase tracking-[0.2em]">Concurso 2026</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors leading-none">POLÍCIA PENAL <br/><span className="text-red-500 uppercase">DO AMAZONAS</span></h3>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                      <div className="space-y-1.5">
                        <h4 className="text-red-500 text-[7px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">Básicas</h4>
                        <div className="flex flex-wrap gap-1 focus:outline-none">
                          {['Português', 'Informática', 'Raciocínio', 'História', 'Geografia'].map(s => (
                            <span key={s} className="text-brand-text-muted text-[6px] font-bold uppercase bg-white/5 border border-white/10 px-1 py-0.5 rounded transition-all cursor-default hover:text-red-300 hover:border-red-500/30">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-red-500 text-[7px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">Direito</h4>
                        <div className="flex flex-wrap gap-1">
                          {['Constitucional', 'Administrativo', 'Penal', 'Proc. Penal'].map(s => (
                            <span key={s} className="text-brand-text-muted text-[6px] font-bold uppercase bg-white/5 border border-white/10 px-1 py-0.5 rounded transition-all cursor-default hover:text-red-300 hover:border-red-500/30">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-red-500 text-[7px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">Criminologia</h4>
                        <div className="flex flex-wrap gap-1">
                          {['LEP', 'DH', 'Criminologia'].map(s => (
                            <span key={s} className="text-brand-text-muted text-[6px] font-bold uppercase bg-white/5 border border-white/10 px-1 py-0.5 rounded transition-all cursor-default hover:text-red-300 hover:border-red-500/30">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between opacity-30">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[6px] font-bold text-white uppercase tracking-widest">Sincronizado Edital</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap size={8} className="text-red-500" />
                        <span className="text-[6px] font-bold text-white uppercase tracking-widest italic">Prepare-se IA</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-brand-text-muted group-hover:text-red-500 group-hover:translate-x-1 transition-all" size={24} />
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center pt-8"
        >
          <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.4em] opacity-40">BIZU QUESTOES V1.0</p>
        </motion.div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      
      <DisciplineModal 
        isOpen={isDisciplineModalOpen}
        onClose={() => setIsDisciplineModalOpen(false)}
        onSelect={setSelectedDiscipline}
        selectedId={selectedDiscipline?.id}
        searchTerm={disciplineSearch}
        setSearchTerm={setDisciplineSearch}
      />

      <SubjectModal 
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSelect={setSelectedSubject}
        selectedId={selectedSubject?.id}
        searchTerm={subjectSearch}
        setSearchTerm={setSubjectSearch}
        subjects={selectedDiscipline?.subjects || []}
      />

      <BancaModal 
        isOpen={isBancaModalOpen}
        onClose={() => setIsBancaModalOpen(false)}
        onSelect={setSelectedBanca}
        selectedBanca={selectedBanca}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Generator Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Dashboard</h2>
            <div className="flex items-center gap-2 text-brand-text-muted text-xs font-bold uppercase">
              <TimerIcon size={14} />
              Sessão Ativa
            </div>
          </div>

          <Card className="bg-brand-card border-brand-border p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-brand-border pb-6">
              <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center text-brand-primary">
                <Play size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Gerador de Questões</h3>
                <p className="text-xs text-brand-text-muted">Configure e inicie seu treinamento personalizado</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Disciplina</label>
                <button 
                  onClick={() => setIsDisciplineModalOpen(true)}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-sm font-bold text-left flex items-center justify-between hover:border-brand-primary/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {selectedDiscipline ? (
                      <>
                        <div className="text-brand-primary">
                          <DisciplineIcon icon={selectedDiscipline.icon} size={18} />
                        </div>
                        <span className="text-white">{selectedDiscipline.title}</span>
                      </>
                    ) : (
                      <span className="text-brand-text-muted">Selecione a Disciplina</span>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-brand-text-muted group-hover:text-brand-primary transition-colors" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Assunto</label>
                <button 
                  onClick={() => {
                    if (!selectedDiscipline) {
                      setError("Selecione uma disciplina primeiro.");
                      return;
                    }
                    setIsSubjectModalOpen(true);
                  }}
                  disabled={!selectedDiscipline}
                  className={cn(
                    "w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-sm font-bold text-left flex items-center justify-between transition-all group",
                    !selectedDiscipline ? "opacity-50 cursor-not-allowed" : "hover:border-brand-secondary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("transition-colors", selectedSubject ? "text-brand-secondary" : "text-brand-text-muted")}>
                      <BookOpen size={18} />
                    </div>
                    <span className={cn(selectedSubject ? "text-white" : "text-brand-text-muted")}>
                      {selectedSubject ? selectedSubject.title : "Todos os Assuntos"}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-brand-text-muted group-hover:text-brand-secondary transition-colors" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Banca Organizadora</label>
                <button 
                  onClick={() => setIsBancaModalOpen(true)}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl p-4 text-sm font-bold text-left flex items-center justify-between hover:border-brand-primary/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-brand-primary">
                      <Zap size={18} />
                    </div>
                    <span className="text-white">{selectedBanca}</span>
                  </div>
                  <ChevronRight size={16} className="text-brand-text-muted group-hover:text-brand-primary transition-colors" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Nível de Dificuldade</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Fácil', 'Médio', 'Difícil'].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={cn(
                        "py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all border",
                        selectedLevel === lvl 
                          ? "bg-brand-primary border-brand-primary text-black" 
                          : "bg-brand-bg border-brand-border text-brand-text-muted hover:border-brand-primary/50"
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Quantidade de Questões</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 30, 50].map(n => (
                    <button
                      key={n}
                      onClick={() => setAmount(n)}
                      className={cn(
                        "py-2.5 rounded-xl text-xs font-bold transition-all border",
                        amount === n 
                          ? "bg-brand-primary border-brand-primary text-black" 
                          : "bg-brand-bg border-brand-border text-brand-text-muted hover:border-brand-primary/50"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!selectedDiscipline) {
                  setError("Selecione uma disciplina para começar.");
                  return;
                }
                startQuiz(amount);
                setView('quiz');
              }}
              disabled={loading}
              className="w-full py-5 bg-brand-primary hover:bg-[#E5E5E5] text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 group"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <Play size={20} fill="currentColor" />
                  Gerar Questões Inéditas
                </>
              )}
            </button>
            {error && <p className="text-center text-red-500 text-xs font-bold">{error}</p>}
          </Card>
        </div>

        {/* Sidebar Progress Card */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-brand-text-muted uppercase tracking-widest">Seu Progresso</h2>
          
          <Card className="bg-brand-card border-brand-border p-6 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-text-muted uppercase">Questões Hoje</span>
                  <span className="text-xl font-black text-white">{stats.doneToday}</span>
                </div>
                <div className="w-full h-2 bg-brand-bg rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary" style={{ width: `${Math.min((stats.doneToday / 50) * 100, 100)}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-brand-bg rounded-xl border border-brand-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-secondary/20 rounded-lg text-brand-secondary">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-brand-text-muted uppercase">Acertos</p>
                    <p className="text-lg font-black text-white">{stats.accuracy}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/20 rounded-lg text-brand-primary">
                    <TimerIcon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-brand-text-muted uppercase">Tempo Médio</p>
                    <p className="text-lg font-black text-white">{stats.avgTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-brand-border">
              <h4 className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Acesso Rápido</h4>
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => setView('essay-perfect')} className="flex items-center justify-between p-3 bg-brand-bg hover:bg-brand-card border border-brand-border rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <PenTool size={16} className="text-brand-primary" />
                    <span className="text-xs font-bold text-white">Redação Perfeita</span>
                  </div>
                  <ChevronRight size={14} className="text-brand-text-muted group-hover:text-white" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderDisciplines = () => {
    const categories = [
      { name: 'Básicas', ids: ['portugues', 'informatica', 'geografia_historia_regional', 'etica_direitos_humanos'] },
      { name: 'Direito', ids: ['direito_constitucional', 'direito_penal', 'direito_penal_2', 'direito_processual_penal'] },
      { name: 'Legislação', ids: ['legislacao_transito', 'legislacao_especifica'] }
    ];

    const filtered = DISCIPLINES.filter(d => 
      d.title.toLowerCase().includes(disciplineSearch.toLowerCase())
    );

    return (
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-primary/20 rounded-2xl text-brand-primary">
              <Library size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Disciplinas</h2>
              <p className="text-brand-text-muted text-xs font-bold uppercase tracking-widest">Explore o conteúdo programático</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:w-80">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted" size={18} />
              <input 
                type="text"
                placeholder="Buscar disciplina..."
                value={disciplineSearch}
                onChange={(e) => setDisciplineSearch(e.target.value)}
                className="w-full bg-brand-card border border-brand-border rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:ring-2 focus:ring-brand-primary/30 outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => setView('home')} 
              className="px-6 py-3 bg-brand-bg hover:bg-brand-card border border-brand-border rounded-2xl text-xs font-black text-white uppercase tracking-widest transition-all"
            >
              Voltar
            </button>
          </div>
        </div>
        
        <div className="space-y-12">
          {categories.map(cat => {
            const catDisciplines = filtered.filter(d => cat.ids.includes(d.id));
            if (catDisciplines.length === 0) return null;

            return (
              <div key={cat.name} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-brand-border" />
                  <h3 className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.3em] whitespace-nowrap">{cat.name}</h3>
                  <div className="h-px flex-1 bg-brand-border" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {catDisciplines.map((discipline) => (
                    <Card 
                      key={discipline.id} 
                      onClick={() => handleSelectDiscipline(discipline)} 
                      className="flex flex-col gap-4 p-6 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                        <DisciplineIcon icon={discipline.icon} size={80} />
                      </div>
                      
                      <div className="flex items-center justify-between relative z-10">
                        <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary group-hover:bg-brand-primary group-hover:text-black transition-all">
                          <DisciplineIcon icon={discipline.icon} size={24} />
                        </div>
                        <div className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-text-muted group-hover:border-brand-primary group-hover:text-brand-primary transition-all">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                      
                      <div className="space-y-1 relative z-10">
                        <h4 className="text-lg font-black text-white leading-tight group-hover:text-brand-primary transition-colors">{discipline.title}</h4>
                        <p className="text-[10px] text-brand-text-muted uppercase font-black tracking-widest">{discipline.subjects.length} Assuntos Disponíveis</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-brand-card rounded-full flex items-center justify-center mx-auto text-brand-text-muted">
              <Library size={40} />
            </div>
            <h3 className="text-xl font-bold text-white">Nenhuma disciplina encontrada</h3>
            <p className="text-brand-text-muted">Tente buscar por outro termo ou limpe o filtro.</p>
          </div>
        )}
      </div>
    );
  };

  const renderMockExams = () => (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-brand-primary border-brand-primary/50 p-8 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Trophy size={120} className="text-black" />
          </div>
          <div className="space-y-2 relative z-10">
            <h3 className="text-2xl font-black text-black uppercase tracking-tighter">Simulado Completo</h3>
            <p className="text-black/60 text-sm">65 Questões • Padrão Consulplan • Todas as Matérias</p>
          </div>
          <button 
            onClick={startMockExam}
            className="w-full py-4 bg-black text-white font-black uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-black/90 transition-all"
          >
            <Play size={18} fill="currentColor" />
            Iniciar Agora
          </button>
        </Card>

        <Card className="bg-brand-card border-brand-border p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Simulado por Matéria</h3>
            <p className="text-brand-text-muted text-sm">Escolha uma disciplina para um simulado focado.</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {DISCIPLINES.slice(0, 4).map(d => (
              <button 
                key={d.id}
                onClick={() => handleSelectDiscipline(d)}
                className="flex items-center justify-between p-3 bg-brand-bg hover:bg-brand-border border border-brand-border rounded-xl text-xs font-bold text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-brand-primary group-hover:scale-110 transition-transform">
                    <DisciplineIcon icon={d.icon} size={16} />
                  </div>
                  {d.title}
                </div>
                <ChevronRight size={14} className="text-brand-text-muted group-hover:text-white" />
              </button>
            ))}
            <button onClick={() => setView('disciplines')} className="text-center text-[10px] font-bold text-brand-primary uppercase mt-2 hover:underline">Ver todas as matérias</button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSubjects = () => {
    const toggleSubject = (id: string) => {
      setSelectedSubjectIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    };

    const startCustomMock = () => {
      const selectedTitles = selectedDiscipline?.subjects
        .filter(s => selectedSubjectIds.includes(s.id))
        .map(s => s.title) || [];
      
      startQuiz(amount, selectedTitles); 
      setView('quiz');
    };

    return (
      <div className="max-w-4xl mx-auto p-4 space-y-8 pb-52">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card 
            onClick={() => {
              setSelectedSubject(null);
              setView('quiz');
            }} 
            className="bg-brand-primary border-brand-primary hover:bg-[#E5E5E5] flex items-center justify-between group p-6 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <BarChart3 size={80} className="text-black" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-black/5 rounded-xl text-black">
                <BarChart3 size={28} />
              </div>
              <div>
                <span className="text-xl font-black text-black uppercase tracking-tight">Simulado Geral</span>
                <p className="text-black/60 text-[10px] font-bold uppercase tracking-widest">Questões de todos os temas</p>
              </div>
            </div>
            <Play className="text-black relative z-10" fill="currentColor" size={24} />
          </Card>

            <Card 
              onClick={() => {
                setSelectedSubject(null);
                startReview({ id: 'all', title: 'Geral' } as any);
              }} 
              className="bg-brand-card border-brand-border hover:border-brand-primary/50 flex items-center justify-between group p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <AlertCircle size={80} className="text-white" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <span className="text-xl font-black text-white uppercase tracking-tight">Reta Final</span>
                  <p className="text-brand-text-muted text-[10px] font-bold uppercase tracking-widest">Revisão estratégica</p>
                </div>
              </div>
              <ChevronRight className="text-brand-primary relative z-10" size={24} />
            </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.3em] whitespace-nowrap">Assuntos Específicos</h3>
            <button 
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                if (isSelectionMode) setSelectedSubjectIds([]);
              }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
                isSelectionMode 
                  ? "bg-brand-secondary border-brand-secondary text-brand-bg" 
                  : "bg-brand-card border-brand-border text-brand-text-muted hover:text-white"
              )}
            >
              {isSelectionMode ? 'Cancelar Seleção' : 'Selecionar Múltiplos'}
            </button>
          </div>
          
          <div className="grid gap-3">
            {selectedDiscipline?.subjects.map((subject) => {
              const isSelected = selectedSubjectIds.includes(subject.id);
              
              return (
                <Card 
                  key={subject.id} 
                  onClick={() => isSelectionMode && toggleSubject(subject.id)}
                  className={cn(
                    "flex items-center justify-between p-5 bg-brand-card border transition-all group",
                    isSelectionMode ? (isSelected ? "border-brand-secondary bg-brand-secondary/5" : "border-brand-border hover:border-brand-secondary/30") : "border-brand-border hover:border-brand-primary/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      isSelectionMode 
                        ? (isSelected ? "bg-brand-secondary text-brand-bg" : "bg-brand-bg text-brand-text-muted") 
                        : "bg-brand-bg text-brand-text-muted group-hover:text-brand-primary"
                    )}>
                      {isSelectionMode && isSelected ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
                    </div>
                    <div>
                      <h4 className={cn(
                        "text-sm font-bold transition-colors",
                        isSelectionMode ? (isSelected ? "text-brand-secondary" : "text-white") : "text-white group-hover:text-brand-primary"
                      )}>{subject.title}</h4>
                      <p className="text-[10px] text-brand-text-muted uppercase font-bold">
                        {isSelectionMode ? (isSelected ? 'Selecionado' : 'Clique para selecionar') : 'Pronto para praticar'}
                      </p>
                    </div>
                  </div>
                  {!isSelectionMode && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleSelectSubject(subject); }}
                        className="px-4 py-2 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                      >
                        Questões
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); startReview(subject); }}
                        className="px-4 py-2 bg-brand-secondary/10 hover:bg-brand-secondary text-brand-secondary hover:text-brand-bg text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                      >
                        Revisão
                      </button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Floating Custom Mock Button */}
        <AnimatePresence>
          {isSelectionMode && selectedSubjectIds.length > 0 && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-50 space-y-3"
            >
              <div className="bg-brand-card/90 backdrop-blur-md border border-brand-border p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
                <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest pl-2">Questões:</span>
                <div className="flex gap-2">
                  {[10, 20, 30, 50].map(n => (
                    <button
                      key={n}
                      onClick={() => setAmount(n)}
                      className={cn(
                        "w-10 py-2 rounded-xl text-[10px] font-black transition-all border",
                        amount === n 
                          ? "bg-brand-secondary border-brand-secondary text-brand-bg" 
                          : "bg-brand-bg border-brand-border text-brand-text-muted hover:border-brand-secondary/50"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={startCustomMock}
                className="w-full py-5 bg-brand-secondary text-brand-bg font-black uppercase tracking-widest rounded-2xl shadow-2xl flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Zap size={20} fill="currentColor" />
                Iniciar com {selectedSubjectIds.length} Assuntos
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderQuiz = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <Loader2 className="animate-spin text-brand-primary" size={48} />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white uppercase tracking-tighter">
              {isMockExam ? `Gerando Simulado (${Math.round(mockExamProgress)}%)...` : 'Gerando questões inéditas...'}
            </h3>
            <p className="text-brand-text-muted text-sm">Nossa IA está simulando o padrão Consulplan para você.</p>
            {error && <p className="text-red-500 font-bold mt-4">{error}</p>}
          </div>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="max-w-xl mx-auto p-4 space-y-8">
          <Header 
            view={view} 
            onBack={() => setView('subjects')} 
            title={selectedSubject?.title || `Simulado: ${selectedDiscipline?.title}`} 
            setView={setView} 
          />
          <Card className="bg-brand-card border-brand-border p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto text-white">
              <Play size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Pronto para começar?</h3>
              <p className="text-brand-text-muted">Escolha a quantidade de questões para este simulado.</p>
              {error && <p className="text-red-500 font-bold mt-4">{error}</p>}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[10, 20, 50].map(n => (
                <button
                  key={n}
                  onClick={() => startQuiz(n)}
                  className="py-3 px-4 bg-[#1A1A1A] hover:bg-white text-white hover:text-black font-bold rounded-xl transition-all border border-[#2A2A2A]"
                >
                  {n} Questões
                </button>
              ))}
            </div>
          </Card>
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
                    onClick={() => exportQuestionPDF(currentQuestion)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all flex items-center gap-2"
                    title="Exportar Questão (Sem Resposta)"
                  >
                    <Download size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">PDF</span>
                  </button>
                  <button 
                    onClick={() => toggleFavorite(currentQuestion.id)}
                    className={cn("transition-colors", favorites.includes(currentQuestion.id) ? "text-yellow-500" : "text-zinc-600")}
                  >
                    <Star size={20} fill={favorites.includes(currentQuestion.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {isMockExam && !showGabarito && (
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.2em]">Resposta Rápida</h5>
                    <button 
                      onClick={() => setShowGabaritoInput(!showGabaritoInput)}
                      className="text-[10px] font-bold text-blue-400 hover:underline px-2 py-1"
                    >
                      {showGabaritoInput ? 'Fechar' : 'Digitar Gabarito Completo'}
                    </button>
                  </div>
                  
                  {showGabaritoInput ? (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <textarea 
                        value={gabaritoInput}
                        onChange={(e) => setGabaritoInput(e.target.value)}
                        placeholder="Ex: 1-A, 2-B, 3-C..."
                        className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white hide-scrollbar focus:border-brand-primary outline-none"
                      />
                      <button 
                        onClick={processGabaritoInput}
                        className="w-full py-2 bg-brand-primary text-black font-black text-[10px] uppercase tracking-widest rounded-lg"
                      >
                        Aplicar Gabarito
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex flex-wrap gap-2 py-2 overflow-x-auto no-scrollbar pb-4 border-b border-white/5">
                      {questions.map((q, idx) => (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] border transition-all shrink-0",
                            currentQuestionIndex === idx ? "bg-brand-primary border-brand-primary text-black scale-110" : 
                            answers[q.id] ? "bg-blue-900/40 border-blue-600 text-blue-100" :
                            "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-500"
                          )}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
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
                  className="flex-[2] py-4 bg-brand-primary hover:bg-[#E5E5E5] text-black font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
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
                  className="flex-[2] py-4 bg-brand-primary hover:bg-[#E5E5E5] text-black font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
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

    const sortedDisciplines = isMockExam ? Object.entries(disciplineBreakdown)
      .map(([id, stats]) => ({
        id,
        title: DISCIPLINES.find(d => d.id === id)?.title || '',
        percentage: (stats.correct / stats.total) * 100,
        ...stats
      }))
      .sort((a, b) => b.percentage - a.percentage) : [];

    const bestDiscipline = sortedDisciplines[0];
    const worstDiscipline = sortedDisciplines[sortedDisciplines.length - 1];

    return (
      <div className="max-w-4xl mx-auto p-4 py-12 space-y-8">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "inline-block p-4 rounded-full shadow-lg",
              isMockExam && totalScore >= 70 ? "bg-green-600 shadow-green-600/40" : "bg-brand-primary shadow-brand-primary/40"
            )}
          >
            <Trophy size={48} className="text-white" />
          </motion.div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            {isMockExam ? 'Simulado Concluído!' : 'Quiz Finalizado!'}
          </h2>
          {isMockExam && (
            <div className="text-4xl font-black text-white mt-4 bg-white/5 py-3 rounded-2xl border border-white/10 uppercase tracking-tighter">
              Sua nota foi: <span className={cn(totalScore >= 70 ? "text-green-500" : "text-brand-primary")}>{totalScore.toFixed(1)}/100</span>
            </div>
          )}
          <p className="text-brand-text-muted">
            {isMockExam 
              ? 'Confira seu desempenho detalhado por disciplina abaixo' 
              : `Você finalizou o estudo de ${selectedSubject?.title}.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center p-6 space-y-2 border-t-4 border-t-brand-primary bg-brand-card">
            <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Pontuação Total</span>
            <div className="text-4xl font-black text-white">
              {isMockExam ? totalScore.toFixed(1) : correctAnswers}
              <span className="text-lg text-brand-text-muted font-normal ml-1">
                / {isMockExam ? '100' : totalQuestions}
              </span>
            </div>
          </Card>
          <Card className="text-center p-6 space-y-2 border-t-4 border-t-brand-secondary bg-brand-card">
            <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Acertos</span>
            <div className="text-4xl font-black text-brand-secondary">
              {correctAnswers}
              <span className="text-lg text-brand-text-muted font-normal ml-1">/{totalQuestions}</span>
            </div>
          </Card>
          <Card className="text-center p-6 space-y-2 border-t-4 border-t-purple-600 bg-brand-card">
            <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest">Aproveitamento</span>
            <div className="text-4xl font-black text-purple-500">
              {percentage.toFixed(1)}%
            </div>
          </Card>
        </div>

        {isMockExam && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-brand-primary" size={24} />
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Feedback por Matéria</h3>
            </div>
            
            <div className="grid gap-4">
              {sortedDisciplines.map((item) => (
                <Card key={item.id} className="p-5 space-y-4 bg-zinc-900 border-zinc-800">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm uppercase tracking-tight">{item.title}</span>
                      <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Peso: {MOCK_EXAM_STRUCTURE.find(s => s.disciplineId === item.id)?.weight.toFixed(1)}</span>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-lg uppercase border",
                      item.percentage >= 70 ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      item.percentage >= 50 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                      "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      {item.score.toFixed(1)} / {item.maxScore.toFixed(1)} pts ({item.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
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
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-zinc-500 italic">Acertos: {item.correct} de {item.total}</span>
                    <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400">
                      {item.percentage >= 70 ? '🎯 Excelente' : item.percentage >= 50 ? '⚠️ Atenção' : '❌ Precisa Revisar'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-brand-secondary/5 border border-brand-secondary/20 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-brand-secondary font-bold uppercase text-xs tracking-widest">
                  <CheckCircle2 size={18} />
                  Ponto Forte
                </div>
                <p className="text-sm text-brand-text-muted">
                  Você teve um excelente desempenho em <span className="text-white font-bold">{bestDiscipline?.title}</span>. Continue mantendo esse nível!
                </p>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs tracking-widest">
                  <AlertCircle size={18} />
                  Ponto de Atenção
                </div>
                <p className="text-sm text-brand-text-muted">
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
            className="w-full py-5 bg-brand-primary hover:bg-[#E5E5E5] text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
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
            className="w-full py-5 bg-black hover:bg-white hover:text-black border border-white/20 text-white font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            {isMockExam ? 'Refazer Simulado (Novas Questões)' : 'Gerar Novas Questões'}
          </button>

          <button
            onClick={() => setView('home')}
            className="w-full py-5 text-brand-text-muted hover:text-white font-bold uppercase tracking-widest text-xs transition-all"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    );
  };

  const renderReview = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <Loader2 className="animate-spin text-brand-primary" size={48} />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white uppercase tracking-tighter">
              Ativando MODO RETA FINAL...
            </h3>
            <p className="text-brand-text-muted">Preparando sua revisão estratégica de 48 horas.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6">
        <Header 
          view={view}
          onBack={() => setView('subjects')} 
          title="MODO RETA FINAL (2 DIAS)" 
          subtitle={`${selectedDiscipline?.title} • ${selectedSubject?.id === 'all' ? 'Revisão Geral' : selectedSubject?.title}`}
          setView={setView}
        />
        
        <div className="bg-orange-600/10 border border-orange-600/30 rounded-2xl p-4 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="text-orange-400 font-bold uppercase text-sm">Atenção Candidato!</h4>
            <p className="text-zinc-400 text-xs">Faltam apenas 2 dias. Foque no que realmente cai. Esta revisão é estratégica e direta.</p>
          </div>
        </div>

        <Card className="prose prose-invert max-w-none prose-orange bg-zinc-900/80 border-orange-900/20">
          <div className="markdown-body">
            <ReactMarkdown>{reviewContent}</ReactMarkdown>
          </div>
        </Card>

        <div className="flex gap-4">
          <button
            onClick={() => {
              if (selectedSubject?.id === 'all') {
                setSelectedSubject(null);
                setView('quiz');
              } else {
                handleSelectSubject(selectedSubject!);
              }
            }}
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Play size={20} />
            Praticar com Questões
          </button>
          <button
            onClick={() => setView('subjects')}
            className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all"
          >
            Voltar aos Assuntos
          </button>
        </div>
      </div>
    );
  };

  const renderEssayPerfect = () => {
    const themes = [
      {
        id: 'feminicidio',
        theme: 'Feminicídio',
        description: 'O aumento dos casos de feminicídio no Brasil e os desafios no combate à violência contra a mulher.',
        structure: 'Introdução: Contextualizar a Lei Maria da Penha e o conceito de feminicídio. Desenvolvimento: Discutir raízes patriarcais e falhas na rede de proteção. Conclusão: Fortalecimento de delegacias especializadas e educação de base.',
        arguments: ['Raízes históricas do patriarcado', 'Ineficiência das medidas protetivas'],
        keywords: ['Violência de gênero', 'Patriarcalismo', 'Medidas protetivas', 'Impunidade'],
        fullModel: {
          intro: 'Diante do cenário contemporâneo, a persistência do feminicídio no Brasil revela uma grave lacuna entre a legislação e a realidade social. Nesse sentido, é imperativo analisar como o legado patriarcal e a insuficiência das políticas públicas fomentam esse entrave.',
          dev1: 'Em primeiro lugar, vale ressaltar que a herança cultural machista é um fator determinante. Historicamente, a mulher foi colocada em posição de submissão, o que naturaliza a violência de gênero. Assim, o crime de feminicídio é o ápice de um ciclo de abusos não interrompido.',
          dev2: 'Além disso, a ineficiência das medidas protetivas agrava a problemática. Muitas vítimas, mesmo após denunciarem, permanecem vulneráveis devido à demora judicial e à falta de monitoramento eficaz dos agressores. Logo, a impunidade serve como combustível para a reincidência.',
          concl: 'Portanto, medidas são necessárias para mitigar esse impasse. Cabe ao Ministério da Educação promover campanhas de conscientização nas escolas, por meio de palestras, visando desconstruir o machismo. Paralelamente, o Estado deve ampliar as delegacias especializadas, a fim de garantir proteção real às mulheres.'
        }
      },
      {
        id: 'maria-da-penha',
        theme: 'Lei Maria da Penha',
        description: 'A importância da Lei Maria da Penha no enfrentamento da violência doméstica e seus desafios de aplicação.',
        structure: 'Introdução: Apresentar a Lei 11.340/2006 como marco legal. Desenvolvimento: Analisar o impacto positivo e a resistência cultural. Conclusão: Ampliação do monitoramento eletrônico e suporte psicológico.',
        arguments: ['Avanço na punição de agressores', 'Dificuldade de denúncia por dependência emocional/financeira'],
        keywords: ['Ciclo da violência', 'Rede de apoio', 'Denúncia', 'Direitos Humanos'],
        fullModel: {
          intro: 'A promulgação da Lei Maria da Penha representou um marco histórico na defesa dos direitos humanos no Brasil. Entretanto, a plena aplicação dessa norma ainda enfrenta desafios culturais e estruturais que impedem a erradicação da violência doméstica.',
          dev1: 'Sob esse viés, é notório que a lei trouxe avanços significativos na punição de agressores. A criação de mecanismos de proteção imediata salvou milhares de vidas. Contudo, a resistência de setores conservadores da sociedade ainda tenta minimizar a gravidade das agressões intrafamiliares.',
          dev2: 'Ademais, a dependência emocional e financeira das vítimas é um entrave à denúncia. Sem um suporte econômico sólido e acolhimento psicológico contínuo, muitas mulheres retornam ao ciclo de violência. Dessa forma, a lei sozinha não basta sem uma rede de apoio integrada.',
          concl: 'Em suma, urge que o Governo Federal invista em casas de acolhimento e programas de autonomia financeira para vítimas. Somente assim, unindo o rigor da Lei Maria da Penha à assistência social, será possível garantir a segurança e a dignidade das famílias brasileiras.'
        }
      },
      {
        id: 'eca-digital',
        theme: 'ECA Digital',
        description: 'A proteção de crianças e adolescentes no ambiente digital e os desafios da era tecnológica.',
        structure: 'Introdução: Mencionar o ECA e a nova realidade hiperconectada. Desenvolvimento: Riscos de cyberbullying e exposição a conteúdos impróprios. Conclusão: Alfabetização digital e fiscalização rigorosa de plataformas.',
        arguments: ['Vulnerabilidade infantil online', 'Responsabilidade das Big Techs'],
        keywords: ['Nativos digitais', 'Cyberbullying', 'Exposição precoce', 'Marco Civil da Internet'],
        fullModel: {
          intro: 'O Estatuto da Criança e do Adolescente (ECA) foi criado para garantir a proteção integral dos jovens. Contudo, a ascensão da era tecnológica trouxe novos riscos, como o cyberbullying e a exploração online, que desafiam a eficácia dessa legislação no ambiente digital.',
          dev1: 'Primordialmente, a vulnerabilidade infantil no ciberespaço é alarmante. Nativos digitais estão expostos a algoritmos que nem sempre filtram conteúdos impróprios, além de estarem sujeitos ao assédio de criminosos ocultos por perfis falsos. Assim, a ingenuidade juvenil torna-se alvo fácil na rede.',
          dev2: 'Outrossim, a responsabilidade das Big Techs deve ser questionada. A falta de uma fiscalização rigorosa sobre o que é veiculado nas redes sociais permite que discursos de ódio e práticas nocivas se proliferem. Portanto, a liberdade de expressão não pode ser usada como escudo para a omissão.',
          concl: 'Dessarte, é fundamental que o Ministério da Justiça, em parceria com o MEC, implemente a alfabetização digital nas escolas. O objetivo deve ser orientar jovens e pais sobre o uso seguro da internet. Só assim o ECA será, de fato, uma ferramenta de proteção na realidade virtual.'
        }
      }
    ];

    return (
      <div className="max-w-7xl mx-auto p-4 pb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* 1. COMO FAZER REDAÇÃO */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-black font-bold">1</div>
            <h2 className="text-xl font-black uppercase tracking-tight">Como Fazer Redação</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Introdução', items: ['Contexto', 'Problema', 'Tese'], color: 'border-white/10 bg-white/5 text-white' },
              { title: 'Desenvolvimento 1', items: ['Argumento', 'Explicação', 'Exemplo'], color: 'border-white/10 bg-white/5 text-white' },
              { title: 'Desenvolvimento 2', items: ['Argumento', 'Explicação', 'Consequência'], color: 'border-white/10 bg-white/5 text-white' },
              { title: 'Conclusão', items: ['Agente', 'Ação', 'Meio', 'Finalidade'], color: 'border-white/10 bg-white/5 text-white' },
            ].map((step, i) => (
              <Card key={i} className={cn("p-5 border", step.color)}>
                <h3 className="font-bold mb-3 uppercase tracking-widest text-xs opacity-80">{step.title}</h3>
                <ul className="space-y-2">
                  {step.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <Card className="p-6 bg-brand-card border-brand-border border-l-4 border-l-brand-primary">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary mb-2">Exemplo em Destaque</h4>
            <p className="text-sm italic text-brand-text-muted leading-relaxed">
              "Embora a Constituição de 1988 assegure a dignidade da pessoa humana, a persistência do feminicídio no Brasil revela uma lacuna entre a norma e a realidade. Nesse sentido, é imperativo analisar como o legado patriarcal e a insuficiência das políticas públicas fomentam esse entrave social."
            </p>
          </Card>
        </section>

        {/* 2. ESQUELETO VISUAL */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-secondary rounded-lg flex items-center justify-center text-black font-bold">2</div>
            <h2 className="text-xl font-black uppercase tracking-tight">Esqueleto Visual</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Introdução', color: 'bg-[#1A1A1A] border-[#2A2A2A]', text: 'Diante desse cenário, é fundamental analisar...' },
              { label: 'Desenvolvimento 1', color: 'bg-[#1A1A1A] border-[#2A2A2A]', text: 'Em primeiro lugar, vale ressaltar que...' },
              { label: 'Desenvolvimento 2', color: 'bg-[#1A1A1A] border-[#2A2A2A]', text: 'Além disso, é preciso considerar...' },
              { label: 'Conclusão', color: 'bg-[#1A1A1A] border-[#2A2A2A]', text: 'Portanto, medidas são necessárias para...' },
            ].map((block, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2">
                <div className={cn("w-full sm:w-40 py-3 px-4 rounded-xl text-white border font-black uppercase tracking-tighter text-center sm:text-left", block.color)}>
                  {block.label}
                </div>
                <div className="flex-1 bg-brand-card border border-brand-border p-3 rounded-xl flex items-center italic text-sm text-brand-text-muted">
                  "{block.text}"
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. PALAVRAS-CHAVE & 4. BIZU */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-black font-bold">3</div>
              <h2 className="text-xl font-black uppercase tracking-tight">Palavras-Chave</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-5 bg-brand-card border-brand-border">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-3">Conectivos</h3>
                <div className="flex flex-wrap gap-2">
                  {['Ademais', 'Portanto', 'Entretanto', 'Todavia', 'Contudo', 'Nesse viés'].map(w => (
                    <span key={w} className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs font-bold">{w}</span>
                  ))}
                </div>
              </Card>
              <Card className="p-5 bg-brand-card border-brand-border">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-3">Palavras Fortes</h3>
                <div className="flex flex-wrap gap-2">
                  {['Problemática', 'Entrave', 'Mitigar', 'Fomentar', 'Impasse', 'Ineficiência'].map(w => (
                    <span key={w} className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-xs font-bold">{w}</span>
                  ))}
                </div>
              </Card>
              <Card className="p-5 bg-brand-card border-brand-border sm:col-span-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-3">Frases Coringa</h3>
                <ul className="space-y-2 text-sm text-brand-text-muted italic">
                  <li>"A temática em questão exige uma análise profunda..."</li>
                  <li>"Diante desse cenário, urge que o Estado..."</li>
                  <li>"Medidas são necessárias para mitigar esse entrave..."</li>
                </ul>
              </Card>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-secondary rounded-lg flex items-center justify-center text-black font-bold">4</div>
              <h2 className="text-xl font-black uppercase tracking-tight">Bizu de Memorização</h2>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-brand-secondary/20 to-brand-bg border border-brand-secondary/30 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Zap size={60} />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <Zap className="text-brand-secondary" fill="currentColor" size={20} />
                    <h3 className="font-black uppercase tracking-tighter text-lg">Regra do 2</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                      <span className="block text-2xl font-black text-brand-secondary">2</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest">Argumentos</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                      <span className="block text-2xl font-black text-brand-secondary">2</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest">Desenvolvimentos</span>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-6 bg-brand-card border-brand-border">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="text-brand-primary" size={20} />
                  <h3 className="font-black uppercase tracking-tighter text-lg">Regra da Conclusão</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { q: 'Quem faz?', a: 'Agente' },
                    { q: 'O que faz?', a: 'Ação' },
                    { q: 'Como faz?', a: 'Meio' },
                    { q: 'Pra quê?', a: 'Finalidade' },
                  ].map((item, i) => (
                    <div key={i} className="p-2 border border-brand-border rounded-lg bg-brand-bg/50">
                      <p className="text-[9px] font-bold text-brand-text-muted uppercase">{item.q}</p>
                      <p className="text-sm font-black text-white">{item.a}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="p-4 bg-brand-primary/10 border border-brand-primary/30 rounded-xl text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1">Frase Mágica</p>
                <p className="text-xl font-black text-white uppercase tracking-tighter">Causa <span className="text-brand-primary">→</span> Consequência</p>
              </div>
            </div>
          </section>
        </div>

        {/* TEMAS PARA TREINO */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-black font-bold">🧪</div>
            <h2 className="text-xl font-black uppercase tracking-tight">Temas para Treino</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((t) => (
              <Card key={t.id} className="p-6 bg-brand-card border-brand-border flex flex-col justify-between group hover:border-brand-primary/50 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-brand-primary">
                    <Sparkles size={18} />
                    <h3 className="font-black uppercase tracking-tight">{t.theme}</h3>
                  </div>
                  <p className="text-sm text-brand-text-muted leading-relaxed">{t.description}</p>
                </div>
                <button 
                  onClick={() => setGuidedEssay(t)}
                  className="mt-6 w-full py-3 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all border border-brand-primary/20"
                >
                  Gerar Redação Guiada
                </button>
              </Card>
            ))}
          </div>
        </section>

        {/* GUIDED ESSAY MODAL/SECTION */}
        <AnimatePresence>
          {guidedEssay && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-brand-bg border-brand-primary/30 p-8 space-y-6 relative">
                <button 
                  onClick={() => setGuidedEssay(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-brand-card rounded-full text-brand-text-muted"
                >
                  <XCircle size={24} />
                </button>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{guidedEssay.theme}</h3>
                  <p className="text-brand-text-muted text-sm">{guidedEssay.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-2">Estrutura Pronta</h4>
                    <p className="text-sm text-white leading-relaxed">{guidedEssay.structure}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">Dicas de Argumentos</h4>
                      <ul className="space-y-1">
                        {guidedEssay.arguments.map((arg, i) => (
                          <li key={i} className="text-xs text-brand-text-muted flex items-center gap-2">
                            <div className="w-1 h-1 bg-brand-secondary rounded-full" />
                            {arg}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-400">Palavras-Chave</h4>
                      <div className="flex flex-wrap gap-1">
                        {guidedEssay.keywords.map((kw, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-purple-500/10 text-purple-300 rounded text-[10px] font-bold">{kw}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {guidedEssay.fullModel && (
                    <div className="space-y-3 pt-4 border-t border-brand-border">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Modelo Pronto (Exemplo)</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-500/5 border-l-2 border-blue-500 rounded-r-lg">
                          <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Introdução</p>
                          <p className="text-xs text-brand-text-muted leading-relaxed italic">"{guidedEssay.fullModel.intro}"</p>
                        </div>
                        <div className="p-3 bg-green-500/5 border-l-2 border-green-500 rounded-r-lg">
                          <p className="text-[10px] font-bold text-green-400 uppercase mb-1">Desenvolvimento 1</p>
                          <p className="text-xs text-brand-text-muted leading-relaxed italic">"{guidedEssay.fullModel.dev1}"</p>
                        </div>
                        <div className="p-3 bg-yellow-500/5 border-l-2 border-yellow-500 rounded-r-lg">
                          <p className="text-[10px] font-bold text-yellow-400 uppercase mb-1">Desenvolvimento 2</p>
                          <p className="text-xs text-brand-text-muted leading-relaxed italic">"{guidedEssay.fullModel.dev2}"</p>
                        </div>
                        <div className="p-3 bg-red-500/5 border-l-2 border-red-500 rounded-r-lg">
                          <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Conclusão</p>
                          <p className="text-xs text-brand-text-muted leading-relaxed italic">"{guidedEssay.fullModel.concl}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setGuidedEssay(null)}
                  className="w-full py-4 bg-brand-primary text-white font-black uppercase tracking-widest rounded-xl"
                >
                  Entendi, vamos treinar!
                </button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. FOLHA DE REDAÇÃO */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center text-white font-bold">5</div>
            <h2 className="text-xl font-black uppercase tracking-tight">Folha de Redação</h2>
          </div>
          <Card className="bg-white p-4 sm:p-10 text-black font-mono selection:bg-blue-100 relative overflow-hidden shadow-2xl">
            <div className="border-b-2 border-black pb-4 mb-6 text-center">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter">REDAÇÃO – FOLHA OFICIAL</h2>
              <p className="text-[9px] mt-1 font-sans font-bold text-zinc-500 italic">Simulação Real de Prova • 30 Linhas</p>
            </div>

            <div className="relative">
              {/* Lines Background */}
              <div className="absolute inset-0 pointer-events-none">
                {essayDraft.map((_, i) => (
                  <div key={i} className="flex items-end gap-3 h-8 border-b border-zinc-100">
                    <span className="text-[10px] font-bold text-zinc-300 w-6 text-right mb-1">
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Editable Inputs */}
              <div className="relative z-10 pl-10">
                {essayDraft.map((line, i) => (
                  <input
                    key={i}
                    type="text"
                    value={line}
                    onChange={(e) => {
                      const newDraft = [...essayDraft];
                      newDraft[i] = e.target.value;
                      setEssayDraft(newDraft);
                    }}
                    className="w-full h-8 bg-transparent border-none outline-none text-[13px] sm:text-[15px] leading-8 px-0 focus:ring-0 placeholder:text-zinc-100"
                    placeholder="Digite aqui..."
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-black flex justify-between items-center no-print">
              <button 
                onClick={() => setEssayDraft(Array(30).fill(''))}
                className="text-[10px] font-bold text-red-500 uppercase hover:underline"
              >
                Limpar Folha
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-xs font-bold"
              >
                <Printer size={14} />
                IMPRIMIR FOLHA
              </button>
            </div>
          </Card>
        </section>
      </div>
    );
  };

  const renderPortugueseLessons = () => {
    const total = PORTUGUESE_LESSONS.length;
    const completedCount = PORTUGUESE_LESSONS.filter(item => completedLessons[item.id]).length;
    const progress = Math.round((completedCount / total) * 100);

    return (
      <div className="min-h-screen bg-brand-bg pb-24 animate-in fade-in duration-700">
        {/* Progress Bar Header */}
        <div className="bg-brand-card border-b border-brand-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Português para Concurso</h2>
                <p className="text-sm text-brand-text-muted mt-1 font-medium italic">Sua jornada rumo à nota máxima</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white">{progress}%</span>
                <p className="text-[10px] uppercase font-bold text-brand-text-muted tracking-widest mt-1">Concluído</p>
              </div>
            </div>
            <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-brand-primary"
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PORTUGUESE_LESSONS.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-brand-card border border-brand-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden",
                  completedLessons[lesson.id] ? "opacity-80" : ""
                )}
              >
                {/* Checkbox Background Indicator */}
                {completedLessons[lesson.id] && (
                  <div className="absolute top-0 right-0 p-1 bg-white/10">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl shrink-0 transition-colors",
                    completedLessons[lesson.id] ? "bg-black text-brand-text-muted" : "bg-brand-bg text-white"
                  )}>
                    <lesson.icon size={22} />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setCompletedLessons(prev => ({ ...prev, [lesson.id]: !prev[lesson.id] }))}
                        className={cn(
                          "w-5 h-5 rounded border transition-all flex items-center justify-center",
                          completedLessons[lesson.id] 
                            ? "bg-brand-primary border-brand-primary text-black" 
                            : "border-brand-border hover:border-brand-primary"
                        )}
                      >
                        {completedLessons[lesson.id] && <CheckCircle2 size={14} strokeWidth={3} />}
                      </button>
                      <h3 className={cn(
                        "text-sm font-bold tracking-tight text-white",
                        completedLessons[lesson.id] && "line-through opacity-60"
                      )}>
                        {lesson.title}
                      </h3>
                    </div>

                    <a
                      href={lesson.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-brand-primary hover:bg-[#E5E5E5] text-black px-4 py-2 rounded-lg text-xs font-bold transition-all w-full justify-center group/btn"
                    >
                      <Video size={14} className="group-hover/btn:scale-110 transition-transform" />
                      Assistir Aula
                      <ExternalLink size={10} className="opacity-40" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center space-y-3 opacity-60">
            <Languages size={32} className="mx-auto text-[#37352F]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Domine a Norma Culta</p>
          </div>
        </div>
      </div>
    );
  };

  const renderTrafficLegislationLessons = () => {
    const total = TRAFFIC_LEGISLATION_LESSONS.length;
    const completedCount = TRAFFIC_LEGISLATION_LESSONS.filter(item => completedLessons[item.id]).length;
    const progress = Math.round((completedCount / total) * 100);

    return (
      <div className="min-h-screen bg-brand-bg pb-24 animate-in fade-in duration-700">
        {/* Progress Bar Header */}
        <div className="bg-brand-card border-b border-brand-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Legislação de Trânsito</h2>
                <p className="text-sm text-brand-text-muted mt-1 font-medium italic">Foco Total no CTB</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white">{progress}%</span>
                <p className="text-[10px] uppercase font-bold text-brand-text-muted tracking-widest mt-1">Concluído</p>
              </div>
            </div>
            <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-brand-primary"
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRAFFIC_LEGISLATION_LESSONS.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-brand-card border border-brand-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden",
                  completedLessons[lesson.id] ? "opacity-80" : ""
                )}
              >
                {completedLessons[lesson.id] && (
                  <div className="absolute top-0 right-0 p-1 bg-white/10">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl shrink-0 transition-colors",
                    completedLessons[lesson.id] ? "bg-black text-brand-text-muted" : "bg-brand-bg text-white"
                  )}>
                    <lesson.icon size={22} />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setCompletedLessons(prev => ({ ...prev, [lesson.id]: !prev[lesson.id] }))}
                        className={cn(
                          "w-5 h-5 rounded border transition-all flex items-center justify-center",
                          completedLessons[lesson.id] 
                            ? "bg-brand-primary border-brand-primary text-black" 
                            : "border-brand-border hover:border-brand-primary"
                        )}
                      >
                        {completedLessons[lesson.id] && <CheckCircle2 size={14} strokeWidth={3} />}
                      </button>
                      <h3 className={cn(
                        "text-sm font-bold tracking-tight text-white leading-snug",
                        completedLessons[lesson.id] && "line-through opacity-60"
                      )}>
                        {lesson.title}
                      </h3>
                    </div>

                    <a
                      href={lesson.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-brand-primary hover:bg-[#E5E5E5] text-black px-4 py-2 rounded-lg text-xs font-bold transition-all w-full justify-center group/btn"
                    >
                      <Video size={14} className="group-hover/btn:scale-110 transition-transform" />
                      Assistir Aula
                      <ExternalLink size={10} className="opacity-40" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center space-y-3 opacity-60">
            <TrafficCone size={32} className="mx-auto text-[#37352F]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#37352F]">Segurança Viária</p>
          </div>
        </div>
      </div>
    );
  };

  const renderHumanRightsLessons = () => {
    const total = HUMAN_RIGHTS_LESSONS.length;
    const completedCount = HUMAN_RIGHTS_LESSONS.filter(item => completedLessons[item.id]).length;
    const progress = Math.round((completedCount / total) * 100);

    return (
      <div className="min-h-screen bg-brand-bg pb-24 animate-in fade-in duration-700">
        {/* Progress Bar Header */}
        <div className="bg-brand-card border-b border-brand-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Direitos Humanos</h2>
                <p className="text-sm text-brand-text-muted mt-1 font-medium italic">Justiça Social e Dignidade</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white">{progress}%</span>
                <p className="text-[10px] uppercase font-bold text-brand-text-muted tracking-widest mt-1">Concluído</p>
              </div>
            </div>
            <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-brand-primary"
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HUMAN_RIGHTS_LESSONS.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-brand-card border border-brand-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden",
                  completedLessons[lesson.id] ? "opacity-80" : ""
                )}
              >
                {completedLessons[lesson.id] && (
                  <div className="absolute top-0 right-0 p-1 bg-white/10">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl shrink-0 transition-colors",
                    completedLessons[lesson.id] ? "bg-black text-brand-text-muted" : "bg-brand-bg text-white"
                  )}>
                    <lesson.icon size={22} />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setCompletedLessons(prev => ({ ...prev, [lesson.id]: !prev[lesson.id] }))}
                        className={cn(
                          "w-5 h-5 rounded border transition-all flex items-center justify-center",
                          completedLessons[lesson.id] 
                            ? "bg-brand-primary border-brand-primary text-black" 
                            : "border-brand-border hover:border-brand-primary"
                        )}
                      >
                        {completedLessons[lesson.id] && <CheckCircle2 size={14} strokeWidth={3} />}
                      </button>
                      <h3 className={cn(
                        "text-sm font-bold tracking-tight text-white leading-snug",
                        completedLessons[lesson.id] && "line-through opacity-60"
                      )}>
                        {lesson.title}
                      </h3>
                    </div>

                    <a
                      href={lesson.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-brand-primary hover:bg-[#E5E5E5] text-black px-4 py-2 rounded-lg text-xs font-bold transition-all w-full justify-center group/btn"
                    >
                      <Video size={14} className="group-hover/btn:scale-110 transition-transform" />
                      Assistir Aula
                      <ExternalLink size={10} className="opacity-40" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center space-y-3 opacity-60">
            <Heart size={32} className="mx-auto text-[#37352F]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#37352F]">Humanidade e Ética</p>
          </div>
        </div>
      </div>
    );
  };

  const renderConstitutionalLessons = () => {
    const total = CONSTITUTIONAL_LESSONS.length;
    const completedCount = CONSTITUTIONAL_LESSONS.filter(item => completedLessons[item.id]).length;
    const progress = Math.round((completedCount / total) * 100);

    return (
      <div className="min-h-screen bg-brand-bg pb-24 animate-in fade-in duration-700">
        {/* Progress Bar Header */}
        <div className="bg-brand-card border-b border-brand-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Direito Constitucional</h2>
                <p className="text-sm text-brand-text-muted mt-1 font-medium italic">A Lei Maior do nosso País</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white">{progress}%</span>
                <p className="text-[10px] uppercase font-bold text-brand-text-muted tracking-widest mt-1">Concluído</p>
              </div>
            </div>
            <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-brand-primary"
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONSTITUTIONAL_LESSONS.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-brand-card border border-brand-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden",
                  completedLessons[lesson.id] ? "opacity-80" : ""
                )}
              >
                {completedLessons[lesson.id] && (
                  <div className="absolute top-0 right-0 p-1 bg-white/10">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl shrink-0 transition-colors",
                    completedLessons[lesson.id] ? "bg-black text-brand-text-muted" : "bg-brand-bg text-white"
                  )}>
                    <lesson.icon size={22} />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setCompletedLessons(prev => ({ ...prev, [lesson.id]: !prev[lesson.id] }))}
                        className={cn(
                          "w-5 h-5 rounded border transition-all flex items-center justify-center",
                          completedLessons[lesson.id] 
                            ? "bg-brand-primary border-brand-primary text-black" 
                            : "border-brand-border hover:border-brand-primary"
                        )}
                      >
                        {completedLessons[lesson.id] && <CheckCircle2 size={14} strokeWidth={3} />}
                      </button>
                      <h3 className={cn(
                        "text-sm font-bold tracking-tight text-white leading-snug",
                        completedLessons[lesson.id] && "line-through opacity-60"
                      )}>
                        {lesson.title}
                      </h3>
                    </div>

                    <a
                      href={lesson.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-brand-primary hover:bg-[#E5E5E5] text-black px-4 py-2 rounded-lg text-xs font-bold transition-all w-full justify-center group/btn"
                    >
                      <Video size={14} className="group-hover/btn:scale-110 transition-transform" />
                      Assistir Aula
                      <ExternalLink size={10} className="opacity-40" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center space-y-3 opacity-60">
            <Scale size={32} className="mx-auto text-[#37352F]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#37352F]">Ordem e Progresso</p>
          </div>
        </div>
      </div>
    );
  };

  const renderLegislationLessons = () => {
    const total = LEGISLATION_LESSONS.length;
    const completedCount = LEGISLATION_LESSONS.filter(item => completedLessons[item.id]).length;
    const progress = Math.round((completedCount / total) * 100);

    return (
      <div className="min-h-screen bg-brand-bg pb-24 animate-in fade-in duration-700">
        {/* Progress Bar Header */}
        <div className="bg-brand-card border-b border-brand-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Legislação Específica</h2>
                <p className="text-sm text-brand-text-muted mt-1 font-medium italic">Domine as leis do seu concurso</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white">{progress}%</span>
                <p className="text-[10px] uppercase font-bold text-brand-text-muted tracking-widest mt-1">Concluído</p>
              </div>
            </div>
            <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-brand-primary"
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEGISLATION_LESSONS.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-brand-card border border-brand-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden",
                  completedLessons[lesson.id] ? "opacity-80" : ""
                )}
              >
                {completedLessons[lesson.id] && (
                  <div className="absolute top-0 right-0 p-1 bg-white/10">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl shrink-0 transition-colors",
                    completedLessons[lesson.id] ? "bg-black text-brand-text-muted" : "bg-brand-bg text-white"
                  )}>
                    <lesson.icon size={22} />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setCompletedLessons(prev => ({ ...prev, [lesson.id]: !prev[lesson.id] }))}
                        className={cn(
                          "w-5 h-5 rounded border transition-all flex items-center justify-center",
                          completedLessons[lesson.id] 
                            ? "bg-brand-primary border-brand-primary text-black" 
                            : "border-brand-border hover:border-brand-primary"
                        )}
                      >
                        {completedLessons[lesson.id] && <CheckCircle2 size={14} strokeWidth={3} />}
                      </button>
                      <h3 className={cn(
                        "text-sm font-bold tracking-tight text-white leading-snug",
                        completedLessons[lesson.id] && "line-through opacity-60"
                      )}>
                        {lesson.title}
                      </h3>
                    </div>

                    <a
                      href={lesson.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-brand-primary hover:bg-[#E5E5E5] text-black px-4 py-2 rounded-lg text-xs font-bold transition-all w-full justify-center group/btn"
                    >
                      <Video size={14} className="group-hover/btn:scale-110 transition-transform" />
                      Assistir Aula
                      <ExternalLink size={10} className="opacity-40" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center space-y-3 opacity-60">
            <Gavel size={32} className="mx-auto text-[#37352F]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#37352F]">Justiça e Segurança</p>
          </div>
        </div>
      </div>
    );
  };

  const renderExtras = () => {
    const totalLessons = LESSONS.reduce((acc, cat) => acc + cat.items.length, 0);
    const completedCount = Object.values(completedLessons).filter(Boolean).length;
    const progress = Math.round((completedCount / totalLessons) * 100);

    const toggleLesson = (id: string) => {
      setCompletedLessons(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    };

    return (
      <div className="max-w-4xl mx-auto p-4 pb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Progress Overview Card */}
        <Card className="bg-gradient-to-br from-brand-card/90 to-brand-bg border-brand-primary/20 p-6 space-y-6 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Target size={120} />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Progresso Geral</h2>
              <p className="text-brand-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                {completedCount} de {totalLessons} tópicos concluídos
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    className="stroke-brand-bg"
                    cx="18"
                    cy="18"
                    r="16"
                    strokeWidth="3.5"
                    fill="none"
                  />
                  <motion.circle
                    className="stroke-brand-primary"
                    cx="18"
                    cy="18"
                    r="16"
                    strokeWidth="3.5"
                    strokeDasharray="100, 100"
                    strokeDashoffset={100 - progress}
                    strokeLinecap="round"
                    fill="none"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - progress }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-[10px] font-black">{progress}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-3 bg-brand-bg rounded-full overflow-hidden border border-brand-border">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary"
            />
          </div>
        </Card>

        {/* Categories and Lessons */}
        <div className="space-y-6">
          {LESSONS.map((category, catIndex) => {
            const catCompleted = category.items.filter(item => completedLessons[item.id]).length;

            return (
              <div key={catIndex} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary text-xs font-bold">
                      {catIndex + 1}
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">{category.category}</h3>
                  </div>
                  <span className="text-[10px] font-black text-brand-text-muted uppercase bg-brand-card px-3 py-1.5 rounded-lg border border-brand-border">
                    {catCompleted}/{category.items.length} Finalizado
                  </span>
                </div>

                <Card className="p-0 overflow-hidden bg-brand-card/30 border-brand-border backdrop-blur-sm">
                  <div className="divide-y divide-brand-border/50">
                    {category.items.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => toggleLesson(lesson.id)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-brand-primary/5 transition-all text-left group"
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                          completedLessons[lesson.id] 
                            ? "bg-brand-primary border-brand-primary text-black" 
                            : "border-brand-border group-hover:border-brand-primary/50"
                        )}>
                          {completedLessons[lesson.id] && <CheckCircle2 size={16} strokeWidth={3} />}
                        </div>
                        <span className={cn(
                          "text-sm font-bold transition-all flex-1",
                          completedLessons[lesson.id] ? "text-brand-text-muted line-through" : "text-white"
                        )}>
                          {lesson.title}
                        </span>
                        {completedLessons[lesson.id] && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-[9px] font-black text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-2 py-1 rounded"
                          >
                            Concluído
                          </motion.span>
                        )}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Motivational Footer */}
        <div className="text-center py-12 px-6 space-y-4">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary shadow-[0_0_20px_rgba(58,134,255,0.1)]">
            <Trophy size={32} />
          </div>
          <h4 className="text-xl font-black text-white uppercase tracking-tighter">Rumo à Aprovação!</h4>
          <p className="text-brand-text-muted text-[10px] max-w-sm mx-auto leading-relaxed uppercase font-black tracking-[0.2em] italic">
            "O progresso, não a perfeição, é o que importa. Cada tópico marcado é um passo mais perto do seu distintivo."
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white font-sans selection:bg-brand-primary/30 relative overflow-x-hidden transition-colors duration-500">
      {apiKeyMissing && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-zinc-900 border border-red-900/50 p-8 rounded-2xl text-center space-y-6 shadow-2xl shadow-red-900/20">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto text-red-500">
              <ShieldAlert size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Configuração Necessária</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                A chave da API do Gemini não foi configurada. Por favor, adicione a variável <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-red-400">GEMINI_API_KEY</code> nas configurações do projeto.
              </p>
            </div>
            <div className="pt-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all border border-zinc-700"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      )}
      
      {view !== 'quiz' && view !== 'review' && view !== 'landing' && (
        <Header 
          view={view}
          setView={setView} 
          onBack={
            view === 'subjects' ? () => setView('disciplines') : 
            view === 'disciplines' ? () => setView('home') : 
            view === 'essay-perfect' ? () => setView('home') :
            view === 'portuguese-lessons' ? () => setView('home') :
            view === 'legislation-lessons' ? () => setView('home') :
            view === 'constitutional-lessons' ? () => setView('home') :
            view === 'human-rights-lessons' ? () => setView('home') :
            view === 'traffic-legislation-lessons' ? () => setView('home') :
            view === 'mock-exams' ? () => setView('home') :
            view === 'flashcards' ? () => setView('home') :
            undefined
          }
          title={
            view === 'subjects' ? (selectedDiscipline?.title || 'Assuntos') : 
            view === 'essay-perfect' ? 'Redação Perfeita' :
            view === 'portuguese-lessons' ? 'Português para Concurso' :
            view === 'legislation-lessons' ? 'Legislação Específica' :
            view === 'constitutional-lessons' ? 'Direito Constitucional' :
            view === 'human-rights-lessons' ? 'Direitos Humanos' :
            view === 'traffic-legislation-lessons' ? 'Legislação de Trânsito' :
            view === 'mock-exams' ? 'GUARDA MUNICIPAL' :
            view === 'flashcards' ? 'FLASH CARDS' :
            view === 'home' ? 'BIZU QUESTÕES' :
            view === 'disciplines' ? 'Disciplinas' :
            view === 'extras' ? '🎯 EXTRAS (IMPORTANTE)' :
            'BIZU QUESTÕES'
          } 
          subtitle={
            view === 'subjects' ? "Simulado por Assunto" :
            view === 'home' ? "QUEM TREINA, PASSA." :
            view === 'portuguese-lessons' ? "Domínio Total da Língua Portuguesa" :
            view === 'legislation-lessons' ? "Leis e Decretos na Prática" :
            view === 'constitutional-lessons' ? "O Estudo da Carta Magna" :
            view === 'human-rights-lessons' ? "Dignidade Humana e Cidadania" :
            view === 'traffic-legislation-lessons' ? "Código de Trânsito Brasileiro" :
            view === 'mock-exams' ? "SIMULADOS COMPLETOS GMM" :
            view === 'flashcards' ? "MEMORIZAÇÃO ATIVA E BIZUS" :
            view === 'extras' ? "Checklist de Estudos e Progresso" :
            undefined
          }
        />
      )}

      <main className={cn(
        view === 'landing' ? "" : "pb-20"
      )}>
        {view === 'landing' && renderLanding()}
        {view === 'home' && renderHome()}
        {view === 'disciplines' && renderDisciplines()}
        {view === 'subjects' && renderSubjects()}
        {view === 'quiz' && renderQuiz()}
        {view === 'results' && renderResults()}
        {view === 'review' && renderReview()}
        {view === 'essay-perfect' && renderEssayPerfect()}
        {view === 'portuguese-lessons' && renderPortugueseLessons()}
        {view === 'legislation-lessons' && renderLegislationLessons()}
        {view === 'mock-exams' && renderMockExams()}
        {view === 'constitutional-lessons' && renderConstitutionalLessons()}
        {view === 'human-rights-lessons' && renderHumanRightsLessons()}
        {view === 'traffic-legislation-lessons' && renderTrafficLegislationLessons()}
        {view === 'flashcards' && renderFlashCards()}
        {view === 'extras' && renderExtras()}
      </main>

      {/* Mobile Navigation */}
      {view !== 'landing' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-card/90 backdrop-blur-lg border-t border-brand-border p-2 flex overflow-x-auto justify-start items-center z-40 gap-1 no-scrollbar">
          {[
            { id: 'landing', icon: LayoutGrid, label: 'Portal' },
            { id: 'home', icon: Play, label: 'Gerar' },
            { id: 'disciplines', icon: Library, label: 'Matérias' },
            { id: 'portuguese-lessons', icon: Languages, label: 'Português' },
            { id: 'legislation-lessons', icon: Gavel, label: 'Legislação' },
            { id: 'constitutional-lessons', icon: Scale, label: 'Const.' },
            { id: 'human-rights-lessons', icon: Globe, label: 'D. Humanos' },
            { id: 'traffic-legislation-lessons', icon: Car, label: 'Trânsito' },
            { id: 'essay-perfect', icon: PenTool, label: 'Redação' },
            { id: 'extras', icon: LayoutGrid, label: 'Extras' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-all min-w-[70px] shrink-0",
                view === item.id ? "text-brand-primary" : "text-brand-text-muted"
              )}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
