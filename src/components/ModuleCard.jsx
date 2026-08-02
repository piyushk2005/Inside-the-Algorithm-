export default function ModuleCard({ module, onLaunch }) {
  return (
    <div className="module-card">
      <div className="module-icon" aria-hidden="true">{module.icon}</div>
      <div className="module-tag">{module.difficulty}</div>
      <h3 className="module-title">{module.title}</h3>
      <p className="module-desc">{module.description}</p>
      <button className="launch-btn" onClick={() => onLaunch(module.id)}>
        Launch <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
