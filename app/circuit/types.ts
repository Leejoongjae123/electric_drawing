export interface Point {
  x: number;
  y: number;
}

export interface ConnectionPoint {
  id: string;
  componentId: string;
  position: 'top' | 'bottom';
  point: Point;
}

export interface Component {
  id: string;
  position: Point;
  width: number;
  height: number;
  label: string;
}

export interface Wire {
  id: string;
  from: ConnectionPoint;
  to: ConnectionPoint;
  midPoint?: Point; // 사용자가 조정한 중간 지점 (선택적)
}

export interface CircuitState {
  components: Component[];
  wires: Wire[];
  selectedComponent: string | null;
  draggingComponent: string | null;
  connectingFrom: ConnectionPoint | null;
  addComponent: () => void;
  updateComponentPosition: (id: string, position: Point) => void;
  updateWireMidPoint: (wireId: string, midPoint: Point) => void;
  startDragging: (id: string) => void;
  stopDragging: () => void;
  selectComponent: (id: string | null) => void;
  startConnecting: (point: ConnectionPoint) => void;
  finishConnecting: (point: ConnectionPoint) => void;
  cancelConnecting: () => void;
  deleteComponent: (id: string) => void;
  deleteWire: (id: string) => void;
}
