'use client';

import { useCircuitStore } from './store/circuitStore';

export default function ControlPanel() {
  const {
    components,
    wires,
    selectedComponent,
    addComponent,
    deleteComponent,
  } = useCircuitStore();

  const selectedComp = components.find((c) => c.id === selectedComponent);

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 space-y-4 min-w-[250px] z-10">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">회로도 에디터</h2>
        <p className="text-sm text-gray-600">
          컴포넌트: {components.length}개 | 와이어: {wires.length}개
        </p>
      </div>

      <div className="border-t pt-4">
        <button
          onClick={addComponent}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          + 컴포넌트 추가
        </button>
      </div>

      {selectedComp && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            선택된 컴포넌트
          </h3>
          <div className="bg-gray-50 p-3 rounded space-y-2 text-sm">
            <p>
              <span className="font-medium">이름:</span> {selectedComp.label}
            </p>
            <p>
              <span className="font-medium">위치:</span> ({Math.round(selectedComp.position.x)}, {Math.round(selectedComp.position.y)})
            </p>
            <button
              onClick={() => deleteComponent(selectedComp.id)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors mt-2"
            >
              삭제
            </button>
          </div>
        </div>
      )}

      <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
        <p>• 컴포넌트를 드래그하여 이동</p>
        <p>• 상단(초록)/하단(빨강) 점을 드래그하여 연결</p>
        <p>• 와이어를 클릭하여 삭제</p>
      </div>
    </div>
  );
}
