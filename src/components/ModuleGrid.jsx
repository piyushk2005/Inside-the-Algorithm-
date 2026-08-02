import ModuleCard from './ModuleCard';
import { modules } from '../data/modules';

export default function ModuleGrid({ onLaunch }) {
  return (
    <section className="module-grid">
      {modules.map((m) => (
        <ModuleCard key={m.id} module={m} onLaunch={onLaunch} />
      ))}
    </section>
  );
}
