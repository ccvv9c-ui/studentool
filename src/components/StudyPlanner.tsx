import React, { useState, useEffect } from 'react';
import { 
  CalendarClock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Flame, 
  Clock, 
  Tag,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Task {
  id: string;
  title: string;
  subject: string;
  priority: 'عالية' | 'متوسطة' | 'عادية';
  completed: boolean;
}

export const StudyPlanner: React.FC = () => {
  // Pomodoro timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [completedSessions, setCompletedSessions] = useState(0);

  // Task list
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'مراجعة الفصل الثالث في الفيزياء', subject: 'الفيزياء', priority: 'عالية', completed: false },
    { id: '2', title: 'حل تمارين التفاضل والتكامل رقم 4', subject: 'الرياضيات', priority: 'متوسطة', completed: true },
    { id: '3', title: 'تلخيص مفاهيم خوارزميات البحث', subject: 'الحاسوب', priority: 'عادية', completed: false },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('عام');
  const [newTaskPriority, setNewTaskPriority] = useState<'عالية' | 'متوسطة' | 'عادية'>('متوسطة');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      if (mode === 'study') {
        setCompletedSessions((prev) => prev + 1);
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('study');
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: Task = {
      id: `task_${Date.now()}`,
      title: newTaskTitle,
      subject: newTaskSubject || 'عام',
      priority: newTaskPriority,
      completed: false,
    };
    setTasks([task, ...tasks]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Pomodoro Focus Timer Panel (5 Cols) */}
        <Card className="lg:col-span-5 glass-panel border-cyan-500/30 flex flex-col justify-between glow-cyan">
          <div>
            <CardHeader className="pb-3 border-b border-slate-800/80">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-tajawal">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  <span>مؤقت التركيز الفائق (بومودورو)</span>
                </CardTitle>

                <Badge
                  variant="outline"
                  className={`text-xs px-2.5 py-0.5 font-bold ${
                    mode === 'study'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {mode === 'study' ? 'جلسة دراسة 📚' : 'استراحة قصيرة ☕'}
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-400 mt-1">
                تقنية بومودورو العالمية لزيادة التركيز وتجنب الإجهاد الذهني
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-8 text-center space-y-6">
              {/* Big Digital Timer Display */}
              <div className="relative inline-flex items-center justify-center p-8 rounded-full border-4 border-cyan-500/30 bg-slate-950/80 shadow-2xl shadow-cyan-500/10 min-w-[220px] min-h-[220px]">
                <span className="text-5xl font-extrabold font-mono text-white tracking-widest">
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={toggleTimer}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs gap-2 shadow-lg transition-all ${
                    isRunning
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>إيقاف مؤقت</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      <span>بدء التركيز</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetTimer}
                  className="h-10 w-10 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl"
                  title="إعادة ضبط"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>

          <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 rounded-b-2xl flex items-center justify-between text-xs">
            <span className="text-slate-400">الجلسات المكتملة اليوم:</span>
            <div className="flex items-center gap-1.5 font-bold text-amber-400 font-mono">
              <Flame className="h-4 w-4 text-amber-400 animate-bounce" />
              <span>{completedSessions} جلسات</span>
            </div>
          </div>
        </Card>

        {/* Task Planner & Study Manager (7 Cols) */}
        <Card className="lg:col-span-7 glass-panel border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-800/80">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-tajawal">
              <Target className="h-5 w-5 text-blue-400" />
              <span>جدول المهام والأهداف الأكاديمية</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1">
              تنظيم المهام اليومية مع تحديد الأولويات وتتبع الإنجاز
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Add Task Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="عنوان المهمة أو المراجعة المطلوب إنجازها..."
                className="sm:col-span-6 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />

              <input
                type="text"
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
                placeholder="اسم المادة"
                className="sm:col-span-3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />

              <Button
                onClick={addTask}
                className="sm:col-span-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة مهمة</span>
              </Button>
            </div>

            {/* Tasks List */}
            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    task.completed
                      ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`h-5 w-5 rounded-md flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-emerald-500 text-slate-950'
                          : 'border-2 border-slate-700 hover:border-cyan-400'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="h-4 w-4 stroke-[3]" />}
                    </button>

                    <div>
                      <p className={`text-xs font-bold ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.2 rounded font-semibold">
                          {task.subject}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          الأولوية: {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="h-7 w-7 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
