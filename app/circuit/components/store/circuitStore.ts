import { create } from 'zustand';
import { CircuitState, Component, Point, ConnectionPoint, Wire } from '../../types';

export const useCircuitStore = create<CircuitState>((set, get) => ({
  components: [],
  wires: [],
  selectedComponent: null,
  draggingComponent: null,
  connectingFrom: null,

  addComponent: () => {
    // 캔버스 중앙에 배치 (기본 캔버스 크기 가정)
    const canvasWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const canvasHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const componentWidth = 120;
    const componentHeight = 80;
    
    const newComponent: Component = {
      id: `component-${Date.now()}`,
      position: { 
        x: (canvasWidth - componentWidth) / 2, 
        y: (canvasHeight - componentHeight) / 2 
      },
      width: componentWidth,
      height: componentHeight,
      label: `Component ${get().components.length + 1}`,
    };
    set((state) => ({
      components: [...state.components, newComponent],
    }));
  },

  updateComponentPosition: (id: string, position: Point) => {
    set((state) => {
      // 먼저 컴포넌트 위치 업데이트
      const updatedComponents = state.components.map((comp) =>
        comp.id === id ? { ...comp, position } : comp
      );
      
      // 업데이트된 컴포넌트 정보로 와이어 업데이트
      const updatedWires = state.wires.map((wire) => {
        const fromComp = updatedComponents.find((c) => c.id === wire.from.componentId);
        const toComp = updatedComponents.find((c) => c.id === wire.to.componentId);
        
        if (!fromComp || !toComp) return wire;
        
        const updatedFrom = {
          ...wire.from,
          point: {
            x: fromComp.position.x + fromComp.width / 2,
            y: wire.from.position === 'top' 
              ? fromComp.position.y 
              : fromComp.position.y + fromComp.height,
          },
        };
        
        const updatedTo = {
          ...wire.to,
          point: {
            x: toComp.position.x + toComp.width / 2,
            y: wire.to.position === 'top' 
              ? toComp.position.y 
              : toComp.position.y + toComp.height,
          },
        };
        
        return { ...wire, from: updatedFrom, to: updatedTo };
      });
      
      return {
        components: updatedComponents,
        wires: updatedWires,
      };
    });
  },

  updateWireMidPoint: (wireId: string, midPoint: Point) => {
    set((state) => ({
      wires: state.wires.map((wire) =>
        wire.id === wireId ? { ...wire, midPoint } : wire
      ),
    }));
  },

  startDragging: (id: string) => {
    set({ draggingComponent: id });
  },

  stopDragging: () => {
    set({ draggingComponent: null });
  },

  selectComponent: (id: string | null) => {
    set({ selectedComponent: id });
  },

  startConnecting: (point: ConnectionPoint) => {
    set({ connectingFrom: point });
  },

  finishConnecting: (point: ConnectionPoint) => {
    const { connectingFrom } = get();
    
    if (connectingFrom && connectingFrom.componentId !== point.componentId) {
      const newWire: Wire = {
        id: `wire-${Date.now()}`,
        from: connectingFrom,
        to: point,
      };
      
      set((state) => ({
        wires: [...state.wires, newWire],
        connectingFrom: null,
      }));
    } else {
      set({ connectingFrom: null });
    }
  },

  cancelConnecting: () => {
    set({ connectingFrom: null });
  },

  deleteComponent: (id: string) => {
    set((state) => ({
      components: state.components.filter((comp) => comp.id !== id),
      wires: state.wires.filter(
        (wire) => wire.from.componentId !== id && wire.to.componentId !== id
      ),
      selectedComponent: state.selectedComponent === id ? null : state.selectedComponent,
    }));
  },

  deleteWire: (id: string) => {
    set((state) => ({
      wires: state.wires.filter((wire) => wire.id !== id),
    }));
  },
}));
