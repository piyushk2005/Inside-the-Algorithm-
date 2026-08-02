import { useState } from 'react';
import Hero from './components/Hero';
import ModuleGrid from './components/ModuleGrid';
import ModeToggle from './components/ModeToggle';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const [mode, setMode] = useState('free');

  function handleLaunch(moduleId) {
    // Modules aren't wired up yet — landing page is step one.
    console.log(`Launch requested for: ${moduleId} (mode: ${mode})`);
  }

  return (
    <div className="app">
      <div className="bg-grid" aria-hidden="true" />
      <main>
        <Hero />
        <ModeToggle mode={mode} setMode={setMode} />
        <ModuleGrid onLaunch={handleLaunch} />
      </main>
      <Footer />
    </div>
  );
}
