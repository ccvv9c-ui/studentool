import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  Download, 
  BookOpen, 
  Lightbulb,
  Target,
  ListChecks,
  Sliders,
  Share2,
  RefreshCw,
  Info,
  Award,
  Layers,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';

interface StructuredSummary {
  executiveSummary: string;
  keyTakeaways: string[];
  actionableInsights: string[];
  keyTerms: { term: string; context: string }[];
  flashcards: { q: string; a: string }[];
  wordCount: { original: number; summary: number; reductionRatio: number };
}

const ACADEMIC_SAMPLES = [
  {
    title: 'تطبيقات الذكاء الاصطناعي في التعليم العالي',
    text: `تعتبر تقنيات الذكاء الاصطناعي من أهم الدوافع للتحول الرقمي في المؤسسات الأكاديمية والتعليم العالي. يهدف هذا البحث إلى دراسة التأثير المباشر للذكاء الاصطناعي التكيّفي على تحسين كفاءة التعلم الذاتي لدى الطلاب وترسيخ المفاهيم المعقدة.
تعتمد الدراسة على تحليل بيانات أكثر من 1200 طالب وطالبة عبر ثلاثة أجهزة جامعية مختلفة. أظهرت النتائج أن الاعتماد على الخوارزميات التكيفية لتقديم المحتوى وفقاً لمستوى التلميذ أدى إلى رفع تحصيلهم الدراسي بنسبة 28% وزيادة معدل الالتزام والإنتاجية الدراسية بنسبة 35%.
توصي الدراسة بضرورة إدماج أدوات الذكاء الاصطناعي بشكل ممنهج في المناهج الدراسية، وتدريب الكادر الأكاديمي على التعامل مع منصات التحليل التنبؤية لتحديد الطلاب الذين يحتاجون إلى دعم مبكر، مع الحفاظ على الأطر الأخلاقية لحماية خصوصية بيانات المتعلمين.`
  },
  {
    title: 'تأثير النوم والتركيز على الأداء الأكاديمي',
    text: `يلعب النوم المنتظم والعميق دوراً حيوياً في معالجة المعلومات المكتسبة وترسيخ الذاكرة قصيرة المدى وتحويلها إلى ذاكرة طويلة المدى لدى الطلاب. استهدفت هذه الدراسة قياس أثر عدد ساعات النوم وجودته على الأداء في الامتحانات النهائية لدى طلاب كليات الطب والهندسة.
أوضحت النتائج الميدانية أن الحرمان المزمن من النوم (أقل من 6 ساعات يومياً) يرتبط انخفاضاً حاداً في التركيز بنسبة 40% وزيادة ملحوظة في الأخطاء التحليلية أثناء معالجة الأسئلة المفهومية. كما أن ممارسة تقنيات التكرار المتباعد مع حركات التركيز العميق (مثل تقنية بومودورو) تساهم في رفع كفاءة الاستيعاب وتخفيف التوتر النفسي.
بناءً على المعطيات، يُوصى بتطبيق جدول استذكار متوازن يعتمد على 7 إلى 8 ساعات نوم يومياً، وتجنب السهر المفرط قبل الاختبارات، واعتماد بطاقات المراجعة السريعة بدلاً من إعادة قراءة الكتب بالكامل.`
  }
];

export const SmartSummarizer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summaryMode, setSummaryMode] = useState<'standard' | 'deep' | 'concise'>('standard');
  const [summaryResult, setSummaryResult] = useState<StructuredSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'takeaways' | 'insights' | 'flashcards'>('summary');

  // Smart Academic Processing Logic
  const processAcademicText = (text: string, mode: 'standard' | 'deep' | 'concise'): StructuredSummary => {
    const rawParagraphs = text.split(/\n+/).map(p => p.trim()).filter(Boolean);
    const sentences = text
      .split(/(?<=[.؟!؟])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 8);

    const originalWordCount = text.trim().split(/\s+/).length;

    // 1. Classify sentences by semantic intent
    const objectiveKeywords = ['يهدف', 'تستهدف', 'الهدف', 'تعتبر', 'يقوم', 'دراسة', 'تبحث'];
    const resultKeywords = ['أظهرت النتائج', 'أوضحت', 'بينت', 'أدى', 'نسبة', 'ارتفاع', 'انخفاض', 'ارتبط'];
    const recommendationKeywords = ['توصي', 'يُوصى', 'ضرورة', 'بناءً على', 'خطوات', 'اعتماد', 'يجب'];

    const objectives = sentences.filter(s => objectiveKeywords.some(k => s.includes(k)));
    const results = sentences.filter(s => resultKeywords.some(k => s.includes(k)));
    const recommendations = sentences.filter(s => recommendationKeywords.some(k => s.includes(k)));

    // Fallbacks if detection is light
    const fallbackFirst = sentences[0] || 'يدور هذا النص حول دراسة مفهومية وأكاديمية متخصصة.';
    const fallbackMiddle = sentences[Math.floor(sentences.length / 2)] || 'يتضمن النص تحليلاً مركزاً لعدة متغيرات محورية.';
    const fallbackLast = sentences[sentences.length - 1] || 'تتلخص المخرجات بتوصيات عملية لتحسين كفاءة التطبيق.';

    // 2. Build Executive Summary (2-3 sentences max)
    let execSentence1 = objectives[0] || fallbackFirst;
    let execSentence2 = results[0] || fallbackMiddle;
    let execSentence3 = recommendations[0] || fallbackLast;

    if (execSentence1 === execSentence2) execSentence2 = fallbackMiddle;
    if (execSentence3 === execSentence2 || execSentence3 === execSentence1) execSentence3 = fallbackLast;

    const executiveSummary = mode === 'concise' 
      ? `${execSentence1} ${execSentence2}`
      : `${execSentence1} ${execSentence2} ${execSentence3}`;

    // 3. Build Key Takeaways
    const keyTakeaways: string[] = [];
    if (objectives.length > 0) keyTakeaways.push(`الهدف المحوري: ${objectives[0]}`);
    
    // Add distinct informative sentences
    sentences.forEach(s => {
      if (
        keyTakeaways.length < (mode === 'deep' ? 6 : 4) &&
        !keyTakeaways.some(k => k.includes(s)) &&
        s !== execSentence1
      ) {
        keyTakeaways.push(s);
      }
    });

    if (keyTakeaways.length < 2) {
      keyTakeaways.push(fallbackFirst);
      keyTakeaways.push(fallbackMiddle);
    }

    // 4. Build Actionable Insights
    const actionableInsights: string[] = [];
    if (recommendations.length > 0) {
      recommendations.forEach(r => actionableInsights.push(r));
    } else {
      actionableInsights.push('اعتماد المخرجات المباشرة للنص لتوجيه التطبيق العملي والأكاديمي.');
      actionableInsights.push('مراجعة المتغيرات المذكورة وإدراجها ضمن أطر العمل والأبحاث المستقبليّة.');
    }

    // 5. Build Smart Flashcards
    const flashcards = [
      {
        q: 'ما هي الفكرة الأساسية أو هدف الدراسة الرئيسية في هذا النص؟',
        a: execSentence1
      },
      {
        q: 'ما هي أبرز النتائج أو المعطيات الرقمية/التطبيقية المذكورة؟',
        a: results[0] || fallbackMiddle
      },
      {
        q: 'ما هي التوصية الإستراتيجية أو الخطوة العملية الأهم؟',
        a: recommendations[0] || actionableInsights[0] || fallbackLast
      }
    ];

    if (mode === 'deep' && sentences.length > 4) {
      flashcards.push({
        q: 'ما هي المبررات والعوامل المساعدة المذكورة في السياق؟',
        a: sentences[2] || fallbackMiddle
      });
    }

    // 6. Build Key Terms Context
    const words = text.split(/\s+/);
    const frequencyMap: Record<string, number> = {};
    const stopWords = new Set(['في', 'على', 'من', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'أن', 'إن', 'تم', 'كان', 'كانت', 'التي', 'الذي', 'أو']);

    words.forEach(w => {
      const clean = w.replace(/[.،؟!؟"']/g, '').trim();
      if (clean.length > 3 && !stopWords.has(clean)) {
        frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
      }
    });

    const sortedTerms = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([term]) => {
        const matchSentence = sentences.find(s => s.includes(term)) || `مصطلح محوري يتكرر بوضوح في النص.`;
        return { term, context: matchSentence };
      });

    const summaryWordCount = executiveSummary.split(/\s+/).length;
    const reductionRatio = Math.round((1 - summaryWordCount / (originalWordCount || 1)) * 100);

    return {
      executiveSummary,
      keyTakeaways,
      actionableInsights,
      keyTerms: sortedTerms,
      flashcards,
      wordCount: {
        original: originalWordCount,
        summary: summaryWordCount,
        reductionRatio: reductionRatio > 0 ? reductionRatio : 0
      }
    };
  };

  const handleSummarize = () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const result = processAcademicText(inputText, summaryMode);
      setSummaryResult(result);
      setIsProcessing(false);
      setActiveTab('summary');
    }, 600);
  };

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadReport = () => {
    if (!summaryResult) return;

    const content = `================================================
  تقرير التلخيص الأكاديمي المتقدم
  تطوير وإعداد: الأستاذ جعفر العبادي
================================================

[الملخص التنفيذي / Executive Summary]
${summaryResult.executiveSummary}

------------------------------------------------
[المحاور والنقاط الرئيسية / Key Takeaways]
${summaryResult.keyTakeaways.map((k, i) => `${i + 1}. ${k}`).join('\n')}

------------------------------------------------
[المخرجات والخطوات العملية / Actionable Insights]
${summaryResult.actionableInsights.map((a, i) => `• ${a}`).join('\n')}

------------------------------------------------
[بطاقات الاستذكار السريع / Flashcards]
${summaryResult.flashcards.map((f, i) => `س${i + 1}: ${f.q}\nج: ${f.a}\n`).join('\n')}

------------------------------------------------
إحصائيات:
- عدد كلمات النص الأصلي: ${summaryResult.wordCount.original}
- عدد كلمات الملخص التنفيذي: ${summaryResult.wordCount.summary}
- نسبة الاختصار الذكي: ${summaryResult.wordCount.reductionRatio}%
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Academic_Summary_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-tajawal">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 shadow-lg">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">المُساعد الذكي لتلخيص المقالات والأبحاث الأكاديمية</h2>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                إصدار أكاديمي 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              تحليل مفهومي منظم وهيكلة احترافية (ملخص تنفيذي، محاور رئيسية، ومخرجات عملية)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <Award className="h-4 w-4 text-amber-400" />
          <span>تطوير وإعداد: <strong className="text-white">الأستاذ جعفر العبادي</strong></span>
        </div>
      </div>

      {/* Main Input Form */}
      <Card className="glass-panel border-cyan-500/30">
        <CardHeader className="pb-3 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <span>إدخال المقال أو الورقة البحثية</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1">
              ألصق نص الورقة العلمية، المحاضرة، أو الفصل الدراسي للحصول على تحليل منهجي رصين
            </CardDescription>
          </div>

          {/* Quick Academic Samples */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">عينة تجريبية:</span>
            {ACADEMIC_SAMPLES.map((sample, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => setInputText(sample.text)}
                className="h-7 text-[11px] bg-slate-900/80 border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white rounded-lg"
              >
                {sample.title}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-cyan-400" />
                <span>محتوى النص الأكاديمي</span>
              </label>

              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition"
                >
                  مسح النص
                </button>
              )}
            </div>

            <textarea
              rows={7}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ألصق المقال الأكاديمي، الملخص العلمي، أو الملاحظات الدراسية هنا..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 leading-relaxed focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600 font-sans"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>عدد الكلمات: {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} كلمة</span>
              <span>يدعم النصوص العربية والإنجليزية بالأبحاث العلمية</span>
            </div>
          </div>

          {/* Summary Mode Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">عمق التحليل الأكاديمي:</span>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
              {(
                [
                  { id: 'concise', label: 'موجز سريع' },
                  { id: 'standard', label: 'تحليل قياسي' },
                  { id: 'deep', label: 'بحثي متعمق' }
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSummaryMode(mode.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    summaryMode === mode.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <Button
            onClick={handleSummarize}
            disabled={isProcessing || !inputText.trim()}
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 gap-2 transition-all"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>جاري معالجة الهيكلة الأكاديمية واستنباط الرؤى...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>بدء التحليل المفهومي والتخصيص الذكي</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Summary Output Area */}
      {summaryResult && (
        <Card className="glass-panel border-cyan-500/40 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="pb-3 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-extrabold text-white">التقرير التحليلي المنظم</CardTitle>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  تم التلخيص بنسبة اختصار {summaryResult.wordCount.reductionRatio}%
                </span>
              </div>
              <CardDescription className="text-xs text-slate-400">
                نتائج التحليل المهيكل وفق أحدث المعايير البحثية الأكاديمية
              </CardDescription>
            </div>

            {/* Action Tools */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
                className="h-8 text-xs bg-slate-900 border-slate-700 text-slate-200 hover:text-white hover:border-cyan-500 gap-1.5"
              >
                <Download className="h-3.5 w-3.5 text-cyan-400" />
                <span>تصدير التقرير (TXT)</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(summaryResult.executiveSummary, 'full')}
                className="h-8 text-xs bg-slate-900 border-slate-700 text-slate-200 hover:text-white hover:border-cyan-500 gap-1.5"
              >
                {copiedSection === 'full' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-cyan-400" />
                )}
                <span>نسخ الخلاصة</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            
            {/* Quick Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'summary'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCheck className="h-4 w-4" />
                <span>1. الملخص التنفيذي</span>
              </button>

              <button
                onClick={() => setActiveTab('takeaways')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'takeaways'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Target className="h-4 w-4" />
                <span>2. المحاور الرئيسية ({summaryResult.keyTakeaways.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('insights')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'insights'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Lightbulb className="h-4 w-4" />
                <span>3. الخطوات العملية</span>
              </button>

              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'flashcards'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>4. بطاقات الاستذكار ({summaryResult.flashcards.length})</span>
              </button>
            </div>

            {/* TAB 1: EXECUTIVE SUMMARY */}
            {activeTab === 'summary' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-cyan-400" />
                      <span>الملخص التنفيذي (Executive Summary):</span>
                    </span>
                    <button
                      onClick={() => handleCopy(summaryResult.executiveSummary, 'exec')}
                      className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                    >
                      {copiedSection === 'exec' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedSection === 'exec' ? 'تم النسخ' : 'نسخ'}</span>
                    </button>
                  </div>

                  <p className="text-sm text-slate-100 leading-relaxed font-sans bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                    {summaryResult.executiveSummary}
                  </p>
                </div>

                {/* Key Concepts Grid */}
                {summaryResult.keyTerms.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-blue-400" />
                      <span>المفاهيم والمصطلحات المحورية في الورقة:</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {summaryResult.keyTerms.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                            #{item.term}
                          </span>
                          <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
                            "{item.context}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: KEY TAKEAWAYS */}
            {activeTab === 'takeaways' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-cyan-400" />
                    <span>المحاور والنقاط الجوهرية (مرتبة حسب الأهمية):</span>
                  </h4>

                  <button
                    onClick={() => handleCopy(summaryResult.keyTakeaways.join('\n'), 'takeaways')}
                    className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                  >
                    {copiedSection === 'takeaways' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>نسخ المحاور</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {summaryResult.keyTakeaways.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3 hover:border-cyan-500/30 transition-colors"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-500/20">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans pt-0.5">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ACTIONABLE INSIGHTS */}
            {activeTab === 'insights' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4 text-amber-400" />
                    <span>المخرجات والخطوات العملية (Actionable Insights):</span>
                  </h4>

                  <button
                    onClick={() => handleCopy(summaryResult.actionableInsights.join('\n'), 'insights')}
                    className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                  >
                    {copiedSection === 'insights' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>نسخ التوصيات</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {summaryResult.actionableInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: FLASHCARDS */}
            {activeTab === 'flashcards' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-emerald-400" />
                    <span>بطاقات الاستذكار والمراجعة السريعة المقترحة:</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {summaryResult.flashcards.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-colors flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 inline-block">
                          بطاقة مراجعة #{idx + 1}
                        </span>
                        <h5 className="text-xs font-bold text-white leading-snug">
                          {card.q}
                        </h5>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                        <strong className="text-cyan-300 block mb-1 text-[11px]">الإجابة المباشرة:</strong>
                        {card.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      )}

    </div>
  );
};
