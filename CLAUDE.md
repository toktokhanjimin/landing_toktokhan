@AGENTS.md

# TOKTOKHAN.DEV — 프로젝트 규칙

## 절대 규칙 (건드리지 말 것)

- **배포 금지**: 사용자가 명시적으로 요청하기 전까지 절대 배포하지 말 것
- **도메인 금지**: `www.toktokhan.dev` 도메인 설정에 절대 손대지 말 것 (Vercel 프로젝트 연결, DNS 변경 모두 포함)

---

## URL 정보

| 용도 | URL |
|------|-----|
| 개발 서버 (Vercel staging) | `https://my-project-two-khaki-92.vercel.app` |
| 운영 도메인 (절대 건드리지 말 것) | `https://www.toktokhan.dev` |
| 브로셔 폼 (Pluuug) | `https://www.pluuug.com/form/pbrPZzeYyu` |
| 브로셔 완료 페이지 (개발) | `https://my-project-two-khaki-92.vercel.app/brochure/success` |

배포 명령어: `npx vercel --prod`

---

## 브레이크포인트

| 구간 | 범위 |
|------|------|
| Mobile | `≤ 767px` |
| Tablet | `768px – 1023px` |
| Desktop | `≥ 1024px` |

---

## CSS 전략

### 핵심 원칙
- 레이아웃·그리드 관련 속성은 **인라인 스타일에 쓰지 말 것** — `globals.css`로만 제어
- 반응형 오버라이드는 `globals.css` 미디어쿼리에서 `!important`로 처리
- 색상·간격·타이포 등 모든 값은 CSS 변수(`var(--*)`) 사용

### 자주 하는 실수
- `gridAutoRows` 또는 `gridTemplateColumns`를 컴포넌트 인라인 스타일에 쓰면 CSS `!important`와 충돌함
- `.wg-grid` (홈 포트폴리오 그리드) vs `.wk-grid` (Work 목록 페이지 그리드) 혼동 주의

---

## 파일 구조

```
app/
├── globals.css          # 디자인 토큰 + 반응형 CSS (핵심 파일)
├── layout.tsx           # Root layout
├── page.tsx             # 홈페이지
├── components/
│   ├── ui/
│   │   ├── Button.tsx       # 공용 버튼 컴포넌트
│   │   ├── FilterChip.tsx   # 필터 칩 (work, insight 페이지)
│   │   ├── Badge.tsx        # 뱃지
│   │   └── Container.tsx    # 레이아웃 컨테이너
│   ├── StickyActionButton.tsx  # 하단 플로팅 바
│   ├── SiteHeader.tsx          # 글로벌 헤더
│   ├── Footer.tsx              # 글로벌 푸터
│   ├── WorkGrid.tsx            # 홈 포트폴리오 섹션 (wg-grid)
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── WhyToktok.tsx
│   ├── KPIStrip.tsx
│   ├── AIInsights.tsx
│   ├── Clients.tsx
│   └── FAQ.tsx
├── lib/
│   └── store.ts         # 데이터 store (localStorage 기반)
├── work/                # 포트폴리오 목록 + 상세
├── insight/             # 인사이트 목록 + 상세
├── faq/                 # 자주 묻는 질문
├── brochure/success/    # 브로셔 신청 완료 페이지
└── admin/               # 어드민 (콘텐츠 관리)
```

---

## 데이터 구조 (store.ts)

| 인터페이스 | localStorage 키 | 설명 |
|---|---|---|
| `WorkItem[]` | `ttk_work` | 포트폴리오 항목 |
| `InsightItem[]` | `ttk_insights` | 인사이트 항목 |
| `FAQItem[]` | `ttk_faqs` | FAQ |
| `StickyConfig` | `ttk_sticky` | 플로팅 바 설정 |

썸네일 이미지는 별도 키(`ttk_work_thumb_{id}`, `ttk_insight_img_{i}`)에 저장해 메인 JSON 크기를 줄임.

---

## 컴포넌트 사용 규칙

- 버튼은 반드시 `Button` 컴포넌트 사용 (`variant`: primary / secondary / outline / ghost)
- 필터 칩은 `FilterChip` 컴포넌트 사용
- 뱃지는 `Badge` 컴포넌트 사용
- 인라인으로 `<button>`, `<a>` 스타일링 직접 하지 말 것 (어드민 내부 제외)

---

## StickyActionButton 주요 사항

- 플로팅 형태 (fixed): 모든 일반 페이지
- 인라인 형태 (sticky): FAQ 페이지 내부
- Desktop 바 너비: `700px`, `justify-content: space-between`
- Tablet/Mobile (≤1023px): 설명 텍스트 숨김, 버튼만 중앙 정렬, 너비 `auto`
- 채팅 아이콘 버튼 → `/faq` 이동
- 서비스 소개서 버튼 → Pluuug 폼 (`https://www.pluuug.com/form/pbrPZzeYyu`) 새 탭
- "똑똑한 AX 교육 보기" 버튼 → 어드민에서 URL 관리 (`ttk_sticky`)

---

## 다음 작업 목록

### 마케팅 세팅 (마케터 정보 대기 중)

**마케터한테 받아야 할 것들:**
- GA4 측정 ID (`G-XXXXXXXXXX`)
- SEO 카피 검토 (아래 초안 마케터 확인 필요)
- 추적할 이벤트 목록 확정
- 추가 픽셀 필요 여부 (Meta, 카카오 광고 등)

**SEO 카피 초안 (마케터 검토 필요):**
```
홈:      똑똑한개발자 | No.1 AX 파트너
         복잡한 업무 흐름과 기존 시스템을 이해하고, AI가 실제 업무 안에서 작동하도록 전략·개발·운영까지 함께 설계합니다.

Work:    포트폴리오 | 똑똑한개발자
         AX·AI·Ops 분야 실제 프로젝트 사례들. 각 작업은 똑똑한개발자의 일하는 방식이 남긴 기록입니다.

Insight: 인사이트 | 똑똑한개발자
         AX·AI를 만들며 배운 것들과, 일하는 방식에 대한 짧은 글들.

FAQ:     자주 묻는 질문 | 똑똑한개발자
         AX 도입을 고민하면서 가장 많이 받는 질문들을 모았습니다.

키워드:  AX, AI 도입, 업무 자동화, AI 에이전트, AX 컨설팅, 똑똑한개발자, 기업 AI 전환
```

**OG 이미지:** `/public/OG.png` (1200×630px) ✅ 준비 완료

**작업할 파일들:**
- `app/layout.tsx` — metadata (SEO + OG) + GA 스크립트
- `app/work/page.tsx`, `app/insight/page.tsx`, `app/faq/page.tsx` — 페이지별 metadata
- `app/sitemap.ts` — 신규 생성
- `app/robots.ts` — 신규 생성

**실배포 시 추가로 해야 할 것:**
- Google Search Console 등록 + 소유권 인증
- sitemap.xml Search Console 제출
- OG 미리보기 디버거 확인 (카카오/페이스북)
