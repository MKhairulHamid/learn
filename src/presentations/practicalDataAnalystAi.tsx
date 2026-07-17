import { useState } from 'react'
import {
  Sparkles, Bot, BrainCircuit, Gauge, TrendingUp, LineChart, BarChart3,
  Users, Building2, Globe2, FileText, ShieldCheck, AlertTriangle, CheckCircle2,
  XCircle, ArrowRight, Lightbulb, Search, Database, Layers, Target,
  Briefcase, GraduationCap, Rocket, MessageSquare, Workflow, Wrench,
  Eye, HelpCircle, Quote, Repeat, UserCheck, Landmark, Network, MapPin,
  ListChecks, ArrowUpRight, ScanSearch, GitCompare, ArrowDownRight, Compass,
  Filter, ClipboardCheck, ShieldAlert, FileSearch, Sigma, Percent, Calendar,
} from 'lucide-react'
import {
  BRAND, Shell, Glow, Tag, SlideTitle, Bullet, Panel, Note, SectionLabel,
  Sql, DataTable, type Presentation,
} from './primitives'

/* ─────────────────────────────────────────────────────────────────────────────
   Webinar — Practical Data Analyst & AI
   Kolaborasi Talentiv × Ditekindo. 40 slide.
   Semua klaim angka disandarkan ke 10 sumber yang dikutip eksplisit di slide.
───────────────────────────────────────────────────────────────────────────── */

const WRAP = 'relative z-10 w-full max-w-6xl mx-auto'

/** Logo Ditekindo — file lokal, dengan fallback wordmark bila aset belum ada. */
function DitekindoLogo({ className = 'h-8' }: { className?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span className="w-7 h-7 rounded-md bg-gradient-to-br from-[#2E8BC0] to-[#5AAEE0] flex items-center justify-center">
          <Layers size={14} className="text-white" />
        </span>
        <span className="font-bold tracking-tight text-white text-lg leading-none">DITEKINDO</span>
      </span>
    )
  }
  return (
    <img
      src={BRAND.logoDitekindo}
      alt="Ditekindo"
      onError={() => setFailed(true)}
      className={`${className} object-contain`}
    />
  )
}

/** Baris dua logo penyelenggara. */
function CoBrand({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <img src={BRAND.logoWhite} alt="Talentiv" className="h-8 object-contain" />
      <span className="text-gray-600 text-lg font-light">×</span>
      <DitekindoLogo className="h-8" />
    </div>
  )
}

/** Badge sumber — dipakai tiap kali ada angka, agar klaim bisa ditelusuri. */
function Source({ children }: { children: string }) {
  return (
    <div className="mt-3 flex items-start gap-1.5 text-[10px] text-gray-500 leading-snug">
      <FileText size={11} className="mt-px shrink-0" />
      <span>{children}</span>
    </div>
  )
}

/** Angka besar + label — kartu statistik. */
function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.06] px-4 py-3.5">
      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#1FA79B] to-[#D1EDE5] bg-clip-text text-transparent tabular-nums">
        {value}
      </div>
      <div className="text-xs text-gray-300 mt-1 font-medium">{label}</div>
      {note && <div className="text-[10px] text-gray-500 mt-0.5">{note}</div>}
    </div>
  )
}

// ── 01 · Pembuka ────────────────────────────────────────────────────────────────
const S01 = (
  <div className="w-full min-h-full relative overflow-hidden flex items-center">
    <Glow className="top-1/4 left-1/3 w-[700px] h-[460px] bg-[#1FA79B]/20" />
    <Glow className="bottom-0 right-0 w-[500px] h-[400px] bg-[#6DC4AA]/12" />
    <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <CoBrand className="mb-8" />
        <div className="inline-flex items-center gap-2 mb-5 border border-[#1FA79B]/30 bg-[#1FA79B]/10 rounded-full px-4 py-1.5">
          <Sparkles size={14} className="text-[#6DC4AA]" />
          <span className="text-xs font-semibold text-[#D1EDE5]">Webinar · Talentiv × Ditekindo</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
          Practical
          <span className="block mt-2 bg-gradient-to-r from-[#1FA79B] via-[#6DC4AA] to-[#D1EDE5] bg-clip-text text-transparent">
            Data Analyst &amp; AI
          </span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-gray-400 max-w-md leading-relaxed">
          Peran data analyst tidak hilang. Isinya yang berubah. Hari ini kita bedah
          peran barunya, cara kerjanya, dan cara memakai AI untuk analisis yang sesungguhnya.
        </p>
        <div className="mt-7 grid grid-cols-2 gap-2.5 max-w-md">
          {[
            ['Pembicara', 'M Khairul Hamid., SE.'],
            ['Format', 'Materi + hands-on + tanya jawab'],
            ['Durasi', '±120 menit · 40 slide'],
            ['Basis materi', '10 riset & data resmi'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.08] px-3 py-2">
              <div className="text-[10px] uppercase tracking-widest text-[#6DC4AA]">{k}</div>
              <div className="text-xs text-gray-300 mt-0.5">{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="max-w-[440px] mx-auto rounded-2xl border border-[#6DC4AA]/20 bg-[#0b1220]/80 shadow-2xl shadow-black/50 overflow-hidden">
          <div className="bg-[#6DC4AA]/[0.08] px-4 py-2 flex items-center gap-2 border-b border-[#6DC4AA]/15">
            <Bot size={13} className="text-[#6DC4AA]" />
            <span className="text-[11px] font-mono text-gray-400">analyst_workflow.ai</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="rounded-lg bg-[#1FA79B]/[0.08] border border-[#1FA79B]/20 px-3 py-2">
              <div className="text-[10px] uppercase tracking-widest text-[#6DC4AA] mb-1">Kamu</div>
              <p className="text-xs text-gray-300">
                &ldquo;Penjualan turun 12% bulan ini. Cari tahu kenapa, per region.&rdquo;
              </p>
            </div>
            <div className="flex justify-center"><ArrowRight size={14} className="text-gray-600 rotate-90" /></div>
            <Sql>{`SELECT region,
       SUM(revenue) AS revenue,
       COUNT(DISTINCT order_id) AS orders
FROM orders
WHERE order_date BETWEEN '2026-06-01' AND '2026-06-30'
GROUP BY region
ORDER BY revenue ASC;`}</Sql>
            <div className="flex justify-center"><ArrowRight size={14} className="text-gray-600 rotate-90" /></div>
            <DataTable
              caption="hasil"
              columns={['region', 'revenue', 'orders']}
              rows={[
                ['Sumatera', '412.900.000', 1204],
                ['Jawa Timur', '988.400.000', 3110],
              ]}
            />
            <Note tone="warn">
              AI menulis query-nya dalam 8 detik. <b>Kamu</b> yang memutuskan apakah angkanya
              benar, dan apa artinya bagi bisnis.
            </Note>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// ── 02 · Perkenalan pembicara ───────────────────────────────────────────────────
const S02 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Perkenalan" />
      <SlideTitle sub="Materi hari ini lahir dari 8 tahun lebih berpindah-pindah di dua sisi meja: sisi yang membangun sistem datanya, dan sisi yang harus mengambil keputusan dari data itu sendiri.">
        M Khairul Hamid<span className="text-[#6DC4AA]">, SE.</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel icon={<Briefcase size={16} />} title="Hari ini" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-400 mb-3">
            Saat ini menjabat <b className="text-gray-200">Senior Software Engineer</b> di Nomni,
            platform teknologi hospitality AI-first asal Melbourne (remote).
          </p>
          <ul className="space-y-2">
            <Bullet>Integrasi data pembayaran &amp; pesanan lintas <b className="text-[#6DC4AA]">35.000+ venue</b>, 3 region global</Bullet>
            <Bullet>Layanan yang memproses <b className="text-[#6DC4AA]">120 juta+</b> transaksi per tahun</Bullet>
            <Bullet>Terlibat langsung membangun produk yang AI-first sejak hari pertama</Bullet>
          </ul>
        </Panel>
        <Panel icon={<BarChart3 size={16} />} title="Sisi analitik">
          <p className="text-xs text-gray-400 mb-3">
            Sebelumnya menjabat <b className="text-gray-200">Director of Business Intelligence</b> di
            Boogie Medical, distributor alat kesehatan untuk 600+ rumah sakit.
          </p>
          <ul className="space-y-2">
            <Bullet>Membangun fungsi BI <b className="text-[#6DC4AA]">dari nol</b>: data model, dashboard, proses</Bullet>
            <Bullet>Duduk langsung dengan CEO &amp; board untuk menerjemahkan strategi jadi angka</Bullet>
            <Bullet>Paham betul rasanya menyusun laporan manual yang makan waktu berhari-hari, sekaligus tahu cara memangkasnya</Bullet>
          </ul>
        </Panel>
        <Panel icon={<Globe2 size={16} />} title="Skala &amp; jangkauan">
          <p className="text-xs text-gray-400 mb-3">
            Sebelum itu, <b className="text-gray-200">Senior Software Engineer</b> di BIPO,
            penyedia HRMS &amp; payroll global untuk 170+ pasar.
          </p>
          <ul className="space-y-2">
            <Bullet>Data workflow multi-tenant untuk <b className="text-[#6DC4AA]">650.000+</b> karyawan aktif</Bullet>
            <Bullet>Sebelumnya di fintech pertanian Telkom, menjangkau <b className="text-[#6DC4AA]">71.000+</b> petani</Bullet>
            <Bullet>Mengawali karier sebagai System Analyst dengan fokus membenahi proses kerja, jauh sebelum sempat menyentuh baris kode</Bullet>
          </ul>
        </Panel>
      </div>
      <Note className="mt-4">
        <b className="text-[#6DC4AA]">Kenapa ini relevan untuk kamu:</b> saya pernah berada di
        posisi orang yang menunggu laporan, orang yang mengerjakan laporannya, dan orang yang
        membangun sistem di belakangnya. Tiga sudut pandang itulah yang kita pakai sepanjang sesi
        ini, dengan penekanan pada cara berpikir — sesuatu yang jauh lebih tahan lama daripada
        sekadar daftar tools.
      </Note>
    </div>
  </Shell>
)

// ── 03 · Rekam jejak dalam angka ────────────────────────────────────────────────
const S03 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Konteks pengalaman" />
      <SlideTitle sub="Angka-angka ini sekadar memberi gambaran skala kerja sehari-hari. Semua contoh, analogi, dan studi kasus hari ini diambil langsung dari sistem-sistem berikut, bukan dari dataset tutorial.">
        Dari mana materi ini <span className="text-[#6DC4AA]">berasal</span>
      </SlideTitle>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Stat value="35.000+" label="Venue terhubung" note="Nomni · integrasi M&A" />
        <Stat value="120 jt+" label="Transaksi / tahun" note="Nomni · payment & ordering" />
        <Stat value="650.000+" label="Pengguna aktif" note="BIPO · HRMS multi-tenant" />
        <Stat value="600+" label="Akun rumah sakit" note="Boogie Medical · BI" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<Layers size={16} />} title="Yang saya pelajari dari sisi engineering">
          <ul className="space-y-2">
            <Bullet>Data yang &ldquo;kelihatan rapi&rdquo; di dashboard hampir selalu berantakan di sumbernya</Bullet>
            <Bullet>Sistem besar selalu diganti sepotong demi sepotong, nyaris tidak pernah sekaligus — pola yang nanti kita pakai sebagai analogi adopsi AI</Bullet>
            <Bullet>Dokumentasi &amp; flowchart sering lebih berdampak daripada kode itu sendiri</Bullet>
          </ul>
        </Panel>
        <Panel icon={<Target size={16} />} title="Yang saya pelajari dari sisi bisnis" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>Board tidak pernah meminta &ldquo;query&rdquo;. Yang mereka minta adalah <b className="text-[#6DC4AA]">keputusan</b></Bullet>
            <Bullet>Laporan yang paling cepat selalu kalah oleh laporan yang paling dipercaya</Bullet>
            <Bullet>Analis yang naik kelas adalah yang berani menutup presentasinya dengan &ldquo;karena itu, sebaiknya kita lakukan X&rdquo;</Bullet>
          </ul>
        </Panel>
      </div>
      <Note tone="info" className="mt-4">
        Semua studi kasus hari ini adalah versi sederhana dari masalah nyata di atas: data
        penjualan yang terpecah, KPI yang dihitung manual, dan pertanyaan bos yang harus dijawab
        hari itu juga.
      </Note>
    </div>
  </Shell>
)

// ── 04 · Agenda ─────────────────────────────────────────────────────────────────
const S04 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Agenda" />
      <SlideTitle sub="Delapan hal yang akan kita tuntaskan bersama. Tiga bagian besar: memahami perubahan, menguasai workflow, lalu membuktikannya lewat portofolio.">
        Apa yang kita <span className="text-[#6DC4AA]">bahas</span> hari ini
      </SlideTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          [<BrainCircuit size={16} key="a" />, '01', 'Memahami Peran Baru Data Analyst di Era AI', 'Apa yang berubah, apa yang tetap.'],
          [<Bot size={16} key="b" />, '02', 'Belajar Menggunakan AI untuk Analisis Data', 'Prompting, validasi, batasnya.'],
          [<Wrench size={16} key="c" />, '03', 'Hands-On Workshop dengan Studi Kasus Nyata', 'Dari pertanyaan bisnis ke insight.'],
          [<Gauge size={16} key="d" />, '04', 'Meningkatkan Produktivitas Berkali Lipat', 'Di mana waktumu sebenarnya hilang.'],
          [<Briefcase size={16} key="e" />, '05', 'Kompetensi Data Analyst yang Dicari Perusahaan', 'Berdasarkan lowongan nyata.'],
          [<Rocket size={16} key="f" />, '06', 'Membangun Portofolio Proyek Berbasis AI', 'Yang bikin recruiter berhenti scroll.'],
          [<Workflow size={16} key="g" />, '07', 'Workflow & Studi Kasus Data Analyst', 'Tujuh langkah, versi AI-augmented.'],
          [<MessageSquare size={16} key="h" />, '08', 'Sesi Tanya Jawab Langsung dengan Praktisi', 'Bawa pertanyaan tersulitmu.'],
        ].map(([icon, no, title, sub]) => (
          <div key={no as string} className="rounded-2xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.06] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1FA79B]/15 border border-[#1FA79B]/20 flex items-center justify-center text-[#6DC4AA]">
                {icon as React.ReactNode}
              </div>
              <span className="text-[10px] font-mono text-gray-600">{no as string}</span>
            </div>
            <h3 className="text-[13px] font-semibold text-white leading-snug">{title as string}</h3>
            <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">{sub as string}</p>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        {[
          ['Bagian 1 · Slide 5–25', 'Kenapa peran ini berubah, didukung bukti data'],
          ['Bagian 2 · Slide 26–36', 'Workflow, tools, prompting, studi kasus'],
          ['Bagian 3 · Slide 37–40', 'Kompetensi, portofolio, langkah 90 hari'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-[#1FA79B]/25 bg-[#1FA79B]/[0.06] px-4 py-2.5">
            <div className="text-[10px] uppercase tracking-widest text-[#6DC4AA]">{k}</div>
            <div className="text-xs text-gray-300 mt-1">{v}</div>
          </div>
        ))}
      </div>
    </div>
  </Shell>
)

// ── 05 · Janji sesi ─────────────────────────────────────────────────────────────
const S05 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Kontrak belajar" />
      <SlideTitle sub="Supaya waktumu tidak sia-sia, berikut janji saya, dan berikut juga yang saya minta darimu.">
        Yang kamu <span className="text-[#6DC4AA]">bawa pulang</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<CheckCircle2 size={16} />} title="Setelah sesi ini kamu bisa…" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>Menjelaskan dengan bukti kenapa peran analis <b className="text-[#6DC4AA]">berubah, bukan hilang</b></Bullet>
            <Bullet>Menjalankan workflow 7 langkah dengan AI di titik yang tepat</Bullet>
            <Bullet>Menulis prompt analisis yang menghasilkan SQL/kode yang benar</Bullet>
            <Bullet>Memvalidasi output AI, termasuk menangkap saat AI mengarang jawaban</Bullet>
            <Bullet>Menyusun 1 proyek portofolio yang layak dipamerkan</Bullet>
            <Bullet>Tahu kompetensi apa yang benar-benar ditulis di lowongan 2026</Bullet>
          </ul>
        </Panel>
        <div className="space-y-4">
          <Panel icon={<XCircle size={16} />} title="Yang TIDAK akan kita lakukan" className="border-red-500/20 bg-red-500/[0.05]">
            <ul className="space-y-2">
              <Bullet tone="bad">Menakut-nakuti bahwa &ldquo;AI akan mengambil pekerjaanmu&rdquo;</Bullet>
              <Bullet tone="bad">Menjual tools ajaib yang menyelesaikan semuanya</Bullet>
              <Bullet tone="bad">Mengklaim angka tanpa menyebut sumbernya</Bullet>
            </ul>
          </Panel>
          <Panel icon={<HelpCircle size={16} />} title="Yang saya minta darimu">
            <ul className="space-y-2">
              <Bullet>Potong saya kapan saja kalau ada yang tidak masuk akal</Bullet>
              <Bullet>Saat studi kasus: coba dulu sendiri sebelum lihat jawaban</Bullet>
              <Bullet>Simpan pertanyaan tersulit untuk slide terakhir</Bullet>
            </ul>
          </Panel>
        </div>
      </div>
      <Note tone="info" className="mt-4">
        Setiap angka di deck ini punya badge sumber di bawahnya. Kalau kamu mau mengecek ulang di
        rumah, semua tautannya ada di slide penutup.
      </Note>
    </div>
  </Shell>
)

// ── 06 · Hook ───────────────────────────────────────────────────────────────────
const S06 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Pertanyaan yang membuatmu hadir di sini" />
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center tracking-tight leading-tight mb-3">
        &ldquo;Apakah AI akan <span className="text-red-400">menggantikan</span> data analyst?&rdquo;
      </h2>
      <p className="text-center text-gray-400 text-sm sm:text-base mb-8 max-w-2xl mx-auto">
        Jawaban jujurnya ada di tengah, dan di situlah letak peluangnya.
      </p>
      <div className="grid lg:grid-cols-3 gap-4 items-stretch">
        <Panel icon={<XCircle size={16} />} title="Jawaban yang salah #1" className="border-red-500/20 bg-red-500/[0.05]">
          <p className="text-sm text-gray-300 font-medium mb-2">&ldquo;Ya, habislah kita.&rdquo;</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Bertentangan dengan data. Proyeksi resmi pemerintah AS justru menunjukkan pertumbuhan
            lapangan kerja data yang jauh di atas rata-rata sampai 2034. Kita bahas di slide 13.
          </p>
        </Panel>
        <Panel icon={<XCircle size={16} />} title="Jawaban yang salah #2" className="border-amber-500/20 bg-amber-500/[0.05]">
          <p className="text-sm text-gray-300 font-medium mb-2">&ldquo;Tidak, AI cuma hype.&rdquo;</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Juga bertentangan dengan data. Hampir 9 dari 10 perusahaan sudah memakai AI, dan
            AI &amp; big data ada di puncak daftar skill yang permintaannya paling cepat naik.
          </p>
        </Panel>
        <Panel icon={<CheckCircle2 size={16} />} title="Jawaban yang jujur" className="border-[#1FA79B]/30 bg-[#1FA79B]/[0.09]">
          <p className="text-sm text-[#D1EDE5] font-medium mb-2">
            &ldquo;AI menggantikan <u>tugas</u>, bukan <u>peran</u>.&rdquo;
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            Yang tergantikan: menulis query rutin, merapikan data, menyusun laporan berulang.
            Yang nilainya makin naik: merumuskan pertanyaan, memvalidasi hasil, dan mengubah
            angka menjadi keputusan.
          </p>
          <Source>Riset HBS via Harvard Business Review (2026) menemukan bahwa AI membentuk ulang pekerjaan white-collar secara tidak merata, alih-alih menghapusnya begitu saja.</Source>
        </Panel>
      </div>
      <Note tone="warn" className="mt-5">
        <b>Coba ganti pertanyaannya.</b> Bertanya &ldquo;apakah saya akan digantikan AI?&rdquo;
        tidak banyak menolong. Pertanyaan yang jauh lebih penting adalah <b className="text-[#6DC4AA]">&ldquo;apakah
        saya akan tersalip oleh analis lain yang sudah memakai AI?&rdquo;</b> Jawaban pertanyaan
        itu sepenuhnya ada di tanganmu.
      </Note>
    </div>
  </Shell>
)

// ── 07 · Kenapa berubah — overview 4 poin ───────────────────────────────────────
const S07 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Inti bagian 1" />
      <SlideTitle sub="Ada empat perubahan yang terjadi bersamaan. Empat slide berikutnya membedahnya satu per satu, lalu slide 12–21 menunjukkan datanya.">
        Kenapa Data Analyst <span className="text-[#6DC4AA]">Berubah</span> di Era AI?
      </SlideTitle>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          [<Gauge size={18} key="1" />, '01', 'AI mempercepat proses analisis data',
            'Pekerjaan yang dulu makan waktu berjam-jam (query, cleaning, draft chart) kini selesai dalam hitungan menit. Waktumu bergeser dari mengetik ke berpikir.'],
          [<Bot size={18} key="2" />, '02', 'Banyak KPI manual mulai diotomatisasi',
            'Laporan mingguan yang disusun tangan adalah kandidat otomasi pertama. Kalau itu satu-satunya nilai jualmu, posisimu rapuh.'],
          [<Building2 size={18} key="3" />, '03', 'Perusahaan butuh data analis yang pakai AI',
            'Adopsi AI tinggi, tapi hasilnya belum terasa. Yang dicari perusahaan: orang yang bisa menyambungkan AI ke workflow nyata mereka.'],
          [<TrendingUp size={18} key="4" />, '04', 'Skill Data + AI jadi keunggulan baru',
            'Kombinasi keduanyalah yang kini dihargai pasar, ditandai lewat premi upah yang melonjak tajam.'],
        ].map(([icon, no, title, body]) => (
          <div key={no as string} className="rounded-2xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.06] p-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#1FA79B]/15 border border-[#1FA79B]/25 flex items-center justify-center text-[#6DC4AA] shrink-0">
                {icon as React.ReactNode}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-[#6DC4AA]">{no as string}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-white leading-snug">{title as string}</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{body as string}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Note tone="info" className="mt-4">
        Perhatikan polanya: tiga poin pertama <b>menggerus</b> pekerjaan lama, sedangkan poin
        keempat <b className="text-[#6DC4AA]">membuka</b> pekerjaan baru. Sesi hari ini membahas
        cara berpindah dari sisi kiri ke sisi kanan.
      </Note>
    </div>
  </Shell>
)

// ── 08 · Poin 1: AI mempercepat analisis ────────────────────────────────────────
const S08 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Poin 1 dari 4" />
      <SlideTitle sub="Yang sebenarnya berubah adalah biaya untuk mencoba. Kalau satu eksplorasi cuma makan waktu 2 menit, kamu jadi berani menguji 20 hipotesis sekaligus, bukan cuma 2.">
        AI <span className="text-[#6DC4AA]">mempercepat</span> proses analisis data
      </SlideTitle>
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 rounded-2xl border border-[#6DC4AA]/20 overflow-hidden">
          <div className="grid grid-cols-4 bg-[#6DC4AA]/[0.08] text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
            <div className="px-3 py-2">Tugas</div>
            <div className="px-3 py-2">Cara lama</div>
            <div className="px-3 py-2 text-[#6DC4AA]">Dengan AI</div>
            <div className="px-3 py-2">Siapa yang tetap memutuskan</div>
          </div>
          {[
            ['Menulis query eksplorasi', '20–40 menit', '1–3 menit', 'Kamu: apakah logikanya benar'],
            ['Membersihkan data mentah', '2–4 jam', '15–30 menit', 'Kamu: mana yang boleh dibuang'],
            ['Membuat chart pertama', '30 menit', '2 menit', 'Kamu: chart apa yang jujur'],
            ['Draft narasi laporan', '1–2 jam', '10 menit', 'Kamu: klaim apa yang berani dibela'],
            ['Debug error SQL', '15–60 menit', '2–5 menit', 'Kamu: apakah perbaikannya masuk akal'],
          ].map((r) => (
            <div key={r[0]} className="grid grid-cols-4 border-t border-[#6DC4AA]/12 text-xs">
              <div className="px-3 py-2.5 text-gray-300">{r[0]}</div>
              <div className="px-3 py-2.5 text-gray-500 tabular-nums">{r[1]}</div>
              <div className="px-3 py-2.5 text-[#6DC4AA] tabular-nums font-medium">{r[2]}</div>
              <div className="px-3 py-2.5 text-gray-400">{r[3]}</div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Panel icon={<Lightbulb size={16} />} title="Efek yang jarang dibicarakan" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
            <ul className="space-y-2">
              <Bullet>Hipotesis yang dulu &ldquo;tidak sempat dicek&rdquo; sekarang bisa dicek</Bullet>
              <Bullet>Kamu berani membuang pendekatan yang salah lebih cepat</Bullet>
              <Bullet>Kualitas analisis naik karena kamu jadi mampu <b className="text-[#6DC4AA]">iterasi</b> lebih banyak, bukan semata AI-nya yang pintar</Bullet>
            </ul>
          </Panel>
          <Note tone="warn">
            <b>Jebakannya:</b> cepat salah tetap salah. Kecepatan tanpa validasi hanya membuatmu
            memproduksi laporan keliru lebih banyak, lebih cepat.
          </Note>
        </div>
      </div>
      <Note tone="info">
        <b className="text-[#6DC4AA]">Dari pengalaman:</b> di Boogie Medical, laporan penjualan
        per akun rumah sakit dulu disusun manual dari CRM yang terpecah. Yang benar-benar mengubah
        keadaan adalah hilangnya jeda antara &ldquo;muncul pertanyaan&rdquo; dan &ldquo;dapat
        jawaban&rdquo;, bukan tools yang lebih canggih. Itu persis yang dilakukan AI hari ini,
        hanya satu level lebih jauh.
      </Note>
      <Source>Angka pada tabel adalah rentang tipikal dari praktik lapangan, bukan hasil studi terkontrol, dan hanya dipakai sebagai ilustrasi urutan besaran. Untuk data adopsi &amp; produktivitas AI yang terverifikasi akademik, lihat Stanford HAI AI Index Report 2026 (slide 15).</Source>
    </div>
  </Shell>
)

// ── 09 · Poin 2: KPI manual diotomatisasi ───────────────────────────────────────
const S09 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Poin 2 dari 4" />
      <SlideTitle sub="Tidak semua KPI diciptakan setara. Sebagian aman diserahkan ke mesin, sebagian lain tetap menuntut penilaianmu. Kuncinya ada di cara KPI itu dihitung.">
        Banyak KPI manual mulai <span className="text-[#6DC4AA]">diotomatisasi</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Panel icon={<Repeat size={16} />} title="Ciri KPI yang aman diotomatisasi penuh" className="border-amber-500/20 bg-amber-500/[0.05]">
          <ul className="space-y-2">
            <Bullet tone="neutral">Rumusnya tetap sama dari bulan ke bulan</Bullet>
            <Bullet tone="neutral">Sumber datanya sudah bersih dan terstruktur</Bullet>
            <Bullet tone="neutral">Hasilnya bisa dibaca tanpa konteks tambahan</Bullet>
            <Bullet tone="neutral">Dijalankan berkala: harian, mingguan, bulanan</Bullet>
          </ul>
          <Note tone="warn" className="mt-3">Contoh: laporan penjualan harian, rekap absensi, dashboard traffic rutin.</Note>
        </Panel>
        <Panel icon={<UserCheck size={16} />} title="Ciri KPI yang tetap butuh kamu" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>Definisinya bergeser tiap kuartal mengikuti strategi</Bullet>
            <Bullet>Butuh membedakan anomali sungguhan dari salah input</Bullet>
            <Bullet>Dipakai untuk keputusan besar: ekspansi, PHK, investasi</Bullet>
            <Bullet>Perlu diceritakan ke orang yang tidak paham data</Bullet>
          </ul>
          <Note tone="info" className="mt-3">Contoh: proyeksi churn, valuasi ekspansi pasar baru, evaluasi kinerja tim.</Note>
        </Panel>
      </div>
      <Note tone="info">
        <b className="text-[#6DC4AA]">Dari pengalaman:</b> di BIPO, ratusan aturan kepatuhan payroll
        per negara sudah terotomatisasi penuh. Satu pertanyaan yang tetap dipegang tim dan tidak
        bisa dihitung mesin: &ldquo;apakah angka ini masuk akal untuk pasar ini?&rdquo; Itu yang
        bertahan setelah otomatisasi selesai.
      </Note>
    </div>
  </Shell>
)

// ── 10 · Poin 3: perusahaan butuh analis ber-AI ─────────────────────────────────
const S10 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Poin 3 dari 4" />
      <SlideTitle sub="Hampir semua perusahaan sudah membeli lisensi AI. Yang masih langka adalah orang yang tahu menyambungkannya ke pekerjaan sehari-hari. Datanya menyusul di slide 14.">
        Perusahaan butuh data analis yang <span className="text-[#6DC4AA]">memakai AI</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Panel icon={<XCircle size={16} />} title="Yang sering dikira dicari perusahaan" className="border-red-500/20 bg-red-500/[0.05]">
          <ul className="space-y-2">
            <Bullet tone="bad">Ahli prompt yang hafal mantra-mantra khusus</Bullet>
            <Bullet tone="bad">Yang paling cepat mencoba tools baru</Bullet>
            <Bullet tone="bad">Yang bisa membuat AI terlihat mengesankan di demo</Bullet>
          </ul>
        </Panel>
        <Panel icon={<Search size={16} />} title="Yang sesungguhnya dicari" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>Paham proses bisnis cukup dalam untuk tahu titik AI berguna</Bullet>
            <Bullet>Bisa merangkai AI ke workflow yang sudah berjalan</Bullet>
            <Bullet>Berani bilang &ldquo;di bagian ini AI belum bisa dipercaya&rdquo;</Bullet>
          </ul>
        </Panel>
      </div>
      <Note tone="info">
        <b className="text-[#6DC4AA]">Dari pengalaman:</b> mengintegrasikan sistem pembayaran dari
        beberapa platform hasil akuisisi di Nomni intinya adalah merancang ulang alurnya supaya
        semua bagian nyambung, bukan sekadar memilih alat yang tepat. Adopsi AI di perusahaan
        menuntut kerja yang persis sama, dan itulah pekerjaan seorang analis hari ini.
      </Note>
    </div>
  </Shell>
)

// ── 11 · Poin 4: skill Data + AI ─────────────────────────────────────────────────
const S11 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Poin 4 dari 4" />
      <SlideTitle sub="Data tanpa AI masih berjalan, hanya lebih lambat. AI tanpa pemahaman data gampang salah arah. Titik temu keduanya yang sekarang paling dicari pasar kerja — datanya ada di slide 17.">
        Skill Data + AI jadi <span className="text-[#6DC4AA]">keunggulan baru</span>
      </SlideTitle>
      <div className="flex items-center justify-center py-6">
        <div className="relative flex items-center">
          <div className="w-52 h-52 rounded-full bg-[#1FA79B]/15 border border-[#1FA79B]/30 flex items-center justify-center">
            <span className="text-sm font-semibold text-[#D1EDE5] text-center -translate-x-5">Kemampuan<br />Data</span>
          </div>
          <div className="w-52 h-52 rounded-full bg-[#6DC4AA]/15 border border-[#6DC4AA]/30 flex items-center justify-center -ml-16">
            <span className="text-sm font-semibold text-[#D1EDE5] text-center translate-x-5">Kemampuan<br />AI</span>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-2xl border border-white/20 bg-[#0b1220]/95 px-4 py-3 text-center shadow-xl whitespace-nowrap">
              <div className="text-xs font-bold text-white">Kamu di sini</div>
              <div className="text-[10px] text-gray-400 mt-0.5">paling langka, paling dihargai</div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <Panel icon={<Database size={16} />} title="Hanya jago data">
          <p className="text-xs text-gray-400">Query rapi, tapi lambat saat harus eksplorasi &amp; iterasi.</p>
        </Panel>
        <Panel icon={<Bot size={16} />} title="Hanya jago AI">
          <p className="text-xs text-gray-400">Cepat menghasilkan jawaban, tapi rawan tidak sadar saat jawabannya salah.</p>
        </Panel>
        <Panel icon={<Sparkles size={16} />} title="Data + AI" className="border-[#1FA79B]/30 bg-[#1FA79B]/[0.09]">
          <p className="text-xs text-gray-300">Tahu cara meminta yang tepat <span className="text-[#6DC4AA] font-medium">dan</span> tahu cara memeriksa hasilnya.</p>
        </Panel>
      </div>
    </div>
  </Shell>
)

// ── 12 · Bukti 1: WEF Future of Jobs 2025 ───────────────────────────────────────
const S12 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Bukti 1 dari 10 · World Economic Forum" />
      <SlideTitle sub="Disusun dari survei terhadap 1.000+ perusahaan besar yang mewakili 14 juta pekerja di 55 negara — konsensus pasar kerja global, bukan opini satu analis.">
        AI &amp; Big Data ada di <span className="text-[#6DC4AA]">puncak</span> daftar skill
      </SlideTitle>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-[#6DC4AA]/20 p-5">
          <SectionLabel>Skill dengan permintaan tumbuh paling cepat</SectionLabel>
          <div className="space-y-2.5 mt-3">
            {[
              ['AI & Big Data', 100],
              ['Networks & Cybersecurity', 78],
              ['Technological Literacy', 71],
              ['Creative Thinking', 64],
              ['Analytical Thinking', 60],
            ].map(([label, pct], i) => (
              <div key={label as string}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={i === 0 ? 'text-[#6DC4AA] font-semibold' : 'text-gray-400'}>{label as string}</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-[#1FA79B] to-[#6DC4AA]' : 'bg-white/20'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-3">Ilustrasi peringkat relatif berdasarkan temuan laporan, bukan angka persentase resmi WEF.</p>
        </div>
        <div className="space-y-4">
          <Stat value="39%" label="Skill inti berubah pada 2030" note="dari seluruh skill yang dipakai hari ini" />
          <Stat value="55" label="Negara tercakup" note="1.000+ perusahaan besar disurvei" />
        </div>
      </div>
      <Source>World Economic Forum, The Future of Jobs Report 2025 · weforum.org/publications/the-future-of-jobs-report-2025</Source>
    </div>
  </Shell>
)

// ── 13 · Bukti 2: US BLS Occupational Outlook ───────────────────────────────────
const S13 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Bukti 2 dari 10 · U.S. Bureau of Labor Statistics" />
      <SlideTitle sub="Badan statistik resmi Departemen Tenaga Kerja Amerika Serikat. Tidak berjualan kursus, tidak berjualan software — datanya murni proyeksi ketenagakerjaan.">
        Lapangan kerja data scientist diproyeksikan tumbuh <span className="text-[#6DC4AA]">34%</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4 items-center">
        <div className="rounded-2xl border border-[#1FA79B]/25 bg-[#1FA79B]/[0.06] p-6 text-center">
          <div className="text-6xl font-bold bg-gradient-to-r from-[#1FA79B] to-[#D1EDE5] bg-clip-text text-transparent tabular-nums">+34%</div>
          <p className="text-sm text-gray-300 mt-2">Proyeksi pertumbuhan 2024–2034</p>
          <p className="text-xs text-gray-500 mt-3">Jauh di atas rata-rata seluruh pekerjaan di AS, yang diproyeksikan tumbuh di kisaran satu digit rendah.</p>
        </div>
        <Panel icon={<Landmark size={16} />} title="Kenapa angka ini penting">
          <ul className="space-y-2">
            <Bullet>Sumber pemerintah tanpa kepentingan komersial</Bullet>
            <Bullet>Didorong kebutuhan membangun model AI &amp; menganalisis data</Bullet>
            <Bullet>Membantah langsung narasi &ldquo;AI menghapus pekerjaan analis&rdquo;</Bullet>
          </ul>
        </Panel>
      </div>
      <Note tone="info" className="mt-4">
        Ingat dua jawaban di slide 6 yang sama-sama meleset: &ldquo;AI akan menghapus semua&rdquo;
        dan &ldquo;AI cuma hype&rdquo;. Angka BLS ini salah satu alasan kenapa jawaban pertama
        tidak berdiri di atas data.
      </Note>
      <Source>U.S. Bureau of Labor Statistics, Occupational Outlook Handbook — Data Scientists · bls.gov/ooh/math/data-scientists.htm</Source>
    </div>
  </Shell>
)

// ── 14 · Bukti 3: McKinsey State of AI 2025 ──────────────────────────────────────
const S14 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Bukti 3 dari 10 · McKinsey & Company" />
      <SlideTitle sub="Berbasis survei tahunan berskala besar terhadap eksekutif perusahaan. Temuannya penuh nuansa, dan nuansa itu justru paling relevan buat karier seorang analis.">
        Hampir semua pakai AI. Sebagian besar <span className="text-[#6DC4AA]">belum merasakan hasilnya</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <Stat value="~90%" label="Perusahaan sudah memakai AI" note="dalam minimal satu fungsi bisnis" />
        <Stat value="94%" label="Belum melihat nilai signifikan" note="dari investasi AI mereka" />
      </div>
      <Panel icon={<Network size={16} />} title="Kenapa gap ini terjadi" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
        <p className="text-xs text-gray-400 mb-3">
          Nilai baru muncul saat <b className="text-gray-200">workflow dirancang ulang</b> di sekitar
          AI, bukan saat AI ditempel begitu saja di atas proses lama. Menempelkan AI ke proses yang
          sama persis biasanya cuma memindahkan pekerjaan, bukan menambah nilai.
        </p>
        <Note tone="info">
          <b className="text-[#6DC4AA]">Dari pengalaman:</b> mengintegrasikan sistem M&amp;A di
          Nomni mengajarkan hal serupa — menyambungkan platform baru ke platform lama tidak pernah
          cukup dengan &ldquo;tempel di atas&rdquo;. Alurnya harus dirancang ulang dari awal. Adopsi
          AI di perusahaan menuntut disiplin yang sama.
        </Note>
      </Panel>
      <Note tone="warn" className="mt-4">
        Inilah celah yang bisa kamu isi: analis yang paham merancang ulang workflow di sekitar AI
        jauh lebih berharga daripada analis yang sekadar tahu memakai satu tool AI.
      </Note>
      <Source>McKinsey & Company, Where AI will create value—and where it won't — The State of AI 2025 · mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/where-ai-will-create-value-and-where-it-wont</Source>
    </div>
  </Shell>
)

// ── 15 · Bukti 4: Stanford HAI AI Index 2026 ─────────────────────────────────────
const S15 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Bukti 4 dari 10 · Stanford HAI" />
      <SlideTitle sub="Institut riset AI akademik terkemuka, netral, dan tidak menjual produk apa pun. AI Index adalah kompilasi data AI tahunan paling komprehensif yang tersedia untuk publik.">
        Satu laporan, tiga <span className="text-[#6DC4AA]">lensa data AI</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-3 gap-4">
        <Panel icon={<TrendingUp size={16} />} title="Adopsi">
          <p className="text-xs text-gray-400">Seberapa cepat organisasi di berbagai sektor &amp; negara mengadopsi AI ke operasional mereka.</p>
        </Panel>
        <Panel icon={<Gauge size={16} />} title="Produktivitas">
          <p className="text-xs text-gray-400">Dampak terukur AI terhadap output kerja, termasuk riset tentang pekerjaan berbasis data &amp; analisis.</p>
        </Panel>
        <Panel icon={<Building2 size={16} />} title="Investasi">
          <p className="text-xs text-gray-400">Aliran dana global ke riset &amp; produk AI — sinyal ke mana permintaan skill akan bergerak.</p>
        </Panel>
      </div>
      <Note tone="info" className="mt-4">
        Laporan ini diperbarui tiap tahun dan angkanya bergerak cepat. Untuk data paling mutakhir
        soal adopsi &amp; produktivitas AI sebelum interview atau riset karier, ini sumber akademik
        paling layak dipercaya.
      </Note>
      <Source>Stanford HAI (Institute for Human-Centered AI), AI Index Report 2026 · hai.stanford.edu/ai-index</Source>
    </div>
  </Shell>
)

// ── 16 · Bukti 5: HBR / HBS research ─────────────────────────────────────────────
const S16 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Bukti 5 dari 10 · Harvard Business Review" />
      <SlideTitle sub="Riset faculty Harvard Business School (Suraj Srinivasan), diterbitkan lewat HBR. Kredibilitas akademik, dan menjawab langsung tesis inti webinar ini.">
        AI membentuk ulang pekerjaan <span className="text-[#6DC4AA]">white-collar</span> — tidak merata
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<ScanSearch size={16} />} title="Temuan utama">
          <ul className="space-y-2">
            <Bullet>Dampak AI terhadap pekerjaan kantoran <b className="text-[#6DC4AA]">tidak seragam</b> antar peran</Bullet>
            <Bullet>Sebagian tugas hilang, sebagian bergeser, sebagian baru muncul — dalam peran yang sama</Bullet>
            <Bullet>Peran paling aman menuntut penilaian &amp; konteks, bukan eksekusi berulang</Bullet>
          </ul>
        </Panel>
        <Panel icon={<GraduationCap size={16} />} title="Kaitannya dengan data analyst" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-400">
            Data analyst persis berada di kategori &ldquo;dibentuk ulang&rdquo;: sebagian besar
            tugas eksekusi (query, cleaning, chart) mudah diambil alih AI, sementara tugas
            penilaian (apa artinya angka ini, apa yang harus dilakukan) tetap menuntut manusia.
          </p>
        </Panel>
      </div>
      <Note tone="warn" className="mt-4">
        Ini riset yang paling langsung mendukung tesis hari ini: peran berubah, bukan hilang
        secara merata. Kalau ada satu slide yang layak kamu simpan untuk meyakinkan atasanmu,
        ini salah satunya.
      </Note>
      <Source>Harvard Business Review / HBS Working Knowledge, Research: How AI Is Changing the Labor Market (2026) · hbr.org/2026/03/research-how-ai-is-changing-the-labor-market</Source>
    </div>
  </Shell>
)

// ── 17 · Bukti 6: PwC Global AI Jobs Barometer ───────────────────────────────────
const S17 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Bukti 6 dari 10 · PwC" />
      <SlideTitle sub="Salah satu firma 'Big Four' global. Datanya bukan survei opini, melainkan analisis jutaan lowongan kerja nyata — data primer dari pasar kerja itu sendiri.">
        Skill AI kini bernilai premi upah <span className="text-[#6DC4AA]">56%</span>
      </SlideTitle>
      <div className="rounded-2xl border border-[#6DC4AA]/20 p-6">
        <SectionLabel>Premi upah untuk pekerja dengan skill AI, dibanding rekan sejawat tanpanya</SectionLabel>
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-400">Tahun sebelumnya</span>
              <span className="text-gray-400 font-mono">25%</span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-white/25" style={{ width: '25%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#6DC4AA] font-semibold">Tahun ini</span>
              <span className="text-[#6DC4AA] font-mono font-semibold">56%</span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#1FA79B] to-[#6DC4AA]" style={{ width: '56%' }} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-[#6DC4AA]">
          <ArrowUpRight size={14} />
          <span>Lebih dari dua kali lipat dalam setahun</span>
        </div>
      </div>
      <Note tone="info" className="mt-4">
        Ini bukan premi untuk gelar atau sertifikat AI. Ini premi untuk orang yang benar-benar
        memakai skill itu di pekerjaan sehari-hari — persis argumen &ldquo;Skill Data + AI&rdquo;
        di slide 11.
      </Note>
      <Source>PwC, Global AI Jobs Barometer 2025 · pwc.com/gx/en/issues/artificial-intelligence/ai-jobs-barometer.html</Source>
    </div>
  </Shell>
)

// ── 18 · Bukti 7: 365 Data Science ───────────────────────────────────────────────
const S18 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Bukti 7 dari 10 · 365 Data Science" />
      <SlideTitle sub="Platform edukasi data science yang menganalisis 1.000+ lowongan kerja nyata tiap tahun. Sumber komersial dengan metodologi transparan — tetap disandingkan dengan sumber Tier 1 seperti BLS.">
        Kompetensi yang paling sering muncul di <span className="text-[#6DC4AA]">lowongan data analyst</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['ETL', 'Extract, transform, load — menyatukan data dari banyak sumber'],
          ['Data Governance', 'Menjaga data tetap akurat, aman, dan bisa dipertanggungjawabkan'],
          ['Cloud Computing', 'BigQuery, Snowflake, AWS — data sudah pindah dari laptop'],
          ['AI Literacy', 'Memakai & memvalidasi tools AI dalam workflow analisis'],
        ].map(([k, v]) => (
          <Panel key={k} icon={<ListChecks size={16} />} title={k}>
            <p className="text-xs text-gray-400">{v}</p>
          </Panel>
        ))}
      </div>
      <Note tone="warn" className="mt-4">
        <b>Catatan sumber:</b> 365 Data Science adalah platform komersial, jadi angka persisnya
        sebaiknya tidak dikutip berdiri sendiri. Yang dipakai di sini hanya pola kompetensi yang
        konsisten muncul, dan pola itu sejalan dengan data BLS &amp; Komdigi di slide 13 &amp; 20.
      </Note>
      <Source>365 Data Science, Data Analyst Job Outlook 2026: Trends, Salaries, and Skills · 365datascience.com/career-advice/data-analyst-job-outlook-2025</Source>
    </div>
  </Shell>
)

// ── 19 · Bukti 8: BPS Sakernas ────────────────────────────────────────────────────
const S19 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Bukti 8 dari 10 · Badan Pusat Statistik" />
      <SlideTitle sub="Lembaga statistik resmi pemerintah Indonesia. Konsep ketenagakerjaannya mengikuti standar International Labour Organization — anchor data lokal paling netral yang kita punya.">
        Data ketenagakerjaan Indonesia, langsung dari <span className="text-[#6DC4AA]">sumbernya</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<Landmark size={16} />} title="Kenapa BPS jadi anchor">
          <ul className="space-y-2">
            <Bullet>Tidak menjual apa pun — murni lembaga statistik negara</Bullet>
            <Bullet>Metodologinya mengikuti standar ILO, bisa dibandingkan lintas negara</Bullet>
            <Bullet>Jadi basis proyeksi lembaga lain, termasuk Komdigi di slide berikutnya</Bullet>
          </ul>
        </Panel>
        <Panel icon={<MapPin size={16} />} title="Sakernas" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-400">
            Survei Angkatan Kerja Nasional — sensus rutin BPS yang memetakan struktur angkatan
            kerja Indonesia per golongan umur, sektor, dan wilayah. Data inilah fondasi setiap
            proyeksi kebutuhan talenta digital nasional.
          </p>
        </Panel>
      </div>
      <Note tone="info" className="mt-4">
        Kenapa ini penting buat kamu yang di Indonesia: semua angka global tadi (WEF, BLS, PwC)
        datang dari pasar kerja negara maju. Dua slide berikutnya membawa percakapan ini pulang
        ke konteks lokal.
      </Note>
      <Source>Badan Pusat Statistik, Survei Angkatan Kerja Nasional (Sakernas) — Statistik Ketenagakerjaan · bps.go.id/id/statistics-table/2/Njk4IzI=/angkatan-kerja--ak--menurut-golongan-umur.html</Source>
    </div>
  </Shell>
)

// ── 20 · Bukti 9: Komdigi talent projection ──────────────────────────────────────
const S20 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Bukti 9 dari 10 · Kementerian Komunikasi dan Digital" />
      <SlideTitle sub="Sumber primer pemerintah yang khusus mengukur kesenjangan supply-demand talenta digital Indonesia, dibangun di atas data Sakernas BPS.">
        Data analyst masuk profesi digital yang <span className="text-[#6DC4AA]">paling sulit dicari</span> di Indonesia
      </SlideTitle>
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Stat value="2024–2030" label="Rentang proyeksi" note="Komdigi × basis data Sakernas BPS" />
        <Panel icon={<Users size={16} />} title="Gap yang diukur" className="lg:col-span-2">
          <p className="text-xs text-gray-400">
            Proyeksi ini membandingkan <b className="text-gray-200">supply</b> (lulusan &amp; talenta
            siap kerja) dengan <b className="text-gray-200">demand</b> (kebutuhan riil industri) untuk
            peran-peran digital kunci. Data analyst dan AI engineer konsisten masuk kategori paling
            sulit dipenuhi dari dalam negeri.
          </p>
        </Panel>
      </div>
      <Note tone="info">
        <b className="text-[#6DC4AA]">Dari pengalaman:</b> saat membangun fungsi BI dari nol di
        Boogie Medical, tantangan terbesarnya selalu sama: mencari orang yang bisa memakai tools
        itu untuk masalah nyata perusahaan, sebab tools sendiri gampang dibeli. Data Komdigi ini
        menunjukkan itu bukan pengalaman satu perusahaan saja, melainkan pola yang berulang di
        seluruh negeri.
      </Note>
      <Source>Kementerian Komunikasi dan Digital (Komdigi), Proyeksi Ketersediaan (Supply) dan Kebutuhan (Demand) Talenta Digital Indonesia 2024–2030 · digitalent.komdigi.go.id</Source>
    </div>
  </Shell>
)

// ── 21 · Bukti 10: InfoWorld ──────────────────────────────────────────────────────
const S21 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Bukti 10 dari 10 · InfoWorld" />
      <SlideTitle sub="Media teknologi enterprise dengan editorial jurnalistik (grup Foundry/IDG), bukan blog pemasaran vendor. Artikel penutup paling konkret dari sepuluh sumber ini.">
        Analis sekarang bekerja seperti <span className="text-[#6DC4AA]">me-review kode AI</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<Eye size={16} />} title="Definisi peran baru, versi InfoWorld">
          <p className="text-xs text-gray-400 mb-3">Tiga kata kerja baru yang mendominasi hari kerja seorang analis:</p>
          <ul className="space-y-2">
            <Bullet><b className="text-[#6DC4AA]">Mereview</b> — membaca output AI sebelum dipakai</Bullet>
            <Bullet><b className="text-[#6DC4AA]">Menyempurnakan</b> — memperbaiki bagian yang meleset</Bullet>
            <Bullet><b className="text-[#6DC4AA]">Memvalidasi</b> — memastikan angkanya cocok dengan kenyataan</Bullet>
          </ul>
        </Panel>
        <Panel icon={<GitCompare size={16} />} title="Kaitan langsung dengan pengalaman saya" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-300 leading-relaxed">
            Sebagai software engineer, saya me-review pull request tiap minggu — kode orang lain,
            atau belakangan ini, kode hasil AI. Memvalidasi output analisis dari AI menuntut refleks
            yang persis sama: baca dulu, curigai dulu, baru percaya.
          </p>
        </Panel>
      </div>
      <Note tone="warn" className="mt-4">
        Ini definisi peran paling praktis dari seluruh sesi ini. Kalau kamu cuma ingat satu
        kalimat dari bagian bukti, ingat ini: <b className="text-[#6DC4AA]">analis hari ini
        adalah editor AI, bukan operator manual.</b>
      </Note>
      <Source>InfoWorld, How AI changes the data analyst role · infoworld.com/article/4058946/how-ai-changes-the-data-analyst-role.html</Source>
    </div>
  </Shell>
)

// ── 22 · Sintesis 10 sumber ────────────────────────────────────────────────────────
const S22 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Sintesis" />
      <SlideTitle sub="Sepuluh sumber, satu benang merah: permintaan terhadap skill AI naik tajam, sementara lapangan kerja analis sendiri tidak menyusut. Ia berubah bentuk.">
        Sepuluh sumber, <span className="text-[#6DC4AA]">satu tabel</span>
      </SlideTitle>
      <div className="rounded-2xl border border-[#6DC4AA]/20 overflow-hidden">
        <div className="grid grid-cols-12 bg-[#6DC4AA]/[0.08] text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
          <div className="col-span-3 px-3 py-2">Sumber</div>
          <div className="col-span-5 px-3 py-2">Temuan kunci</div>
          <div className="col-span-4 px-3 py-2">Implikasi</div>
        </div>
        {[
          ['WEF (S12)', 'AI & big data = skill #1 tumbuh tercepat', '39% skill inti berubah pada 2030'],
          ['BLS (S13)', 'Lapangan kerja data scientist +34%', 'Bantahan resmi narasi "AI menghapus analis"'],
          ['McKinsey (S14)', '90% adopsi, 94% belum lihat nilai', 'Celah untuk analis yang mendesain ulang workflow'],
          ['Stanford HAI (S15)', 'Kompilasi data adopsi & produktivitas AI', 'Rujukan akademik untuk riset lanjutan'],
          ['HBR/HBS (S16)', 'AI membentuk ulang kerja kantoran, tidak merata', 'Peran berubah, bukan hilang'],
          ['PwC (S17)', 'Premi upah skill AI naik ke 56%', 'Data + AI = nilai jual paling tinggi'],
          ['365 DS (S18)', 'ETL, governance, cloud jadi standar baru', 'Peta kompetensi teknis yang harus dikuasai'],
          ['BPS (S19)', 'Anchor data ketenagakerjaan Indonesia', 'Basis semua proyeksi lokal'],
          ['Komdigi (S20)', 'Data analyst = talenta paling langka RI', 'Peluang karier konkret di dalam negeri'],
          ['InfoWorld (S21)', 'Analis kini mereview & memvalidasi output AI', 'Definisi praktis peran baru sehari-hari'],
        ].map((r, i) => (
          <div key={r[0]} className={`grid grid-cols-12 border-t border-[#6DC4AA]/12 text-[11px] ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}>
            <div className="col-span-3 px-3 py-2 text-[#6DC4AA] font-medium">{r[0]}</div>
            <div className="col-span-5 px-3 py-2 text-gray-300">{r[1]}</div>
            <div className="col-span-4 px-3 py-2 text-gray-500">{r[2]}</div>
          </div>
        ))}
      </div>
    </div>
  </Shell>
)

// ── 23 · Peta tugas ────────────────────────────────────────────────────────────────
const S23 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Sintesis" />
      <SlideTitle sub="Ini bukan daftar 'aman' vs 'terancam'. Ini peta tugas, karena satu peran yang sama bisa berisi ketiga jenis tugas ini sekaligus.">
        Peta tugas seorang data analyst, <span className="text-[#6DC4AA]">hari ini</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel icon={<ArrowDownRight size={16} />} title="Mulai hilang" className="border-red-500/20 bg-red-500/[0.05]">
          <ul className="space-y-2">
            <Bullet tone="bad">Menulis query eksplorasi dari nol</Bullet>
            <Bullet tone="bad">Membersihkan data yang formatnya sudah dikenal</Bullet>
            <Bullet tone="bad">Menyusun laporan berkala dengan format tetap</Bullet>
            <Bullet tone="bad">Draft pertama sebuah chart atau narasi</Bullet>
          </ul>
        </Panel>
        <Panel icon={<ShieldCheck size={16} />} title="Tetap bertahan">
          <ul className="space-y-2">
            <Bullet>Merumuskan pertanyaan bisnis yang tepat</Bullet>
            <Bullet>Menilai apakah sebuah angka masuk akal</Bullet>
            <Bullet>Mengomunikasikan implikasi ke pengambil keputusan</Bullet>
            <Bullet>Bertanggung jawab penuh atas kesimpulan akhir</Bullet>
          </ul>
        </Panel>
        <Panel icon={<Sparkles size={16} />} title="Baru muncul" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>Menulis prompt analisis yang presisi</Bullet>
            <Bullet>Memvalidasi &amp; mengoreksi output AI</Bullet>
            <Bullet>Merancang workflow yang menyatukan AI dengan proses lama</Bullet>
            <Bullet>Menjaga etika &amp; akurasi data di tengah otomatisasi</Bullet>
          </ul>
        </Panel>
      </div>
      <Note tone="info" className="mt-4">
        Perhatikan kolom tengah: tidak satu pun barisnya berubah sejak sebelum ada AI. Itulah
        fondasi karier paling tahan lama, dan itulah yang akan kita latih di studi kasus bagian 2.
      </Note>
    </div>
  </Shell>
)

// ── 24 · Konteks Indonesia ─────────────────────────────────────────────────────────
const S24 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Konteks lokal" />
      <SlideTitle sub="Menyambungkan data BPS & Komdigi tadi ke satu pertanyaan yang lebih personal: apa artinya semua ini buat kariermu, di pasar kerja Indonesia, sekarang.">
        Apa artinya buat kariermu <span className="text-[#6DC4AA]">di Indonesia</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Panel icon={<Building2 size={16} />} title="Yang terjadi di lapangan">
          <ul className="space-y-2">
            <Bullet>Perusahaan Indonesia mulai bersaing memperebutkan talenta data + AI yang sama</Bullet>
            <Bullet>Banyak perusahaan menengah baru mulai membangun fungsi data dari nol, seperti Boogie Medical dulu</Bullet>
            <Bullet>Lowongan makin sering mensyaratkan familiaritas dengan tools AI, bukan cuma SQL</Bullet>
          </ul>
        </Panel>
        <Panel icon={<Target size={16} />} title="Yang perlu kamu lakukan" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>Jangan tunggu perusahaanmu &ldquo;siap AI&rdquo; — mulai duluan secara personal</Bullet>
            <Bullet>Latih kemampuan validasi, bukan cuma kemampuan bertanya ke AI</Bullet>
            <Bullet>Bangun portofolio yang menunjukkan cara berpikirmu, bukan cuma hasil akhirnya</Bullet>
          </ul>
        </Panel>
      </div>
      <Note tone="warn">
        Kesenjangan yang diukur Komdigi di slide 20 bukan berita buruk kalau kamu melihatnya dari
        sisi yang tepat. Kesenjangan berarti permintaan lebih besar daripada penawaran, dan itu
        selalu berarti daya tawar lebih tinggi buat yang mengisinya.
      </Note>
    </div>
  </Shell>
)

// ── 25 · Jembatan ke bagian 2 ──────────────────────────────────────────────────────
const S25 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Penutup bagian 1" />
      <SlideTitle sub="Dua puluh slide bukti sudah cukup. Sekarang saatnya berpindah dari 'kenapa' ke 'bagaimana' — dan itu yang mengisi seluruh bagian dua sesi ini.">
        Jadi, <span className="text-[#6DC4AA]">bagaimana caranya?</span>
      </SlideTitle>
      <div className="rounded-2xl border border-[#1FA79B]/25 bg-[#1FA79B]/[0.06] p-6 mb-5">
        <div className="flex items-start gap-3">
          <Quote size={20} className="text-[#6DC4AA] shrink-0 mt-1" />
          <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
            Peran data analyst tidak hilang. Yang berubah adalah bagian mana dari pekerjaan itu
            yang kamu kerjakan sendiri, dan bagian mana yang kamu delegasikan ke AI lalu periksa
            ulang hasilnya.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <Panel icon={<Workflow size={16} />} title="Berikutnya: Workflow">
          <p className="text-xs text-gray-400">Tujuh langkah kerja analis, dipetakan ulang untuk era AI.</p>
        </Panel>
        <Panel icon={<MessageSquare size={16} />} title="Lalu: Prompting">
          <p className="text-xs text-gray-400">Cara meminta yang menghasilkan jawaban benar, bukan jawaban meyakinkan.</p>
        </Panel>
        <Panel icon={<Wrench size={16} />} title="Puncaknya: Studi kasus">
          <p className="text-xs text-gray-400">Satu kasus nyata, dari pertanyaan bisnis sampai rekomendasi.</p>
        </Panel>
      </div>
    </div>
  </Shell>
)

// ── 26 · Pembuka bagian 2 ───────────────────────────────────────────────────────────
const S26 = (
  <div className="w-full min-h-full relative overflow-hidden flex items-center">
    <Glow className="top-1/3 right-1/4 w-[650px] h-[420px] bg-[#1FA79B]/18" />
    <Glow className="bottom-0 left-0 w-[450px] h-[380px] bg-[#6DC4AA]/10" />
    <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-12 text-center">
      <div className="inline-flex items-center gap-2 mb-6 border border-[#1FA79B]/30 bg-[#1FA79B]/10 rounded-full px-4 py-1.5">
        <Compass size={14} className="text-[#6DC4AA]" />
        <span className="text-xs font-semibold text-[#D1EDE5]">Bagian 2 dari 3</span>
      </div>
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
        Cara Kerja <span className="bg-gradient-to-r from-[#1FA79B] via-[#6DC4AA] to-[#D1EDE5] bg-clip-text text-transparent">Baru</span>
      </h1>
      <p className="mt-5 text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
        Workflow, prompting, validasi, dan satu studi kasus lengkap dari awal sampai akhir.
        Bagian ini paling bisa langsung kamu praktikkan besok pagi.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
        {['Workflow 7 Langkah', 'Prompting', 'Validasi Output', 'Studi Kasus'].map(t => (
          <span key={t} className="text-xs font-medium text-gray-300 rounded-full border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.08] px-3.5 py-1.5">{t}</span>
        ))}
      </div>
    </div>
  </div>
)

// ── 27 · Workflow 7 langkah ────────────────────────────────────────────────────────
const S27 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Workflow dan Studi Kasus Data Analyst" />
      <SlideTitle sub="Tujuh langkah ini tidak berubah sejak dulu. Yang berubah adalah di titik mana AI ikut bekerja, dan di titik mana kamu tetap harus memegang kendali penuh.">
        Workflow analis, <span className="text-[#6DC4AA]">versi AI-augmented</span>
      </SlideTitle>
      <div className="space-y-2">
        {[
          ['1', 'Rumuskan pertanyaan', 'Manual — AI tidak tahu masalah bisnismu', 'human'],
          ['2', 'Ambil & satukan data', 'AI bisa bantu tulis query & gabungkan sumber', 'ai'],
          ['3', 'Bersihkan & siapkan data', 'AI bisa deteksi anomali & sarankan perbaikan', 'ai'],
          ['4', 'Eksplorasi & analisis', 'AI bisa uji banyak hipotesis dengan cepat', 'ai'],
          ['5', 'Visualisasikan', 'AI bisa bikin draft chart dalam hitungan detik', 'ai'],
          ['6', 'Susun narasi & rekomendasi', 'AI bantu draft, kamu yang menajamkan klaim', 'mixed'],
          ['7', 'Validasi & putuskan', 'Manual — tanggung jawab akhir ada di kamu', 'human'],
        ].map(([no, title, desc, mode]) => (
          <div key={no} className="flex items-center gap-4 rounded-xl border border-[#6DC4AA]/15 bg-[#6DC4AA]/[0.04] px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-[#1FA79B]/15 border border-[#1FA79B]/25 flex items-center justify-center text-[#6DC4AA] font-mono text-xs font-bold shrink-0">
              {no}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white">{title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
            </div>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
              mode === 'human' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25' :
              mode === 'ai' ? 'bg-[#1FA79B]/15 text-[#6DC4AA] border border-[#1FA79B]/25' :
              'bg-white/10 text-gray-300 border border-white/15'
            }`}>
              {mode === 'human' ? 'Kamu' : mode === 'ai' ? 'AI bantu' : 'Bareng'}
            </span>
          </div>
        ))}
      </div>
      <Note tone="info" className="mt-4">
        Langkah 1 dan 7 mengapit semuanya — <b className="text-[#6DC4AA]">selalu</b> dimulai dan
        diakhiri oleh manusia. Lima slide berikutnya membedah langkah 2–7 satu per satu.
      </Note>
    </div>
  </Shell>
)

// ── 28 · Langkah 1–2 ───────────────────────────────────────────────────────────────
const S28 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Langkah 1–2 dari 7" />
      <SlideTitle sub="Pertanyaan yang kabur menghasilkan analisis yang kabur, secepat apa pun AI menjawabnya. Ini langkah yang paling sering dilewatkan terburu-buru.">
        Rumuskan pertanyaan, <span className="text-[#6DC4AA]">baru ambil data</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Panel icon={<XCircle size={16} />} title="Pertanyaan yang terlalu kabur" className="border-red-500/20 bg-red-500/[0.05]">
          <p className="text-sm text-gray-300 italic">&ldquo;Kenapa penjualan turun?&rdquo;</p>
          <Note tone="warn" className="mt-3">AI akan menjawab dengan asumsi sendiri soal periode, region, dan produk yang dimaksud.</Note>
        </Panel>
        <Panel icon={<CheckCircle2 size={16} />} title="Pertanyaan yang siap dieksekusi" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-sm text-gray-200">&ldquo;Penjualan Juni turun 12% dibanding Mei. Region mana penyumbang penurunan terbesar, dan apakah polanya sama di semua kategori produk?&rdquo;</p>
        </Panel>
      </div>
      <Panel icon={<Database size={16} />} title="Baru setelah itu: ambil & satukan data">
        <p className="text-xs text-gray-400 mb-3">Di sinilah AI mulai berguna — menulis query gabungan dari beberapa tabel jauh lebih cepat daripada mengetiknya manual.</p>
        <Sql>{`SELECT o.region, p.category,
       SUM(o.revenue) AS revenue_juni
FROM orders o
JOIN products p ON p.product_id = o.product_id
WHERE o.order_date BETWEEN '2026-06-01' AND '2026-06-30'
GROUP BY o.region, p.category;`}</Sql>
      </Panel>
      <Note tone="info" className="mt-4">
        <b className="text-[#6DC4AA]">Kebiasaan yang layak dibangun:</b> tulis pertanyaanmu dalam
        satu kalimat lengkap sebelum membuka AI. Kalau kalimat itu masih bisa ditafsirkan lebih
        dari satu cara, perbaiki dulu sebelum lanjut.
      </Note>
    </div>
  </Shell>
)

// ── 29 · Langkah 3–4 ───────────────────────────────────────────────────────────────
const S29 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Langkah 3–4 dari 7" />
      <SlideTitle sub="AI unggul menemukan pola dalam data yang sudah bersih. Tapi 'bersih' menurut AI dan 'bersih' menurut konteks bisnismu bisa jadi dua hal berbeda.">
        Bersihkan data, lalu <span className="text-[#6DC4AA]">jelajahi polanya</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<Filter size={16} />} title="Yang bisa kamu delegasikan ke AI">
          <ul className="space-y-2">
            <Bullet>Deteksi nilai yang hilang, duplikat, atau format tidak konsisten</Bullet>
            <Bullet>Saran penanganan outlier berdasarkan distribusi data</Bullet>
            <Bullet>Uji cepat banyak hipotesis: &ldquo;coba pecah per kategori, per region, per kohort&rdquo;</Bullet>
          </ul>
        </Panel>
        <Panel icon={<AlertTriangle size={16} />} title="Yang wajib kamu putuskan sendiri" className="border-amber-500/20 bg-amber-500/[0.05]">
          <ul className="space-y-2">
            <Bullet tone="bad">Apakah transaksi Rp0 itu data rusak, atau memang promo gratis?</Bullet>
            <Bullet tone="bad">Apakah outlier itu kesalahan input, atau justru pelanggan terbesarmu?</Bullet>
            <Bullet tone="bad">Apakah &ldquo;region kosong&rdquo; berarti data hilang, atau transaksi online tanpa region?</Bullet>
          </ul>
        </Panel>
      </div>
      <Note tone="warn" className="mt-4">
        AI akan selalu memilih penanganan yang <i>paling umum secara statistik</i>. Konteks
        bisnismu yang menentukan apakah pilihan umum itu benar untuk kasusmu.
      </Note>
    </div>
  </Shell>
)

// ── 30 · Langkah 5–6 ───────────────────────────────────────────────────────────────
const S30 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Langkah 5–6 dari 7" />
      <SlideTitle sub="Chart pertama dari AI hampir selalu benar secara teknis dan meleset secara pesan. Tugasmu di sini menajamkan, bukan cuma merapikan warna.">
        Visualisasi &amp; narasi: <span className="text-[#6DC4AA]">draft AI, edit kamu</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<LineChart size={16} />} title="Draft pertama dari AI" className="border-amber-500/20 bg-amber-500/[0.05]">
          <p className="text-xs text-gray-400 mb-2">&ldquo;Tunjukkan tren penjualan per bulan.&rdquo;</p>
          <div className="rounded-lg bg-[#0b1220] border border-white/10 p-3">
            <div className="text-[10px] text-gray-500 mb-2">Sumbu Y dimulai dari 8.000.000</div>
            <div className="flex items-end gap-1.5 h-16">
              {[62, 58, 65, 60, 55, 50].map((h, i) => (
                <div key={i} className="flex-1 bg-red-400/50 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-red-300/80 mt-2">Penurunan terlihat dramatis — padahal sumbu-Y dipotong, bukan mulai dari nol.</p>
        </Panel>
        <Panel icon={<CheckCircle2 size={16} />} title="Setelah kamu koreksi" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-400 mb-2">Sumbu-Y diminta mulai dari nol, konteks ditambahkan</p>
          <div className="rounded-lg bg-[#0b1220] border border-white/10 p-3">
            <div className="text-[10px] text-gray-500 mb-2">Sumbu Y dimulai dari 0</div>
            <div className="flex items-end gap-1.5 h-16">
              {[38, 36, 39, 37, 35, 33].map((h, i) => (
                <div key={i} className="flex-1 bg-[#6DC4AA]/60 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-[#6DC4AA]/90 mt-2">Penurunannya nyata, tapi proporsional — jujur ke audiens.</p>
        </Panel>
      </div>
      <Note tone="warn" className="mt-4">
        Ini bukan AI &ldquo;berbohong&rdquo;. Default chart library sering memotong sumbu-Y demi
        keterbacaan angka kecil. Tugasmu mengecek setiap default sebelum chart itu tampil di depan bos.
      </Note>
    </div>
  </Shell>
)

// ── 31 · Langkah 7 ─────────────────────────────────────────────────────────────────
const S31 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Langkah 7 dari 7 · Yang paling penting" />
      <SlideTitle sub="Kalau kamu cuma punya waktu melatih satu skill dari seluruh workflow ini, latih yang satu ini. Semua langkah sebelumnya bisa dipercepat AI — langkah ini tidak boleh.">
        Validasi sebelum <span className="text-[#6DC4AA]">kamu tekan &ldquo;kirim&rdquo;</span>
      </SlideTitle>
      <div className="rounded-2xl border border-[#1FA79B]/25 bg-[#1FA79B]/[0.06] overflow-hidden">
        <div className="bg-[#1FA79B]/[0.1] px-4 py-2.5 flex items-center gap-2 border-b border-[#1FA79B]/20">
          <ClipboardCheck size={14} className="text-[#6DC4AA]" />
          <span className="text-xs font-semibold text-[#D1EDE5] uppercase tracking-wider">Checklist validasi sebelum presentasi</span>
        </div>
        <div className="p-4 grid sm:grid-cols-2 gap-2.5">
          {[
            'Total di chart cocok dengan total mentah di sumber data?',
            'Semua kolom yang dipakai memang ada di skema, bukan karangan AI?',
            'Angka anehnya sudah dicek manual, bukan diasumsikan benar?',
            'Periode waktu & filter sudah sesuai pertanyaan awal?',
            'Ada baris/kategori yang diam-diam hilang dari hasil akhir?',
            'Kalau ditanya "kenapa angkanya begini", kamu bisa jawab tanpa buka AI lagi?',
          ].map(item => (
            <div key={item} className="flex items-start gap-2.5 text-xs text-gray-300 rounded-lg bg-white/[0.03] px-3 py-2.5">
              <CheckCircle2 size={14} className="text-[#6DC4AA] mt-0.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <Note tone="warn" className="mt-4">
        Pertanyaan terakhir di checklist itu yang paling keras. Kalau jawabanmu &ldquo;saya harus
        buka AI lagi untuk jelaskan&rdquo;, artinya kamu belum benar-benar memvalidasi — kamu baru
        menyalin.
      </Note>
    </div>
  </Shell>
)

// ── 32 · Prompting: anatomi ────────────────────────────────────────────────────────
const S32 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Belajar Menggunakan AI untuk Analisis Data" />
      <SlideTitle sub="Prompt analisis yang baik punya struktur yang bisa diulang. Empat bagian ini paling menentukan apakah AI menjawab tepat sasaran atau menebak-nebak.">
        Anatomi prompt analisis yang <span className="text-[#6DC4AA]">bagus</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-2 gap-4">
        <Panel icon={<Target size={16} />} title="1 · Konteks bisnis">
          <p className="text-xs text-gray-400">Apa yang sedang terjadi, kenapa kamu bertanya, siapa yang akan pakai jawabannya.</p>
        </Panel>
        <Panel icon={<Database size={16} />} title="2 · Skema data">
          <p className="text-xs text-gray-400">Nama tabel &amp; kolom yang sesungguhnya ada — jangan biarkan AI menebak struktur datamu.</p>
        </Panel>
        <Panel icon={<ShieldAlert size={16} />} title="3 · Batasan">
          <p className="text-xs text-gray-400">Periode waktu, filter yang wajib, dan hal yang harus diabaikan.</p>
        </Panel>
        <Panel icon={<FileText size={16} />} title="4 · Format keluaran">
          <p className="text-xs text-gray-400">Tabel, ringkasan, atau kode? Sebutkan supaya tidak perlu bolak-balik minta ulang.</p>
        </Panel>
      </div>
      <Note tone="info" className="mt-4">
        Empat bagian ini tidak harus panjang — cukup satu-dua kalimat masing-masing. Yang penting
        semuanya ada, bukan seberapa elegan kalimatnya.
      </Note>
    </div>
  </Shell>
)

// ── 33 · Prompting: before & after ───────────────────────────────────────────────
const S33 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Prompting" />
      <SlideTitle sub="Prompt lemah menghasilkan jawaban yang terdengar percaya diri tapi salah asumsi. Prompt kuat menyempitkan ruang AI untuk menebak.">
        Prompt lemah vs <span className="text-[#6DC4AA]">prompt kuat</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<XCircle size={16} />} title="Lemah" className="border-red-500/20 bg-red-500/[0.05]">
          <p className="text-xs text-gray-300 italic mb-3">&ldquo;Analisis data penjualan saya dan kasih insight.&rdquo;</p>
          <ul className="space-y-2">
            <Bullet tone="bad">Tidak jelas tabel/kolom mana yang dimaksud</Bullet>
            <Bullet tone="bad">&ldquo;Insight&rdquo; tidak punya definisi — AI akan menebak</Bullet>
            <Bullet tone="bad">Tidak ada periode waktu</Bullet>
          </ul>
        </Panel>
        <Panel icon={<CheckCircle2 size={16} />} title="Kuat" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-200 mb-3">
            &ldquo;Dari tabel <span className="font-mono text-[#6DC4AA]">orders</span> (kolom: order_date,
            region, revenue), hitung total revenue per region untuk Q2 2026. Urutkan dari terendah.
            Tunjukkan sebagai tabel, lalu sebutkan satu region yang paling perlu diperhatikan
            dan alasannya berdasarkan angka.&rdquo;
          </p>
          <ul className="space-y-2">
            <Bullet>Tabel &amp; kolom eksplisit</Bullet>
            <Bullet>Periode &amp; urutan output ditentukan</Bullet>
            <Bullet>Minta alasan, bukan cuma kesimpulan</Bullet>
          </ul>
        </Panel>
      </div>
      <Note tone="info" className="mt-4">
        Trik sederhana: minta AI menyertakan <b className="text-[#6DC4AA]">query atau langkah
        perhitungannya</b>, bukan cuma hasil akhir. Kalau kamu tidak bisa membaca langkahnya,
        kamu tidak akan bisa memvalidasinya di langkah 7.
      </Note>
    </div>
  </Shell>
)

// ── 34 · Validasi: menangkap AI mengarang ────────────────────────────────────────
const S34 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Validasi" />
      <SlideTitle sub="AI tidak pernah bilang 'saya tidak yakin'. Ia menjawab dengan nada percaya diri yang sama, entah jawabannya benar atau mengarang. Ini lima cara menangkapnya.">
        Cara menangkap AI yang <span className="text-[#6DC4AA]">mengarang</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-2 gap-3.5">
        {[
          [<FileSearch size={16} key="1" />, 'Minta ia tunjukkan sumbernya', 'Kolom, baris, atau query mana yang menghasilkan angka itu? Kalau tidak bisa ditunjuk, curigai.'],
          [<Sigma size={16} key="2" />, 'Cocokkan dengan total mentah', 'Jumlahkan manual angka kecil, bandingkan dengan klaim total dari AI.'],
          [<ScanSearch size={16} key="3" />, 'Cek nama kolom benar-benar ada', 'AI kadang "mengingat" nama kolom dari dataset lain yang mirip.'],
          [<Percent size={16} key="4" />, 'Curigai angka yang terlalu rapi', '"Naik tepat 20%" di data nyata jarang setepat itu.'],
        ].map(([icon, title, body]) => (
          <Panel key={title as string} icon={icon as React.ReactNode} title={title as string}>
            <p className="text-xs text-gray-400">{body as string}</p>
          </Panel>
        ))}
      </div>
      <Note tone="warn" className="mt-4">
        <b>Istilah teknisnya &ldquo;halusinasi&rdquo;:</b> AI menghasilkan jawaban yang terdengar
        masuk akal secara bahasa, tapi tidak berbasis data sungguhan. Ini bukan bug yang bisa
        dihilangkan sepenuhnya — ini sifat dasar cara kerja model bahasa, dan alasan kenapa langkah
        validasi tidak pernah opsional.
      </Note>
    </div>
  </Shell>
)

// ── 35 · Studi kasus part 1 ───────────────────────────────────────────────────────
const S35 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Hands-On Workshop · Bagian 1" />
      <SlideTitle sub="Satu kasus, dari pertanyaan bos sampai keputusan. Ikuti tiap langkahnya — ini kerangka yang sama persis dengan workflow 7 langkah di slide 27.">
        Studi kasus: <span className="text-[#6DC4AA]">kenapa retensi pelanggan turun?</span>
      </SlideTitle>
      <div className="rounded-2xl border border-[#6DC4AA]/20 bg-[#0b1220]/60 p-5 mb-4">
        <div className="flex items-start gap-3">
          <MessageSquare size={18} className="text-[#6DC4AA] shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Pertanyaan dari bos</div>
            <p className="text-sm text-gray-200">&ldquo;Retensi pelanggan bulanan kita turun dari 82% ke 74% dalam tiga bulan terakhir. Cari tahu penyebabnya sebelum rapat direksi hari Jumat.&rdquo;</p>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<Target size={16} />} title="Langkah 1 · Pertanyaan yang diperjelas">
          <p className="text-xs text-gray-300">&ldquo;Segmen pelanggan mana yang retensinya turun paling tajam, dan apakah penurunannya lebih terkait harga, kualitas layanan, atau munculnya kompetitor baru?&rdquo;</p>
        </Panel>
        <Panel icon={<Bot size={16} />} title="Langkah 2–4 · Prompt ke AI" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <Sql>{`SELECT customer_segment,
       DATE_TRUNC('month', order_date) AS bulan,
       COUNT(DISTINCT customer_id) AS pelanggan_aktif
FROM orders
WHERE order_date >= '2026-03-01'
GROUP BY customer_segment, bulan
ORDER BY bulan;`}</Sql>
        </Panel>
      </div>
      <div className="mt-4">
        <DataTable
          caption="Hasil awal — retensi per segmen"
          columns={['segment', 'April', 'Mei', 'Juni', 'perubahan']}
          rows={[
            ['Enterprise', '89%', '88%', '87%', '-2 pts'],
            ['SMB', '84%', '76%', '65%', '-19 pts'],
            ['Individu', '78%', '77%', '76%', '-2 pts'],
          ]}
          highlightCol={3}
        />
      </div>
      <Note tone="info" className="mt-4">
        Pola sudah terlihat: penurunan retensi hampir seluruhnya berasal dari satu segmen. Lanjut
        ke slide berikutnya untuk mencari tahu kenapa, dan bagaimana ini berujung jadi rekomendasi.
      </Note>
    </div>
  </Shell>
)

// ── 36 · Studi kasus part 2 ───────────────────────────────────────────────────────
const S36 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Hands-On Workshop · Bagian 2" />
      <SlideTitle sub="Angka mentah bukan jawaban. Langkah 5–7 mengubah tabel di slide sebelumnya jadi satu rekomendasi yang bisa dibawa ke rapat direksi hari Jumat.">
        Dari tabel ke <span className="text-[#6DC4AA]">rekomendasi</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Panel icon={<Search size={16} />} title="Langkah 5–6 · Gali lebih dalam segmen SMB">
          <p className="text-xs text-gray-400 mb-2">Prompt lanjutan ke AI, mengarahkan ke satu segmen yang mencurigakan:</p>
          <p className="text-xs text-gray-300 italic">&ldquo;Khusus segmen SMB, bandingkan pelanggan yang churn vs bertahan: apakah ada perbedaan pola di harga paket, jumlah tiket support, atau tanggal mulai berlangganan?&rdquo;</p>
        </Panel>
        <Panel icon={<Eye size={16} />} title="Temuan setelah divalidasi manual" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>Pelanggan SMB yang churn 3× lebih sering membuka tiket support</Bullet>
            <Bullet>73% dari mereka mulai berlangganan tepat setelah kompetitor baru meluncurkan paket serupa lebih murah</Bullet>
            <Bullet>Dicek manual ke sistem tiket asli — polanya konsisten, bukan kebetulan statistik</Bullet>
          </ul>
        </Panel>
      </div>
      <div className="rounded-2xl border border-[#1FA79B]/30 bg-[#1FA79B]/[0.09] p-5 mb-4">
        <div className="text-[10px] uppercase tracking-widest text-[#6DC4AA] mb-2">Rekomendasi untuk rapat direksi</div>
        <p className="text-sm text-gray-200 leading-relaxed">
          Penurunan retensi terkonsentrasi di segmen SMB, dipicu kombinasi layanan support yang
          lambat dan tekanan harga dari kompetitor baru. Rekomendasi: prioritaskan perbaikan SLA
          support untuk SMB dalam 30 hari, dan evaluasi ulang struktur harga paket menengah.
        </p>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <Stat value="~45 mnt" label="Waktu pengerjaan dengan AI" note="dari pertanyaan sampai rekomendasi" />
        <Stat value="~1–2 hari" label="Estimasi cara lama" note="query manual, cross-check manual" />
        <Stat value="100%" label="Tetap divalidasi manusia" note="setiap klaim dicek ke sumber asli" />
      </div>
    </div>
  </Shell>
)

// ── 37 · Kompetensi yang dicari ───────────────────────────────────────────────────
const S37 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Mengenal Kompetensi Data Analyst yang Dicari Perusahaan" />
      <SlideTitle sub="Disarikan dari lowongan kerja nyata (365 Data Science), proyeksi talenta (Komdigi), dan premi upah (PwC) yang sudah kita bahas. Tiga lapis kompetensi, bukan satu daftar panjang.">
        Kompetensi yang dicari perusahaan <span className="text-[#6DC4AA]">di 2026</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel icon={<Database size={16} />} title="Fondasi teknis">
          <ul className="space-y-2">
            <Bullet>SQL &amp; pemodelan data</Bullet>
            <Bullet>ETL &amp; data governance</Bullet>
            <Bullet>Cloud platform (BigQuery, Snowflake, dsb.)</Bullet>
            <Bullet>Visualisasi (Power BI, Tableau, dsb.)</Bullet>
          </ul>
        </Panel>
        <Panel icon={<Bot size={16} />} title="Literasi AI" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>Menulis prompt analisis yang presisi</Bullet>
            <Bullet>Memvalidasi &amp; mengoreksi output AI</Bullet>
            <Bullet>Tahu kapan <i>tidak</i> memakai AI</Bullet>
            <Bullet>Merancang workflow AI + proses lama</Bullet>
          </ul>
        </Panel>
        <Panel icon={<MessageSquare size={16} />} title="Kompetensi bisnis">
          <ul className="space-y-2">
            <Bullet>Merumuskan pertanyaan yang tepat</Bullet>
            <Bullet>Komunikasi ke non-teknis</Bullet>
            <Bullet>Penilaian &amp; tanggung jawab keputusan</Bullet>
            <Bullet>Empati terhadap konteks industri</Bullet>
          </ul>
        </Panel>
      </div>
      <Note tone="info" className="mt-4">
        Lapisan tengah adalah yang paling baru dan paling langka. Kalau kamu sudah kuat di lapisan
        kiri dan kanan, lapisan tengah inilah investasi belajar dengan hasil tercepat.
      </Note>
    </div>
  </Shell>
)

// ── 38 · Portofolio ────────────────────────────────────────────────────────────────
const S38 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Membangun Portofolio Proyek Data Analyst Berbasis AI" />
      <SlideTitle sub="Recruiter membuka puluhan portofolio sehari. Yang membuat mereka berhenti scroll bukan dataset yang eksotis, tapi cara berpikir yang terlihat jelas dari awal sampai akhir.">
        Portofolio yang bikin recruiter <span className="text-[#6DC4AA]">berhenti scroll</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Panel icon={<XCircle size={16} />} title="Portofolio yang tenggelam" className="border-red-500/20 bg-red-500/[0.05]">
          <ul className="space-y-2">
            <Bullet tone="bad">Dataset tutorial (Titanic, Iris) tanpa konteks bisnis</Bullet>
            <Bullet tone="bad">Cuma screenshot dashboard, tanpa cerita di baliknya</Bullet>
            <Bullet tone="bad">Prompt AI ditampilkan tanpa proses validasi</Bullet>
          </ul>
        </Panel>
        <Panel icon={<CheckCircle2 size={16} />} title="Portofolio yang menonjol" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>Masalah bisnis nyata (boleh studi kasus publik/simulasi)</Bullet>
            <Bullet>Menunjukkan proses: pertanyaan → prompt → validasi → rekomendasi</Bullet>
            <Bullet>Ada bagian &ldquo;di sini AI salah, ini cara saya menangkapnya&rdquo;</Bullet>
          </ul>
        </Panel>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <Panel icon={<Rocket size={16} />} title="Ide proyek 1">
          <p className="text-xs text-gray-400">Bedah data publik (BPS, Kaggle) jadi rekomendasi bisnis, lengkap dengan log prompt &amp; koreksi.</p>
        </Panel>
        <Panel icon={<Rocket size={16} />} title="Ide proyek 2">
          <p className="text-xs text-gray-400">Bangun dashboard otomatis dengan AI, lalu tulis dokumentasi cara kamu memvalidasi tiap angkanya.</p>
        </Panel>
        <Panel icon={<Rocket size={16} />} title="Ide proyek 3">
          <p className="text-xs text-gray-400">Reproduksi salah satu studi kasus hari ini dengan datasetmu sendiri, lalu bandingkan hasilnya.</p>
        </Panel>
      </div>
    </div>
  </Shell>
)

// ── 39 · Rencana 90 hari ──────────────────────────────────────────────────────────
const S39 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Rencana aksi" />
      <SlideTitle sub="Tidak perlu menguasai semuanya minggu ini. Tiga fase, sembilan puluh hari, satu portofolio siap dipamerkan di ujungnya.">
        Rencana aksi <span className="text-[#6DC4AA]">90 hari</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        <Panel icon={<Calendar size={16} />} title="Hari 1–30">
          <ul className="space-y-2">
            <Bullet>Kuatkan SQL &amp; satu tool visualisasi</Bullet>
            <Bullet>Mulai pakai AI harian untuk tugas analisis kecil</Bullet>
            <Bullet>Bangun kebiasaan checklist validasi (slide 31)</Bullet>
          </ul>
        </Panel>
        <Panel icon={<Calendar size={16} />} title="Hari 31–60" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>Pilih satu ide proyek portofolio (slide 38)</Bullet>
            <Bullet>Latih prompting terstruktur (slide 32–33)</Bullet>
            <Bullet>Minta feedback dari analis lain atas hasilmu</Bullet>
          </ul>
        </Panel>
        <Panel icon={<Calendar size={16} />} title="Hari 61–90">
          <ul className="space-y-2">
            <Bullet>Selesaikan &amp; dokumentasikan proyek portofolio</Bullet>
            <Bullet>Publikasikan (LinkedIn, GitHub, atau blog pribadi)</Bullet>
            <Bullet>Mulai melamar / ajukan proyek serupa di tempat kerjamu</Bullet>
          </ul>
        </Panel>
      </div>
      <div className="rounded-2xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.06] p-5">
        <div className="text-[10px] uppercase tracking-widest text-[#6DC4AA] mb-3">Enam hal untuk diingat</div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {[
            'Peran data analyst tidak hilang; bagian yang kamu kerjakan sendiri yang berubah',
            'AI menekan biaya mencoba — manfaatkan untuk iterasi, bukan cuma kecepatan',
            'Adopsi AI perusahaan menuntut workflow yang dirancang ulang, bukan ditempel',
            'Skill Data + AI kini punya premi upah nyata, bukan sekadar tren',
            'Validasi adalah satu-satunya langkah yang tidak boleh didelegasikan',
            'Portofolio yang menonjol menunjukkan cara berpikir, bukan cuma hasil akhir',
          ].map(t => (
            <div key={t} className="flex items-start gap-2.5 text-xs text-gray-300">
              <CheckCircle2 size={13} className="text-[#6DC4AA] mt-0.5 shrink-0" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Shell>
)

// ── 40 · Penutup ───────────────────────────────────────────────────────────────────
const S40 = (
  <Shell>
    <div className={WRAP}>
      <div className="text-center mb-8">
        <CoBrand className="justify-center mb-6" />
        <Tag label="Penutup" />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center tracking-tight leading-tight">
          Sekarang giliran <span className="text-[#6DC4AA]">kamu</span> bertanya
        </h2>
        <p className="text-center text-gray-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Sesi tanya jawab langsung — bawa pertanyaan tersulitmu, termasuk yang menantang klaim di deck ini.
        </p>
      </div>
      <div className="rounded-2xl border border-[#6DC4AA]/20 p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={14} className="text-[#6DC4AA]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6DC4AA]">Sepuluh sumber sesi ini</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] text-gray-400">
          {[
            'WEF — The Future of Jobs Report 2025',
            'U.S. BLS — Occupational Outlook Handbook',
            'McKinsey — The State of AI 2025',
            'Stanford HAI — AI Index Report 2026',
            'HBR / HBS — How AI Is Changing the Labor Market',
            'PwC — Global AI Jobs Barometer 2025',
            '365 Data Science — Data Analyst Job Outlook 2026',
            'BPS — Survei Angkatan Kerja Nasional (Sakernas)',
            'Komdigi — Proyeksi Talenta Digital Indonesia 2024–2030',
            'InfoWorld — How AI changes the data analyst role',
          ].map((s, i) => (
            <div key={s} className="flex items-start gap-2">
              <span className="text-gray-600 font-mono shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1FA79B]/30 bg-[#1FA79B]/10 px-5 py-2.5">
          <Sparkles size={15} className="text-[#6DC4AA]" />
          <span className="text-sm text-[#D1EDE5] font-medium">M Khairul Hamid, SE. — Senior Software Engineer</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.08] px-5 py-2.5">
          <HelpCircle size={15} className="text-[#6DC4AA]" />
          <span className="text-sm text-gray-300">Terima kasih — Talentiv × Ditekindo</span>
        </div>
      </div>
    </div>
  </Shell>
)

export const practicalDataAnalystAi: Presentation = {
  id: 'practical-data-analyst-and-ai',
  program: 'Webinar · Talentiv × Ditekindo',
  session: 'Special Session',
  title: 'Practical Data Analyst & AI',
  subtitle: 'Peran data analyst tidak hilang; isinya yang berubah. Sesi ini membedah peran barunya, cara kerjanya, dan cara memakai AI untuk analisis yang sesungguhnya.',
  durationMin: 120,
  slides: [
    { label: 'Pembuka', render: S01, notes: `SELAMAT DATANG. Webinar kolaborasi Talentiv × Ditekindo.\n• Sapa peserta, minta sebut kota + role di chat — kalibrasi audiens.\n• Tunjuk panel kanan: "Ini seluruh isi webinar dalam satu gambar." Pertanyaan bisnis → AI bikin query → hasil → TAPI kamu yang memvalidasi.\n• Janji: 120 menit, 40 slide, semua klaim ada sumbernya.\n⏱️ ~3 menit.` },
    { label: 'Perkenalan', render: S02, notes: `PERKENALAN — jangan lebih dari 4 menit, dan jangan terdengar pamer.\n• Framing: "Saya perkenalkan diri bukan untuk mengesankan, tapi supaya kamu tahu materi ini datang dari mana."\n• Tiga sudut pandang: pembuat sistem (Nomni/BIPO), pembuat laporan (Boogie BI), penunggu laporan (System Analyst).\n• Poin paling penting ada di Note bawah — baca pelan.\n⏱️ ~4 menit.` },
    { label: 'Rekam jejak', render: S03, notes: `KONTEKS SKALA — cepat saja, ~2 menit.\n• Frame ulang: "Angka ini bukan prestasi saya, ini ukuran masalah yang akan kita pakai jadi contoh."\n• Sorot satu pelajaran: sistem besar diganti sepotong-sepotong → ini analogi adopsi AI di slide 25.\n• Kalimat kunci: "Board tidak pernah minta query. Mereka minta keputusan."` },
    { label: 'Agenda', render: S04, notes: `AGENDA — 8 key point webinar.\n• Baca cepat, jangan satu-satu. Tunjuk 3 blok bagian di bawah.\n• Tanya di chat: "Nomor berapa yang paling kamu tunggu?" — pakai jawabannya untuk mengatur tempo nanti.\n⏱️ ~2 menit.` },
    { label: 'Janji sesi', render: S05, notes: `KONTRAK BELAJAR.\n• Kolom kiri = hasil belajar. Baca sebagai janji, bukan daftar.\n• Kolom "yang TIDAK kita lakukan" penting — ini yang membedakan sesi ini dari konten AI-hype.\n• Tegaskan: setiap angka ada badge sumber. Undang mereka mengecek.` },
    { label: 'Hook', render: S06, notes: `MOMEN HOOK — pelan, beri jeda.\n• Tanya kelas DULU sebelum buka jawaban: "Menurut kamu, ya atau tidak?" Baca chat.\n• Bongkar dua jawaban salah, lalu jawaban jujur: AI menggantikan TUGAS, bukan PERAN.\n• PUNCHLINE ada di Note bawah — bacakan utuh dan beri jeda 3 detik: bukan digantikan AI, tapi digantikan analis lain yang memakai AI.\n⏱️ ~5 menit. Ini slide paling penting di bagian 1.` },
    { label: '4 alasan perubahan', render: S07, notes: `OVERVIEW 4 POIN — ini kerangka dari pertanyaan inti webinar.\n• Baca keempatnya cepat; jangan bahas dalam — 4 slide berikutnya membedah masing-masing.\n• Tunjuk pola di Note: 3 poin pertama menekan, poin ke-4 membuka.\n• Bilang: "Slide 12–21 nanti isinya bukti. Kalau kamu skeptis, tahan dulu."` },
    { label: 'Poin 1 · Kecepatan', render: S08, notes: `POIN 1 — AI mempercepat analisis.\n• Insight utama BUKAN kecepatan, tapi turunnya BIAYA MENCOBA → berani 20 hipotesis, bukan 2.\n• Telusuri kolom paling kanan tabel: "siapa yang tetap memutuskan" — jawabannya selalu KAMU. Ini benang merah seluruh webinar.\n• Cerita Boogie Medical: yang berubah adalah hilangnya jeda pertanyaan→jawaban.\n• Jangan lewatkan kotak jebakan: cepat salah tetap salah.` },
    { label: 'Poin 2 · Otomatisasi KPI', render: S09, notes: `POIN 2 — banyak KPI manual diotomatisasi.\n• Ajak kelas identifikasi: "KPI apa di kerjaanmu yang paling rutin?" — cek dengan 4 ciri di panel kiri.\n• Tekankan panel kanan sama pentingnya — ini bukan slide "AI menang telak".\n• Cerita BIPO: satu pertanyaan yang tidak bisa dihitung mesin adalah yang bertahan.` },
    { label: 'Poin 3 · Perusahaan butuh AI-literate', render: S10, notes: `POIN 3 — perusahaan butuh analis yang pakai AI.\n• Bongkar dulu miskonsepsi (panel kiri) — biasanya ini yang dibayangkan peserta soal "kerja dengan AI".\n• Panel kanan lebih penting: paham proses bisnis > jago prompt.\n• Cerita Nomni: integrasi M&A = redesign alur, bukan pasang alat.` },
    { label: 'Poin 4 · Premi skill', render: S11, notes: `POIN 4 — skill Data + AI.\n• Diagram Venn: biarkan kelas menebak dulu apa isi bagian tengah sebelum kamu bacakan.\n• Tiga kartu bawah: baca berurutan kiri→kanan, tekankan kartu ketiga adalah tujuan sesi ini.\n• Sambungkan ke slide 17 (PwC) untuk data konkretnya nanti.` },
    { label: 'Bukti · WEF', render: S12, notes: `BUKTI 1/10 — WEF.\n• Tekankan skala survei: 1.000+ perusahaan, 14 juta pekerja, 55 negara — ini bukan sampel kecil.\n• Bar chart kiri ilustratif (baca disclaimer di bawahnya), angka 39% di kanan yang benar-benar dikutip resmi.\n• Transisi: "Ini baru satu sumber. Sembilan lagi menyusul, dan makin spesifik."` },
    { label: 'Bukti · BLS', render: S13, notes: `BUKTI 2/10 — BLS.\n• Angka +34% adalah PUNCHLINE slide ini — beri jeda setelah menyebutkannya.\n• Tekankan netralitas sumber: pemerintah AS, bukan vendor, bukan lembaga riset berbayar.\n• Callback ke slide 6 (hook) — ini salah satu bukti langsung yang menjawab hook di awal.` },
    { label: 'Bukti · McKinsey', render: S14, notes: `BUKTI 3/10 — McKinsey. SLIDE PENTING, jangan buru-buru.\n• Dua angka (90% vs 94%) sengaja diletakkan berdampingan — biarkan kontrasnya terasa dulu sebelum dijelaskan.\n• Insight kunci ada di Panel: "workflow dirancang ulang" — ini bahasa paling penting untuk dipahami kelas.\n• Cerita Nomni menguatkan; Note terakhir adalah ajakan langsung ke peserta.` },
    { label: 'Bukti · Stanford HAI', render: S15, notes: `BUKTI 4/10 — Stanford HAI.\n• Ini slide "rujukan", bukan slide angka besar. Sampaikan sebagai sumber yang layak mereka bookmark sendiri.\n• Jangan mengarang angka spesifik dari laporan ini — arahkan mereka mengecek langsung karena datanya diperbarui tiap tahun.` },
    { label: 'Bukti · HBR/HBS', render: S16, notes: `BUKTI 5/10 — HBR/HBS. Salah satu slide paling penting.\n• Ini riset yang paling akademik dan paling relevan dengan tesis utama webinar.\n• Baca Note terakhir dengan tekanan — dorong mereka screenshot slide ini kalau perlu.` },
    { label: 'Bukti · PwC', render: S17, notes: `BUKTI 6/10 — PwC.\n• Bar chart 25%→56%: beri jeda di antara dua bar, biarkan lonjakannya terasa.\n• Tekankan ini data primer dari lowongan kerja nyata, bukan survei opini.\n• Sambungkan balik ke slide 11 (diagram Venn Data+AI).` },
    { label: 'Bukti · 365 DS', render: S18, notes: `BUKTI 7/10 — 365 Data Science.\n• PENTING: baca box "Catatan sumber" dengan jujur — ini momen mengajarkan kelas cara menilai kredibilitas sumber, bukan cuma menerima angka mentah.\n• Empat kartu kompetensi: tanya kelas mana yang paling asing buat mereka.` },
    { label: 'Bukti · BPS', render: S19, notes: `BUKTI 8/10 — BPS Sakernas.\n• Ini slide transisi ke konteks lokal — nada bicara berubah dari global ke Indonesia.\n• Tekankan independensi BPS: tidak jualan apa pun, basis semua proyeksi lain.` },
    { label: 'Bukti · Komdigi', render: S20, notes: `BUKTI 9/10 — Komdigi.\n• Ini slide paling relevan secara emosional buat peserta Indonesia — beri waktu lebih.\n• Cerita Boogie Medical menutup dengan kuat: kesulitan mencari orang, bukan mencari tools.` },
    { label: 'Bukti · InfoWorld', render: S21, notes: `BUKTI 10/10 — InfoWorld. Penutup bagian bukti, buat berkesan.\n• Tiga kata kerja (review, sempurnakan, validasi) — minta kelas ulangi bareng-bareng.\n• Cerita pull request adalah momen paling personal di seluruh sesi — sampaikan pelan, ini pengalaman nyata kamu.\n• PUNCHLINE penutup: "analis hari ini adalah editor AI, bukan operator manual."` },
    { label: 'Sintesis 10 sumber', render: S22, notes: `SINTESIS — tabel rangkuman.\n• Tidak perlu dibaca baris per baris. Bilang: "Ini foto dari semua yang baru kita bahas, tersedia untuk kamu screenshot."\n• Beri jeda 10–15 detik supaya peserta sempat membaca sendiri.` },
    { label: 'Peta tugas', render: S23, notes: `SINTESIS — peta tugas hilang/bertahan/baru.\n• Slide paling actionable dari bagian 1. Minta peserta pilih satu baris dari kolom kiri yang paling relevan ke pekerjaan mereka.\n• Tekankan kolom tengah: fondasi karier paling tahan lama.` },
    { label: 'Konteks Indonesia', render: S24, notes: `KONTEKS LOKAL.\n• Bicara lebih personal di sini — "kamu" bukan "peserta".\n• Reframe kesenjangan Komdigi sebagai peluang, bukan ancaman, di Note penutup.` },
    { label: 'Jembatan bagian 2', render: S25, notes: `PENUTUP BAGIAN 1.\n• Baca kutipan besar pelan-pelan, beri jeda sebelum lanjut.\n• Ini titik alami untuk jeda sesi/istirahat singkat kalau perlu.\n⏱️ Total bagian 1 sampai sini idealnya ~55–60 menit.` },
    { label: 'Pembuka bagian 2', render: S26, notes: `PEMBUKA BAGIAN 2 — energi naik lagi setelah jeda.\n• Slide divider, jangan dibaca panjang. Cukup: "Sekarang kita masuk ke bagian paling praktis."\n• Empat chip di bawah adalah peta bagian 2 — sebut sekilas.` },
    { label: 'Workflow 7 langkah', render: S27, notes: `WORKFLOW 7 LANGKAH — kerangka inti bagian 2.\n• Baca badge kanan tiap baris: Kamu / AI bantu / Bareng — pola ini yang membentuk seluruh sisa sesi.\n• Tekankan Note bawah: langkah 1 & 7 SELALU manusia.` },
    { label: 'Langkah 1–2', render: S28, notes: `LANGKAH 1–2.\n• Kontraskan dua pertanyaan (kabur vs siap eksekusi) — minta kelas coba perbaiki versi kabur duluan sebelum kamu tunjukkan jawaban.\n• Query SQL: jelaskan JOIN-nya singkat kalau kelas belum pernah SQL (tidak perlu dalam).` },
    { label: 'Langkah 3–4', render: S29, notes: `LANGKAH 3–4.\n• Panel kanan (yang wajib diputuskan sendiri) adalah inti slide — baca satu-satu, biarkan kelas berpikir sejenak di tiap poin.\n• Analogi: ini persis kerja "penilaian konteks" yang disebut di riset HBR (slide 16).` },
    { label: 'Langkah 5–6', render: S30, notes: `LANGKAH 5–6 — chart yang menyesatkan.\n• Tunjuk dua chart bar berdampingan, minta kelas tebak dulu bedanya sebelum kamu jelaskan (sumbu-Y dipotong).\n• Tekankan Note: ini bukan AI jahat, ini default tool yang harus selalu dicek.` },
    { label: 'Langkah 7 · Validasi', render: S31, notes: `LANGKAH 7 — SLIDE PALING PENTING DI BAGIAN 2.\n• Baca checklist pelan, beri waktu kelas menyerap tiap poin.\n• Pertanyaan terakhir di checklist adalah puncaknya — beri jeda sebelum membacanya.\n⏱️ Jangan terburu-buru di slide ini, ini inti dari seluruh "practical" di judul webinar.` },
    { label: 'Prompting · Anatomi', render: S32, notes: `PROMPTING — anatomi 4 bagian.\n• Ajak kelas coba susun satu prompt sendiri di kolom chat pakai 4 bagian ini.\n• Ini fondasi sebelum masuk contoh before/after di slide berikutnya.` },
    { label: 'Prompting · Before/after', render: S33, notes: `PROMPTING — before/after.\n• Baca prompt lemah dulu, biarkan kelas menebak kenapa itu bermasalah, baru bongkar 3 poin di bawahnya.\n• Prompt kuat: baca utuh, ini yang layak mereka contek/simpan.` },
    { label: 'Validasi · AI mengarang', render: S34, notes: `VALIDASI — menangkap halusinasi AI.\n• Empat kartu: kalau waktu terbatas, prioritaskan kartu 1 & 2 (paling praktis).\n• Istilah "halusinasi" di Note — jelaskan singkat kalau kelas belum familiar.` },
    { label: 'Studi kasus · Bagian 1', render: S35, notes: `HANDS-ON — studi kasus dimulai.\n• Baca pertanyaan bos dengan nada mendesak (ada deadline hari Jumat) — bangun urgensi.\n• Tunjuk tabel hasil di bawah, minta kelas baca sendiri dulu sebelum kamu bacakan Note kesimpulannya.` },
    { label: 'Studi kasus · Bagian 2', render: S36, notes: `HANDS-ON — studi kasus selesai.\n• Baca rekomendasi akhir seolah benar-benar presentasi ke direksi — ini contoh nyata "dari angka ke keputusan".\n• Tiga stat penutup: tekankan stat ketiga (100% divalidasi manusia) paling keras.` },
    { label: 'Kompetensi dicari', render: S37, notes: `KOMPETENSI 2026.\n• Tiga kolom: minta kelas nilai diri sendiri 1–10 di tiap kolom secara diam-diam.\n• Tekankan Note: kolom tengah paling baru & paling langka — prioritas belajar.` },
    { label: 'Portofolio', render: S38, notes: `PORTOFOLIO BERBASIS AI.\n• Kontraskan dua panel atas dulu, baru masuk 3 ide proyek konkret di bawah.\n• Dorong kelas pilih satu ide sekarang juga, bukan nanti setelah webinar selesai.` },
    { label: 'Rencana 90 hari', render: S39, notes: `RENCANA 90 HARI + rangkuman 6 poin.\n• Tiga fase: baca cepat, ini kerangka bukan resep kaku.\n• Enam poin rangkuman: minta kelas sebutkan bareng-bareng kalau masih ada energi, atau baca sendiri kalau waktu mepet.\n⏱️ ~4 menit.` },
    { label: 'Penutup & Q&A', render: S40, notes: `PENUTUP.\n• Ucapkan terima kasih ke Talentiv & Ditekindo secara eksplisit sebelum buka sesi tanya jawab.\n• Daftar 10 sumber: bilang slide ini akan dibagikan, tidak perlu dicatat manual.\n• Buka sesi tanya jawab — ingat komitmen di slide 5: potong kapan saja, pertanyaan tersulit disimpan untuk sini.` },
  ],
}
