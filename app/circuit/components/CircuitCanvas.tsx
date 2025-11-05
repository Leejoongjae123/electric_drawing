'use client';

import { useRef, useState } from 'react';
import { useCircuitStore } from './store/circuitStore';
import CircuitComponent from './CircuitComponent';
import WireComponent from './WireComponent';

export default function CircuitCanvas() {
  const {
    components,
    wires,
    selectComponent,
    connectingFrom,
    cancelConnecting,
    deleteWire,
  } = useCircuitStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleCanvasClick = () => {
    selectComponent(null);
    if (connectingFrom) {
      cancelConnecting();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-gray-100 overflow-hidden"
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    >
      {/* SVG 레이어 (와이어용) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#d1d5db" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* 기존 와이어들 */}
        <g className="pointer-events-auto">
          {wires.map((wire) => (
            <WireComponent
              key={wire.id}
              wire={wire}
              onDelete={deleteWire}
            />
          ))}
        </g>

        {/* 연결 중인 임시 와이어 (ㄷ자 형태) */}
        {connectingFrom && (() => {
          const midY = (connectingFrom.point.y + mousePosition.y) / 2;
          const tempPath = `M ${connectingFrom.point.x} ${connectingFrom.point.y} 
                           L ${connectingFrom.point.x} ${midY}
                           L ${mousePosition.x} ${midY}
                           L ${mousePosition.x} ${mousePosition.y}`;
          return (
            <path
              d={tempPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="pointer-events-none"
            />
          );
        })()}
      </svg>

      {/* 컴포넌트 레이어 */}
      {components.map((component) => (
        <CircuitComponent key={component.id} component={component} />
      ))}
    </div>
  );
}
