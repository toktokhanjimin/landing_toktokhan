-- ============================================================
--  TOKTOKHAN.DEV — Supabase Schema
--  Supabase 대시보드 > SQL Editor 에서 순서대로 실행하세요.
-- ============================================================

-- ── 1. work 테이블 ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS work (
  id                 TEXT        PRIMARY KEY,
  client             TEXT        NOT NULL DEFAULT '',
  tag                TEXT        NOT NULL DEFAULT '',
  category           TEXT        NOT NULL DEFAULT 'AI',
  year               TEXT        NOT NULL DEFAULT '',
  date               TEXT        NOT NULL DEFAULT '',
  bg                 TEXT        NOT NULL DEFAULT '',
  description        TEXT        NOT NULL DEFAULT '',
  title              TEXT        NOT NULL DEFAULT '',
  lead               TEXT        NOT NULL DEFAULT '',
  thumb_img          TEXT        NOT NULL DEFAULT '',
  sections           JSONB       NOT NULL DEFAULT '[]',
  points             JSONB       NOT NULL DEFAULT '[]',
  featured           BOOLEAN     NOT NULL DEFAULT false,
  related_insight_ids BIGINT[]   NOT NULL DEFAULT '{}',
  sort_order         INTEGER     NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. insights 테이블 ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS insights (
  id         BIGSERIAL   PRIMARY KEY,
  mark       TEXT        NOT NULL DEFAULT '',
  mark_color TEXT        NOT NULL DEFAULT '#0a0a0a',
  thumb      TEXT        NOT NULL DEFAULT '',
  thumb_img  TEXT        NOT NULL DEFAULT '',
  title      TEXT        NOT NULL DEFAULT '',
  tag        TEXT        NOT NULL DEFAULT '',
  category   TEXT        NOT NULL DEFAULT 'log',
  date       TEXT        NOT NULL DEFAULT '',
  excerpt    TEXT        NOT NULL DEFAULT '',
  url        TEXT        NOT NULL DEFAULT '',
  featured   BOOLEAN     NOT NULL DEFAULT false,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. RLS (Row Level Security) ─────────────────────────────
ALTER TABLE work     ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 허용
CREATE POLICY "public_read_work"     ON work     FOR SELECT USING (true);
CREATE POLICY "public_read_insights" ON insights FOR SELECT USING (true);

-- 쓰기는 service_role 만 (API 라우트에서만 사용)
-- INSERT / UPDATE / DELETE 는 RLS 정책 없음 → service_role bypass 로만 허용

-- ── 4. Storage 버킷 ─────────────────────────────────────────
-- Supabase 대시보드 > Storage 에서 직접 만들거나 아래 실행:
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-images',    'work-images',    true),
       ('insight-images', 'insight-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage public read 정책
CREATE POLICY "public_read_work_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'work-images');

CREATE POLICY "public_read_insight_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'insight-images');
