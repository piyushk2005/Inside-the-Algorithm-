export default function ModeToggle({ mode, setMode }) {
  return (
    <div className="mode-toggle" role="tablist" aria-label="Playground mode">
      <button
        role="tab"
        aria-selected={mode === 'guided'}
        className={mode === 'guided' ? 'mode-btn active' : 'mode-btn'}
        onClick={() => setMode('guided')}
      >
        Guided walkthrough
      </button>
      <button
        role="tab"
        aria-selected={mode === 'free'}
        className={mode === 'free' ? 'mode-btn active' : 'mode-btn'}
        onClick={() => setMode('free')}
      >
        Free explore
      </button>
    </div>
  );
}
