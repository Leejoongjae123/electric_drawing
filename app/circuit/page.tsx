import CircuitCanvas from './components/CircuitCanvas';
import ControlPanel from './components/ControlPanel';

export default function CircuitPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <CircuitCanvas />
      <ControlPanel />
    </div>
  );
}
