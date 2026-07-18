import { useState } from 'react'
import {
  Sparkles, Bot, Gauge, TrendingUp, Building2, FileText, ShieldCheck,
  AlertTriangle, XCircle, ArrowRight, Search, Database, Layers,
  Target, Rocket, MessageSquare,
  Eye, HelpCircle, Quote, Repeat, ListChecks, ScanSearch,
  GitCompare, Send, ExternalLink, RefreshCw,
} from 'lucide-react'
import {
  BRAND, Shell, Glow, Tag, SlideTitle, Bullet, Panel, Note, SectionLabel,
  Sql, DataTable, RankBars, StatBars, ComparePairs, type Presentation,
} from './primitives'

/* ─────────────────────────────────────────────────────────────────────────────
   Webinar — Practical Data Analyst & AI: Peran Baru di Era Otomatisasi
   Kolaborasi Talentiv × Ditekindo. 26 slide, storyline McKinsey-style:
   bukti pertumbuhan → 4 pergeseran → bukti pasar → demo satu studi kasus →
   peta kompetensi → portofolio → penutup.
───────────────────────────────────────────────────────────────────────────── */

const WRAP = 'relative z-10 w-full max-w-6xl mx-auto'

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

function CoBrand({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <img src={BRAND.logoWhite} alt="Talentiv" className="h-8 object-contain" />
      <span className="text-gray-600 text-lg font-light">×</span>
      <DitekindoLogo className="h-8" />
    </div>
  )
}

function Source({ children }: { children: string }) {
  return (
    <div className="mt-3 flex items-start gap-1.5 text-[10px] text-gray-500 leading-snug">
      <FileText size={11} className="mt-px shrink-0" />
      <span>{children}</span>
    </div>
  )
}

/** Big centered number for sparse "breath" slides (hook, bridge, quote). */
function BigLine({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-center tracking-tight leading-[1.25] max-w-4xl mx-auto">
      {children}
    </h2>
  )
}

// ── 01 · Pembuka ────────────────────────────────────────────────────────────────
const S01 = (
  <div className="w-full min-h-full relative overflow-hidden flex items-center">
    <Glow className="top-1/4 left-1/3 w-[700px] h-[460px] bg-[#1FA79B]/20" />
    <Glow className="bottom-0 right-0 w-[500px] h-[400px] bg-[#6DC4AA]/12" />
    <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-12 text-center">
      <CoBrand className="justify-center mb-9" />
      <div className="inline-flex items-center gap-2 mb-6 border border-[#1FA79B]/30 bg-[#1FA79B]/10 rounded-full px-4 py-1.5">
        <Sparkles size={14} className="text-[#6DC4AA]" />
        <span className="text-xs font-semibold text-[#D1EDE5]">Webinar · Talentiv × Ditekindo</span>
      </div>
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">
        Practical Data Analyst &amp; AI
        <span className="block mt-2 bg-gradient-to-r from-[#1FA79B] via-[#6DC4AA] to-[#D1EDE5] bg-clip-text text-transparent">
          Peran Baru di Era Otomatisasi
        </span>
      </h1>
      <div className="mt-9 inline-flex flex-col items-center">
        <span className="text-lg sm:text-xl font-semibold text-white">M Khairul Hamid, SE.</span>
        <span className="text-sm text-gray-400 mt-1.5 max-w-xl">
          8+ tahun di tech &amp; data · Ex-Director of Business Intelligence · Senior Software Engineer di perusahaan SaaS global
        </span>
      </div>
    </div>
  </div>
)

// ── 02 · Hook (sengaja kosong — pemantik ketegangan) ────────────────────────────
const S02 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Pertanyaan pembuka" />
      <BigLine>
        &ldquo;AI bisa query, bikin chart, bikin insight sendiri.
        <span className="block mt-3 text-[#6DC4AA]">Masih ada masa depan buat data analyst?&rdquo;</span>
      </BigLine>
    </div>
  </Shell>
)

// ── 03 · BLS +34% ────────────────────────────────────────────────────────────────
const S03 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Data pasar kerja · U.S. Bureau of Labor Statistics" />
      <SlideTitle sub="Sumber pemerintah AS yang tidak berjualan kursus atau software — proyeksi ketenagakerjaan resmi, bukan opini industri.">
        Lapangan kerja data justru tumbuh <span className="text-[#6DC4AA]">34%</span>, jauh di atas rata-rata
      </SlideTitle>
      <StatBars
        items={[
          { value: 34, display: '+34%', label: 'Data Scientist (proyeksi BLS 2024–2034)', tone: 'accent' },
          { value: 4, display: '~4%', label: 'Rata-rata seluruh profesi di AS', tone: 'muted' },
        ]}
        delta="~8,5× lipat dari rata-rata"
        note="Rata-rata seluruh profesi adalah kisaran tipikal proyeksi BLS untuk 10 tahun ke depan, dipakai sebagai pembanding kasar — bukan angka tunggal resmi untuk satu tahun tertentu."
      />
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <Panel icon={<TrendingUp size={16} />} title="Apa pendorongnya">
          <p className="text-xs text-gray-400">
            Pertumbuhan ini didorong justru oleh kebutuhan membangun model AI dan menganalisis data dalam skala besar — bukan menggantikannya.
          </p>
        </Panel>
        <Panel icon={<Target size={16} />} title="So-what" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-300">
            Pertanyaan yang tepat bukan &ldquo;profesi ini hilang atau tidak&rdquo;, melainkan <b className="text-[#6DC4AA]">&ldquo;profesi ini berubah jadi apa&rdquo;</b>.
          </p>
        </Panel>
      </div>
      <Source>U.S. Bureau of Labor Statistics, Occupational Outlook Handbook — Data Scientists · bls.gov/ooh/math/data-scientists.htm</Source>
    </div>
  </Shell>
)

// ── 04 · Peta 4 pergeseran ───────────────────────────────────────────────────────
const S04 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Kerangka bagian ini" />
      <SlideTitle sub="Empat pergeseran ini dibahas berurutan, satu slide untuk masing-masing. Bukan daftar acak — ini urutan sebab-akibat dari kecepatan sampai cara kerja.">
        Peran data analyst berubah karena <span className="text-[#6DC4AA]">empat pergeseran besar</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          [<Gauge size={20} key="1" />, '01', 'Kecepatan', 'Analisis berjam-jam jadi hitungan menit'],
          [<Repeat size={20} key="2" />, '02', 'Otomatisasi tugas manual', 'Reporting & KPI rutin diambil alih mesin'],
          [<Search size={20} key="3" />, '03', 'Jenis analis yang dicari', 'Bukan analis biasa, tapi yang mahir AI'],
          [<GitCompare size={20} key="4" />, '04', 'Cara kerja baru', 'Dari eksekusi manual ke review & validasi'],
        ].map(([icon, no, title, desc]) => (
          <div key={no as string} className="rounded-2xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.06] p-5">
            <div className="w-10 h-10 rounded-xl bg-[#1FA79B]/15 border border-[#1FA79B]/25 flex items-center justify-center text-[#6DC4AA] mb-3">
              {icon as React.ReactNode}
            </div>
            <span className="text-[10px] font-mono text-gray-600">{no as string}</span>
            <h3 className="text-[15px] font-semibold text-white leading-snug mt-1">{title as string}</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">{desc as string}</p>
          </div>
        ))}
      </div>
    </div>
  </Shell>
)

// ── 05 · Pergeseran #1: kecepatan ───────────────────────────────────────────────
const S05 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Pergeseran 1 dari 4 · Kecepatan" />
      <SlideTitle sub="Bukan cuma lebih cepat — kapasitas analisis per orang naik drastis, karena eksplorasi yang tadinya terlalu mahal untuk dicoba sekarang murah untuk dicoba.">
        AI memangkas analisis berjam-jam jadi <span className="text-[#6DC4AA]">hitungan menit</span>
      </SlideTitle>
      <ComparePairs
        legend={['Cara manual', 'Dengan AI']}
        rows={[
          { label: 'Menulis query eksplorasi', before: 30, after: 2, beforeDisplay: '20–40 mnt', afterDisplay: '1–3 mnt' },
          { label: 'Membersihkan data mentah', before: 180, after: 22, beforeDisplay: '2–4 jam', afterDisplay: '15–30 mnt' },
          { label: 'Membuat chart pertama', before: 30, after: 2, beforeDisplay: '30 mnt', afterDisplay: '2 mnt' },
          { label: 'Draft narasi laporan', before: 90, after: 10, beforeDisplay: '1–2 jam', afterDisplay: '10 mnt' },
        ]}
      />
      <Note tone="info" className="mt-4">
        <b className="text-[#6DC4AA]">Implikasinya:</b> saat satu eksplorasi cuma butuh beberapa menit, seorang analis berani menguji jauh lebih banyak hipotesis dalam satu hari kerja yang sama.
      </Note>
    </div>
  </Shell>
)

// ── 06 · Pergeseran #2: otomatisasi reporting/KPI ───────────────────────────────
const S06 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Pergeseran 2 dari 4 · Otomatisasi tugas manual" />
      <SlideTitle sub="Ini bagian yang paling sering memicu kecemasan soal 'digantikan'. Layak diakui langsung, bukan dihindari.">
        Reporting dan KPI manual kini makin banyak <span className="text-[#6DC4AA]">diotomatisasi</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<AlertTriangle size={16} />} title="Yang wajar bikin cemas" className="border-amber-500/20 bg-amber-500/[0.05]">
          <ul className="space-y-2">
            <Bullet tone="bad">Laporan penjualan harian yang formatnya selalu sama</Bullet>
            <Bullet tone="bad">Rekap KPI mingguan yang rumusnya tidak pernah berubah</Bullet>
            <Bullet tone="bad">Dashboard traffic rutin yang tinggal dijadwalkan</Bullet>
          </ul>
        </Panel>
        <Panel icon={<RefreshCw size={16} />} title="Yang sebenarnya terjadi" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-300 leading-relaxed">
            Yang hilang adalah <b className="text-[#6DC4AA]">tugasnya</b>, bukan <b className="text-[#6DC4AA]">perannya</b>. Waktu yang dulu habis untuk menyusun ulang laporan yang sama tiap minggu, sekarang bergeser ke kerja yang nilainya lebih tinggi: merancang metrik baru, menyelidiki anomali, dan menerjemahkan angka jadi keputusan.
          </p>
        </Panel>
      </div>
      <Note tone="warn" className="mt-4">
        Kalau nilai jualmu satu-satunya adalah menyusun laporan rutin, posisi itu memang rapuh. Kalau nilai jualmu adalah menilai apa yang laporan itu maksudkan, posisi itu justru makin dibutuhkan.
      </Note>
    </div>
  </Shell>
)

// ── 07 · Pergeseran #3: jenis analis yang dicari ────────────────────────────────
const S07 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Pergeseran 3 dari 4 · Jenis analis yang dicari" />
      <SlideTitle sub="Pertanyaan perusahaan sudah bergeser. Detail datanya menyusul di slide 9 — hampir semua perusahaan sudah mencoba AI, tapi belum semua memetik hasilnya.">
        Perusahaan tak lagi cari analis biasa, melainkan yang bisa <span className="text-[#6DC4AA]">memakai AI</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<XCircle size={16} />} title="Pertanyaan lama" className="border-red-500/20 bg-red-500/[0.05]">
          <p className="text-sm text-gray-300 italic">&ldquo;Apakah kita butuh data analyst?&rdquo;</p>
          <p className="text-xs text-gray-500 mt-2">Pertanyaan ini sudah selesai dijawab — hampir semua perusahaan menengah ke atas sudah punya fungsi data.</p>
        </Panel>
        <Panel icon={<Search size={16} />} title="Pertanyaan baru" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-sm text-gray-200">&ldquo;Analis <b className="text-[#6DC4AA]">jenis apa</b> yang kita butuhkan?&rdquo;</p>
          <p className="text-xs text-gray-400 mt-2">Nilai baru datang dari kemampuan mengintegrasikan AI ke dalam alur kerja analisis yang sudah berjalan — bukan menulis ulang semuanya dari nol.</p>
        </Panel>
      </div>
      <Note tone="info" className="mt-4">
        Slide berikutnya membedah cara kerja baru itu secara konkret, lalu slide 9 menunjukkan kenapa kemampuan ini langka: adopsi AI di perusahaan sudah tinggi, tapi hasilnya belum.
      </Note>
    </div>
  </Shell>
)

// ── 08 · Pergeseran #4: cara kerja baru ─────────────────────────────────────────
const S08 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Pergeseran 4 dari 4 · Cara kerja baru · InfoWorld" />
      <SlideTitle sub="Bukan menulis semua dari nol, tapi mengarahkan AI lalu mengoreksi hasilnya. Ini pergeseran cara kerja yang paling konkret dari seluruh empat pergeseran.">
        Analis kini bekerja seperti AI engineer: <span className="text-[#6DC4AA]">mereview, memvalidasi, menyempurnakan</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-3 gap-4">
        <Panel icon={<Eye size={16} />} title="Mereview">
          <p className="text-xs text-gray-400">Membaca output AI sebelum dipakai — query, chart, atau narasi — dan menilai apakah logikanya masuk akal.</p>
        </Panel>
        <Panel icon={<ScanSearch size={16} />} title="Memvalidasi" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-300">Mencocokkan angka dengan sumber data asli, memastikan tidak ada kolom atau asumsi yang dikarang AI.</p>
        </Panel>
        <Panel icon={<GitCompare size={16} />} title="Menyempurnakan">
          <p className="text-xs text-gray-400">Memperbaiki bagian yang meleset dan menajamkan klaim sebelum dibawa ke pengambil keputusan.</p>
        </Panel>
      </div>
      <Note tone="warn" className="mt-4">
        <b className="text-[#6DC4AA]">So-what:</b> skill baru yang paling dicari adalah <b>judgment atas output AI</b>, bukan sekadar kecepatan eksekusi manual. Ini persis kerangka yang dipakai di studi kasus slide 15–18.
      </Note>
      <Source>InfoWorld, How AI changes the data analyst role · infoworld.com/article/4058946/how-ai-changes-the-data-analyst-role.html</Source>
    </div>
  </Shell>
)

// ── 09 · McKinsey: adopsi vs nilai ───────────────────────────────────────────────
const S09 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Data pasar · McKinsey, State of AI 2025" />
      <SlideTitle sub="Berbasis survei tahunan berskala besar terhadap eksekutif perusahaan. Nuansa di angka ini adalah inti peluangnya.">
        Adopsi AI sudah meluas, tapi sedikit perusahaan yang <span className="text-[#6DC4AA]">benar-benar memetik hasilnya</span>
      </SlideTitle>
      <StatBars
        items={[
          { value: 90, display: '~90%', label: 'Perusahaan sudah memakai AI', tone: 'accent' },
          { value: 6, display: '~6%', label: 'Melihat nilai signifikan dari AI', tone: 'warning' },
        ]}
        delta="gap 84 poin antara mencoba dan berhasil"
        deltaTone="warning"
        note="94% perusahaan yang mengadopsi AI belum melihat nilai signifikan darinya — sisanya, sekitar 6%, yang sudah merasakan dampak nyata."
      />
      <Panel icon={<Building2 size={16} />} title="Kenapa gap ini terjadi" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06] mt-4">
        <p className="text-xs text-gray-400">
          Nilai baru muncul saat <b className="text-gray-200">workflow dirancang ulang</b> di sekitar AI, bukan saat AI ditempelkan begitu saja ke proses lama.
        </p>
      </Panel>
      <Note tone="info" className="mt-4">
        <b className="text-[#6DC4AA]">So-what:</b> di sinilah celah peluangnya — perusahaan butuh orang yang bisa merancang ulang alur kerja dengan AI, bukan sekadar orang yang tahu satu tool AI.
      </Note>
      <Source>McKinsey & Company, Where AI will create value—and where it won't — The State of AI 2025</Source>
    </div>
  </Shell>
)

// ── 10 · PwC: premi upah ─────────────────────────────────────────────────────────
const S10 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Data pasar · PwC, Global AI Jobs Barometer 2025" />
      <SlideTitle sub="Bukan survei opini — analisis atas jutaan lowongan kerja nyata. Data primer langsung dari pasar kerja itu sendiri.">
        Pekerja dengan skill AI dibayar <span className="text-[#6DC4AA]">jauh lebih tinggi</span>
      </SlideTitle>
      <StatBars
        items={[
          { value: 25, display: '25%', label: 'Premi upah tahun sebelumnya', tone: 'muted' },
          { value: 56, display: '56%', label: 'Premi upah tahun ini', tone: 'accent' },
        ]}
        delta="2,2× lipat dalam setahun"
        note="Premi upah untuk pekerja dengan skill AI, dibanding rekan sejawat tanpanya."
      />
      <Note tone="info" className="mt-4">
        <b className="text-[#6DC4AA]">So-what:</b> skill Data + AI bukan pelengkap CV — ini keunggulan yang harganya terukur secara finansial, dan tren-nya sedang menajam.
      </Note>
      <Source>PwC, Global AI Jobs Barometer 2025</Source>
    </div>
  </Shell>
)

// ── 11 · WEF: skill demand ranking ──────────────────────────────────────────────
const S11 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Data pasar · World Economic Forum, Future of Jobs 2025" />
      <SlideTitle sub="Survei 1.000+ perusahaan besar yang mewakili 14 juta pekerja di 55 negara — konsensus pasar kerja global.">
        AI dan big data jadi skill dengan permintaan <span className="text-[#6DC4AA]">paling cepat naik</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-[#6DC4AA]/20 p-5">
          <SectionLabel>Skill dengan permintaan tumbuh paling cepat</SectionLabel>
          <RankBars
            items={[
              { label: 'AI & Big Data', value: 100, display: '#1', emphasis: true },
              { label: 'Networks & Cybersecurity', value: 78, display: '#2' },
              { label: 'Technological Literacy', value: 71, display: '#3' },
              { label: 'Creative Thinking', value: 64, display: '#4' },
              { label: 'Analytical Thinking', value: 60, display: '#5' },
            ]}
          />
          <p className="text-[10px] text-gray-500 mt-3">Ilustrasi peringkat relatif berdasarkan temuan laporan, bukan angka persentase resmi WEF.</p>
        </div>
        <StatBars items={[{ value: 39, display: '39%', label: 'Skill inti berubah pada 2030', tone: 'accent' }]} />
      </div>
      <Note tone="warn" className="mt-4">
        <b className="text-[#6DC4AA]">So-what:</b> arah pasar global sudah jelas — kombinasi Data + AI yang dicari, bukan salah satunya saja.
      </Note>
      <Source>World Economic Forum, The Future of Jobs Report 2025</Source>
    </div>
  </Shell>
)

// ── 12 · Komdigi/BPS: talenta RI ─────────────────────────────────────────────────
const S12 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Data lokal · Komdigi × Sakernas BPS" />
      <SlideTitle sub="Basis datanya Sakernas BPS — jangkar lokal paling netral yang kita punya, sebelum diproyeksikan oleh Komdigi untuk kebutuhan talenta digital 2024–2030.">
        Di Indonesia, talenta data dan AI justru <span className="text-[#6DC4AA]">paling sulit ditemukan</span>
      </SlideTitle>
      <div className="rounded-2xl border border-[#6DC4AA]/20 p-5">
        <SectionLabel>Tingkat kesulitan pengisian posisi digital (ilustrasi berdasarkan temuan Komdigi)</SectionLabel>
        <RankBars
          items={[
            { label: 'Data Analyst & AI Engineer', value: 100, display: 'tersulit', emphasis: true },
            { label: 'Cloud & DevOps Engineer', value: 78, display: 'sulit' },
            { label: 'Cybersecurity Specialist', value: 70, display: 'sulit' },
            { label: 'Web / Mobile Developer', value: 45, display: 'sedang' },
          ]}
        />
        <p className="text-[10px] text-gray-500 mt-3">Ilustrasi urutan relatif dari temuan Komdigi, bukan angka gap resmi per posisi.</p>
      </div>
      <Note tone="info" className="mt-4">
        <b className="text-[#6DC4AA]">So-what:</b> gap sebesar ini bukan berita buruk kalau dilihat dari sisi yang tepat — ini peluang konkret bagi siapa pun yang mengisinya lebih dulu.
      </Note>
      <Source>Kementerian Komunikasi dan Digital (Komdigi), Proyeksi Talenta Digital Indonesia 2024–2030 · basis data Badan Pusat Statistik (Sakernas)</Source>
    </div>
  </Shell>
)

// ── 13 · Jembatan (sengaja kosong) ──────────────────────────────────────────────
const S13 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Dari argumen ke praktik" />
      <BigLine>
        Cukup teorinya.
        <span className="block mt-3 text-[#6DC4AA]">Sekarang mari lihat praktiknya.</span>
      </BigLine>
      <p className="text-center text-gray-400 text-sm mt-6 max-w-md mx-auto">
        Satu studi kasus nyata, dari pertanyaan bisnis sampai insight.
      </p>
    </div>
  </Shell>
)

// ── 14 · Peta workflow 5 langkah ────────────────────────────────────────────────
const S14 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Kerangka demo" />
      <SlideTitle sub="Lima langkah ini yang akan kita telusuri satu per satu di slide berikutnya, memakai satu kasus nyata dari awal sampai akhir.">
        Workflow data analyst berbasis AI berjalan dalam <span className="text-[#6DC4AA]">lima langkah</span>
      </SlideTitle>
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        {[
          ['1', 'Pertanyaan bisnis', Target],
          ['2', 'Eksplorasi AI', Bot],
          ['3', 'Validasi manusia', ShieldCheck],
          ['4', 'Insight', Sparkles],
          ['5', 'Visualisasi', TrendingUp],
        ].map(([no, label, Icon], i, arr) => (
          <div key={no as string} className="flex items-center flex-1">
            <div className="flex-1 rounded-2xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.06] p-4 text-center">
              <div className="w-9 h-9 mx-auto rounded-lg bg-[#1FA79B]/15 border border-[#1FA79B]/25 flex items-center justify-center text-[#6DC4AA] mb-2">
                {(() => { const I = Icon as typeof Target; return <I size={16} /> })()}
              </div>
              <div className="text-[10px] font-mono text-gray-600">{no as string}</div>
              <div className="text-xs sm:text-[13px] font-semibold text-white mt-0.5">{label as string}</div>
            </div>
            {i < arr.length - 1 && <ArrowRight size={16} className="text-gray-600 mx-1 shrink-0 hidden sm:block" />}
          </div>
        ))}
      </div>
    </div>
  </Shell>
)

// ── 15 · Langkah 1: pertanyaan bisnis ───────────────────────────────────────────
const S15 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Langkah 1 dari 5 · Studi kasus: retensi pelanggan turun" />
      <SlideTitle sub="Data tanpa pertanyaan yang tajam adalah eksplorasi tanpa arah. Tugas manusia di langkah ini: merumuskan masalah yang tepat, sebelum AI dilibatkan sama sekali.">
        Analisis yang baik selalu mulai dari pertanyaan bisnis, <span className="text-[#6DC4AA]">bukan dari data</span>
      </SlideTitle>
      <div className="rounded-2xl border border-[#6DC4AA]/20 bg-[#0b1220]/60 p-5 mb-4">
        <div className="flex items-start gap-3">
          <MessageSquare size={18} className="text-[#6DC4AA] shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Konteks kasus</div>
            <p className="text-sm text-gray-200">&ldquo;Retensi pelanggan bulanan turun dari 82% ke 74% dalam tiga bulan terakhir. Cari tahu penyebabnya sebelum rapat direksi hari Jumat.&rdquo;</p>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<XCircle size={16} />} title="Pertanyaan awal — terlalu kabur" className="border-red-500/20 bg-red-500/[0.05]">
          <p className="text-sm text-gray-300 italic">&ldquo;Kenapa retensi turun?&rdquo;</p>
        </Panel>
        <Panel icon={<Target size={16} />} title="Pertanyaan yang dipertajam" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-sm text-gray-200">&ldquo;Segmen mana yang turunnya paling tajam, dan apakah lebih terkait harga, layanan, atau kompetitor baru?&rdquo;</p>
        </Panel>
      </div>
      <div className="mt-4">
        <DataTable
          caption="dataset mentah — orders (cuplikan)"
          columns={['customer_id', 'segment', 'order_date', 'status']}
          rows={[
            ['C-1042', 'SMB', '2026-04-12', 'active'],
            ['C-1043', 'SMB', '2026-05-03', 'churned'],
            ['C-1044', 'Enterprise', '2026-05-20', 'active'],
          ]}
        />
      </div>
    </div>
  </Shell>
)

// ── 16 · Langkah 2: eksplorasi AI ───────────────────────────────────────────────
const S16 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Langkah 2 dari 5 · Studi kasus" />
      <SlideTitle sub="Peran AI di sini adalah akselerator eksekusi — bukan pengambil keputusan. Prompt diarahkan ke Claude/ChatGPT untuk menulis query dan menandai pola awal.">
        AI mempercepat eksplorasi dan menemukan pola <span className="text-[#6DC4AA]">lebih cepat</span>
      </SlideTitle>
      <Panel icon={<Bot size={16} />} title="Prompt ke AI (Claude / ChatGPT)" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06] mb-4">
        <Sql>{`SELECT customer_segment,
       DATE_TRUNC('month', order_date) AS bulan,
       COUNT(DISTINCT customer_id) FILTER (WHERE status='churned')
         ::float / COUNT(DISTINCT customer_id) AS churn_rate
FROM orders
WHERE order_date >= '2026-03-01'
GROUP BY customer_segment, bulan
ORDER BY bulan;`}</Sql>
      </Panel>
      <div className="rounded-2xl border border-[#6DC4AA]/20 p-5">
        <SectionLabel>Pola yang ditemukan AI — retensi per segmen</SectionLabel>
        <ComparePairs
          legend={['April', 'Juni']}
          rows={[
            { label: 'Enterprise', before: 89, after: 87, beforeDisplay: '89%', afterDisplay: '87%' },
            { label: 'SMB', before: 84, after: 65, beforeDisplay: '84%', afterDisplay: '65%' },
            { label: 'Individu', before: 78, after: 76, beforeDisplay: '78%', afterDisplay: '76%' },
          ]}
        />
      </div>
      <Note tone="info" className="mt-4">
        Dalam hitungan menit, AI menandai satu pola: penurunan retensi terkonsentrasi tajam di segmen SMB. Langkah berikutnya <b className="text-[#6DC4AA]">bukan</b> langsung mempercayainya.
      </Note>
    </div>
  </Shell>
)

// ── 17 · Langkah 3: validasi manusia ────────────────────────────────────────────
const S17 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Langkah 3 dari 5 · Titik paling penting" />
      <SlideTitle sub="AI mengeksekusi. Manusia menafsirkan dan memutuskan. Inilah kontras yang menjelaskan kenapa peran ini tidak hilang.">
        Keputusan akhir tetap di tangan manusia yang <span className="text-[#6DC4AA]">memvalidasi dan menafsirkan</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<Bot size={16} />} title="Yang dikerjakan AI" className="border-white/10">
          <ul className="space-y-2">
            <Bullet tone="neutral">Menulis query &amp; menghitung churn rate per segmen</Bullet>
            <Bullet tone="neutral">Menandai SMB sebagai segmen dengan penurunan tertajam</Bullet>
            <Bullet tone="neutral">Menyusun draft tabel &amp; ringkasan angka</Bullet>
          </ul>
        </Panel>
        <Panel icon={<ShieldCheck size={16} />} title="Yang wajib dikerjakan manusia" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>Cek akurasi: apakah query-nya benar dan datanya representatif?</Bullet>
            <Bullet>Tafsir konteks: kenapa SMB, bukan segmen lain — harga, layanan, atau kompetitor?</Bullet>
            <Bullet>Putuskan mana yang relevan dibawa ke rapat direksi</Bullet>
          </ul>
        </Panel>
      </div>
      <Note tone="warn" className="mt-4">
        <b className="text-[#6DC4AA]">So-what:</b> inilah alasan peran tidak hilang — AI tidak bisa mengambil keputusan berbasis nilai dan konteks bisnis. Itu tetap kerja manusia.
      </Note>
    </div>
  </Shell>
)

// ── 18 · Langkah 4–5: insight & visualisasi ─────────────────────────────────────
const S18 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Langkah 4–5 dari 5 · Penutup studi kasus" />
      <SlideTitle sub="Insight baru bernilai saat diubah jadi visual yang bisa langsung ditindaklanjuti. Ini bukti nyata klaim produktivitas berkali lipat.">
        Insight jadi bernilai saat diubah jadi visualisasi yang <span className="text-[#6DC4AA]">bisa ditindaklanjuti</span>
      </SlideTitle>
      <div className="rounded-2xl border border-[#1FA79B]/30 bg-[#1FA79B]/[0.09] p-5 mb-4">
        <div className="text-[10px] uppercase tracking-widest text-[#6DC4AA] mb-2">Rekomendasi untuk rapat direksi</div>
        <p className="text-sm text-gray-200 leading-relaxed">
          Penurunan retensi terkonsentrasi di segmen SMB, dipicu kombinasi layanan support yang lambat dan tekanan harga dari kompetitor baru. Rekomendasi: perbaiki SLA support SMB dalam 30 hari, dan evaluasi ulang harga paket menengah.
        </p>
      </div>
      <StatBars
        items={[
          { value: 45, display: '~45 mnt', label: 'Dari pertanyaan sampai rekomendasi, dengan AI', tone: 'accent' },
          { value: 960, display: '~1–2 hari', label: 'Estimasi cara manual sepenuhnya', tone: 'muted' },
        ]}
        delta="~16× lebih cepat"
        note="Skala waktu bar disederhanakan agar kedua batang tetap terbaca — bukan proporsi menit-ke-menit yang presisi."
      />
      <Note tone="info" className="mt-4">
        Alur lengkapnya utuh: pertanyaan yang tajam (langkah 1) → AI mempercepat eksekusi (langkah 2) → manusia memvalidasi (langkah 3) → insight terpakai (langkah 4–5). Bukan salah satu — kelimanya berurutan.
      </Note>
    </div>
  </Shell>
)

// ── 19 · Peta kompetensi 2 lapis ────────────────────────────────────────────────
const S19 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Kerangka bagian ini" />
      <SlideTitle sub="Dua lapis ini yang dibedah di dua slide berikutnya. Perusahaan tidak memilih salah satu — mereka mencari orang yang punya keduanya.">
        Perusahaan mencari kombinasi <span className="text-[#6DC4AA]">kompetensi teknis dan pemahaman AI</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-2 gap-4">
        <Panel icon={<Database size={16} />} title="Lapis 1 · Fondasi teknis">
          <p className="text-xs text-gray-400">SQL, spreadsheet, visualisasi, statistik dasar — dan yang makin dicari: ETL, cloud, data governance. Dibahas di slide 20.</p>
        </Panel>
        <Panel icon={<Bot size={16} />} title="Lapis 2 · Kemampuan AI" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-300">Prompting, validasi output, integrasi AI ke workflow yang sudah berjalan. Dibahas di slide 21.</p>
        </Panel>
      </div>
    </div>
  </Shell>
)

// ── 20 · Lapis 1: fondasi teknis ────────────────────────────────────────────────
const S20 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Lapis 1 dari 2 · 365 Data Science, WEF" />
      <SlideTitle sub="AI tidak menggantikan fondasi ini — justru fondasi inilah yang dipakai untuk memvalidasi output AI di langkah 3 tadi.">
        Skill dasar tetap jadi fondasi yang <span className="text-[#6DC4AA]">wajib dikuasai lebih dulu</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<ListChecks size={16} />} title="Fondasi inti">
          <ul className="space-y-2">
            <Bullet>SQL &amp; pemodelan data</Bullet>
            <Bullet>Spreadsheet (Excel / Google Sheets) tingkat lanjut</Bullet>
            <Bullet>Visualisasi (Power BI, Tableau, dsb.)</Bullet>
            <Bullet>Statistik dasar untuk membaca signifikansi</Bullet>
          </ul>
        </Panel>
        <Panel icon={<TrendingUp size={16} />} title="Tambahan yang makin dicari" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>ETL — menyatukan data dari banyak sumber</Bullet>
            <Bullet>Cloud computing (BigQuery, Snowflake, dsb.)</Bullet>
            <Bullet>Data governance — akurasi &amp; akuntabilitas data</Bullet>
          </ul>
        </Panel>
      </div>
      <Note tone="warn" className="mt-4">
        <b>Prinsipnya:</b> AI tidak menggantikan fondasi ini. AI justru butuh fondasi ini ada di kepalamu, supaya kamu tahu kapan outputnya salah.
      </Note>
      <Source>365 Data Science, Data Analyst Job Outlook 2026 · World Economic Forum, The Future of Jobs Report 2025</Source>
    </div>
  </Shell>
)

// ── 21 · Lapis 2: kemampuan AI (efek pengali) ───────────────────────────────────
const S21 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Lapis 2 dari 2 · Efek pengali" />
      <SlideTitle sub="Bukan pilih salah satu — keduanya berlapis. Fondasi tanpa AI berjalan lambat; AI tanpa fondasi gampang salah arah tanpa disadari.">
        Kemampuan AI melipatgandakan nilai dari <span className="text-[#6DC4AA]">skill dasar itu</span>
      </SlideTitle>
      <div className="grid grid-cols-3 items-center gap-2 sm:gap-4">
        <Panel icon={<Database size={16} />} title="Fondasi teknis" className="text-center">
          <p className="text-xs text-gray-400">SQL, statistik, visualisasi</p>
        </Panel>
        <div className="flex flex-col items-center justify-center text-gray-500">
          <span className="text-3xl sm:text-4xl font-bold">×</span>
        </div>
        <Panel icon={<Bot size={16} />} title="Kemampuan AI" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06] text-center">
          <p className="text-xs text-gray-300">Prompting, validasi, integrasi workflow</p>
        </Panel>
      </div>
      <div className="flex justify-center my-3">
        <ArrowRight size={20} className="text-gray-600 rotate-90" />
      </div>
      <div className="rounded-2xl border border-[#1FA79B]/30 bg-gradient-to-br from-[#1FA79B]/[0.12] to-[#6DC4AA]/[0.06] p-5 text-center">
        <Sparkles size={20} className="text-[#6DC4AA] mx-auto mb-2" />
        <p className="text-sm sm:text-base text-white font-semibold">Produktivitas &amp; nilai jauh lebih tinggi</p>
        <p className="text-xs text-gray-400 mt-1">daripada menguasai salah satunya saja</p>
      </div>
    </div>
  </Shell>
)

// ── 22 · Portofolio sebagai bukti ───────────────────────────────────────────────
const S22 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Untuk yang belum punya pengalaman kerja" />
      <SlideTitle sub="Paradoks klasik fresh graduate: butuh pengalaman untuk dapat pengalaman. Portofolio adalah jalan keluarnya.">
        Tanpa pengalaman kerja, portofolio jadi <span className="text-[#6DC4AA]">bukti kemampuan Anda</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel icon={<AlertTriangle size={16} />} title="Paradoksnya" className="border-amber-500/20 bg-amber-500/[0.05]">
          <p className="text-xs text-gray-400">Lowongan minta pengalaman. Pengalaman butuh lowongan. Tanpa jalan keluar, siklus ini berputar terus.</p>
        </Panel>
        <Panel icon={<Rocket size={16} />} title="Jalan keluarnya" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-300">Portofolio proyek nyata — hasil kerja yang bisa dilihat langsung, tanpa perlu menunggu ditugaskan perusahaan.</p>
        </Panel>
      </div>
      <Panel icon={<ListChecks size={16} />} title="Isi portofolio yang meyakinkan" className="mt-4">
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          <Bullet>Masalah bisnis nyata, bukan dataset tutorial (Titanic, Iris)</Bullet>
          <Bullet>Proses lengkap: pertanyaan → prompt AI → validasi → rekomendasi</Bullet>
          <Bullet>Satu bagian &ldquo;di sini AI salah, ini cara saya menangkapnya&rdquo;</Bullet>
          <Bullet>Workflow AI end-to-end, persis kerangka slide 14–18</Bullet>
        </ul>
      </Panel>
    </div>
  </Shell>
)

// ── 23 · Roadmap portofolio (visual, minim teks) ────────────────────────────────
const S23 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Roadmap" />
      <SlideTitle sub="Mulai kecil. Satu proyek yang utuh jauh lebih meyakinkan daripada lima proyek yang setengah jadi.">
        Portofolio pertama bisa dibangun <span className="text-[#6DC4AA]">bertahap dari nol</span>
      </SlideTitle>
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        {[
          [Target, 'Pilih masalah'],
          [Database, 'Cari dataset'],
          [Bot, 'Analisis dengan AI'],
          [TrendingUp, 'Visualisasi'],
          [Send, 'Publikasi'],
        ].map(([Icon, label], i, arr) => (
          <div key={label as string} className="flex items-center flex-1">
            <div className="flex-1 rounded-2xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.06] p-5 text-center">
              <div className="w-11 h-11 mx-auto rounded-xl bg-[#1FA79B]/15 border border-[#1FA79B]/25 flex items-center justify-center text-[#6DC4AA] mb-3">
                {(() => { const I = Icon as typeof Target; return <I size={20} /> })()}
              </div>
              <div className="text-sm font-semibold text-white">{label as string}</div>
            </div>
            {i < arr.length - 1 && <ArrowRight size={18} className="text-gray-600 mx-1 shrink-0 hidden sm:block" />}
          </div>
        ))}
      </div>
      <Note tone="info" className="mt-5">
        Konsistensi bertahap mengalahkan lompatan besar. Satu proyek selesai dalam sebulan lebih berharga daripada rencana ambisius yang tidak pernah rampung.
      </Note>
    </div>
  </Shell>
)

// ── 24 · Kutipan penutup ─────────────────────────────────────────────────────────
const S24 = (
  <Shell>
    <div className={WRAP}>
      <Quote size={28} className="text-[#6DC4AA] mx-auto mb-6" />
      <BigLine>
        &ldquo;Kalau 90% pekerjaan diotomasi, semua orang mengerjakan 10% sisanya —
        <span className="block mt-3 text-[#6DC4AA]">dan itu melipatgandakan produktivitas hingga 10 kali.&rdquo;</span>
      </BigLine>
      <p className="text-center text-gray-400 text-sm mt-6">— Dario Amodei</p>
      <div className="max-w-xl mx-auto mt-8 rounded-2xl border border-[#1FA79B]/25 bg-[#1FA79B]/[0.06] px-5 py-4 text-center">
        <p className="text-sm text-gray-300">
          AI menggeser dan melipatgandakan pekerjaan — bukan menghapusnya. Tesis yang sama yang kita bahas sejak slide 3: peran berubah, dan nilai seorang analis justru naik.
        </p>
      </div>
    </div>
  </Shell>
)

// ── 25 · Ajakan bertindak ────────────────────────────────────────────────────────
const S25 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Langkah pertama" />
      <SlideTitle sub="Tidak perlu menguasai semuanya minggu ini. Satu langkah konkret, dikerjakan konsisten, lebih menentukan daripada rencana besar yang tidak pernah dimulai.">
        Langkah awal Anda menentukan arah <span className="text-[#6DC4AA]">perjalanan berikutnya</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-2 gap-4">
        <Panel icon={<Database size={16} />} title="Contoh langkah pertama · Fondasi">
          <p className="text-xs text-gray-400">Kuasai satu skill fondasi yang masih lemah — SQL, statistik dasar, atau satu tool visualisasi — sampai benar-benar lancar.</p>
        </Panel>
        <Panel icon={<Rocket size={16} />} title="Contoh langkah pertama · Portofolio" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-300">Mulai satu proyek portofolio kecil minggu ini — bukan yang sempurna, yang selesai.</p>
        </Panel>
      </div>
      <Note tone="warn" className="mt-4">
        <b>Prinsipnya:</b> konsistensi bertahap mengalahkan lompatan besar. Pilih satu, mulai hari ini.
      </Note>
    </div>
  </Shell>
)

// ── 26 · Penutup & tanya jawab ───────────────────────────────────────────────────
const S26 = (
  <Shell>
    <div className={WRAP}>
      <div className="text-center mb-8">
        <CoBrand className="justify-center mb-6" />
        <Tag label="Penutup" />
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center tracking-tight leading-tight">
          Sesi tanya jawab
        </h2>
        <p className="text-center text-gray-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Ruang diskusi terbuka — bawa pertanyaan tersulitmu.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1FA79B]/30 bg-[#1FA79B]/10 px-5 py-2.5">
          <Sparkles size={15} className="text-[#6DC4AA]" />
          <span className="text-sm text-[#D1EDE5] font-medium">M Khairul Hamid, SE.</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.08] px-5 py-2.5">
          <HelpCircle size={15} className="text-[#6DC4AA]" />
          <span className="text-sm text-gray-300">Terima kasih — Talentiv × Ditekindo</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a href="https://linkedin.com/in/mkhairulhamid" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-gray-300">
          <ExternalLink size={13} className="text-[#6DC4AA]" /> linkedin.com/in/mkhairulhamid
        </a>
        <a href="https://github.com/MKhairulHamid" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-gray-300">
          <ExternalLink size={13} className="text-[#6DC4AA]" /> github.com/MKhairulHamid
        </a>
      </div>
    </div>
  </Shell>
)

export const practicalDataAnalystAi: Presentation = {
  id: 'practical-data-analyst-and-ai',
  program: 'Webinar · Talentiv × Ditekindo',
  session: 'Special Session',
  title: 'Practical Data Analyst & AI',
  subtitle: 'Peran Baru di Era Otomatisasi — dari data pertumbuhan lapangan kerja sampai studi kasus workflow AI, langkah demi langkah.',
  durationMin: 75,
  slides: [
    { label: 'Pembuka', render: S01, notes: `SELAMAT DATANG. Webinar kolaborasi Talentiv × Ditekindo.\n• Sapa peserta, minta sebut kota + role di chat.\n• Perkenalan singkat — kredibilitas sudah ada di slide, tidak perlu diulang panjang.\n⏱️ ~2 menit.` },
    { label: 'Hook', render: S02, notes: `HOOK — biarkan menggantung. JANGAN dijawab di sini.\n• Baca pelan, beri jeda 3-4 detik setelah kalimat selesai.\n• Tanya kelas: "Menurut kamu, ya atau tidak?" Baca 2-3 jawaban di chat.\n• Jangan buka jawabannya — bilang "kita jawab ini pelan-pelan, mulai dari data."\n⏱️ ~2 menit. Slide ini sengaja tanpa poin pendukung.` },
    { label: 'BLS +34%', render: S03, notes: `BUKTI PERTAMA — angka BLS.\n• Beri jeda setelah menyebut "34%" — biarkan kontrasnya kerasa vs rata-rata.\n• Tekankan netralitas sumber: pemerintah AS, bukan vendor.\n• Baca so-what pelan: "bukan hilang atau tidak, tapi berubah jadi apa" — ini kalimat kunci seluruh sesi.` },
    { label: 'Peta 4 pergeseran', render: S04, notes: `PETA — kerangka MECE sebelum detail.\n• Baca 4 judul cepat, jangan bahas dalam. 4 slide berikutnya membedah satu-satu.\n• Bilang: "Urutannya bukan acak — dari kecepatan sampai cara kerja."` },
    { label: 'Pergeseran 1 · Kecepatan', render: S05, notes: `PERGESERAN 1 — kecepatan.\n• Telusuri tabel before/after baris demi baris, biar kontrasnya kerasa.\n• Insight: bukan cuma cepat, tapi BERANI mencoba lebih banyak hipotesis.` },
    { label: 'Pergeseran 2 · Otomatisasi', render: S06, notes: `PERGESERAN 2 — otomatisasi reporting/KPI.\n• Akui kecemasan dulu (panel kiri) sebelum membalikkan framingnya (panel kanan).\n• Kalimat kunci: "yang hilang tugas, bukan peran" — baca dengan tegas, ini titik paling rawan disalahpahami.` },
    { label: 'Pergeseran 3 · Jenis analis', render: S07, notes: `PERGESERAN 3 — jenis analis yang dicari.\n• Kontraskan pertanyaan lama vs baru — biarkan kelas merasakan pergeserannya.\n• Jembatani eksplisit ke slide 9 di akhir.` },
    { label: 'Pergeseran 4 · Cara kerja', render: S08, notes: `PERGESERAN 4 — cara kerja baru (InfoWorld).\n• Tiga kata kerja: review, validasi, sempurnakan — minta kelas ulangi.\n• So-what paling penting sesi ini: skill baru = judgment, bukan eksekusi. Sambungkan ke demo slide 15-18.` },
    { label: 'McKinsey · Adopsi vs nilai', render: S09, notes: `BUKTI — McKinsey. SLIDE PALING PENTING di blok data.\n• Dua angka (90% vs 6%) sengaja kontras — beri jeda sebelum menjelaskan gap-nya.\n• Insight kunci: "workflow dirancang ulang" — ini bahasa paling penting di seluruh blok bukti.` },
    { label: 'PwC · Premi upah', render: S10, notes: `BUKTI — PwC.\n• Bar 25%→56%: beri jeda di antara, biarkan lonjakannya terasa.\n• Tekankan ini data primer dari lowongan nyata, bukan survei opini.` },
    { label: 'WEF · Skill ranking', render: S11, notes: `BUKTI — WEF.\n• Chart ranking: AI & Big Data di puncak — baca urutannya cepat.\n• Angka 39% di kanan adalah stat kedua yang berdiri sendiri.` },
    { label: 'Komdigi · Talenta RI', render: S12, notes: `BUKTI — konteks lokal, nada bicara berubah jadi lebih personal.\n• Chart ranking ilustratif: Data Analyst & AI Engineer di puncak kesulitan.\n• Reframe di Note: gap = peluang, bukan berita buruk.` },
    { label: 'Jembatan', render: S13, notes: `JEMBATAN — jeda psikologis. Sengaja tanpa poin pendukung.\n• Baca pelan, beri jeda sebelum lanjut ke slide 14.\n• Titik alami untuk cek chat / tanya kesiapan kelas.\n⏱️ Total sampai sini idealnya ~30-35 menit.` },
    { label: 'Peta workflow', render: S14, notes: `PETA WORKFLOW 5 LANGKAH.\n• Baca cepat, ini kerangka untuk 4 slide demo berikutnya (15-18).\n• Bilang: "Kita ikuti satu kasus nyata lewat kelima langkah ini."` },
    { label: 'Langkah 1 · Pertanyaan', render: S15, notes: `DEMO LANGKAH 1.\n• Baca konteks kasus dengan nada mendesak (deadline hari Jumat) — bangun urgensi.\n• Kontraskan pertanyaan kabur vs dipertajam — minta kelas coba pertajam dulu sebelum kamu tunjukkan.` },
    { label: 'Langkah 2 · Eksplorasi AI', render: S16, notes: `DEMO LANGKAH 2.\n• Ini yang dimaksud "sebutkan tool spesifik" — sebut Claude/ChatGPT eksplisit.\n• Tunjuk chart pola SMB — biarkan kelas lihat sendiri sebelum kamu bacakan Note.\n• Tutup dengan peringatan: pola ini BELUM boleh langsung dipercaya.` },
    { label: 'Langkah 3 · Validasi', render: S17, notes: `DEMO LANGKAH 3 — SLIDE PALING PENTING DI DEMO.\n• Kontras AI (eksekusi) vs manusia (judgment) — baca dua panel berdampingan, jangan buru-buru.\n• So-what: ini jawaban paling konkret atas hook di slide 2.` },
    { label: 'Langkah 4-5 · Insight', render: S18, notes: `DEMO LANGKAH 4-5 — penutup studi kasus.\n• Baca rekomendasi akhir seolah benar-benar presentasi ke direksi.\n• Chart waktu: tekankan ini bukti nyata klaim produktivitas, bukan klaim kosong.\n• Rangkum kelima langkah sebagai satu alur utuh di Note penutup.` },
    { label: 'Peta kompetensi', render: S19, notes: `PETA KOMPETENSI 2 LAPIS.\n• Baca cepat, kerangka untuk slide 20-21.\n• Tekankan: bukan pilih salah satu.` },
    { label: 'Lapis 1 · Fondasi', render: S20, notes: `LAPIS 1 — fondasi teknis.\n• Dua kolom: fondasi inti vs tambahan yang makin dicari.\n• Kalimat kunci Note: AI butuh fondasi ada di kepalamu untuk tahu kapan outputnya salah — sambungkan ke langkah 3 demo.` },
    { label: 'Lapis 2 · AI & efek pengali', render: S21, notes: `LAPIS 2 — kemampuan AI, efek pengali.\n• Visual "fondasi × AI" — baca sebagai persamaan, bukan tabel data.\n• Tegaskan: tidak ada angka pengali yang diklaim di sini — ini visual konseptual, bukan statistik.` },
    { label: 'Portofolio sebagai bukti', render: S22, notes: `PORTOFOLIO — untuk fresh graduate / career switcher.\n• Akui paradoksnya dulu, baru solusinya.\n• Empat poin isi portofolio: baca satu-satu, ini yang paling actionable dari seluruh sesi.` },
    { label: 'Roadmap portofolio', render: S23, notes: `ROADMAP VISUAL — sengaja minim teks, biarkan visualnya bicara.\n• Baca lima langkah cepat, jangan berhenti lama di satu titik.\n• Note penutup: satu proyek selesai > lima proyek setengah jadi.` },
    { label: 'Kutipan · Dario Amodei', render: S24, notes: `KUTIPAN PENUTUP.\n• Baca pelan-pelan, beri jeda 3 detik sebelum baris kedua.\n• Sebut sumber: Dario Amodei, CEO Anthropic.\n• Sambungkan eksplisit ke tesis dari slide 3: peran berubah, nilai naik.` },
    { label: 'Ajakan bertindak', render: S25, notes: `CTA — tenang, tidak menggurui.\n• Dua contoh langkah pertama, bukan daftar panjang.\n• Ajak kelas pilih SATU di kepala mereka sekarang, sebelum lanjut ke Q&A.` },
    { label: 'Penutup & Q&A', render: S26, notes: `PENUTUP.\n• Ucapkan terima kasih ke Talentiv & Ditekindo secara eksplisit.\n• Buka sesi tanya jawab — ingatkan boleh menantang klaim apa pun di deck ini.\n• Kontak LinkedIn/GitHub ada di layar untuk follow-up.` },
  ],
}
