import React from 'react';
import { GraduationCap, Heart, Award, Shield, Sparkles } from 'lucide-react';

export const StudentFooter: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 glass-panel relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white font-tajawal">
                أداة الطالب
              </span>
              <p className="text-[11px] text-slate-400">
                منصة تفاعلية سينمائية شاملة للطلاب
              </p>
            </div>
          </div>

          {/* Prominent Developer Highlight Badge */}
          <div className="px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-center shadow-lg">
            <span className="text-xs font-semibold text-slate-400 block mb-0.5">
              حقوق الملكية والتطوير
            </span>
            <p className="text-sm font-extrabold text-cyan-300 font-tajawal flex items-center gap-2 justify-center">
              <Award className="h-4 w-4 text-amber-400" />
              <span>تطوير وإعداد: الأستاذ جعفر العبادي</span>
            </p>
          </div>

          {/* Status text */}
          <div className="text-xs text-slate-400 text-center md:text-left font-mono">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
