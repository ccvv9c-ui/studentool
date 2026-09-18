import React, { useState } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Award, 
  TrendingUp, 
  BarChart3, 
  RotateCcw,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: number; // Percentage scale 0-100 or 4.0
}

export const GpaCalculator: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'الرياضيات المتقدمة', credits: 3, grade: 92 },
    { id: '2', name: 'الفيزياء العامة', credits: 4, grade: 88 },
    { id: '3', name: 'علوم الحاسوب', credits: 3, grade: 95 },
    { id: '4', name: 'اللغة العربية والأساليب', credits: 2, grade: 90 },
  ]);

  const [previousGpa, setPreviousGpa] = useState<string>('3.65');
  const [previousCredits, setPreviousCredits] = useState<string>('30');

  // Helper grade conversions
  const getGradePoint = (percentage: number): number => {
    if (percentage >= 90) return 4.0;
    if (percentage >= 85) return 3.75;
    if (percentage >= 80) return 3.5;
    if (percentage >= 75) return 3.0;
    if (percentage >= 70) return 2.5;
    if (percentage >= 65) return 2.0;
    if (percentage >= 60) return 1.5;
    return 0.0;
  };

  const getLetterWithLabel = (percentage: number): { letter: string; label: string; color: string } => {
    if (percentage >= 90) return { letter: 'A+', label: 'ممتاز مرتفع', color: 'text-emerald-400' };
    if (percentage >= 85) return { letter: 'A', label: 'ممتاز', color: 'text-emerald-300' };
    if (percentage >= 80) return { letter: 'B+', label: 'جيد جداً مرتفع', color: 'text-blue-400' };
    if (percentage >= 75) return { letter: 'B', label: 'جيد جداً', color: 'text-blue-300' };
    if (percentage >= 70) return { letter: 'C+', label: 'جيد مرتفع', color: 'text-amber-400' };
    if (percentage >= 65) return { letter: 'C', label: 'جيد', color: 'text-amber-300' };
    if (percentage >= 60) return { letter: 'D', label: 'مقبول', color: 'text-orange-400' };
    return { letter: 'F', label: 'راسب', color: 'text-rose-400' };
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: `course_${Date.now()}`,
      name: `مادة دراسية ${courses.length + 1}`,
      credits: 3,
      grade: 85,
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((c) => c.id !== id));
  };

  // Calculations
  const termTotalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  const termWeightedPoints = courses.reduce(
    (sum, c) => sum + getGradePoint(Number(c.grade) || 0) * (Number(c.credits) || 0),
    0
  );
  const termGpa = termTotalCredits > 0 ? (termWeightedPoints / termTotalCredits) : 0;

  // Cumulative GPA calculation
  const prevGpaNum = parseFloat(previousGpa) || 0;
  const prevCredsNum = parseFloat(previousCredits) || 0;

  const cumulativeTotalCredits = prevCredsNum + termTotalCredits;
  const cumulativeWeightedPoints = prevGpaNum * prevCredsNum + termWeightedPoints;
  const cumulativeGpa = cumulativeTotalCredits > 0 ? cumulativeWeightedPoints / cumulativeTotalCredits : termGpa;

  const getHonorsStatus = (gpa: number) => {
    if (gpa >= 3.75) return { text: 'مرتبة الشرف الأولى 🏆', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    if (gpa >= 3.5) return { text: 'مرتبة الشرف الثانية 🎖️', badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    if (gpa >= 3.0) return { text: 'تقدير جيد جداً 👍', badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
    if (gpa >= 2.5) return { text: 'تقدير جيد ⚖️', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    return { text: 'يحتاج إلى تحسين الأداء 📈', badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
  };

  const exportSummary = () => {
    let summaryText = `=== تقرير المعدل الأكاديمي - أداة الطالب ===\n`;
    summaryText += `إعداد وتطوير: الأستاذ جعفر العبادي\n\n`;
    summaryText += `المعدل الفصل الحالي: ${termGpa.toFixed(2)} / 4.00\n`;
    summaryText += `المعدل التراكمي الإجمالي: ${cumulativeGpa.toFixed(2)} / 4.00\n`;
    summaryText += `مجموع الساعات المكتسبة: ${cumulativeTotalCredits} ساعة\n\n`;
    summaryText += `المواد المسجلة:\n`;
    courses.forEach((c, idx) => {
      const g = getLetterWithLabel(c.grade);
      summaryText += `${idx + 1}. ${c.name} - الساعات: ${c.credits} | الدرجة: ${c.grade}% (${g.letter} - ${g.label})\n`;
    });

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GPA_Report_Student_Tool_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Overview Metric Cards Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Term GPA Box */}
        <Card className="glass-panel border-cyan-500/30 relative overflow-hidden glow-cyan">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-400 to-blue-600" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>المعدل الفصلي الحسابي</span>
              <Award className="h-4 w-4 text-cyan-400" />
            </CardDescription>
            <CardTitle className="text-4xl font-extrabold text-white font-mono flex items-baseline gap-2">
              <span>{termGpa.toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-sans">/ 4.00</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">ساعات الفصل:</span>
              <span className="font-bold text-cyan-300 font-mono">{termTotalCredits} ساعة</span>
            </div>
          </CardContent>
        </Card>

        {/* Cumulative GPA Box */}
        <Card className="glass-panel border-blue-500/30 relative overflow-hidden glow-blue">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>المعدل التراكمي الإجمالي</span>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardDescription>
            <CardTitle className="text-4xl font-extrabold text-white font-mono flex items-baseline gap-2">
              <span>{cumulativeGpa.toFixed(2)}</span>
              <span className="text-xs text-slate-400 font-sans">/ 4.00</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">إجمالي الساعات الكلية:</span>
              <span className="font-bold text-blue-300 font-mono">{cumulativeTotalCredits} ساعة</span>
            </div>
          </CardContent>
        </Card>

        {/* Honors Prediction Box */}
        <Card className="glass-panel border-amber-500/30 relative overflow-hidden glow-amber flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>توقع المرتبة والتقدير</span>
              <BarChart3 className="h-4 w-4 text-amber-400" />
            </CardDescription>
            <div className="pt-1">
              <Badge variant="outline" className={`text-xs px-3 py-1 font-bold ${getHonorsStatus(cumulativeGpa).badgeClass}`}>
                {getHonorsStatus(cumulativeGpa).text}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              الحساب دقيق وفق النظام المعتمد للساعات المعتمدة في الكليات والمعاهد العربية.
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Main Course Table and Previous GPA settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Course List */}
        <Card className="lg:col-span-8 glass-panel border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/80">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-tajawal">
                <Calculator className="h-5 w-5 text-cyan-400" />
                <span>جدول المواد الفصلية الحالية</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                أدخل المواد والساعات المعتمدة والدرجة المئوية لتحديث المعدل فورياً
              </CardDescription>
            </div>

            <Button
              onClick={addCourse}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white gap-2 text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة مادة جديدة</span>
            </Button>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <div className="space-y-3">
              {courses.map((course, index) => {
                const gradeInfo = getLetterWithLabel(course.grade);
                return (
                  <div
                    key={course.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200"
                  >
                    {/* Index & Name Input */}
                    <div className="sm:col-span-5 flex items-center gap-2.5">
                      <span className="h-7 w-7 rounded-lg bg-slate-800 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                        placeholder="اسم المادة"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    {/* Credits Selector */}
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-400 block mb-1 sm:hidden">الساعات</label>
                      <select
                        value={course.credits}
                        onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value, 10))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'ساعة' : 'ساعات'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Grade Percentage Input */}
                    <div className="sm:col-span-3 flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                        />
                        <span className="absolute left-2.5 top-2 text-xs text-slate-500">%</span>
                      </div>
                      
                      <div className="text-center min-w-[50px]">
                        <span className={`text-xs font-bold font-mono block ${gradeInfo.color}`}>
                          {gradeInfo.letter}
                        </span>
                        <span className="text-[9px] text-slate-400 block whitespace-nowrap">
                          {gradeInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Remove Action */}
                    <div className="sm:col-span-2 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCourse(course.id)}
                        disabled={courses.length <= 1}
                        className="h-8 w-8 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
              <Button
                variant="outline"
                size="sm"
                onClick={exportSummary}
                className="gap-2 text-xs border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <Download className="h-3.5 w-3.5 text-cyan-400" />
                <span>تصدير التقرير النهائي (TXT)</span>
              </Button>

              <div className="text-xs text-slate-400 font-mono">
                المجموع الحالي: <span className="text-cyan-300 font-bold">{termTotalCredits}</span> ساعة معتمدة
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right 4 Cols: Previous Cumulative GPA Integration */}
        <Card className="lg:col-span-4 glass-panel border-slate-800 flex flex-col justify-between">
          <div>
            <CardHeader className="pb-4 border-b border-slate-800/80">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2 font-tajawal">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span>دعم الساعات المقطوعة المسبقة</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                ربط المعدل الفصلي الحالي بالسابقة التراكمية
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  المعدل التراكمي المسبق (السابق)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={previousGpa}
                    onChange={(e) => setPreviousGpa(e.target.value)}
                    placeholder="مثال: 3.50"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500">/ 4.00</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  عدد الساعات المكتسبة المسبقة
                </label>
                <input
                  type="number"
                  min="0"
                  value={previousCredits}
                  onChange={(e) => setPreviousCredits(e.target.value)}
                  placeholder="مثال: 45"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>دقة في الاحتساب:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  يتم دمج نقاط المواد الحالية تلقائياً مع الساعات المقطوعة لحساب التراكمي الشامل بدقة متناهية.
                </p>
              </div>
            </CardContent>
          </div>

          <div className="p-4 bg-slate-900/60 border-t border-slate-800/80 rounded-b-2xl">
            <p className="text-[10px] text-slate-500 text-center">
              أداة الطالب الرقمية — تطوير وإعداد: الأستاذ جعفر العبادي
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
};
