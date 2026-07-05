# vanillagrid2 — hisonvue HGrid의 원천 라이브러리

hisonvue **HGrid 컴포넌트가 사용하는 npm `vanillagrid2`의 소스 저장소**. 의존성 없는 순수 TypeScript 그리드.

## ⚠️ 형제 폴더 주의 — 분석/작업 대상은 이 저장소(vanillagrid2.min)만

부모 폴더에는 구버전 저장소들이 함께 있으나 hisonvue와 무관:

```
vanilla/grid/
├─ vanillagrid/             ← v1 원천 (구버전 — 분석 불필요)
├─ vanillagrid.min/         ← v1 배포본 (구버전 — 분석 불필요)
├─ vanillagrid2.min/        ← ★ v2. hisonvue가 사용하는 npm `vanillagrid2` (v1.0.8)
│  ├─ src/
│  │  ├─ index.ts           ← export: getVanillagrid, getVanillagridConfig, 타입/enum
│  │  ├─ core/              ← getVanillagrid(싱글톤), mount/unmountVanillagrid, getGridMethod(2,330줄)
│  │  ├─ types/             ← gridMethods(4,170줄 = 인스턴스 API 정의), gridInfo, colInfo, dataType, enum
│  │  └─ utils/             ← handleGrid/Cell/Element/Active 등 내부 구현
│  └─ playground/           ← Vue 기반 로컬 테스트
└─ vanilla-grid.github.io/  ← 전용 문서 사이트 소스
```

## 핵심 사실 (vanillagrid2.min v1.0.8)

- npm `vanillagrid2` / 런타임 의존성 없음 / MIT / TypeScript + webpack 번들
- **생명주기**: `getVanillagridConfig()` → `getVanillagrid(config)`(싱글톤) → `vg.init()`(SSR 대비 분리, 1회) → `vg.mountGrid(el?)` → `vg.getGrid(id)` → `vg.unmountGrid(el?)` → `vg.destroy()`
- HTML 선언: `<div data-vanillagrid data-id="..."><div data-col id=".." data-type=".."></div></div>`
- `vg.getGrid(id)` → **GridMethods 약 250개** (load/getValues/getDatas, setOnXxx 이벤트 훅 30여 종, grid/col/row/cell 단위 set·get, 검색, undo/redo)
- **행 상태 추적**: RowStatus `C`/`U`/`D` — 편집 시 자동 마킹, `getDatas()`로 변경분 포함 조회
- 셀 타입 10종(text/number/date/month/mask/select/checkbox/button/link/code) + config.dataType으로 커스텀 타입 확장(getChildNode/getEditor/getValue/getText 등)
- **hisonvue 연동**: hisonvue의 getDefaultHisonConfig()가 getVanillagridConfig()를 내부 호출해 `hisonConfig.component.grid`에 주입. HGrid가 mount/unmount 관리

## 상세 문서

- 가이드: `../../../../md/hisondev-vanillagrid.md` (소스 검증 완료)
- 생태계 전체: `../../../../md/hisondev-ecosystem.md`

## 알려진 이슈 (수정 금지 — 추후 소유자와 재정리 예정)

1. GridMethods 공개 API 오타: `getDefualtGridInfo/getDefualtGridCssInfo/getDefualtColInfo` (Defualt→Default)
2. package.json test 스크립트 미구현

## 작업 규칙

- 이 폴더의 소스/README 수정은 사용자의 명시적 지시가 있을 때만 진행 (프로젝트 루트 CLAUDE.md 규칙 준수)
