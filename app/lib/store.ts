// ─── 타입 정의 ─────────────────────────────────────────────────────────────────
// work / insight 는 Supabase에서 관리 (app/lib/supabase.ts 참고)

export interface WorkItem {
  id: string;
  slug?: string;            // URL slug (없으면 id 사용)
  client: string;
  tag: string;
  category: string;
  year: string;
  date: string;
  bg: string;
  desc: string;
  title: string;
  lead: string;
  thumbImg?: string;        // Supabase Storage URL
  sections: { h: string; p: string; grad: string; img?: string }[];
  points: string[];
  featured?: boolean;
  relatedInsights?: number[]; // insight ID 배열 (Supabase insights.id)
  sort_order?: number;
}

export interface InsightItem {
  id?: number;              // Supabase auto-increment PK
  slug?: string;            // URL slug (없으면 id 사용)
  mark: string;
  markColor: string;
  thumb: string;
  thumbImg?: string;        // Supabase Storage URL
  title: string;
  tag: string;
  category?: string;
  date: string;
  excerpt: string;
  url?: string;
  body?: string;            // Tiptap HTML content
  featured?: boolean;
  sort_order?: number;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface StickyAction {
  label: string;
  url: string;
  type: "link" | "download";
  fileName?: string;
}

export interface StickyConfig {
  enabled: boolean;
  buttonLabel: string;
  description: string;
  actions: StickyAction[];
}

// ─── FAQ (localStorage) ────────────────────────────────────────────────────────

const DEFAULT_FAQS: FAQItem[] = [
  {
    q: "AX 도입은 얼마나 걸려요?",
    a: "조직 규모와 범위에 따라 다른데, 보통 진단부터 1차 운영 안착까지 8~12주 정도 잡아요. 짧게는 4주짜리 파일럿으로 시작하고, 결과를 보고 단계적으로 늘려가는 걸 추천드려요.",
  },
  {
    q: "어디서부터 시작해야 할지 모르겠어요.",
    a: "괜찮아요. 거의 모든 고객이 같은 지점에서 시작해요. 먼저 한 시간 정도 워크플로우를 같이 들여다보면서 어떤 일이 매일·매주 반복되는지 짚고, 그중 가장 임팩트 큰 1~2개를 골라서 파일럿을 만들어요.",
  },
  {
    q: "우리 데이터가 외부로 나가나요?",
    a: "기본 원칙은 '나가지 않는다'예요. 자체 호스팅 모델, 사내 인프라 연동, 권한 분리까지 보안 요구사항에 맞춰 설계해요. 외부 API를 써야 하는 경우엔 데이터 마스킹·로그 정책을 같이 정의해요.",
  },
  {
    q: "기존 시스템이랑 어떻게 연결돼요?",
    a: "Slack, Jira, Notion, Confluence, 사내 CRM·ERP까지 대부분의 협업 도구와 연동돼요. 기존 시스템을 갈아엎지 않고, 그 위에서 AI가 작업을 거드는 형태로 붙여요.",
  },
  {
    q: "결과는 어떻게 측정해요?",
    a: "도입 전 베이스라인을 먼저 측정해요. 처리 시간, 에러율, 응답 속도, 1인당 산출량 같은 운영 지표를 정하고, 도입 후 같은 지표를 주간 단위로 봐요. 숫자로 안 보이면 도입 안 한 것과 같아요.",
  },
  {
    q: "팀원들이 잘 쓸 수 있을까요?",
    a: "이게 가장 자주 듣는 질문이에요. 그래서 사내 강사 교육과 실무 훈련을 같이 해요. 도구만 던지지 않고, 매뉴얼·예시·온보딩 세션까지 묶어서 '내일 출근하면 바로 쓰는' 상태로 만들어드려요.",
  },
  {
    q: "비용은 어떻게 책정돼요?",
    a: "범위와 기간에 따라 견적을 따로 드려요. 파일럿은 고정가, 본 도입은 단계별 마일스톤 기반이 많아요. 첫 미팅에서 어떤 범위가 우리한테 맞는지 같이 정해드릴게요.",
  },
];

export const getFAQs = (): FAQItem[] => {
  if (typeof window === "undefined") return DEFAULT_FAQS;
  try {
    const raw = localStorage.getItem("ttk_faqs");
    return raw ? (JSON.parse(raw) as FAQItem[]) : DEFAULT_FAQS;
  } catch {
    return DEFAULT_FAQS;
  }
};

export const saveFAQs = (data: FAQItem[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("ttk_faqs", JSON.stringify(data));
};

// ─── StickyConfig (localStorage) ──────────────────────────────────────────────

const DEFAULT_STICKY: StickyConfig = {
  enabled: true,
  buttonLabel: "똑똑한개발자 더 알아보기",
  description: "No.1 AX 파트너\n똑똑한개발자가 궁금하다면?",
  actions: [
    { label: "서비스 소개서 받기", url: "/brochure", type: "download" },
    { label: "똑똑한 AX 교육 보기", url: "", type: "link" },
  ],
};

export const getStickyConfig = (): StickyConfig => {
  if (typeof window === "undefined") return DEFAULT_STICKY;
  try {
    const raw = localStorage.getItem("ttk_sticky");
    if (!raw) return DEFAULT_STICKY;
    const saved = JSON.parse(raw) as Partial<StickyConfig>;
    const actions = DEFAULT_STICKY.actions.map((def) => {
      const stored = (saved.actions ?? []).find((a) => a.type === def.type);
      return stored ? { ...def, ...stored, url: stored.url || def.url } : def;
    });
    return { ...DEFAULT_STICKY, ...saved, actions };
  } catch {
    return DEFAULT_STICKY;
  }
};

export const saveStickyConfig = (data: StickyConfig): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("ttk_sticky", JSON.stringify(data));
};

// ─── Click Tracking (localStorage) ────────────────────────────────────────────

export const getWorkClicks = (): Record<string, number> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("ttk_work_clicks");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const recordWorkClick = (id: string): void => {
  if (typeof window === "undefined") return;
  const clicks = getWorkClicks();
  clicks[id] = (clicks[id] ?? 0) + 1;
  localStorage.setItem("ttk_work_clicks", JSON.stringify(clicks));
};

export const getInsightClicks = (): Record<string, number> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("ttk_insight_clicks");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const recordInsightClick = (title: string): void => {
  if (typeof window === "undefined") return;
  const clicks = getInsightClicks();
  clicks[title] = (clicks[title] ?? 0) + 1;
  localStorage.setItem("ttk_insight_clicks", JSON.stringify(clicks));
};
