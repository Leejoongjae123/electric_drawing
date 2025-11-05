'use client';

import { useState, useCallback, useEffect } from 'react';
import { Wire } from '../types';
import { useCircuitStore } from './store/circuitStore';

interface WireComponentProps {
  wire: Wire;
  onDelete?: (id: string) => void;
}

export default function WireComponent({ wire, onDelete }: WireComponentProps) {
  const { from, to, midPoint } = wire;
  const { updateWireMidPoint } = useCircuitStore();
  const [isDraggingMidPoint, setIsDraggingMidPoint] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // 중간 지점 계산 (사용자 정의가 있으면 사용, 없으면 기본값)
  const defaultMidY = (from.point.y + to.point.y) / 2;
  const currentMidPoint = midPoint || {
    x: (from.point.x + to.point.x) / 2,
    y: defaultMidY,
  };

  // 경로 계산 - 중간 포인트를 거쳐가는 경로
  const path = `M ${from.point.x} ${from.point.y} 
                L ${from.point.x} ${currentMidPoint.y}
                L ${currentMidPoint.x} ${currentMidPoint.y}
                L ${to.point.x} ${currentMidPoint.y}
                L ${to.point.x} ${to.point.y}`;

  const handleWireClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDraggingMidPoint && onDelete) {
      onDelete(wire.id);
    }
  };

  const handleMidPointMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingMidPoint(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDraggingMidPoint) {
        const svg = (e.target as Element).closest('svg');
        if (svg) {
          const rect = svg.getBoundingClientRect();
          const newMidPoint = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          };
          updateWireMidPoint(wire.id, newMidPoint);
        }
      }
    },
    [isDraggingMidPoint, wire.id, updateWireMidPoint]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingMidPoint(false);
  }, []);

  useEffect(() => {
    if (isDraggingMidPoint) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingMidPoint, handleMouseMove, handleMouseUp]);

  return (
    <g
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 투명한 넓은 영역 (클릭 영역) */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth="20"
        onClick={handleWireClick}
        className="cursor-pointer"
      />
      {/* 실제 와이어 */}
      <path
        d={path}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3"
        className={isHovering && !isDraggingMidPoint ? 'stroke-red-500' : ''}
        style={{ transition: 'stroke 0.2s' }}
      />
      
      {/* 드래그 가능한 중간 포인트 */}
      <circle
        cx={currentMidPoint.x}
        cy={currentMidPoint.y}
        r="10"
        fill="white"
        stroke="#3b82f6"
        strokeWidth="2"
        className="cursor-move"
        style={{
          opacity: isHovering || isDraggingMidPoint ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
        onMouseDown={handleMidPointMouseDown}
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* 중간 포인트 내부 표시 */}
      <circle
        cx={currentMidPoint.x}
        cy={currentMidPoint.y}
        r="4"
        fill="#3b82f6"
        className="pointer-events-none"
        style={{
          opacity: isHovering || isDraggingMidPoint ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      />
    </g>
  );
}
