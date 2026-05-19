export interface WorkItem {
  id: string;
  client: string;
  tag: string;
  category: string;
  year: string;
  date: string;
  bg: string;
  desc: string;
  title: string;
  lead: string;
  sections: { h: string; p: string; grad: string }[];
  points: string[];
  featured?: boolean;
}

export interface InsightItem {
  mark: string;
  markColor: string;
  thumb: string;
  thumbImg?: string;
  title: string;
  tag: string;
  date: string;
  excerpt: string;
  url?: string;
  featured?: boolean;
}

export interface FAQItem {
  q: string;
  a: string;
}

const DEFAULT_WORK: WorkItem[] = [
  {
    id: "bluegarage", client: "BLUEGARAGE", tag: "JYP360", category: "AI", year: "2026", date: "2026.03.18", featured: true,
    bg: "linear-gradient(135deg,#5c2845,#a33a7a)",
    title: "아티스트와 팬, 데이터로 연결되다",
    lead: "엔터테인먼트 컴퍼니의 360° 인사이트 플랫폼. 아티스트·콘텐츠·팬 데이터를 한 화면에서 다루는 운영 환경을 새로 설계했어요.",
    desc: "엔터테인먼트 컴퍼니의 360° 인사이트 플랫폼. 아티스트·콘텐츠·팬 데이터를 한 화면에서 다루는 운영 환경을 새로 설계했어요.",
    sections: [
      { h: "문제", p: "수십 명의 아티스트, 수백 개의 콘텐츠, 매주 쏟아지는 팬 데이터. 매니저·마케터·기획자가 각자 다른 시트와 대시보드에서 같은 질문을 반복하고 있었어요. 의사결정 속도는 데이터 양에 반비례하고 있었죠.", grad: "linear-gradient(135deg,#4a1e3a,#7a2a5a 60%,#bd4d8c)" },
      { h: "접근", p: "우리는 도구 개수를 늘리는 대신 '하나의 질문 → 하나의 화면' 원칙을 잡았어요. AI가 자연어 질문을 받아 데이터를 조회하고, 결과는 항상 같은 카드 포맷으로 떨어집니다. 아티스트별 인사이트, 콘텐츠 성과, 팬덤 시그널까지 동일한 문법으로 묶었어요.", grad: "linear-gradient(135deg,#3a1e4a,#5c2870 60%,#9a4dbd)" },
      { h: "결과", p: "운영팀이 정기 리포트를 만드는 시간은 주당 18시간에서 4시간으로 줄었고, A&R 회의의 절반 이상이 '질문 → 답변' 패턴으로 바뀌었어요. 데이터가 의사결정 흐름에 자연스럽게 끼어드는 환경이 만들어졌습니다.", grad: "linear-gradient(135deg,#1f3a4a,#2d6b8a 60%,#5dd3ff)" },
    ],
    points: ["AI가 자연어 질문을 받아 SQL과 시각화를 동시에 생성", "아티스트·콘텐츠·팬 데이터가 하나의 카드 시스템으로 통일", "리포트 작성 시간 18시간 → 4시간"],
  },
  {
    id: "hyundai", client: "HYUNDAI", tag: "AI Command", category: "AI", year: "2026", date: "2026.02.04", featured: true,
    bg: "linear-gradient(135deg,#1b2340,#00B7FF)",
    title: "명령으로 움직이는 사내 AI 컨트롤 타워",
    lead: "각 부서가 흩어져 운영하던 AI 워크플로를 하나의 명령 환경으로 묶었어요. 보안·권한·감사 흐름은 그대로 유지하면서요.",
    desc: "각 부서가 흩어져 운영하던 AI 워크플로를 하나의 명령 환경으로 묶었어요. 보안·권한·감사 흐름은 그대로 유지하면서요.",
    sections: [
      { h: "문제", p: "부서마다 ChatGPT, 자체 RAG, 외주 모델을 따로 굴리고 있었고, 누가 무엇을 어떻게 쓰는지 IT 본부도 정확히 파악하기 어려웠어요. 보안 리뷰는 매번 새로 시작되는 상황.", grad: "linear-gradient(135deg,#0f1830,#1b2340 60%,#2a3a6a)" },
      { h: "접근", p: "부서가 직접 만든 워크플로를 '명령' 단위로 등록하고, 권한·로그·비용을 한 곳에서 관리하는 컨트롤 타워를 설계했어요. 사용자에게는 단순한 명령창 하나만 보이도록.", grad: "linear-gradient(135deg,#1b2340,#1a4d6e 60%,#00B7FF)" },
      { h: "결과", p: "전사에 흩어져 있던 47개 AI 사용 케이스가 하나의 카탈로그로 정리됐고, 보안 리뷰 사이클이 평균 3주 → 4일로 단축됐어요.", grad: "linear-gradient(135deg,#0f3a4a,#1e6e8a 60%,#5dd3ff)" },
    ],
    points: ["47개 AI 케이스 통합 카탈로그", "보안 리뷰 3주 → 4일", "권한·로그·비용 단일 대시보드"],
  },
  {
    id: "samsung", client: "SAMSUNG", tag: "HR Copilot", category: "AX", year: "2025", date: "2025.11.20", featured: true,
    bg: "linear-gradient(135deg,#3a2815,#b5651f)",
    title: "채용·평가의 반복 업무를 옆에서 도와주는 코파일럿",
    lead: "수만 명 규모의 조직이 매년 반복하는 채용·평가 워크플로를, 사람의 판단을 더 잘 쓰도록 재설계했어요.",
    desc: "수만 명 규모의 조직이 매년 반복하는 채용·평가 워크플로를, 사람의 판단을 더 잘 쓰도록 재설계했어요.",
    sections: [
      { h: "문제", p: "평가 시즌마다 매니저가 자료를 다시 찾고, 채용 담당자가 같은 질문을 반복해서 받는 구조. 핵심 의사결정에 쓸 시간이 정작 부족했어요.", grad: "linear-gradient(135deg,#2a1f15,#5c4225 60%,#8a6535)" },
      { h: "접근", p: "AI 코파일럿이 자료를 모아 정리하고, 사람은 의사결정에 집중하는 흐름을 설계했어요. 코파일럿은 의견을 내지 않고 '무엇을 봐야 하는지'만 제안합니다.", grad: "linear-gradient(135deg,#3a2815,#7a4d20 60%,#b5651f)" },
      { h: "결과", p: "매니저당 평가 시즌 업무 시간 평균 40% 감소, 채용 담당자 1차 검토 시간 60% 단축. 사람은 더 어려운 판단에만 시간을 씁니다.", grad: "linear-gradient(135deg,#1f2a14,#4d6e35 60%,#8aab5d)" },
    ],
    points: ["평가 시즌 매니저 업무 -40%", "채용 1차 검토 -60%", "사람의 판단을 대체하지 않고 보조"],
  },
  {
    id: "kakao", client: "KAKAO", tag: "Ops Agent", category: "Ops", year: "2025", date: "2025.10.12", featured: true,
    bg: "linear-gradient(135deg,#0f3a2d,#1e8c66)",
    title: "운영팀이 직접 키우는 에이전트 워크플로",
    lead: "외주 개발자에게 매번 요청하지 않고, 운영팀이 자기 손으로 에이전트를 만들고 고치는 환경을 만들었어요.",
    desc: "외주 개발자에게 매번 요청하지 않고, 운영팀이 자기 손으로 에이전트를 만들고 고치는 환경을 만들었어요.",
    sections: [
      { h: "문제", p: "운영 시나리오가 매일 바뀌는데, 자동화 요청은 매번 IT 큐에 쌓였어요. '이 정도는 우리가 직접 할 수 있어야 한다'는 갈증.", grad: "linear-gradient(135deg,#0a2a20,#1e5c44 60%,#2d8c66)" },
      { h: "접근", p: "코드 대신 '블록 + 자연어 설명'으로 에이전트를 정의하는 빌더를 만들었어요. 운영팀이 만든 에이전트는 자동으로 검증·로그·롤백 기능을 갖습니다.", grad: "linear-gradient(135deg,#0f3a2d,#1e8c66 60%,#5dd3a4)" },
      { h: "결과", p: "운영팀이 자체 제작한 에이전트가 6개월 만에 120개를 넘었고, IT 개발 큐의 73%가 사라졌어요. 진짜 어려운 일에 개발 리소스를 쓸 수 있게 됐죠.", grad: "linear-gradient(135deg,#1f3a14,#4d8c25 60%,#a5d35d)" },
    ],
    points: ["6개월간 120개 에이전트 자체 제작", "IT 개발 큐 -73%", "자동 검증·로그·롤백 포함"],
  },
  {
    id: "skt", client: "SK Telecom", tag: "CS Router", category: "AI", year: "2025", date: "2025.09.02", featured: true,
    bg: "linear-gradient(135deg,#2a1f4d,#6845c2)",
    title: "고객 문의를 한 번에 알맞은 자리로",
    lead: "LLM이 고객의 문의 의도를 읽고, 가장 잘 해결할 수 있는 채널·담당자로 자동 라우팅합니다.",
    desc: "LLM이 고객의 문의 의도를 읽고, 가장 잘 해결할 수 있는 채널·담당자로 자동 라우팅합니다.",
    sections: [
      { h: "문제", p: "채널은 여러 곳, 답변 품질은 담당자별로 들쭉날쭉. 고객은 같은 이야기를 반복해야 했고, 상담사는 자기 분야가 아닌 문의에 시간을 썼어요.", grad: "linear-gradient(135deg,#1a1430,#3a2a6e 60%,#5d45a4)" },
      { h: "접근", p: "의도 분류 모델을 사내 데이터로 파인튜닝하고, 라우팅 규칙은 운영팀이 직접 수정하도록 분리했어요. 모델이 틀린 라우팅은 곧바로 학습 데이터로 돌아옵니다.", grad: "linear-gradient(135deg,#2a1f4d,#5230a4 60%,#8a5dff)" },
      { h: "결과", p: "1차 응답 정확도 89%, 평균 응대 시간 -34%. 상담사 만족도도 함께 올라갔어요. 라우팅 자체가 한 번에 끝나니까요.", grad: "linear-gradient(135deg,#1f2a4d,#3045a4 60%,#5d8aff)" },
    ],
    points: ["1차 응답 정확도 89%", "평균 응대 시간 -34%", "오답이 즉시 학습 데이터로 환류"],
  },
  {
    id: "millie", client: "MILLIE", tag: "Content AI", category: "AI", year: "2025", date: "2025.08.18", featured: true,
    bg: "linear-gradient(135deg,#2a2a2a,#555)",
    title: "읽는 사람의 맥락을 기억하는 추천 엔진",
    lead: "단순한 '비슷한 책'이 아니라, 지금 이 사람이 어떤 흐름 안에 있는지를 보고 콘텐츠를 큐레이션해요.",
    desc: "단순한 '비슷한 책'이 아니라, 지금 이 사람이 어떤 흐름 안에 있는지를 보고 콘텐츠를 큐레이션해요.",
    sections: [
      { h: "문제", p: "베스트셀러 위주의 추천은 모든 독자에게 비슷한 화면을 보여줬어요. 진짜 추천이 일어나는 건 따로 있는 영역.", grad: "linear-gradient(135deg,#1a1a1a,#3a3a3a 60%,#555)" },
      { h: "접근", p: "독서 시퀀스·체류 시간·완독 패턴을 함께 보는 컨텍스트 모델을 만들었고, 큐레이션 카드 안에서 '왜 추천했는지'를 짧은 한 줄로 항상 보여줍니다.", grad: "linear-gradient(135deg,#2a2a2a,#4d4d4d 60%,#777)" },
      { h: "결과", p: "추천 카드 클릭률 +52%, 완독률 +18%. 추천 이유를 보여주는 한 줄이 클릭률을 가장 크게 끌어올렸어요.", grad: "linear-gradient(135deg,#3a3a2a,#6e6e3a 60%,#a4a45d)" },
    ],
    points: ["추천 클릭률 +52%", "완독률 +18%", "'왜 추천했는지' 한 줄을 모든 카드에 노출"],
  },
  {
    id: "lgcns", client: "LG CNS", tag: "Doc Search", category: "AX", year: "2025", date: "2025.07.05",
    bg: "linear-gradient(135deg,#171f2c,#3b6ea5)",
    title: "내부 문서가 답을 해주는 검색 환경",
    lead: "수만 건의 사내 문서를 '검색'이 아닌 '질문'으로 다루도록 RAG 파이프라인을 다시 설계했어요.",
    desc: "수만 건의 사내 문서를 '검색'이 아닌 '질문'으로 다루도록 RAG 파이프라인을 다시 설계했어요.",
    sections: [
      { h: "문제", p: "검색은 결국 키워드 싸움이었고, 문서가 많을수록 더 어려워졌어요. 신입 구성원이 답을 찾는 데 평균 47분.", grad: "linear-gradient(135deg,#0f1620,#1e2f4a 60%,#2d4a78)" },
      { h: "접근", p: "문서 인덱싱·청크 전략·답변 검증을 분리해 각각 교체할 수 있는 RAG 구조로 만들었어요. 답변에는 항상 근거 문서 링크가 따라붙습니다.", grad: "linear-gradient(135deg,#171f2c,#2d4a78 60%,#3b6ea5)" },
      { h: "결과", p: "평균 답 도달 시간 47분 → 6분, 만족도 4.6/5. 가장 큰 변화는 신입 온보딩 기간이었어요.", grad: "linear-gradient(135deg,#1f2c1f,#3b783b 60%,#6ea56e)" },
    ],
    points: ["답 도달 시간 47분 → 6분", "만족도 4.6 / 5", "답변에 항상 근거 문서 링크"],
  },
  {
    id: "coupang", client: "COUPANG", tag: "Catalog AI", category: "Ops", year: "2025", date: "2025.06.14",
    bg: "linear-gradient(135deg,#2a1614,#c0392b)",
    title: "상품 카탈로그를 스스로 정리하는 에이전트",
    lead: "수십만 개 상품의 속성을 사람이 매번 정리하는 건 가능하지 않아요. 에이전트가 일관성을 지킵니다.",
    desc: "수십만 개 상품의 속성을 사람이 매번 정리하는 건 가능하지 않아요. 에이전트가 일관성을 지킵니다.",
    sections: [
      { h: "문제", p: "카테고리별 속성 표기 규칙이 매번 바뀌고, 셀러마다 입력 품질이 달랐어요. 결과적으로 검색·노출에서 손해를 보는 구조.", grad: "linear-gradient(135deg,#1a0e0c,#3a1f1c 60%,#6e2f29)" },
      { h: "접근", p: "카탈로그 표준에 맞춰 자동 정규화하는 에이전트를 만들었어요. 자신이 없는 항목은 사람의 검토 큐로 보내고, 결정은 학습 데이터로 돌아옵니다.", grad: "linear-gradient(135deg,#2a1614,#7a2820 60%,#c0392b)" },
      { h: "결과", p: "속성 정확도 91% → 99%, 사람 검토 항목 -78%. 카탈로그 품질이 올라가니 검색·노출 성과도 함께 올라갔어요.", grad: "linear-gradient(135deg,#2a1f14,#7a5c20 60%,#c0992b)" },
    ],
    points: ["속성 정확도 91% → 99%", "사람 검토 항목 -78%", "불확실한 항목만 사람에게"],
  },
  {
    id: "woori", client: "WOORI", tag: "Risk Lens", category: "AI", year: "2024", date: "2024.11.08",
    bg: "linear-gradient(135deg,#0f1f2a,#2d6b8a)",
    title: "금융 리스크를 한눈에 읽는 렌즈",
    lead: "분석가 한 명이 보던 화면을 팀 단위로 확장한 리스크 인사이트 대시보드.",
    desc: "분석가 한 명이 보던 화면을 팀 단위로 확장한 리스크 인사이트 대시보드.",
    sections: [
      { h: "문제", p: "리스크 분석 결과가 PDF로 공유되고, 그 PDF가 회의실에서 다시 토론됐어요. 데이터는 항상 어제의 데이터였죠.", grad: "linear-gradient(135deg,#0a141c,#1e3a4d 60%,#2d5878)" },
      { h: "접근", p: "실시간 데이터 위에 분석가의 시나리오를 얹어 같이 볼 수 있는 대시보드를 만들었어요. 시나리오 비교는 클릭 한 번으로.", grad: "linear-gradient(135deg,#0f1f2a,#2d6b8a 60%,#5d9dc2)" },
      { h: "결과", p: "리스크 리뷰 회의가 평균 90분 → 35분으로 줄었고, 시나리오 비교 횟수는 7배 늘어났어요.", grad: "linear-gradient(135deg,#1f2a0f,#5c8a2d 60%,#9dc25d)" },
    ],
    points: ["리뷰 회의 90분 → 35분", "시나리오 비교 7배", "어제 데이터가 아닌 지금 데이터"],
  },
  {
    id: "naver", client: "NAVER", tag: "Editor Ops", category: "Ops", year: "2024", date: "2024.09.22",
    bg: "linear-gradient(135deg,#0a2818,#1e6b4d)",
    title: "편집자의 손이 가는 일을 줄이는 워크플로",
    lead: "콘텐츠 편집자가 본업에 집중하도록, 반복 업무를 워크플로 단위로 묶었어요.",
    desc: "콘텐츠 편집자가 본업에 집중하도록, 반복 업무를 워크플로 단위로 묶었어요.",
    sections: [
      { h: "문제", p: "태깅·요약·이미지 매칭 같은 보조 작업이 편집 시간보다 길어지고 있었어요.", grad: "linear-gradient(135deg,#061a10,#0f3a28 60%,#1e5c44)" },
      { h: "접근", p: "편집자 한 명의 하루를 따라가며 가장 잦은 보조 업무 12종을 추렸고, 각 업무를 작은 자동 워크플로로 묶었어요. 편집자는 결과를 검토만 합니다.", grad: "linear-gradient(135deg,#0a2818,#1e6b4d 60%,#5da490)" },
      { h: "결과", p: "편집자 1인당 일 평균 1.8시간을 본업으로 되돌렸어요. 콘텐츠 발행량도 동시에 늘었습니다.", grad: "linear-gradient(135deg,#1f2a0a,#5c6e1e 60%,#a4c25d)" },
    ],
    points: ["편집자 보조 업무 12종 자동화", "1인당 +1.8시간 / 일", "검토만으로 워크플로 완결"],
  },
  {
    id: "cjenm", client: "CJ ENM", tag: "Brief AX", category: "AX", year: "2024", date: "2024.07.30",
    bg: "linear-gradient(135deg,#2a1830,#7841a0)",
    title: "기획 브리프를 같이 쓰는 도구",
    lead: "AI가 기획자의 메모를 받아 브리프 초안을 작성하고, 부족한 부분을 같이 채워나갑니다.",
    desc: "AI가 기획자의 메모를 받아 브리프 초안을 작성하고, 부족한 부분을 같이 채워나갑니다.",
    sections: [
      { h: "문제", p: "브리프 작성에 매번 평균 3일. 정작 내용을 다듬는 시간은 그중 한 시간 남짓이었어요.", grad: "linear-gradient(135deg,#1a0e20,#3a2050 60%,#5c2870)" },
      { h: "접근", p: "기획자가 어떤 정보를 '이미 알고 있는지'부터 묻고, 그 위에 초안을 만드는 흐름으로 바꿨어요. AI는 부족한 항목만 짚어줍니다.", grad: "linear-gradient(135deg,#2a1830,#5c2870 60%,#9a4dbd)" },
      { h: "결과", p: "브리프 작성 시간 평균 3일 → 4시간, 1차 통과율 +41%.", grad: "linear-gradient(135deg,#2a1f0a,#7a5c1e 60%,#c2992b)" },
    ],
    points: ["작성 시간 3일 → 4시간", "1차 통과율 +41%", "AI가 의견 대신 부족한 항목을 짚음"],
  },
  {
    id: "lotte", client: "LOTTE", tag: "Service Map", category: "AX", year: "2024", date: "2024.05.16",
    bg: "linear-gradient(135deg,#2a1f14,#8a6535)",
    title: "고객 여정 맵을 자동으로 그리다",
    lead: "운영 데이터를 읽어 고객 여정을 자동으로 시각화하고, 끊긴 지점을 짚어주는 진단 도구.",
    desc: "운영 데이터를 읽어 고객 여정을 자동으로 시각화하고, 끊긴 지점을 짚어주는 진단 도구.",
    sections: [
      { h: "문제", p: "고객 여정 맵은 워크숍에서 한 번 그리고 끝나는 경우가 많았어요. 현실은 매주 바뀌는데요.", grad: "linear-gradient(135deg,#1a140a,#3a2a15 60%,#5c4225)" },
      { h: "접근", p: "실제 운영 데이터를 읽어 여정을 자동 생성하고, 끊긴 지점은 진단 카드로 정리했어요. 워크숍은 '어떻게 고칠지'에 집중할 수 있게.", grad: "linear-gradient(135deg,#2a1f14,#5c4225 60%,#8a6535)" },
      { h: "결과", p: "개선 안건 도출 사이클이 분기 → 격주로 짧아졌고, 워크숍 만족도도 함께 올라갔어요.", grad: "linear-gradient(135deg,#1f2a14,#4d6e35 60%,#8aab5d)" },
    ],
    points: ["여정 맵 자동 생성", "개선 사이클 분기 → 격주", "워크숍은 '어떻게 고칠지'에 집중"],
  },
];

const DEFAULT_INSIGHTS: InsightItem[] = [
  { mark: "TOK", markColor: "#00B7FF", thumb: "linear-gradient(135deg,#1a1d24 0%,#0a0a0a 100%)", title: "AX 전환, 어디서부터\n시작해야 할까?", tag: "기술 블로그", date: "2026-04-22", excerpt: "AI 도입의 첫 발걸음을 위한 진단 프레임워크 — 일하는 방식부터 다시 봅니다.", featured: true },
  { mark: "AI", markColor: "#0a0a0a", thumb: "linear-gradient(135deg,#fbe5cf,#f5d0a3)", title: "Agentic AI의 시대,\nAWS re:Invent 2025 현장", tag: "기술 블로그", date: "2026-04-10", excerpt: "에이전트가 함께 일하는 시대의 인프라가 어떻게 바뀌고 있는지.", featured: true },
  { mark: "FE", markColor: "#0a0a0a", thumb: "linear-gradient(135deg,#c8e5f5,#9ec5dd)", title: "리액트의 현재와 미래,\nReact Summit US 2025", tag: "링크드인", date: "2026-03-28", excerpt: "React 19, RSC, Suspense — 프론트엔드가 다음으로 가는 곳.", featured: true },
  { mark: "PJT", markColor: "#ffffff", thumb: "linear-gradient(135deg,#3a2818,#7c5235)", title: "'왜?'라는 질문으로\n쌓아 올린 빵나누기", tag: "링크드인", date: "2026-03-12", excerpt: "한 줄짜리 문제 정의가 어떻게 한 해 동안의 제품으로 자랐는지.", featured: true },
  { mark: "UX", markColor: "#0a0a0a", thumb: "linear-gradient(135deg,#e8e3d8,#d4ccbe)", title: "AI 시대의 UX,\n사람을 위한 인터페이스", tag: "기술 블로그", date: "2026-02-28", excerpt: "답을 주는 AI보다 함께 생각하는 AI를 디자인하기.", featured: true },
  { mark: "ORG", markColor: "#0a0a0a", thumb: "linear-gradient(135deg,#d8e8e0,#b8d4c8)", title: "AI랑 같이 일하는\n조직 운영 노하우", tag: "링크드인", date: "2026-02-12", excerpt: "우리가 먼저 써보며 정리한 12개월치 운영 메모.", featured: true },
  { mark: "DEV", markColor: "#ffffff", thumb: "linear-gradient(135deg,#1a2030,#2a3a5c)", title: "Cursor와 함께한\n프론트엔드 6개월", tag: "기술 블로그", date: "2026-01-28", excerpt: "AI 페어 프로그래밍이 일상이 된 팀의 코드 리뷰는 어떻게 달라지나.", featured: true },
  { mark: "BIZ", markColor: "#0a0a0a", thumb: "linear-gradient(135deg,#f0e5e8,#dcc6cc)", title: "AX 컨설팅이\n바꾼 7개 조직", tag: "링크드인", date: "2026-01-12", excerpt: "고객사 7곳에서 발견한 공통의 패턴과 함정.", featured: true },
  { mark: "DSGN", markColor: "#0a0a0a", thumb: "linear-gradient(135deg,#e0d8f0,#c4b8e0)", title: "디자인 시스템과\nAI 코드 생성의 만남", tag: "기술 블로그", date: "2025-12-22", excerpt: "토큰과 컴포넌트가 잘 정리되면 AI가 만들어주는 코드 품질이 달라져요." },
  { mark: "DATA", markColor: "#0a0a0a", thumb: "linear-gradient(135deg,#dde8d8,#bcd4b0)", title: "우리 데이터로\n파인튜닝, 정말 필요할까?", tag: "기술 블로그", date: "2025-12-08", excerpt: "파인튜닝 전에 점검해야 할 5가지 — 결국 RAG로 충분할 때가 많아요." },
  { mark: "CASE", markColor: "#ffffff", thumb: "linear-gradient(135deg,#2a2030,#4a3a5c)", title: "BLUEGARAGE JYP360,\n런칭 그 이후", tag: "링크드인", date: "2025-11-24", excerpt: "라이브 운영 4개월 후, 우리가 다시 배운 것들." },
];

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
    a: "기본 원칙은 '나가지 않는다'예요. 자체 호스팅 모델, 사내 인프라 연동, 권한 분리까지 보안 요구사항에 맞춰 설계해요. 외부 API를 써야 하는 경우엔 데이터 마스킹·로그 정책을 함께 정의해요.",
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

export const getWork = (): WorkItem[] => {
  if (typeof window === "undefined") return DEFAULT_WORK;
  try {
    const raw = localStorage.getItem("ttk_work");
    return raw ? (JSON.parse(raw) as WorkItem[]) : DEFAULT_WORK;
  } catch {
    return DEFAULT_WORK;
  }
};

export const saveWork = (data: WorkItem[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("ttk_work", JSON.stringify(data));
};

export const getInsights = (): InsightItem[] => {
  if (typeof window === "undefined") return DEFAULT_INSIGHTS;
  try {
    const raw = localStorage.getItem("ttk_insights");
    const items: InsightItem[] = raw ? (JSON.parse(raw) as InsightItem[]) : DEFAULT_INSIGHTS;
    return items.map((it, i) => {
      const img = localStorage.getItem(`ttk_insight_img_${i}`);
      return img ? { ...it, thumbImg: img } : it;
    });
  } catch {
    return DEFAULT_INSIGHTS;
  }
};

export const saveInsights = (data: InsightItem[]): void => {
  if (typeof window === "undefined") return;
  // 이미지는 별도 키에 저장해 메인 JSON 크기를 줄임
  const withoutImgs = data.map((it, i) => {
    if (it.thumbImg) {
      localStorage.setItem(`ttk_insight_img_${i}`, it.thumbImg);
    } else {
      localStorage.removeItem(`ttk_insight_img_${i}`);
    }
    const { thumbImg: _, ...rest } = it;
    return rest as InsightItem;
  });
  // 기존 이미지 키 중 더 이상 없는 인덱스 정리
  for (let i = data.length; i < data.length + 20; i++) {
    localStorage.removeItem(`ttk_insight_img_${i}`);
  }
  localStorage.setItem("ttk_insights", JSON.stringify(withoutImgs));
};

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
