import React from 'react';
import { 
  BookOpenCheck, 
  Bookmark, 
  ExternalLink, 
  GraduationCap, 
  Sparkles,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';

export const AcademicLibrary: React.FC = () => {
  const tips = [
    {
      title: 'تقنية فاينمان للتعلم العميق (Feynman Technique)',
      desc: 'اشرح المفهوم والمعادلة الصعبة بأسلوب بسيط جداً وكأنك تشرحه لطفل بعمر 10 سنوات لتكتشف ثغرات فهمك فوراً.',
      category: 'استراتيجيات الدراسة',
    },
    {
      title: 'التكرار المتباعد (Spaced Repetition)',
      desc: 'مراجعة المادة بعد يوم، ثم 3 أيام، ثم أسبوع تضمن انتقال المعلومات من الذاكرة قصيرة المدى إلى الذاكرة طويلة المدى.',
      category: 'الذاكرة والاستيعاب',
    },
    {
      title: 'استراتيجية الاختبار الذاتي (Active Recall)',
      desc: 'إغلاق الكتاب ومحاولة كتابة أو تسميع ما تذكره أفضل بـ 3 أضعاف من مجرد إعادة قراءة الصفحات سلبياً.',
      category: 'التفوق الأكاديمي',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <Card className="glass-panel border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-800/80">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-tajawal">
            <BookOpenCheck className="h-5 w-5 text-cyan-400" />
            <span>المكتبة والدليل الأكاديمي الشامل</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 mt-1">
            إرشادات منهجية، نصائح دراسية مثبتة علمياً، ونماذج تنظيمية للطلاب
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((tip, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full">
                    {tip.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-3 mb-2">{tip.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{tip.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>طريقة مجربة وعلمية</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
