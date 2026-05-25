-- ============================================================
-- 018: Seed HR Fast Track program — 3 phases, 25 sessions
-- Also fixes phases.phase_number unique constraint to be
-- per-program (program_id, phase_number) instead of global.
-- ============================================================

-- Fix the unique constraint so phase_number 1 can exist in
-- multiple programs.
ALTER TABLE public.phases
  DROP CONSTRAINT IF EXISTS phases_phase_number_key;

ALTER TABLE public.phases
  ADD CONSTRAINT phases_program_phase_unique UNIQUE (program_id, phase_number);

DO $$
DECLARE
  hr_id       uuid;
  phase1_id   uuid;
  phase2_id   uuid;
  phase3_id   uuid;
BEGIN

-- ── 1. HR Program ────────────────────────────────────────
INSERT INTO public.programs
  (slug, name_en, name_id, description_en, description_id, icon, color, is_published, order_num)
VALUES
  ('hr-fast-track',
   'HR Fast Track Bootcamp',
   'Bootcamp HR Fast Track',
   'A 3-month intensive program covering HR fundamentals, BNSP certification, and career preparation — delivered live online by Talentiv HR School.',
   'Program intensif 3 bulan mencakup dasar-dasar HR, sertifikasi BNSP, dan persiapan karir — disampaikan secara live online oleh Talentiv HR School.',
   '👥', 'from-rose-500 to-pink-600', true, 2)
RETURNING id INTO hr_id;

-- ── 2. Phases (Modules) ──────────────────────────────────

INSERT INTO public.phases
  (program_id, phase_number, name_en, name_id, description_en, description_id, icon, color, order_num)
VALUES
  (hr_id, 1,
   'Bootcamp Fast Track',
   'Bootcamp Fast Track',
   'Core HR competencies: job descriptions, recruitment, labor law, payroll management, HRIS, and L&D — with a final mentored project.',
   'Kompetensi HR inti: uraian jabatan, rekrutmen, hukum ketenagakerjaan, pengelolaan payroll, HRIS, dan L&D — dengan proyek akhir yang dibimbing.',
   '🚀', 'from-blue-500 to-cyan-500', 1)
RETURNING id INTO phase1_id;

INSERT INTO public.phases
  (program_id, phase_number, name_en, name_id, description_en, description_id, icon, color, order_num)
VALUES
  (hr_id, 2,
   'Certification (BNSP)',
   'Sertifikasi (BNSP)',
   'Advanced HR administration, performance management, payroll & social security, hands-on HRIS practice, and BNSP competency exam.',
   'Administrasi HR lanjutan, manajemen kinerja, payroll & jaminan sosial, praktik HRIS langsung, dan uji kompetensi BNSP.',
   '🏆', 'from-violet-500 to-purple-600', 2)
RETURNING id INTO phase2_id;

INSERT INTO public.phases
  (program_id, phase_number, name_en, name_id, description_en, description_id, icon, color, order_num)
VALUES
  (hr_id, 3,
   'Career Preparation',
   'Persiapan Karir',
   'CV & portfolio building, personal branding, job hunting strategy, interview coaching — with expert mentoring sessions.',
   'Pembuatan CV & portofolio, personal branding, strategi job hunting, pelatihan interview — dengan sesi mentoring oleh praktisi.',
   '💼', 'from-emerald-500 to-teal-600', 3)
RETURNING id INTO phase3_id;

-- ── 3. Sessions — Module 1: Bootcamp Fast Track ──────────

INSERT INTO public.sessions
  (phase_id, session_number, title_id, title_en, unit_skkni, learning_output_id, learning_output_en, order_num, estimated_duration_minutes, content_id, content_en)
VALUES

(phase1_id, 'H01',
 'Menyusun Uraian Jabatan',
 'Writing Job Descriptions',
 'M.701001.001.01',
 'Mampu menyusun uraian kerja sesuai standar, menyelaraskan tujuan organisasi dengan uraian jabatan, dan mempraktikkan pembuatan uraian kerja.',
 'Able to write job descriptions to standard, align organizational goals with job descriptions, and practice creating job descriptions.',
 101, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini melalui tombol "Edit lesson" di halaman ini.\n\n## Menyusun Uraian Jabatan\n\n*Materi akan segera tersedia. Mentor akan mengisi konten ini sebelum sesi dimulai.*\n\n### Topik yang akan dibahas:\n- Menyusun uraian kerja sesuai standar\n- Alignment tujuan dan uraian jabatan\n- Praktik pembuatan uraian kerja',
 E'> **Mentor note:** Please fill in this session''s material using the "Edit lesson" button on this page.\n\n## Writing Job Descriptions\n\n*Content coming soon. Mentor will fill this in before the session.*\n\n### Topics covered:\n- Writing job descriptions to standard\n- Aligning organizational goals with job descriptions\n- Hands-on job description creation practice'),

(phase1_id, 'H02',
 'KPI & OKR',
 'KPI & OKR',
 'M.701001.002.01',
 'Memahami fungsi-fungsi utama HR dalam organisasi, proses perencanaan kebutuhan tenaga kerja, dan cara membuat KPI & OKR yang efektif.',
 'Understand core HR functions in an organization, workforce planning process, and how to create effective KPIs & OKRs.',
 102, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini melalui tombol "Edit lesson".\n\n## KPI & OKR\n\n*Materi akan segera tersedia.*\n\n### Topik yang akan dibahas:\n- Fungsi-fungsi utama HR dalam organisasi\n- Proses perencanaan kebutuhan tenaga kerja\n- Cara membuat KPI & OKR',
 E'> **Mentor note:** Please fill in this session''s material using the "Edit lesson" button.\n\n## KPI & OKR\n\n*Content coming soon.*\n\n### Topics covered:\n- Core HR functions in an organization\n- Workforce planning process\n- How to create KPIs & OKRs'),

(phase1_id, 'H03',
 'Seleksi & Rekrutmen',
 'Selection & Recruitment',
 'M.701001.003.01',
 'Memahami proses rekrutmen dan seleksi, teknik wawancara dan evaluasi calon karyawan, serta verifikasi referensi dan pemeriksaan latar belakang.',
 'Understand the recruitment and selection process, interview techniques and candidate evaluation, and reference/background checks.',
 103, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini melalui tombol "Edit lesson".\n\n## Seleksi & Rekrutmen\n\n*Materi akan segera tersedia.*\n\n### Topik yang akan dibahas:\n- Proses rekrutmen dan seleksi\n- Teknik wawancara dan evaluasi calon karyawan\n- Verifikasi referensi dan pemeriksaan latar belakang',
 E'> **Mentor note:** Please fill in this session''s material.\n\n## Selection & Recruitment\n\n*Content coming soon.*\n\n### Topics covered:\n- Recruitment and selection process\n- Interview techniques and candidate evaluation\n- Reference verification and background checks'),

(phase1_id, 'H04',
 'Behavior Event Interview',
 'Behavior Event Interview',
 'M.701001.003.02',
 'Menguasai teknik wawancara BEI, menyusun behavior checklist, menggunakan pivot table lanjutan, dan mempraktikkan BEI secara langsung.',
 'Master BEI interview techniques, build behavior checklists, use advanced pivot tables, and practice BEI hands-on.',
 104, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Behavior Event Interview (BEI)\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Teknik wawancara BEI\n- Menyusun behavior checklist\n- Pivot table advance\n- Praktik BEI',
 E'> **Mentor note:** Content coming soon.\n\n## Behavior Event Interview (BEI)\n\n### Topics:\n- BEI interview techniques\n- Building behavior checklists\n- Advanced pivot tables\n- BEI practice'),

(phase1_id, 'H05',
 'Manajemen UU Tenaga Kerja',
 'Labor Law Management',
 'M.701001.005.01',
 'Memahami aturan upah dan kontrak karyawan serta masalah hukum ketenagakerjaan dari perspektif perusahaan dan karyawan.',
 'Understand wage regulations and employee contracts, and labor law issues from both company and employee perspectives.',
 105, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Manajemen UU Tenaga Kerja\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Aturan upah dan kontrak karyawan\n- Masalah yang terjadi sebagai perusahaan & sebagai karyawan',
 E'> **Mentor note:** Content coming soon.\n\n## Labor Law Management\n\n### Topics:\n- Wage regulations and employee contracts\n- Issues from company & employee perspectives'),

(phase1_id, 'H06',
 'Kelas Karir HR',
 'HR Career Class',
 'M.701001.006.01',
 'Mempersiapkan diri berkarir sebagai HR professional dan berlatih mock interview.',
 'Prepare for a career as an HR professional and practice mock interviews.',
 106, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Kelas Karir HR\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Persiapan berkarir sebagai HR\n- Latihan mockup interview',
 E'> **Mentor note:** Content coming soon.\n\n## HR Career Class\n\n### Topics:\n- Preparing for an HR career\n- Mock interview practice'),

(phase1_id, 'H07',
 'HR Information System',
 'HR Information System',
 'M.701001.007.01',
 'Mampu mengelola data HR secara digital, menggunakan Looker Studio untuk HRIS, dan membuat dashboard HR.',
 'Able to manage HR data digitally, use Looker Studio for HRIS, and build HR dashboards.',
 107, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## HR Information System\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Mengelola data HR\n- Looker Studio untuk HRIS\n- Latihan membuat Looker Studio',
 E'> **Mentor note:** Content coming soon.\n\n## HR Information System\n\n### Topics:\n- Managing HR data\n- Looker Studio for HRIS\n- Building an HRIS dashboard in Looker Studio'),

(phase1_id, 'H08',
 'Learning and Development',
 'Learning and Development',
 'M.701001.008.01',
 'Mampu merancang Training Needs Analysis (TNA) dan mengevaluasi efektivitas program Learning & Development.',
 'Able to design a Training Needs Analysis (TNA) and evaluate the effectiveness of Learning & Development programs.',
 108, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Learning and Development\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Merancang TNA\n- Mengevaluasi program L&D',
 E'> **Mentor note:** Content coming soon.\n\n## Learning and Development\n\n### Topics:\n- Designing a Training Needs Analysis (TNA)\n- Evaluating L&D program effectiveness'),

(phase1_id, 'H09',
 'Payroll Management',
 'Payroll Management',
 'M.701001.009.01',
 'Memahami aturan upah & kontrak karyawan, menghitung PPh 21, dan mengelola payroll secara keseluruhan.',
 'Understand wage regulations & employee contracts, calculate PPh 21, and manage payroll end-to-end.',
 109, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Payroll Management\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Aturan upah & kontrak karyawan\n- Perhitungan PPh 21\n- Payroll management',
 E'> **Mentor note:** Content coming soon.\n\n## Payroll Management\n\n### Topics:\n- Wage regulations & employee contracts\n- PPh 21 calculation\n- Payroll management'),

(phase1_id, 'H10',
 'Mentoring & Final Project',
 'Mentoring & Final Project',
 'M.701001.010.01',
 'Menyusun portofolio melalui studi kasus nyata: membuat job description, kontrak kerja, dan payroll secara langsung.',
 'Build a portfolio through real case studies: create job descriptions, employment contracts, and payroll hands-on.',
 110, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Mentoring & Final Project\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Menyusun portofolio melalui studi kasus\n- Membuat job description\n- Membuat kontrak kerja\n- Membuat payroll',
 E'> **Mentor note:** Content coming soon.\n\n## Mentoring & Final Project\n\n### Topics:\n- Building a portfolio through case studies\n- Creating job descriptions\n- Writing employment contracts\n- Building payroll'),

-- ── Module 2: Certification ─────────────────────────────

(phase2_id, 'H11',
 'Advanced Administrasi HR',
 'Advanced HR Administration',
 'M.701001.011.01',
 'Menyusun data HR menggunakan VLOOKUP, HLOOKUP, XLOOKUP, dan menghitung lembur sesuai UU Cipta Kerja.',
 'Organize HR data using VLOOKUP, HLOOKUP, XLOOKUP, and calculate overtime per the Job Creation Law.',
 111, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Advanced Administrasi HR\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Menyusun data HR dengan VLOOKUP, HLOOKUP, XLOOKUP\n- Case: menghitung lembur sesuai UU Cipta Kerja',
 E'> **Mentor note:** Content coming soon.\n\n## Advanced HR Administration\n\n### Topics:\n- Organizing HR data with VLOOKUP, HLOOKUP, XLOOKUP\n- Case: calculating overtime per the Job Creation Law'),

(phase2_id, 'H12',
 'Advanced Administrasi HR II',
 'Advanced HR Administration II',
 'M.701001.012.01',
 'Menguasai pivot table dan analisa data HR untuk pengambilan keputusan berbasis data.',
 'Master pivot tables and HR data analysis for data-driven decision making.',
 112, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Advanced Administrasi HR II\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Pivot table\n- Analisa data HR',
 E'> **Mentor note:** Content coming soon.\n\n## Advanced HR Administration II\n\n### Topics:\n- Pivot tables\n- HR data analysis'),

(phase2_id, 'H13',
 'Performance Management',
 'Performance Management',
 'M.701001.013.01',
 'Memahami pengantar performance management, menyusun uraian jabatan, dan mempraktikkan pembuatan uraian jabatan.',
 'Understand performance management fundamentals, write job descriptions, and practice job description creation.',
 113, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Performance Management\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Pengantar performance management\n- Uraian jabatan\n- Praktik membuat uraian jabatan',
 E'> **Mentor note:** Content coming soon.\n\n## Performance Management\n\n### Topics:\n- Introduction to performance management\n- Job descriptions\n- Hands-on job description creation'),

(phase2_id, 'H14',
 'Manajemen Kebijakan MSDM',
 'HR Policy Management',
 'M.701001.014.01',
 'Mengidentifikasi kebijakan internal perusahaan, mengelola administrasi dokumen kebijakan SDM, dan membuat SOP.',
 'Identify internal company policies, administer HR policy documents, and create Standard Operating Procedures.',
 114, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Manajemen Kebijakan MSDM\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Identifikasi kebijakan internal perusahaan\n- Administrasi dokumen kebijakan SDM\n- Latihan: membuat SOP',
 E'> **Mentor note:** Content coming soon.\n\n## HR Policy Management\n\n### Topics:\n- Identifying internal company policies\n- Administering HR policy documents\n- Exercise: creating SOPs'),

(phase2_id, 'H15',
 'End to End Process Recruitment',
 'End-to-End Recruitment Process',
 'M.701001.015.01',
 'Menyusun program rekrutmen end-to-end dan menguasai teknis job posting yang efektif.',
 'Design an end-to-end recruitment program and master effective job posting techniques.',
 115, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## End to End Process Recruitment\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Menyusun program rekrutmen\n- Teknis job posting',
 E'> **Mentor note:** Content coming soon.\n\n## End-to-End Recruitment Process\n\n### Topics:\n- Designing a recruitment program\n- Job posting techniques'),

(phase2_id, 'H16',
 'Payroll dan Jaminan Sosial',
 'Payroll & Social Security',
 'M.701001.016.01',
 'Menghitung payroll lengkap (termasuk lembur dan bonus), memahami BPJS Kesehatan & Ketenagakerjaan, serta ketentuan, rumus, dan benefit-nya.',
 'Calculate complete payroll (including overtime and bonuses), understand BPJS Health & Employment, and their regulations, formulas, and benefits.',
 116, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Payroll dan Jaminan Sosial\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Perhitungan Payroll beserta lembur dan bonus\n- BPJS kesehatan & ketenagakerjaan\n- Ketentuan, rumus, dan benefit',
 E'> **Mentor note:** Content coming soon.\n\n## Payroll & Social Security\n\n### Topics:\n- Full payroll calculation (including overtime and bonuses)\n- BPJS Health & Employment\n- Regulations, formulas, and benefits'),

(phase2_id, 'H17',
 'Praktik Penggunaan HRIS dengan Mekari Talenta',
 'Hands-on HRIS Practice with Mekari Talenta',
 'M.701001.017.01',
 'Mempraktikkan manajemen data pegawai dan manajemen absensi melalui sistem HRIS Mekari Talenta.',
 'Practice employee data management and attendance management through the Mekari Talenta HRIS system.',
 117, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Praktik HRIS dengan Mekari Talenta\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Praktik management data pegawai melalui HRIS\n- Praktik management absensi melalui HRIS',
 E'> **Mentor note:** Content coming soon.\n\n## Hands-on HRIS Practice with Mekari Talenta\n\n### Topics:\n- Employee data management through HRIS\n- Attendance management through HRIS'),

(phase2_id, 'H18',
 'Uji Kompetensi BNSP',
 'BNSP Competency Exam',
 'BNSP',
 'Mengikuti dan lulus uji kompetensi BNSP untuk mendapatkan sertifikasi profesi HR resmi.',
 'Take and pass the BNSP competency exam to obtain official HR professional certification.',
 118, 120,
 E'> **Catatan untuk Mentor:** Silakan isi materi persiapan ujian ini.\n\n## Uji Kompetensi BNSP\n\n*Informasi ujian akan segera tersedia.*\n\n### Tentang BNSP\nBadan Nasional Sertifikasi Profesi (BNSP) adalah lembaga sertifikasi profesi resmi di Indonesia.',
 E'> **Mentor note:** Please fill in exam preparation material.\n\n## BNSP Competency Exam\n\n*Exam information coming soon.*\n\n### About BNSP\nBNSP (National Professional Certification Agency) is Indonesia''s official professional certification body.'),

-- ── Module 3: Career Preparation ───────────────────────

(phase3_id, 'H19',
 'CV & Portfolio Development',
 'CV & Portfolio Development',
 'Career',
 'Mampu menyusun CV yang profesional dan membangun portofolio HR yang menarik bagi perekrut.',
 'Able to build a professional CV and create an HR portfolio that attracts recruiters.',
 119, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## CV & Portfolio Development\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- CV building\n- Portfolio building',
 E'> **Mentor note:** Content coming soon.\n\n## CV & Portfolio Development\n\n### Topics:\n- CV building\n- Portfolio building'),

(phase3_id, 'H20',
 'CV Mentoring & Review Session',
 'CV Mentoring & Review Session',
 'Career',
 'Mendapatkan feedback langsung dari praktisi HR aktif untuk review, perbaikan, dan optimasi CV.',
 'Receive direct feedback from active HR practitioners for CV review, revision, and optimization.',
 120, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## CV Mentoring & Review\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Mentoring eksklusif dalam grup kecil bersama praktisi HR aktif\n- Review, perbaikan, dan optimasi CV',
 E'> **Mentor note:** Content coming soon.\n\n## CV Mentoring & Review\n\n### Topics:\n- Exclusive small-group mentoring with active HR practitioners\n- CV review, revision, and optimization'),

(phase3_id, 'H21',
 'Job Hunting & Personal Branding Strategy',
 'Job Hunting & Personal Branding Strategy',
 'Career',
 'Menguasai strategi job hunting, membangun kehadiran online di LinkedIn, dan mengembangkan personal branding yang kuat.',
 'Master job hunting strategies, build an online presence on LinkedIn, and develop a strong personal brand.',
 121, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Job Hunting & Personal Branding\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Job hunting tips\n- Membangun kehadiran online di LinkedIn\n- Personal branding',
 E'> **Mentor note:** Content coming soon.\n\n## Job Hunting & Personal Branding Strategy\n\n### Topics:\n- Job hunting tips\n- Building online presence on LinkedIn\n- Personal branding'),

(phase3_id, 'H22',
 'Career Preparation Mentoring',
 'Career Preparation Mentoring',
 'Career',
 'Sesi mentoring eksklusif tentang job hunting, strategi mencari kerja, optimasi LinkedIn, dan personal branding bersama praktisi HR aktif.',
 'Exclusive mentoring sessions on job hunting, job search strategy, LinkedIn optimization, and personal branding with active HR practitioners.',
 122, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Career Preparation Mentoring\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Mentoring eksklusif tentang job hunting\n- Strategi mencari kerja\n- Optimasi LinkedIn\n- Personal branding',
 E'> **Mentor note:** Content coming soon.\n\n## Career Preparation Mentoring\n\n### Topics:\n- Job hunting mentoring\n- Job search strategy\n- LinkedIn optimization\n- Personal branding'),

(phase3_id, 'H23',
 'Interview Preparation & Simulation',
 'Interview Preparation & Simulation',
 'Career',
 'Mempersiapkan diri untuk interview kerja dengan tips dan teknik yang tepat, dilanjutkan dengan simulasi interview nyata.',
 'Prepare for job interviews with the right tips and techniques, followed by a real interview simulation.',
 123, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Interview Preparation & Simulation\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Interview tips and personal manner\n- Interview simulation',
 E'> **Mentor note:** Content coming soon.\n\n## Interview Preparation & Simulation\n\n### Topics:\n- Interview tips and personal manner\n- Interview simulation'),

(phase3_id, 'H24',
 'Interview Mentoring & Coaching',
 'Interview Mentoring & Coaching',
 'Career',
 'Mentoring eksklusif interview dalam grup kecil: melatih teknik menjawab, meningkatkan kepercayaan diri, mempersiapkan proses interview kerja, dan menyusun OKR.',
 'Exclusive small-group interview mentoring: practice answering techniques, build confidence, prepare for job interviews, and draft OKRs.',
 124, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Interview Mentoring & Coaching\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Mentoring eksklusif interview dalam grup kecil\n- Melatih teknik menjawab\n- Meningkatkan kepercayaan diri\n- Menyusun OKR',
 E'> **Mentor note:** Content coming soon.\n\n## Interview Mentoring & Coaching\n\n### Topics:\n- Exclusive small-group interview mentoring\n- Practicing answering techniques\n- Building confidence\n- Drafting OKRs'),

(phase3_id, 'H25',
 'Career Planning & Strategy',
 'Career Planning & Strategy',
 'Career',
 'Memahami negosiasi gaji & benefit, perencanaan karir jangka panjang, dan strategi career switching yang sukses.',
 'Understand salary & benefit negotiation, long-term career planning, and successful career switching strategies.',
 125, 90,
 E'> **Catatan untuk Mentor:** Silakan isi materi sesi ini.\n\n## Career Planning & Strategy\n\n*Materi akan segera tersedia.*\n\n### Topik:\n- Salary & benefit negotiation\n- Career planning tips\n- Career switching',
 E'> **Mentor note:** Content coming soon.\n\n## Career Planning & Strategy\n\n### Topics:\n- Salary & benefit negotiation\n- Career planning tips\n- Career switching');

END $$;
