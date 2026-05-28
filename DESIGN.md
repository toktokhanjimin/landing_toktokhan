# TOKTOKHAN.DEV — 디자인 시스템

> 모든 값은 `app/globals.css` `:root`에 CSS 변수로 선언돼 있음.  
> 컴포넌트 인라인 스타일에서는 반드시 `var(--*)` 형태로 참조할 것.

---

## 색상 시스템

### Brand (Primary)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--primary-500` | `#4950ff` | 브랜드 메인, CTA 버튼 |
| `--primary-400` | `#6b6fff` | 밝은 강조 |
| `--primary-700` | `#2c32b3` | 깊은 강조 |
| `--brand` | `var(--primary-500)` | 시맨틱 alias |
| `--brand-bright` | `var(--primary-400)` | |
| `--brand-deep` | `var(--primary-700)` | |
| `--on-brand` | `var(--white)` | 브랜드 색 위 텍스트 |
| `--btn-primary` | `var(--primary-500)` | 버튼 배경 |

### Grey Scale
| 토큰 | 값 |
|------|-----|
| `--grey-50` | `#f9f9fa` |
| `--grey-100` | `#eaebec` |
| `--grey-200` | `#cfd2d5` |
| `--grey-300` | `#9fa4a9` |
| `--grey-400` | `#6a6d71` |
| `--grey-500` | `#4e5053` |
| `--grey-700` | `#333537` |
| `--grey-800` | `#272727` |
| `--grey-900` | `#1b1c1d` |

### 배경 (Semantic)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--bg` | `var(--white)` | 기본 페이지 배경 (light) |
| `--bg-elev` | `var(--grey-50)` | 카드·패널 배경 |
| `--bg-inverse` | `var(--grey-900)` | |
| `--bg-dark` | `#0a0a0a` | 다크 섹션 배경 (기본 body) |
| `--bg-dark-2` | `#111214` | |
| `--bg-dark-panel` | `#1b1c1d` | |

### 텍스트 (Semantic)
| 토큰 | 용도 |
|------|------|
| `--fg-1` | 기본 텍스트 (on light) |
| `--fg-2` | 보조 텍스트 |
| `--fg-3` | 비활성 텍스트 |
| `--fg-on-dark-1` | 다크 배경 위 기본 텍스트 (white) |
| `--fg-on-dark-2` | 다크 배경 위 보조 텍스트 (70%) |
| `--fg-on-dark-3` | 다크 배경 위 비활성 텍스트 (40%) |

### 테두리
| 토큰 | 용도 |
|------|------|
| `--border` | 기본 경계선 |
| `--border-strong` | 강조 경계선 |
| `--border-dark` | 다크 섹션 경계선 |

### 상태 색상
| 토큰 | 값 |
|------|-----|
| `--red-500` | `#ee3538` |
| `--green-500` | `#1f8a3f` |
| `--yellow-500` | `#d9a400` |
| `--blue-info` | `var(--primary-500)` |

---

## 타이포그래피

### 폰트 패밀리
```css
--font-sans:    "Pretendard Variable", Pretendard, -apple-system, ...
--font-display: "Pretendard Variable", Pretendard, -apple-system, sans-serif
--font-mono:    "IBM Plex Mono", ui-monospace, ...
```

### 폰트 단축키 (`font: <value>` 형태로 사용)
| 토큰 | 크기 / 굵기 | 용도 |
|------|------------|------|
| `--display-1` | 700 / 120px | 대형 히어로 |
| `--display-2` | 700 / 80px | |
| `--display-3` | 700 / 64px | |
| `--h1` | 700 / 48px | |
| `--h2` | 700 / 40px | |
| `--h3` | 700 / 32px | |
| `--h4` | 700 / 24px | |
| `--h5` | 600 / 20px | |
| `--h6` | 600 / 18px | |
| `--body-lg` | 400 / 18px | |
| `--body-md` | 400 / 16px | |
| `--body-sm` | 400 / 14px | |
| `--caption` | 500 / 14px | |
| `--overline` | 500 / 12px | 모노, 레이블 |
| `--code` | 500 / 14px | 코드 |

사용 예: `font: var(--body-md)` 또는 `font: "var(--h3)"`

### 자간 (Letter Spacing)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--tracking-display` | `-0.02em` | 대형 디스플레이 |
| `--tracking-heading` | `-0.01em` | 헤딩 |
| `--tracking-body` | `-0.005em` | 본문 (기본) |
| `--tracking-label` | `0.02em` | 레이블, 캡션 |
| `--tracking-mono` | `0.04em` | 모노스페이스 |

---

## 간격 (Spacing)

| 토큰 | 값 |
|------|-----|
| `--s-1` | 4px |
| `--s-2` | 8px |
| `--s-3` | 12px |
| `--s-4` | 16px |
| `--s-5` | 20px |
| `--s-6` | 24px |
| `--s-8` | 32px |
| `--s-10` | 40px |
| `--s-12` | 48px |
| `--s-16` | 64px |
| `--s-20` | 80px |
| `--s-24` | 96px |
| `--s-32` | 128px |

---

## 모서리 반경 (Border Radius)

| 토큰 | 값 | 용도 예시 |
|------|-----|----------|
| `--r-xs` | 4px | |
| `--r-sm` | 8px | 버튼, 뱃지, 필터 칩 |
| `--r-md` | 12px | |
| `--r-lg` | 16px | 카드 (WorkGrid, WorkCard 등) |
| `--r-xl` | 24px | 큰 카드, 모달 |
| `--r-2xl` | 40px | |
| `--r-full` | 9999px | 원형 버튼, 알약형 |

---

## 그림자 (Elevation)

| 토큰 | 용도 |
|------|------|
| `--elev-1` | 미세한 그림자 |
| `--elev-2` | 카드 기본 |
| `--elev-3` | 드롭다운, 팝오버 |
| `--elev-4` | 모달, 플로팅 바 |

---

## 모션 (Motion)

### 이징
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--ease-out` | `cubic-bezier(.2,.6,.2,1)` | 등장 애니메이션 |
| `--ease-in-out` | `cubic-bezier(.65,.05,.36,1)` | 전환 |
| `--ease-soft` | `cubic-bezier(.4,0,.2,1)` | 버튼/링크 hover |

### 지속 시간
| 토큰 | 값 |
|------|-----|
| `--dur-1` | 120ms |
| `--dur-2` | 200ms |
| `--dur-3` | 320ms |
| `--dur-4` | 560ms |

---

## 컴포넌트

### Button (`app/components/ui/Button.tsx`)

```tsx
<Button variant="primary" size="md" href="/work">포트폴리오 보기 →</Button>
```

| variant | 설명 |
|---------|------|
| `primary` | 브랜드 배경 + 흰 텍스트 |
| `secondary` | 어두운 배경 (dark UI용) |
| `outline` | 흰 배경 + 얇은 테두리 |
| `ghost` | `bg-elev` 배경, 테두리 없음 |

| size | padding |
|------|---------|
| `sm` | 8px 14px |
| `md` | 12px 18px (기본) |
| `lg` | 14px 22px |

### FilterChip (`app/components/ui/FilterChip.tsx`)

카테고리 필터 토글 버튼. work/insight 목록 페이지에서 사용.

```tsx
<FilterChip active={active === "AX"} onClick={() => setActive("AX")}>AX</FilterChip>
```

### Badge (`app/components/ui/Badge.tsx`)

```tsx
<Badge variant="dark">AI</Badge>
```

| variant | 배경 | 텍스트 |
|---------|------|--------|
| `default` | white | grey-800 |
| `dark` | bg-dark | fg-on-dark-1 |
| `primary` | primary-50 | primary-700 |

---

## CSS 유틸리티 클래스 (globals.css)

| 클래스 | 설명 |
|--------|------|
| `.section-title` | 섹션 타이틀 공통 스타일 (clamp 크기) |
| `.tok-dark` | 다크 섹션 배경+텍스트 유틸리티 |
| `.reveal` | 스크롤 등장 초기 상태 (opacity 0) |
| `.reveal.in` | 스크롤 등장 완료 상태 |
| `.wg-grid` | 홈 포트폴리오 그리드 (3열→2열→1열) |
| `.wk-grid` | Work 목록 페이지 그리드 |
| `.wg-card` | 홈 포트폴리오 카드 |
| `.wk-card` | Work 목록 카드 |
| `.no-px` | 좌우 패딩 없음 (클라이언트 마퀴 등) |

---

## 반응형 전략

### 구조
```
globals.css
├── :root { /* 토큰 */ }
├── 베이스 스타일
├── CSS 유틸리티 클래스 (컴포넌트별)
├── @media (max-width: 767px) { /* Mobile */ }
└── @media (min-width: 768px) and (max-width: 1023px) { /* Tablet */ }
```

### 핵심 규칙
1. 그리드/레이아웃 속성은 **인라인 스타일 금지**, CSS 클래스에서만 제어
2. 반응형 오버라이드는 `!important` 사용
3. 컴포넌트에서 반응형이 필요하면 className 기반 CSS로 처리

### 주요 반응형 클래스
| 클래스 | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| `.wg-grid` | 1열, 220px 높이 | 2열, 260px 높이 | 3열, 320px 높이 |
| `.wk-grid` | 1열 | 2열 | 3열 |
| `.nav-links` | 숨김 | - | 표시 |
| `.nav-hamburger` | 표시 | - | 숨김 |
| `.wt-card-img` | - | 숨김 | 표시 |
| `.footer-grid` | 2열 | 3열 | 5열 |
| `.footer-info` | 중앙정렬 | 중앙정렬 (absolute) | 그리드 원래 위치 |

---

## 키애니메이션

```css
@keyframes clientsMarquee  /* 클라이언트 로고 무한 스크롤 */
@keyframes toastIn         /* 토스트 알림 등장 */
@keyframes modalFade       /* 모달 페이드인 */
@keyframes drawerSlide     /* 드로어 슬라이드 */
```

---

## 글로벌 기본 설정

- `body` 배경: `#0a0a0a` (다크)
- `body` 텍스트: `#fff`
- `word-break: keep-all` (전역, 한국어 줄바꿈 보호)
- `::selection` 배경: `var(--primary-500)`
- 버튼·링크 기본 트랜지션: background, color, border, box-shadow, transform, opacity
