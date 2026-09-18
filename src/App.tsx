import React, { useState } from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { StudentHeader } from './components/StudentHeader';
import { GpaCalculator } from './components/GpaCalculator';
import { StudyPlanner } from './components/StudyPlanner';
import { SmartSummarizer } from './components/SmartSummarizer';
import { AcademicLibrary } from './components/AcademicLibrary';
import { AboutTool } from './components/AboutTool';
import { StudentFooter } from './components/StudentFooter';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('gpa');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Dynamic 60fps Canvas Particle Background */}
      <ParticleBackground />

      {/* Top Header Navigation */}
      <StudentHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {activeTab === 'gpa' && <GpaCalculator />}
        {activeTab === 'planner' && <StudyPlanner />}
        {activeTab === 'summarizer' && <SmartSummarizer />}
        {activeTab === 'library' && <AcademicLibrary />}
        {activeTab === 'about' && <AboutTool />}
      </main>

      {/* Cinematic Footer with Educator Attribution */}
      <StudentFooter />
    </div>
  );
}

export default App;
