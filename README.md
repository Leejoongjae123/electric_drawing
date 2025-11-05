# 회로도 에디터 (Circuit Lab)

드래그앤드랍으로 전자 회로 컴포넌트를 배치하고 연결할 수 있는 웹 기반 회로도 에디터입니다.

## 주요 기능

- **컴포넌트 추가**: 버튼 클릭으로 회로 컴포넌트 추가
- **드래그앤드랍**: 컴포넌트를 자유롭게 이동
- **와이어 연결**: 컴포넌트 간 연결선 생성 (ㄷ자 형태)
- **삭제 기능**: 컴포넌트 및 와이어 삭제
- **실시간 업데이트**: 컴포넌트 이동 시 연결된 와이어 자동 업데이트

## 기술 스택

- **Framework**: Next.js 16.0.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5.0.8
- **UI Library**: React 19.2.0

## 프로젝트 구조

```
150.electric_circuit_circuitlab/
├── app/
│   ├── circuit/                          # 회로도 에디터 페이지
│   │   ├── components/                   # 에디터 관련 컴포넌트
│   │   │   ├── store/                    # Zustand 상태 관리
│   │   │   │   └── circuitStore.ts       # 회로도 전역 상태
│   │   │   ├── CircuitCanvas.tsx         # 캔버스 컴포넌트 (Client)
│   │   │   ├── CircuitComponent.tsx      # 개별 회로 컴포넌트
│   │   │   ├── ControlPanel.tsx          # 제어 패널 (추가/삭제 버튼)
│   │   │   └── WireComponent.tsx         # 와이어 연결선 컴포넌트
│   │   ├── page.tsx                      # 회로도 에디터 메인 페이지 (Server)
│   │   └── types.ts                      # 타입 정의
│   ├── layout.tsx                        # 루트 레이아웃
│   ├── page.tsx                          # 홈페이지
│   ├── globals.css                       # 전역 스타일
│   └── favicon.ico                       # 파비콘
├── public/                               # 정적 파일
├── package.json                          # 프로젝트 의존성
├── tsconfig.json                         # TypeScript 설정
├── next.config.ts                        # Next.js 설정
├── tailwind.config.ts                    # Tailwind CSS 설정
└── README.md                             # 프로젝트 문서

```

## 아키텍처 설계

### 컴포넌트 구조

#### Server Components
- `app/page.tsx`: 홈페이지 (랜딩)
- `app/circuit/page.tsx`: 회로도 에디터 페이지 래퍼

#### Client Components
- `CircuitCanvas`: 메인 캔버스 (그리드, 와이어 렌더링)
- `CircuitComponent`: 개별 회로 컴포넌트 (드래그, 연결점)
- `WireComponent`: 와이어 연결선 (ㄷ자 형태, 삭제 기능)
- `ControlPanel`: 제어 패널 (컴포넌트 추가, 선택된 항목 삭제)

### 상태 관리 (Zustand)

**위치**: `app/circuit/components/store/circuitStore.ts`

**주요 상태**:
```typescript
{
  components: Component[]           // 회로 컴포넌트 배열
  wires: Wire[]                     // 와이어 연결선 배열
  selectedComponent: string | null  // 선택된 컴포넌트 ID
  draggingComponent: string | null  // 드래그 중인 컴포넌트 ID
  connectingFrom: ConnectionPoint | null  // 연결 시작점
}
```

**주요 액션**:
- `addComponent()`: 새 컴포넌트 추가
- `updateComponentPosition()`: 컴포넌트 위치 업데이트 + 연결된 와이어 자동 업데이트
- `startConnecting()` / `finishConnecting()`: 와이어 연결
- `deleteComponent()` / `deleteWire()`: 삭제

### 타입 정의

**위치**: `app/circuit/types.ts`

```typescript
interface Component {
  id: string
  position: Point
  width: number
  height: number
  label: string
}

interface Wire {
  id: string
  from: ConnectionPoint
  to: ConnectionPoint
  midPoint?: Point  // 와이어 중간점 (선택적)
}

interface ConnectionPoint {
  id: string
  componentId: string
  position: 'top' | 'bottom'
  point: Point
}
```

## 주요 기능 구현

### 1. 드래그앤드랍
- `CircuitComponent`에서 `onMouseDown` 이벤트로 드래그 시작
- `circuitStore`의 `updateComponentPosition`으로 위치 업데이트
- 연결된 와이어 자동 재계산

### 2. 와이어 연결
- 컴포넌트 상단/하단 연결점 클릭으로 시작
- 마우스 이동 시 임시 ㄷ자 형태 와이어 표시
- 다른 컴포넌트 연결점 클릭으로 완료

### 3. 그리드 배경
- SVG `<pattern>`을 사용한 점 그리드
- 20px 간격의 회색 점

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
npm run build
npm start
```

## 개발 가이드

### 새 컴포넌트 추가 시

1. `app/circuit/components/` 폴더에 컴포넌트 생성
2. Client 컴포넌트인 경우 `'use client'` 지시어 추가
3. 필요한 타입은 `types.ts`에 정의
4. 상태 관리가 필요한 경우 `circuitStore.ts` 확장

### 스타일링

- Tailwind CSS 유틸리티 클래스 사용
- 다크 모드 지원: `dark:` 접두사 활용

### 상태 관리

- 페이지별 상태는 해당 페이지의 `components/store/` 폴더에 관리
- Zustand를 사용한 전역 상태 관리

## 설정 파일

- `next.config.ts`: Next.js 설정
- `tsconfig.json`: TypeScript 컴파일러 옵션
- `tailwind.config.ts`: Tailwind CSS 커스터마이징
- `eslint.config.mjs`: ESLint 규칙

## 라이선스

Private Project

## 기여

이 프로젝트는 개인 프로젝트입니다.
