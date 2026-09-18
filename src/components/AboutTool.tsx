import React from 'react';
import { 
  Award, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  Cpu, 
  CheckCircle2, 
  Star,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';

export const AboutTool: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Hero Header Box */}
      <Card className="glass-panel border-cyan-500/30 overflow-hidden relative glow-cyan">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <CardContent className="p-8 md:p-10 text-right relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Sparkles className="h-4 w-4" />
            <span>المنصة الرقمية المعتمدة للطلاب</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight font-tajawal">
            عن «أداة الطالب» — رؤية مستقبلية لبيئة تعلّم أسهل وأكثر إنجازاً
          </h2>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl font-sans">
            تُعد **«أداة الطالب»** بيئة أكاديمية رقمية متكاملة تم تطويرها خصيصاً لتلبية احتياجات الطلاب في مختلف المراحل التعليمية (الجامعية والثانوية). تجمع الأداة بين دقة الحسابات الأكاديمية للمعدل الفصلي والتراكمي، وتنظيم الوقت بتقنية بومودورو، والتخيص الذكي للمحاضرات لضمان تجربة دراسية سلسة وعالية الإنتاجية.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-200">
            <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>100% تعمل محلياً وبسريّة تامة</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>دقة تامة في احتساب المعدل والتراكمي</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              <span>سرعة فائقة وواجهة سينمائية</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Author & Educator Special Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        <Card className="md:col-span-8 glass-panel border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-800/80">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2 font-tajawal">
              <Award className="h-6 w-6 text-amber-400" />
              <span>إعداد وتطوير: الأستاذ جعفر العبادي</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              الرؤية التعليمية والتقنية الخلّاقة خلف تصميم وتطوير الأداة
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
            <p>
              تم ابتكار وتصميم منصة **«أداة الطالب»** برؤية وإعداد من **الأستاذ جعفر العبادي**، كاستجابة رقمية للتحديات التي تواجه الطلاب يومياً في تنظيم وقتهم وتتبع أدائهم الأكاديمي.
            </p>
            <p>
              يرتكز التطوير على توفير أدوات ذكية سهلة الاستخدام ومتاحة مجاناً للجميع دون تعقيدات، مع الالتزام بأعلى معايير التصميم الحديث والتفاعل السلس لخدمة أجيال المستبقل الأكاديمية.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-4 glass-panel border-amber-500/30 text-center p-6 glow-amber flex flex-col items-center justify-center space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white font-tajawal">الأستاذ جعفر العبادي</h3>
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[11px] px-3 py-1">
            إعداد وتطوير
          </Badge>
          <p className="text-[11px] text-slate-400">
            المنصة الأكاديمية المخصصة لتيسير التفوق والنجاح للطلاب
          </p>
        </Card>

      </div>
    </div>
  );
};
