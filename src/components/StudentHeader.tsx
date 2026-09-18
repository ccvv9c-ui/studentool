import React from 'react';
import { 
  GraduationCap, 
  Calculator, 
  CalendarClock, 
  Sparkles, 
  BookOpenCheck, 
  Info, 
  Award,
  Zap
} from 'lucide-react';
import { Badge } from './ui/badge';

interface StudentHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'gpa', label: 'حاسبة المعدل', icon: Calculator, badge: 'تفاعلي' },
    { id: 'planner', label: 'المُنظّم والمؤقت', icon: CalendarClock, badge: null },
    { id: 'summarizer', label: 'المُساعد الذكي', icon: Sparkles, badge: 'جديد' },
    { id: 'library', label: 'المكتبة الأكاديمية', icon: BookOpenCheck, badge: null },
    { id: 'about', label: 'عن الأداة', icon: Info, badge: null },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Branding Logo & Title */}
        <div 
          onClick={() => setActiveTab('gpa')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
            <GraduationCap className="h-6 w-6 transform group-hover:-rotate-12 transition-transform duration-300" />
            <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-tajawal">
                أداة الطالب<span className="text-cyan-400 font-sans">.</span>
              </h1>
              <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-300 text-[11px] px-2 py-0.5 rounded-full font-medium">
                الإصدار الذكي
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              المنصة الأكاديمية التفاعلية المتكاملة
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 space-x-reverse bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'animate-bounce' : ''}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`mr-1 text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Developer Attribution Header Pill */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-inner">
            <Award className="h-4 w-4 text-amber-400 animate-pulse" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block leading-none">إعداد وتطوير</span>
              <span className="font-extrabold text-cyan-300 font-tajawal text-xs">الأستاذ جعفر العبادي</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden border-t border-slate-800/80 px-2 py-2 flex items-center justify-around overflow-x-auto bg-slate-950/90 backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 min-w-[68px] ${
                isActive
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
