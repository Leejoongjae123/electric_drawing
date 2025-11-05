'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Component, ConnectionPoint } from '../types';
import { useCircuitStore } from './store/circuitStore';

interface CircuitComponentProps {
  component: Component;
}

export default function CircuitComponent({ component }: CircuitComponentProps) {
  const {
    updateComponentPosition,
    startDragging,
    stopDragging,
    selectComponent,
    selectedComponent,
    startConnecting,
    finishConnecting,
    connectingFrom,
  } = useCircuitStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const componentRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('connection-point')) {
      return;
    }
    
    e.stopPropagation();
    setIsDragging(true);
    startDragging(component.id);
    selectComponent(component.id);
    
    const rect = componentRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && componentRef.current) {
      const canvas = componentRef.current.parentElement;
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - dragOffset.x;
        const newY = e.clientY - canvasRect.top - dragOffset.y;
        
        updateComponentPosition(component.id, {
          x: Math.max(0, Math.min(newX, canvasRect.width - component.width)),
          y: Math.max(0, Math.min(newY, canvasRect.height - component.height)),
        });
      }
    }
  }, [isDragging, dragOffset.x, dragOffset.y, updateComponentPosition, component.id, component.width, component.height]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      stopDragging();
    }
  }, [isDragging, stopDragging]);

  const handleConnectionPointClick = (
    e: React.MouseEvent,
    position: 'top' | 'bottom'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    
    const point: ConnectionPoint = {
      id: `${component.id}-${position}`,
      componentId: component.id,
      position,
      point: {
        x: component.position.x + component.width / 2,
        y: position === 'top' 
          ? component.position.y 
          : component.position.y + component.height,
      },
    };

    if (connectingFrom) {
      finishConnecting(point);
    } else {
      startConnecting(point);
    }
  };

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const isSelected = selectedComponent === component.id;

  return (
    <div
      ref={componentRef}
      className={`absolute cursor-move select-none ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        left: component.position.x,
        top: component.position.y,
        width: component.width,
        height: component.height,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 상단 연결점 */}
      <div
        className="connection-point absolute left-1/2 -translate-x-1/2 -top-2 w-4 h-4 bg-green-500 rounded-full cursor-pointer hover:bg-green-600 border-2 border-white shadow-md z-10"
        onClick={(e) => handleConnectionPointClick(e, 'top')}
        onMouseDown={(e) => e.stopPropagation()}
      />
      
      {/* 컴포넌트 박스 */}
      <div className="w-full h-full bg-white border-2 border-gray-800 rounded-lg shadow-lg flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-800">{component.label}</span>
      </div>
      
      {/* 하단 연결점 */}
      <div
        className="connection-point absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-red-500 rounded-full cursor-pointer hover:bg-red-600 border-2 border-white shadow-md z-10"
        onClick={(e) => handleConnectionPointClick(e, 'bottom')}
        onMouseDown={(e) => e.stopPropagation()}
      />
    </div>
  );
}
