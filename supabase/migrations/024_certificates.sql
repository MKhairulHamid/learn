-- Migration 024: Certificate system
-- Tables: certificate_templates, cohort_student_reviews, certificates

-- ── Certificate templates ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificate_templates (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  html_template text        NOT NULL DEFAULT '',
  is_default    boolean     NOT NULL DEFAULT false,
  created_by    uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_can_read_templates"
  ON certificate_templates FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "pm_can_insert_templates"
  ON certificate_templates FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'program_manager'))
  );

CREATE POLICY "pm_can_update_templates"
  ON certificate_templates FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'program_manager'))
  );

CREATE POLICY "pm_can_delete_templates"
  ON certificate_templates FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'program_manager'))
  );

-- ── Student reviews per cohort (PM pass/fail decisions) ──────────────
CREATE TABLE IF NOT EXISTS cohort_student_reviews (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id   uuid        NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewed_by uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  status      text        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'pass', 'fail')),
  notes       text,
  reviewed_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cohort_id, user_id)
);

ALTER TABLE cohort_student_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pm_can_manage_reviews"
  ON cohort_student_reviews
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'program_manager'))
  );

CREATE POLICY "student_can_read_own_review"
  ON cohort_student_reviews FOR SELECT
  USING (user_id = auth.uid());

-- ── Issued certificates ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cohort_id      uuid        NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  template_id    uuid        REFERENCES certificate_templates(id) ON DELETE SET NULL,
  course_title   text        NOT NULL,
  recipient_name text        NOT NULL,
  score          numeric,
  issued_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, cohort_id)
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Public verification: anyone (including anonymous) can read any certificate
CREATE POLICY "public_can_read_certificates"
  ON certificates FOR SELECT
  USING (true);

CREATE POLICY "pm_can_insert_certificates"
  ON certificates FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'program_manager'))
  );

CREATE POLICY "pm_can_update_certificates"
  ON certificates FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'program_manager'))
  );

CREATE POLICY "pm_can_delete_certificates"
  ON certificates FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'program_manager'))
  );

-- ── Default certificate template ─────────────────────────────────────
INSERT INTO certificate_templates (name, html_template, is_default)
VALUES (
  'Default',
  '<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, ''Times New Roman'', serif; background: #fff; }
  .cert {
    width: 842px; height: 595px; padding: 48px 56px;
    position: relative; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
    background: #fff; overflow: hidden;
  }
  .border-outer {
    position: absolute; inset: 12px;
    border: 2.5px solid #1e3a5f;
  }
  .border-inner {
    position: absolute; inset: 18px;
    border: 1px solid #c8a845;
  }
  .corner {
    position: absolute; width: 24px; height: 24px;
    border-color: #c8a845; border-style: solid;
  }
  .corner-tl { top: 22px; left: 22px; border-width: 2px 0 0 2px; }
  .corner-tr { top: 22px; right: 22px; border-width: 2px 2px 0 0; }
  .corner-bl { bottom: 22px; left: 22px; border-width: 0 0 2px 2px; }
  .corner-br { bottom: 22px; right: 22px; border-width: 0 2px 2px 0; }
  .platform {
    font-size: 11px; letter-spacing: 4px; color: #1e3a5f;
    text-transform: uppercase; margin-bottom: 22px; font-family: Arial, sans-serif;
  }
  .cert-title { font-size: 34px; color: #1e3a5f; margin-bottom: 6px; font-weight: normal; }
  .cert-subtitle {
    font-size: 10px; letter-spacing: 3px; color: #888;
    text-transform: uppercase; margin-bottom: 24px; font-family: Arial, sans-serif;
  }
  .divider { width: 60px; height: 1px; background: #c8a845; margin: 0 auto 24px; }
  .recipient { font-size: 40px; color: #c8a845; font-style: italic; margin-bottom: 18px; }
  .body-text {
    font-size: 12px; color: #444; line-height: 1.7;
    max-width: 480px; margin-bottom: 12px; font-family: Arial, sans-serif;
  }
  .score-badge {
    display: inline-block; font-size: 11px; color: #1e3a5f;
    border: 1px solid #1e3a5f; padding: 3px 12px; border-radius: 20px;
    margin-bottom: 28px; font-family: Arial, sans-serif; letter-spacing: 1px;
  }
  .footer {
    position: absolute; bottom: 36px; left: 56px; right: 56px;
    display: flex; justify-content: space-between; align-items: flex-end;
    font-family: Arial, sans-serif;
  }
  .footer-left { text-align: left; }
  .footer-label { font-size: 8px; color: #aaa; letter-spacing: 1px; text-transform: uppercase; }
  .footer-value { font-size: 10px; color: #555; margin-top: 2px; }
  .cert-id { font-size: 8px; color: #bbb; margin-top: 4px; font-family: monospace; }
  .verify-url { font-size: 8px; color: #bbb; margin-top: 3px; }
</style>
</head>
<body>
<div class="cert">
  <div class="border-outer"></div>
  <div class="border-inner"></div>
  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>
  <div class="corner corner-br"></div>

  <div class="platform">Talentiv Learning Platform</div>
  <div class="cert-title">Certificate of Completion</div>
  <div class="cert-subtitle">This is to certify that</div>
  <div class="divider"></div>
  <div class="recipient">{{recipient_name}}</div>
  <div class="body-text">
    has successfully completed the <strong>{{course_title}}</strong> program
    and demonstrated the required knowledge and skills.
  </div>
  <div class="score-badge">Final Score: {{score}}%</div>

  <div class="footer">
    <div class="footer-left">
      <div class="footer-label">Issue Date</div>
      <div class="footer-value">{{issued_at}}</div>
    </div>
    <div style="text-align: right;">
      <div class="cert-id">ID: {{certificate_id}}</div>
      <div class="verify-url">Verify at: {{verify_url}}</div>
    </div>
  </div>
</div>
</body>
</html>',
  true
);
