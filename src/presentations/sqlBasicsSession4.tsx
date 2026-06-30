import { useState } from 'react'
import {
  Database, Table2, Search, Filter, ListOrdered, Sigma, Layers,
  AlertTriangle, CheckCircle2, XCircle, ArrowRight, Braces, KeyRound,
  Hash, Lightbulb, Bug, Code2, Link2, Eye, Percent,
} from 'lucide-react'
import {
  BRAND, Shell, Glow, Tag, SlideTitle, Bullet, Card, Panel, Note, SectionLabel,
  Sql, DataTable, type Presentation,
} from './primitives'

/* ─────────────────────────────────────────────────────────────────────────────
   Data Analyst · Session 04 — SQL Dasar: SELECT, Filter, Aggregasi
   20 slide. Padat informasi, mengisi seluruh layar, langkah demi langkah.
───────────────────────────────────────────────────────────────────────────── */

const WRAP = 'relative z-10 w-full max-w-6xl mx-auto'

/** Hero visual untuk slide pembuka — gambar Talentiv, dengan fallback kartu SQL. */
function HeroVisual() {
  const [failed, setFailed] = useState(false)
  if (!failed) {
    return (
      <img
        src={BRAND.heroImage}
        alt=""
        onError={() => setFailed(true)}
        className="w-full max-w-[440px] mx-auto drop-shadow-2xl"
      />
    )
  }
  return (
    <div className="max-w-[440px] mx-auto rounded-2xl border border-[#6DC4AA]/20 bg-[#0b1220]/80 shadow-2xl shadow-black/50 overflow-hidden">
      <div className="bg-[#6DC4AA]/[0.08] px-4 py-2 flex items-center gap-2 border-b border-[#6DC4AA]/15">
        <Database size={13} className="text-[#6DC4AA]" />
        <span className="text-[11px] font-mono text-gray-400">query_pertamamu.sql</span>
      </div>
      <div className="p-4">
        <Sql>{`SELECT name, city, COUNT(*) AS pesanan
FROM customers
WHERE city = 'Jakarta'
GROUP BY name, city
ORDER BY pesanan DESC
LIMIT 5;`}</Sql>
        <div className="mt-3">
          <DataTable
            columns={['name', 'city', 'pesanan']}
            rows={[['Budi Santoso', 'Jakarta', 14], ['Sari Dewi', 'Jakarta', 9]]}
          />
        </div>
      </div>
    </div>
  )
}

// ── 01 · Pembuka (brand Talentiv) ───────────────────────────────────────────────
const S01 = (
  <div className="w-full min-h-full relative overflow-hidden flex items-center">
    <Glow className="top-1/4 left-1/3 w-[700px] h-[460px] bg-[#1FA79B]/20" />
    <Glow className="bottom-0 right-0 w-[500px] h-[400px] bg-[#6DC4AA]/12" />
    <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <img src={BRAND.logoWhite} alt="Talentiv" className="h-9 mb-8 object-contain" />
        <div className="inline-flex items-center gap-2 mb-5 border border-[#1FA79B]/30 bg-[#1FA79B]/10 rounded-full px-4 py-1.5">
          <Database size={14} className="text-[#6DC4AA]" />
          <span className="text-xs font-semibold text-[#D1EDE5]">Data Analyst Program · Sesi 04</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
          SQL Dasar
          <span className="block mt-2 bg-gradient-to-r from-[#1FA79B] via-[#6DC4AA] to-[#D1EDE5] bg-clip-text text-transparent">
            SELECT, Filter, Aggregasi
          </span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-gray-400 max-w-md leading-relaxed">
          Bahasa #1 seorang data analyst. Hari ini: dari query pertamamu sampai meringkas
          ribuan baris menjadi satu angka.
        </p>
        <div className="mt-7 grid grid-cols-2 gap-2.5 max-w-md">
          {[
            ['Unit SKKNI', '3 & 4 — EDA & Tools'],
            ['Durasi', '±90 menit · 20 slide'],
            ['Filter', 'WHERE · BETWEEN · IN · LIKE'],
            ['Agregasi', 'GROUP BY · HAVING'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.08] px-3 py-2">
              <div className="text-[10px] uppercase tracking-widest text-[#6DC4AA]">{k}</div>
              <div className="text-xs text-gray-300 mt-0.5">{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden lg:block">
        <HeroVisual />
      </div>
    </div>
  </div>
)

// ── 02 · Apa itu database ───────────────────────────────────────────────────────
const S02 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Mulai dari nol" />
      <SlideTitle sub="Bayangkan kamu menjalankan toko online: 10.000 pelanggan, 5.000 produk, 200.000 pesanan. Di skala ini Excel mulai lambat, sering crash, dan susah dipakai banyak orang sekaligus.">
        Apa itu <span className="text-[#6DC4AA]">Database</span>?
      </SlideTitle>
      <div className="grid lg:grid-cols-3 gap-4">
        <Panel icon={<XCircle size={16} />} title="Excel saat data membesar" className="border-red-500/20 bg-red-500/[0.05]">
          <ul className="space-y-2">
            <Bullet tone="bad">Lambat &amp; crash di atas puluhan ribu baris</Bullet>
            <Bullet tone="bad">Susah dipakai banyak orang bersamaan</Bullet>
            <Bullet tone="bad">Tidak ada aturan: harga bisa negatif, ID bisa kosong</Bullet>
            <Bullet tone="bad">Data berulang & gampang tidak konsisten</Bullet>
          </ul>
        </Panel>
        <Panel icon={<Database size={16} />} title="Apa itu database">
          <p className="text-xs text-gray-400 mb-3">Sistem yang terorganisir, kuat, dan andal untuk menyimpan & mengambil data. Seperti sekumpulan file Excel (disebut <span className="font-mono text-gray-300">tabel</span>), tapi jauh lebih kuat.</p>
          <ul className="space-y-2">
            <Bullet>Jutaan–miliaran baris tanpa melambat</Bullet>
            <Bullet>Banyak orang baca &amp; tulis bersamaan</Bullet>
            <Bullet>Menegakkan aturan agar data konsisten</Bullet>
          </ul>
        </Panel>
        <Panel icon={<Link2 size={16} />} title="Keunggulan utama" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <ul className="space-y-2">
            <Bullet>Tabel bisa <span className="text-[#6DC4AA] font-medium">saling terhubung</span></Bullet>
            <Bullet>Dicari & difilter dalam hitungan milidetik</Bullet>
            <Bullet>Aman, ada backup &amp; hak akses</Bullet>
            <Bullet>Standar industri di hampir semua perusahaan</Bullet>
          </ul>
        </Panel>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div className="rounded-2xl border border-[#6DC4AA]/20 overflow-hidden">
          <div className="grid grid-cols-3 bg-[#6DC4AA]/[0.08] text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
            <div className="px-3 py-2">Aspek</div>
            <div className="px-3 py-2">Excel</div>
            <div className="px-3 py-2 text-[#6DC4AA]">Database</div>
          </div>
          {[
            ['Skala', 'ribuan baris', 'jutaan+ baris'],
            ['Multi-user', 'rebutan file', 'serentak'],
            ['Aturan data', 'tidak ada', 'ditegakkan'],
            ['Relasi', 'manual (VLOOKUP)', 'lewat key'],
          ].map((r) => (
            <div key={r[0]} className="grid grid-cols-3 border-t border-[#6DC4AA]/12 text-xs">
              <div className="px-3 py-2 text-gray-400">{r[0]}</div>
              <div className="px-3 py-2 text-gray-500">{r[1]}</div>
              <div className="px-3 py-2 text-gray-200">{r[2]}</div>
            </div>
          ))}
        </div>
        <Note className="self-center text-sm">
          💡 <span className="text-gray-200 font-medium">Analogi:</span> database = lemari arsip raksasa yang super rapi. Tiap laci = tabel, tiap map = baris. SQL adalah cara kamu memintanya: "ambilkan map yang begini."
        </Note>
      </div>
    </div>
  </Shell>
)

// ── 03 · Tabel relasional ───────────────────────────────────────────────────────
const S03 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Database relasional" />
      <SlideTitle sub="Data disimpan di beberapa tabel yang terhubung lewat kolom bersama (key). Tabel orders tidak mengulang nama Budi — cukup simpan customer_id-nya.">
        Tabel yang <span className="text-[#6DC4AA]">saling terhubung</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
        <div className="space-y-3">
          <DataTable
            caption="customers"
            columns={['customer_id', 'name', 'email', 'city']}
            highlightCol={0}
            rows={[
              [1, 'Budi Santoso', 'budi@email.com', 'Jakarta'],
              [2, 'Sari Dewi', 'sari@email.com', 'Surabaya'],
              [3, 'Andi Pratama', 'andi@email.com', 'Bandung'],
            ]}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <DataTable
              caption="products"
              columns={['product_id', 'product_name', 'price']}
              rows={[
                [101, 'Wireless Mouse', 180000],
                [102, 'Notebook A5', 25000],
                [103, 'USB-C Cable', 45000],
              ]}
            />
            <DataTable
              caption="orders"
              columns={['order_id', 'customer_id', 'product_id', 'qty']}
              highlightCol={1}
              rows={[
                [5001, 1, 101, 2],
                [5002, 2, 102, 5],
                [5003, 1, 103, 1],
              ]}
            />
          </div>
        </div>
        <div className="space-y-3">
          <Panel icon={<KeyRound size={16} />} title="Key = penghubung antar tabel">
            <p className="text-xs text-gray-400">Kolom khusus yang menghubungkan satu tabel ke tabel lain. Inilah inti "relasional".</p>
          </Panel>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <div className="text-xs font-semibold text-[#6DC4AA] mb-1">Primary key</div>
              <p className="text-[11px] text-gray-400">ID unik tiap baris. Mis. <span className="font-mono text-gray-300">customer_id</span> di tabel customers.</p>
            </Card>
            <Card className="p-4">
              <div className="text-xs font-semibold text-[#6DC4AA] mb-1">Foreign key</div>
              <p className="text-[11px] text-gray-400">Menunjuk ke primary key tabel lain. Mis. <span className="font-mono text-gray-300">customer_id</span> di tabel orders.</p>
            </Card>
          </div>
          <Note>
            <span className="text-gray-200 font-medium">Kenapa dipisah?</span> Supaya nama & email Budi cukup ditulis sekali. Kalau berubah, ubah di satu tempat. Ini disebut <span className="text-[#6DC4AA]">normalisasi</span> — menghindari duplikasi.
          </Note>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
        <Link2 size={15} className="text-[#1FA79B]" />
        <span><span className="text-[#6DC4AA] font-medium">customer_id = 1</span> di orders menunjuk Budi di customers. Sesi depan kita gabung pakai key ini lewat <span className="font-mono text-gray-300">JOIN</span>.</span>
      </div>
    </div>
  </Shell>
)

// ── 04 · Apa itu SQL ────────────────────────────────────────────────────────────
const S04 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Bahasanya" />
      <SlideTitle sub="Structured Query Language — bukan bahasa pemrograman biasa, tapi bahasa query. Kamu mendeskripsikan APA data yang kamu mau, database mengurus BAGAIMANA mengambilnya.">
        SQL = <span className="text-[#6DC4AA]">Structured Query Language</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <Panel icon={<Braces size={16} />} title="Cara membacanya">
          <p className="text-xs text-gray-400">"S-Q-L" atau "sequel" — keduanya benar & diterima luas. Mayoritas profesional data bilang <span className="text-gray-200 font-medium">"sequel"</span>.</p>
        </Panel>
        <Panel icon={<Database size={16} />} title="Di mana dipakai">
          <p className="text-xs text-gray-400 mb-2">Hampir semua perusahaan teknologi di dunia. Semua bicara SQL dengan sedikit beda sintaks:</p>
          <div className="flex flex-wrap gap-1.5">
            {['PostgreSQL', 'MySQL', 'SQL Server', 'SQLite', 'BigQuery', 'Snowflake', 'Redshift'].map(d => (
              <span key={d} className="text-[10px] font-mono border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.08] rounded px-1.5 py-0.5 text-gray-400">{d}</span>
            ))}
          </div>
        </Panel>
        <Panel icon={<CheckCircle2 size={16} />} title="Kenapa penting" className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <p className="text-xs text-gray-300">Skill <span className="text-[#6DC4AA] font-semibold text-base">#1</span> yang dicari di lowongan data analyst. Dipakai lagi di BigQuery (sesi 7) & Python/Pandas (sesi 10).</p>
        </Panel>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Panel title="Deklaratif vs Imperatif">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-[#6DC4AA]/[0.06] border border-[#6DC4AA]/15 p-3">
              <div className="text-[#6DC4AA] font-semibold mb-1">SQL (deklaratif)</div>
              <p className="text-gray-400">"Beri aku pelanggan Jakarta." Kamu sebut <span className="text-gray-200">tujuan</span>.</p>
            </div>
            <div className="rounded-lg bg-[#6DC4AA]/[0.06] border border-[#6DC4AA]/15 p-3">
              <div className="text-gray-300 font-semibold mb-1">Pemrograman (imperatif)</div>
              <p className="text-gray-400">"Buka file, loop tiap baris, cek kota…" Kamu sebut <span className="text-gray-200">langkah</span>.</p>
            </div>
          </div>
        </Panel>
        <Panel icon={<ListOrdered size={16} />} title="Yang kamu kuasai hari ini">
          <div className="flex flex-wrap gap-1.5">
            {['SELECT', 'FROM', 'WHERE', 'AS', 'BETWEEN', 'IN', 'LIKE', 'IS NULL', 'AND/OR', 'ORDER BY', 'LIMIT', 'COUNT/SUM/AVG', 'GROUP BY', 'HAVING'].map(k => (
              <span key={k} className="text-[10px] font-mono rounded px-2 py-1 bg-[#1FA79B]/10 border border-[#1FA79B]/20 text-[#6DC4AA]">{k}</span>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  </Shell>
)

// ── 05 · SELECT ─────────────────────────────────────────────────────────────────
const S05 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Query pertama" />
      <SlideTitle sub="Setiap query SQL dimulai dengan SELECT — memberi tahu database: 'berikan aku kolom-kolom ini'.">
        <Search size={26} className="inline mr-2 text-[#1FA79B] mb-1" />
        Pernyataan <span className="text-[#6DC4AA]">SELECT</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div>
            <SectionLabel>Anatomi query</SectionLabel>
            <Sql>{`SELECT kolom1, kolom2, kolom3
FROM nama_tabel;`}</Sql>
            <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] text-center">
              <div className="rounded bg-[#6DC4AA]/[0.08] border border-[#6DC4AA]/15 py-1.5"><span className="text-[#6DC4AA] font-mono">SELECT</span><div className="text-gray-500">kolom apa</div></div>
              <div className="rounded bg-[#6DC4AA]/[0.08] border border-[#6DC4AA]/15 py-1.5"><span className="text-[#6DC4AA] font-mono">FROM</span><div className="text-gray-500">tabel mana</div></div>
              <div className="rounded bg-[#6DC4AA]/[0.08] border border-[#6DC4AA]/15 py-1.5"><span className="text-[#6DC4AA] font-mono">;</span><div className="text-gray-500">akhir query</div></div>
            </div>
          </div>
          <div>
            <SectionLabel>Pilih kolom tertentu</SectionLabel>
            <Sql>{`SELECT name, email, city
FROM customers;`}</Sql>
          </div>
          <DataTable
            caption="hasil"
            columns={['name', 'email', 'city']}
            rows={[['Budi Santoso', 'budi@email.com', 'Jakarta'], ['Sari Dewi', 'sari@email.com', 'Surabaya']]}
          />
        </div>
        <div className="space-y-3">
          <div>
            <SectionLabel>Semua kolom dengan *</SectionLabel>
            <Sql>{`SELECT *
FROM customers;`}</Sql>
          </div>
          <Note tone="warn">
            <span className="font-semibold">Hati-hati dengan <span className="font-mono">SELECT *</span>.</span> Di tabel nyata dengan 50+ kolom, ini menarik banyak data yang tidak perlu — lambat & boros.
          </Note>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 border-[#1FA79B]/20 bg-[#1FA79B]/[0.05]">
              <div className="flex items-center gap-1.5 text-[#6DC4AA] text-xs font-semibold mb-1"><CheckCircle2 size={13} /> Praktik baik</div>
              <p className="text-[11px] text-gray-300 font-mono">SELECT name, city</p>
            </Card>
            <Card className="p-4 border-red-500/20 bg-red-500/[0.05]">
              <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold mb-1"><XCircle size={13} /> Hindari</div>
              <p className="text-[11px] text-gray-300 font-mono">SELECT * (selalu)</p>
            </Card>
          </div>
          <Note>💡 Sebut kolom yang benar-benar kamu butuhkan. Query jadi lebih cepat, hasil lebih mudah dibaca, dan maksudmu jelas.</Note>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 06 · Alias AS ───────────────────────────────────────────────────────────────
const S06 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Mempercantik output" />
      <SlideTitle sub="Ganti nama kolom di hasil query agar lebih mudah dibaca — pakai kata kunci AS.">
        Alias dengan <span className="text-[#6DC4AA]">AS</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-3">
          <SectionLabel>Mengganti nama kolom</SectionLabel>
          <Sql>{`SELECT
    name  AS nama_pelanggan,
    email AS kontak_email,
    city  AS lokasi
FROM customers;`}</Sql>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-500 mb-1">Sebelum</p>
              <DataTable columns={['name', 'email']} rows={[['Budi', 'budi@…']]} />
            </div>
            <div>
              <p className="text-gray-500 mb-1">Sesudah</p>
              <DataTable columns={['nama_pelanggan', 'kontak_email']} rows={[['Budi', 'budi@…']]} />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <Panel title="Alias dengan spasi → pakai kutip">
            <Sql>{`SELECT name AS "Nama Lengkap"
FROM customers;`}</Sql>
          </Panel>
          <Panel title="Alias pada hasil hitungan">
            <Sql>{`SELECT price * quantity AS total_harga
FROM orders;`}</Sql>
          </Panel>
          <div className="grid grid-cols-2 gap-3">
            <Note>Data aslinya <span className="text-gray-200">tidak berubah</span> — hanya label kolom di output.</Note>
            <Note><span className="font-mono">AS</span> sebenarnya opsional, tapi pakai saja biar jelas dibaca.</Note>
          </div>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 07 · WHERE ──────────────────────────────────────────────────────────────────
const S07 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Menyaring baris" />
      <SlideTitle sub="WHERE mengambil hanya baris yang memenuhi kondisi. Anggap saja seperti tombol Filter di Excel, tapi jauh lebih kuat.">
        <Filter size={24} className="inline mr-2 text-[#1FA79B] mb-1" />
        Klausa <span className="text-[#6DC4AA]">WHERE</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="space-y-3">
          <Sql>{`SELECT name, email, city
FROM customers
WHERE city = 'Jakarta';`}</Sql>
          <DataTable caption="hanya baris yang cocok" columns={['name', 'city']} rows={[['Budi Santoso', 'Jakarta'], ['Rina Wijaya', 'Jakarta']]} />
          <Note tone="warn">Teks pakai kutip tunggal: <span className="font-mono">'Jakarta'</span>. Angka tanpa kutip: <span className="font-mono">price &gt; 100000</span>.</Note>
        </div>
        <div>
          <SectionLabel>Operator perbandingan</SectionLabel>
          <div className="rounded-xl border border-[#6DC4AA]/20 overflow-hidden text-xs">
            {[
              ['=', 'Sama dengan', "city = 'Jakarta'"],
              ['!=  <>', 'Tidak sama dengan', "city != 'Jakarta'"],
              ['>', 'Lebih besar', 'price > 100000'],
              ['<', 'Lebih kecil', 'price < 100000'],
              ['>=', 'Lebih besar / sama', 'price >= 100000'],
              ['<=', 'Lebih kecil / sama', 'price <= 100000'],
            ].map((r, i) => (
              <div key={i} className="grid grid-cols-[78px_1fr] gap-2 px-3 py-2 border-t border-[#6DC4AA]/12 first:border-0 items-center">
                <span className="font-mono text-[#6DC4AA] font-semibold">{r[0]}</span>
                <span className="text-gray-400">{r[1]} <span className="text-gray-600 font-mono">— {r[2]}</span></span>
              </div>
            ))}
          </div>
          <Note className="mt-3"><span className="font-mono">!=</span> dan <span className="font-mono">&lt;&gt;</span> artinya sama persis — keduanya "tidak sama dengan".</Note>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 08 · BETWEEN & IN ───────────────────────────────────────────────────────────
const S08 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Menyaring lebih cerdas" />
      <SlideTitle><span className="text-[#6DC4AA]">BETWEEN</span> &amp; <span className="text-[#6DC4AA]">IN</span></SlideTitle>
      <div className="grid lg:grid-cols-2 gap-5">
        <Panel icon={<Hash size={16} />} title="BETWEEN — rentang nilai (inklusif)">
          <Sql>{`SELECT product_name, price
FROM products
WHERE price BETWEEN 50000 AND 200000;`}</Sql>
          <Note className="mt-3">Sama dengan <span className="font-mono text-gray-300">price &gt;= 50000 AND price &lt;= 200000</span> — kedua ujung ikut.</Note>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            <div>
              <SectionLabel>Untuk tanggal</SectionLabel>
              <Sql>{`WHERE order_date
BETWEEN '2024-01-01'
    AND '2024-01-31'`}</Sql>
            </div>
            <div>
              <SectionLabel>Kebalikannya</SectionLabel>
              <Sql>{`WHERE price
NOT BETWEEN
  50000 AND 200000`}</Sql>
            </div>
          </div>
        </Panel>
        <Panel icon={<Layers size={16} />} title="IN — cocok salah satu dari daftar">
          <Sql>{`SELECT name, city
FROM customers
WHERE city IN ('Jakarta', 'Surabaya', 'Bandung');`}</Sql>
          <Note className="mt-3">Lebih ringkas daripada: <span className="font-mono text-gray-300">city = 'Jakarta' OR city = 'Surabaya' OR …</span></Note>
          <div className="mt-3">
            <SectionLabel>Kebalikannya (NOT IN)</SectionLabel>
            <Sql>{`WHERE city NOT IN ('Jakarta', 'Surabaya');`}</Sql>
          </div>
        </Panel>
      </div>
      <Note tone="warn" className="mt-4">⚠️ Ingat: <span className="font-mono">BETWEEN</span> itu <span className="font-semibold">inklusif</span> di kedua ujung. <span className="font-mono">BETWEEN 1 AND 10</span> mencakup 1 dan 10. Ini sering jadi sumber kesalahan.</Note>
    </div>
  </Shell>
)

// ── 09 · LIKE ───────────────────────────────────────────────────────────────────
const S09 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Pencocokan pola" />
      <SlideTitle sub="LIKE mencari kecocokan parsial pada teks menggunakan wildcard.">
        Pencarian teks dengan <span className="text-[#6DC4AA]">LIKE</span>
      </SlideTitle>
      <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2"><span className="font-mono text-[#6DC4AA] text-lg">%</span><span className="text-gray-400">karakter apa pun (0 atau lebih)</span></div>
        <div className="flex items-center gap-2"><span className="font-mono text-[#6DC4AA] text-lg">_</span><span className="text-gray-400">tepat satu karakter</span></div>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="grid sm:grid-cols-3 gap-3">
          <div><p className="text-xs text-gray-500 mb-1.5">Diakhiri @gmail.com</p><Sql>{`WHERE email
LIKE '%@gmail.com'`}</Sql></div>
          <div><p className="text-xs text-gray-500 mb-1.5">Diawali "Wireless"</p><Sql>{`WHERE product_name
LIKE 'Wireless%'`}</Sql></div>
          <div><p className="text-xs text-gray-500 mb-1.5">Tepat 5 karakter</p><Sql>{`WHERE product_name
LIKE '_____'`}</Sql></div>
        </div>
        <div>
          <SectionLabel>Pola → yang cocok</SectionLabel>
          <div className="rounded-xl border border-[#6DC4AA]/20 overflow-hidden text-xs">
            {[
              ["'a%'", 'diawali huruf a'],
              ["'%a'", 'diakhiri huruf a'],
              ["'%abc%'", 'mengandung "abc" di mana saja'],
              ["'a_c'", '3 huruf: a, apa saja, c'],
            ].map((r, i) => (
              <div key={i} className="grid grid-cols-[90px_1fr] gap-2 px-3 py-2 border-t border-[#6DC4AA]/12 first:border-0">
                <span className="font-mono text-[#6DC4AA]">{r[0]}</span>
                <span className="text-gray-400">{r[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        <Note>💡 Tidak peduli huruf besar/kecil: <span className="font-mono text-[#6DC4AA]">LOWER(product_name) LIKE '%wireless%'</span></Note>
        <Note>Sebagian DB punya <span className="font-mono">ILIKE</span> (case-insensitive bawaan).</Note>
        <Note tone="warn">Pola <span className="font-mono">'%xxx%'</span> bisa lambat di tabel besar.</Note>
      </div>
    </div>
  </Shell>
)

// ── 10 · IS NULL ────────────────────────────────────────────────────────────────
const S10 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Nilai kosong" />
      <SlideTitle sub="NULL berarti 'tidak ada nilai' / 'tidak diketahui'. Ini BUKAN nol, dan BUKAN string kosong.">
        <span className="text-[#6DC4AA]">IS NULL</span> &amp; IS NOT NULL
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div>
            <SectionLabel>Belum mengisi nomor telepon</SectionLabel>
            <Sql>{`SELECT name, email
FROM customers
WHERE phone IS NULL;`}</Sql>
          </div>
          <div>
            <SectionLabel>Pesanan yang sudah dikirim</SectionLabel>
            <Sql>{`SELECT order_id
FROM orders
WHERE shipped_date IS NOT NULL;`}</Sql>
          </div>
          <Note>💡 Untuk mengganti NULL dengan nilai default, pakai <span className="font-mono text-[#6DC4AA]">COALESCE(phone, 'belum ada')</span>.</Note>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-[#6DC4AA]/20 overflow-hidden text-xs">
            <div className="grid grid-cols-2 bg-[#6DC4AA]/[0.08] text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
              <div className="px-3 py-2">Nilai</div><div className="px-3 py-2">Artinya</div>
            </div>
            {[
              ['NULL', 'tidak ada / tidak diketahui'],
              ['0', 'angka nol (ada nilainya)'],
              ["''", 'string kosong (ada nilainya)'],
            ].map((r) => (
              <div key={r[0]} className="grid grid-cols-2 border-t border-[#6DC4AA]/12">
                <div className="px-3 py-2 font-mono text-[#6DC4AA]">{r[0]}</div>
                <div className="px-3 py-2 text-gray-400">{r[1]}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.07] p-4 flex gap-3 items-start">
            <AlertTriangle size={24} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-1 text-sm">Aturan kritis</p>
              <p className="text-xs text-gray-300">
                <span className="text-red-300 font-semibold">TIDAK BISA</span> pakai <span className="font-mono">= NULL</span>. Harus <span className="font-mono text-[#6DC4AA]">IS NULL</span>.
                <span className="font-mono text-gray-500"> WHERE phone = NULL</span> selalu mengembalikan 0 baris — karena NULL = "tidak diketahui", jadi perbandingan tidak pernah TRUE.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 11 · AND vs OR ──────────────────────────────────────────────────────────────
const S11 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Menggabungkan kondisi" />
      <SlideTitle><span className="text-[#6DC4AA]">AND</span> · <span className="text-[#6DC4AA]">OR</span> · <span className="text-[#6DC4AA]">NOT</span></SlideTitle>
      <div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="space-y-3">
          <Panel title="AND — kedua kondisi harus benar">
            <Sql>{`WHERE city = 'Jakarta'
  AND registration_year = 2024;`}</Sql>
          </Panel>
          <Panel title="OR — setidaknya satu benar">
            <Sql>{`WHERE city = 'Jakarta'
   OR city = 'Surabaya';`}</Sql>
          </Panel>
          <Panel title="NOT — membalik kondisi">
            <Sql>{`WHERE NOT city = 'Jakarta';`}</Sql>
          </Panel>
        </div>
        <div>
          <SectionLabel>Tabel kebenaran</SectionLabel>
          <table className="w-full text-xs rounded-xl overflow-hidden border border-[#6DC4AA]/20">
            <thead>
              <tr className="bg-[#6DC4AA]/[0.08] text-gray-400">
                <th className="px-3 py-2 text-left font-semibold">A</th>
                <th className="px-3 py-2 text-left font-semibold">B</th>
                <th className="px-3 py-2 font-semibold text-[#6DC4AA]">A AND B</th>
                <th className="px-3 py-2 font-semibold text-[#6DC4AA]">A OR B</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {[
                ['TRUE', 'TRUE', true, true],
                ['TRUE', 'FALSE', false, true],
                ['FALSE', 'TRUE', false, true],
                ['FALSE', 'FALSE', false, false],
              ].map((r, i) => (
                <tr key={i} className="border-t border-[#6DC4AA]/12">
                  <td className="px-3 py-2 text-gray-400">{r[0] as string}</td>
                  <td className="px-3 py-2 text-gray-400">{r[1] as string}</td>
                  <td className={`px-3 py-2 text-center ${r[2] ? 'text-[#6DC4AA]' : 'text-gray-600'}`}>{r[2] ? 'TRUE' : 'FALSE'}</td>
                  <td className={`px-3 py-2 text-center ${r[3] ? 'text-[#6DC4AA]' : 'text-gray-600'}`}>{r[3] ? 'TRUE' : 'FALSE'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Note className="mt-3">⚠️ "OR" di SQL artinya <span className="text-gray-200">salah satu atau keduanya</span> — beda dengan "atau" sehari-hari yang sering berarti pilih salah satu.</Note>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 12 · Tanda kurung ───────────────────────────────────────────────────────────
const S12 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Jangan sampai salah logika" />
      <SlideTitle sub="Saat mencampur AND dan OR, selalu pakai tanda kurung untuk memperjelas maksudmu.">
        Gabung AND + OR → pakai <span className="text-[#6DC4AA]">( )</span>
      </SlideTitle>
      <p className="text-sm text-gray-400 mb-3 text-center">
        Pelanggan Jakarta yang belanja &gt; 1 juta, <span className="text-gray-200">ATAU</span> siapa pun yang VIP:
      </p>
      <Sql className="max-w-3xl mx-auto">{`SELECT name, city, total_spent, is_vip
FROM customers
WHERE (city = 'Jakarta' AND total_spent > 1000000) OR is_vip = TRUE;`}</Sql>
      <div className="grid lg:grid-cols-3 gap-4 mt-5">
        <div className="rounded-xl border border-[#1FA79B]/25 bg-[#1FA79B]/[0.06] p-4">
          <div className="flex items-center gap-2 text-[#6DC4AA] text-xs font-semibold mb-1.5"><CheckCircle2 size={14} /> Dengan kurung</div>
          <p className="text-xs text-gray-300 font-mono mb-2">(Jakarta AND &gt;1jt) OR VIP</p>
          <p className="text-xs text-gray-400">Grup (Jakarta + &gt;1jt) dievaluasi dulu, baru di-OR dengan VIP. Sesuai maksud.</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold mb-1.5"><XCircle size={14} /> Tanpa kurung</div>
          <p className="text-xs text-gray-300 font-mono mb-2">Jakarta AND &gt;1jt OR VIP</p>
          <p className="text-xs text-gray-400">SQL mengeksekusi AND lebih dulu — hasil bisa salah total (semua VIP ikut tanpa syarat lain).</p>
        </div>
        <Note className="self-stretch flex items-center">
          <span><Lightbulb size={13} className="inline text-[#6DC4AA] mr-1" /> <span className="text-gray-200 font-medium">Urutan prioritas:</span> NOT → AND → OR. Tanda kurung mengalahkan semuanya, jadi pakai untuk menghindari kebingungan.</span>
        </Note>
      </div>
    </div>
  </Shell>
)

// ── 13 · ORDER BY ───────────────────────────────────────────────────────────────
const S13 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Mengurutkan hasil" />
      <SlideTitle>
        <ListOrdered size={24} className="inline mr-2 text-[#1FA79B] mb-1" />
        <span className="text-[#6DC4AA]">ORDER BY</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div><p className="text-xs text-gray-500 mb-1.5">Naik (default)</p><Sql>{`ORDER BY price;
-- ASC: rendah → tinggi`}</Sql></div>
            <div><p className="text-xs text-gray-500 mb-1.5">Turun</p><Sql>{`ORDER BY price DESC;
-- tinggi → rendah`}</Sql></div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1.5">Beberapa kolom</p>
            <Sql>{`SELECT name, city, registration_year
FROM customers
ORDER BY city ASC, registration_year DESC;`}</Sql>
          </div>
        </div>
        <div className="space-y-3">
          <DataTable
            caption="hasil — kota A→Z, lalu tahun terbaru dulu"
            columns={['name', 'city', 'year']}
            rows={[['Andi', 'Bandung', 2024], ['Dewi', 'Bandung', 2023], ['Budi', 'Jakarta', 2024], ['Rina', 'Jakarta', 2022]]}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <Note>Kolom kedua hanya menentukan urutan <span className="text-gray-200">di dalam</span> nilai kolom pertama yang sama.</Note>
            <Note><span className="font-mono">NULLS LAST</span> / <span className="font-mono">NULLS FIRST</span> mengatur posisi nilai kosong saat mengurutkan.</Note>
          </div>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 14 · LIMIT ──────────────────────────────────────────────────────────────────
const S14 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Kebiasaan baik" />
      <SlideTitle sub="Di database nyata dengan jutaan baris, SELECT * tanpa LIMIT bisa membuat tool macet dan membebani server.">
        Selalu pakai <span className="text-[#6DC4AA]">LIMIT</span> saat eksplorasi
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div>
            <SectionLabel>Ambil 10 baris pertama</SectionLabel>
            <Sql>{`SELECT *
FROM orders
LIMIT 10;`}</Sql>
          </div>
          <div>
            <SectionLabel>Paginasi dengan OFFSET (halaman ke-2)</SectionLabel>
            <Sql>{`SELECT *
FROM orders
ORDER BY order_date
LIMIT 10 OFFSET 10;`}</Sql>
          </div>
          <Note>Beda dialek: SQL Server pakai <span className="font-mono">TOP 10</span>, standar SQL pakai <span className="font-mono">FETCH FIRST 10 ROWS</span>.</Note>
        </div>
        <div className="space-y-3">
          {[
            ['Tanpa LIMIT', 'Bisa menarik jutaan baris → tool query macet', 'bad'],
            ['Butuh waktu lama', 'Query bisa berjalan bermenit-menit', 'bad'],
            ['Dengan LIMIT', '"Tunjukkan sampelnya dulu" — cepat & aman', 'good'],
          ].map(([t, d, tone]) => (
            <div key={t as string} className={`rounded-xl border p-4 ${tone === 'good' ? 'border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]' : 'border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.04]'}`}>
              <p className={`text-sm font-semibold mb-0.5 ${tone === 'good' ? 'text-[#6DC4AA]' : 'text-gray-300'}`}>{t as string}</p>
              <p className="text-xs text-gray-400">{d as string}</p>
            </div>
          ))}
          <Note><Eye size={13} className="inline text-[#6DC4AA] mr-1" /> Setelah paham struktur datanya, baru hilangkan LIMIT untuk analisis penuh.</Note>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 15 · Fungsi agregat ─────────────────────────────────────────────────────────
const S15 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Dari ribuan baris jadi satu angka" />
      <SlideTitle sub="Fungsi agregat meringkas banyak baris menjadi satu nilai ringkasan — seperti tombol Σ / AVERAGE di Excel.">
        <Sigma size={24} className="inline mr-2 text-[#1FA79B] mb-1" />
        Fungsi <span className="text-[#6DC4AA]">Agregat</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-5 gap-3 mb-4">
        {[
          ['COUNT', 'jumlah baris'],
          ['SUM', 'total nilai'],
          ['AVG', 'rata-rata'],
          ['MIN', 'nilai terkecil'],
          ['MAX', 'nilai terbesar'],
        ].map(([f, d]) => (
          <div key={f} className="rounded-xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.06] p-3 text-center">
            <p className="font-mono text-[#6DC4AA] font-semibold text-sm">{f}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{d}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="space-y-3">
          <Sql>{`SELECT
    COUNT(*)      AS jumlah_pesanan,
    SUM(quantity) AS total_unit,
    AVG(price)    AS harga_rata2,
    MAX(price)    AS termahal
FROM orders;`}</Sql>
          <DataTable columns={['jumlah_pesanan', 'total_unit', 'harga_rata2', 'termahal']} rows={[[200000, 512340, 84500, 4200000]]} />
        </div>
        <div className="space-y-3">
          <Panel icon={<Percent size={16} />} title="Tiga rasa COUNT">
            <div className="space-y-2 text-xs">
              <div className="flex gap-2"><span className="font-mono text-[#6DC4AA] w-32 shrink-0">COUNT(*)</span><span className="text-gray-400">hitung semua baris</span></div>
              <div className="flex gap-2"><span className="font-mono text-[#6DC4AA] w-32 shrink-0">COUNT(phone)</span><span className="text-gray-400">hitung yang TIDAK NULL</span></div>
              <div className="flex gap-2"><span className="font-mono text-[#6DC4AA] w-32 shrink-0">COUNT(DISTINCT city)</span><span className="text-gray-400">hitung nilai unik</span></div>
            </div>
          </Panel>
          <Note>Agregat mengabaikan NULL (kecuali <span className="font-mono">COUNT(*)</span>). Bisa digabung WHERE: <span className="font-mono text-gray-300">AVG(price) … WHERE category='Electronics'</span>.</Note>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 16 · GROUP BY ───────────────────────────────────────────────────────────────
const S16 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Meringkas per kelompok" />
      <SlideTitle sub="GROUP BY mengelompokkan baris yang nilainya sama, lalu fungsi agregat dihitung per kelompok — persis seperti Pivot Table.">
        <Layers size={24} className="inline mr-2 text-[#1FA79B] mb-1" />
        <span className="text-[#6DC4AA]">GROUP BY</span>
      </SlideTitle>
      <div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="space-y-3">
          <Sql>{`SELECT
    category,
    COUNT(*)   AS jumlah_produk,
    AVG(price) AS harga_rata2
FROM products
GROUP BY category
ORDER BY jumlah_produk DESC;`}</Sql>
          <DataTable
            columns={['category', 'jumlah_produk', 'harga_rata2']}
            rows={[['Electronics', 1240, 850000], ['Stationery', 980, 32000], ['Fashion', 760, 175000]]}
          />
          <div>
            <SectionLabel>Bisa kelompokkan beberapa kolom</SectionLabel>
            <Sql>{`GROUP BY category, city`}</Sql>
          </div>
        </div>
        <div className="space-y-3">
          <Panel icon={<Layers size={16} />} title="Cara kerjanya (3 langkah)">
            <ol className="space-y-2 text-xs text-gray-300 list-decimal list-inside">
              <li>Kelompokkan baris dengan nilai sama (mis. semua "Electronics" jadi satu grup)</li>
              <li>Hitung agregat untuk tiap grup (COUNT, AVG, …)</li>
              <li>Tiap grup menghasilkan <span className="text-[#6DC4AA]">satu baris</span> di output</li>
            </ol>
          </Panel>
          <Note tone="warn">
            <span className="font-semibold">ATURAN BESI:</span> tiap kolom non-agregat di <span className="font-mono">SELECT</span> wajib ada di <span className="font-mono">GROUP BY</span>. Lupa = error klasik.
          </Note>
          <Note>💡 Analogi: GROUP BY = "Rows" di Pivot Table, fungsi agregat = "Values".</Note>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 17 · HAVING vs WHERE ────────────────────────────────────────────────────────
const S17 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Menyaring hasil agregat" />
      <SlideTitle><span className="text-[#6DC4AA]">HAVING</span> vs WHERE</SlideTitle>
      <div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <div className="font-mono text-[#6DC4AA] text-sm font-semibold mb-1">WHERE</div>
              <p className="text-xs text-gray-400 mb-2"><span className="text-gray-200">Sebelum</span> dikelompokkan. Tidak boleh fungsi agregat.</p>
              <Sql>{`WHERE price > 100000`}</Sql>
            </Card>
            <Card className="p-4 border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
              <div className="font-mono text-[#6DC4AA] text-sm font-semibold mb-1">HAVING</div>
              <p className="text-xs text-gray-400 mb-2"><span className="text-gray-200">Sesudah</span> agregasi. Boleh fungsi agregat.</p>
              <Sql>{`HAVING COUNT(*) > 100`}</Sql>
            </Card>
          </div>
          <div className="rounded-xl border border-[#6DC4AA]/20 overflow-hidden text-xs">
            <div className="grid grid-cols-3 bg-[#6DC4AA]/[0.08] text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
              <div className="px-3 py-2">&nbsp;</div><div className="px-3 py-2">WHERE</div><div className="px-3 py-2 text-[#6DC4AA]">HAVING</div>
            </div>
            {[
              ['Kapan', 'sebelum group', 'sesudah group'],
              ['Menyaring', 'baris', 'kelompok'],
              ['Fungsi agregat', 'tidak boleh', 'boleh'],
            ].map((r) => (
              <div key={r[0]} className="grid grid-cols-3 border-t border-[#6DC4AA]/12">
                <div className="px-3 py-2 text-gray-400">{r[0]}</div>
                <div className="px-3 py-2 text-gray-500">{r[1]}</div>
                <div className="px-3 py-2 text-gray-200">{r[2]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <SectionLabel>Contoh lengkap — kategori dengan &gt; 100 produk</SectionLabel>
          <Sql>{`SELECT category, COUNT(*) AS jumlah
FROM products
WHERE price > 10000      -- saring baris dulu
GROUP BY category        -- kelompokkan
HAVING COUNT(*) > 100    -- saring kelompok
ORDER BY jumlah DESC;`}</Sql>
          <Note><span className="text-gray-200 font-medium">Kalimat kunci:</span> "WHERE tidak bisa pakai COUNT(), HAVING bisa." Keduanya bisa dipakai bersamaan dalam satu query.</Note>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 18 · Urutan eksekusi ─────────────────────────────────────────────────────────
const S18 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Cara database membaca query" />
      <SlideTitle sub="Kamu MENULIS dengan urutan satu — tapi database MENGEKSEKUSI dengan urutan berbeda.">
        Urutan eksekusi SQL
      </SlideTitle>
      <div className="rounded-xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.04] p-3 mb-4 font-mono text-xs text-center text-gray-400">
        SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT
        <span className="block text-[10px] text-gray-600 mt-1">↑ urutan menulis</span>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-2 mb-5">
        {[
          ['FROM', 'tabel mana?'],
          ['WHERE', 'saring baris'],
          ['GROUP BY', 'kelompokkan'],
          ['HAVING', 'saring kelompok'],
          ['SELECT', 'pilih kolom'],
          ['ORDER BY', 'urutkan'],
          ['LIMIT', 'potong'],
        ].map(([step, desc], i, arr) => (
          <div key={step} className="flex items-center gap-2">
            <div className="rounded-lg border border-[#1FA79B]/30 bg-[#1FA79B]/[0.08] px-3 py-2 text-center">
              <div className="text-[10px] text-gray-500">{i + 1}</div>
              <div className="font-mono text-sm font-semibold text-[#6DC4AA]">{step}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{desc}</div>
            </div>
            {i < arr.length - 1 && <ArrowRight size={14} className="text-gray-600 shrink-0" />}
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Note>
          <Code2 size={13} className="inline text-[#6DC4AA] mr-1" /> <span className="text-gray-200 font-medium">Akibatnya:</span> alias yang dibuat di <span className="font-mono">SELECT</span> belum bisa dipakai di <span className="font-mono">WHERE</span> — karena WHERE berjalan lebih dulu.
        </Note>
        <Note>
          GROUP BY berjalan setelah WHERE tapi sebelum SELECT — itulah kenapa <span className="font-mono">HAVING</span> (penyaring kelompok) terpisah dari <span className="font-mono">WHERE</span> (penyaring baris).
        </Note>
      </div>
    </div>
  </Shell>
)

// ── 19 · Error umum ──────────────────────────────────────────────────────────────
const S19 = (
  <Shell>
    <div className={WRAP}>
      <Tag label="Saat query gagal" />
      <SlideTitle>Error umum &amp; cara membacanya</SlideTitle>
      <div className="grid lg:grid-cols-2 gap-5 items-start">
        <div className="grid gap-3">
          {[
            ['column does not exist', 'Salah eja nama kolom, atau kolom tidak ada di tabel itu.'],
            ['table does not exist', 'Salah eja nama tabel, atau query di database/schema yang salah.'],
            ['syntax error at or near…', 'Typo keyword, koma hilang, atau tanda kurung belum ditutup.'],
            ['must appear in GROUP BY', 'Ada kolom non-agregat di SELECT yang lupa dimasukkan ke GROUP BY.'],
            ['0 baris (tanpa error)', 'WHERE terlalu ketat — menyaring semuanya. Longgarkan kondisinya.'],
          ].map(([e, d]) => (
            <div key={e as string} className="rounded-xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.04] p-3.5">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                <span className="font-mono text-xs text-amber-300">{e as string}</span>
              </div>
              <p className="text-xs text-gray-400 pl-6">{d as string}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <Panel icon={<Bug size={16} />} title="Checklist debugging">
            <ol className="space-y-2 text-xs text-gray-300 list-decimal list-inside">
              <li>Baca pesan error dari <span className="text-gray-200">bawah ke atas</span></li>
              <li>Cek ejaan nama tabel &amp; kolom</li>
              <li>Pastikan kutip tunggal untuk teks, titik koma di akhir</li>
              <li>Pecah query besar jadi bagian-bagian kecil</li>
              <li>Jalankan ulang tiap bagian sampai ketemu sumbernya</li>
            </ol>
          </Panel>
          <Note>🐛 Error itu wajar — bahkan analyst senior sering kena. Yang membedakan: bisa membaca pesan error dengan tenang. Tempel error apa pun ke channel diskusi.</Note>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 20 · Penutup / kesimpulan (brand Talentiv) ──────────────────────────────────
const S20 = (
  <div className="w-full min-h-full relative overflow-hidden flex items-center">
    <Glow className="top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[480px] bg-[#1FA79B]/18" />
    <Glow className="bottom-0 right-1/4 w-[460px] h-[320px] bg-[#6DC4AA]/12" />
    <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center py-10">
      <img src={BRAND.logoWhite} alt="Talentiv" className="h-8 mx-auto mb-7 object-contain opacity-90" />
      <Tag label="Kesimpulan utama" />
      <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-7">
        Kamu baru saja menguasai{' '}
        <span className="bg-gradient-to-r from-[#1FA79B] to-[#6DC4AA] bg-clip-text text-transparent">fondasi SQL.</span>
      </h2>
      <div className="grid sm:grid-cols-2 gap-3 text-left max-w-3xl mx-auto mb-7">
        {[
          'SELECT memilih kolom · FROM memilih tabel · WHERE menyaring baris',
          'Operator: = != > < BETWEEN IN LIKE IS NULL',
          'AND butuh keduanya · OR butuh salah satu · pakai ( ) saat dicampur',
          'Agregat: COUNT SUM AVG MIN MAX — diringkas per GROUP BY',
          'WHERE menyaring baris · HAVING menyaring kelompok',
          'SQL dieksekusi: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT',
        ].map(t => (
          <div key={t} className="flex items-start gap-2.5 rounded-xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.06] px-4 py-3">
            <CheckCircle2 size={15} className="text-[#6DC4AA] mt-0.5 shrink-0" />
            <span className="text-sm text-gray-300">{t}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1FA79B]/30 bg-[#1FA79B]/10 px-5 py-2.5">
          <Table2 size={15} className="text-[#6DC4AA]" />
          <span className="text-sm text-[#D1EDE5] font-medium">Sesi berikutnya: JOIN &amp; CTE — menggabungkan tabel</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.08] px-5 py-2.5">
          <Code2 size={15} className="text-[#6DC4AA]" />
          <span className="text-sm text-gray-300">Lanjut ke latihan SQL (auto-graded) di platform</span>
        </div>
      </div>
    </div>
  </div>
)

export const sqlBasicsSession4: Presentation = {
  id: 'da-session-04-sql-basics',
  program: 'Data Analyst Program',
  session: 'Sesi 04',
  title: 'SQL Dasar — SELECT, Filter, Aggregasi',
  subtitle: 'Dari query pertamamu sampai meringkas ribuan baris menjadi satu angka.',
  durationMin: 90,
  slides: [
    { label: 'Pembuka', render: S01, notes: `SELAMAT DATANG. Sesi 4 — titik balik program: dari Excel ke SQL.\n• Tanya kelas: "Siapa yang pernah pakai SQL?" — kalibrasi level.\n• Janji sesi: di akhir 90 menit, mereka bisa menulis query nyata sendiri.\n• Tekankan: SQL adalah skill #1 yang dicari di lowongan data analyst.\n⏱️ ~2 menit. Lanjut saat energi kelas sudah naik.` },
    { label: 'Apa itu database', render: S02, notes: `TUJUAN: bangun intuisi sebelum sintaks.\n• Pakai analogi toko online — minta mereka bayangkan datanya sendiri.\n• Pancing: "Kenapa Excel gagal di skala besar?" Biarkan mereka jawab dulu.\n• Poin kunci: database menegakkan ATURAN (konsistensi) — ini yang Excel tidak punya.\n• Tabel perbandingan: telusuri tiap baris. Jangan masuk teknis dulu.` },
    { label: 'Tabel relasional', render: S03, notes: `INTI: konsep relasi via key.\n• Tunjuk customer_id di tabel orders → "kenapa tidak simpan nama Budi langsung di sini?"\n• Jawaban: hindari duplikasi & inkonsistensi (normalisasi).\n• Bedakan primary key (ID unik tabel sendiri) vs foreign key (menunjuk tabel lain).\n• Foreshadow: "Sesi depan kita JOIN tabel ini pakai key tadi."` },
    { label: 'Apa itu SQL', render: S04, notes: `• Ringan & cepat. Soal pelafalan biasanya bikin kelas tertawa — pakai untuk cairkan suasana.\n• Tekankan "deklaratif": kita bilang APA, bukan BAGAIMANA (pakai panel perbandingan).\n• Tunjuk daftar dialek — skill yang sama dipakai di BigQuery (sesi 7) & Python (sesi 10).\n• Tunjukkan roadmap chips: inilah yang akan dikuasai hari ini.` },
    { label: 'SELECT', render: S05, notes: `MULAI HANDS-ON di sini kalau ada playground.\n• Tulis query live, jangan cuma baca slide.\n• Pakai "anatomi query": tunjuk SELECT=kolom, FROM=tabel, ;=akhir.\n• Demo perbedaan SELECT name,email vs SELECT * pada tabel nyata.\n• Tekankan kebiasaan menulis kolom eksplisit (do/don't di kanan).` },
    { label: 'Alias AS', render: S06, notes: `• Singkat. Tunjukkan output header berubah (sebelum/sesudah), datanya tidak.\n• Tunjuk 3 kegunaan: ganti nama, alias berspasi (kutip ganda), alias pada hasil hitungan (price*qty).\n• Catatan: AS opsional tapi tetap pakai biar jelas.` },
    { label: 'WHERE', render: S07, notes: `KONSEP BESAR: menyaring baris.\n• Analogi: WHERE = filter di Excel, tapi lebih kuat.\n• Live: jalankan tanpa WHERE (banyak baris) lalu tambah WHERE city='Jakarta'.\n• Ingatkan: teks pakai kutip tunggal 'Jakarta', angka tidak.\n• Telusuri tabel operator. != dan <> sama saja.` },
    { label: 'BETWEEN & IN', render: S08, notes: `• BETWEEN itu INKLUSIF — tegaskan kedua ujung ikut (lihat box peringatan). Sering jadi soal jebakan.\n• Tunjuk versi tanggal & NOT BETWEEN.\n• IN: tunjukkan betapa ribetnya kalau ditulis pakai OR berulang; tunjuk NOT IN.\n• Tantangan cepat: "Tulis ulang IN ('A','B') pakai OR."` },
    { label: 'LIKE', render: S09, notes: `• Wildcard % dan _ — pakai legenda di atas.\n• Demo live ketiganya. Yang '_____' (5 underscore) sering bikin "aha".\n• Pakai tabel pola→cocok untuk memantapkan.\n• Tips dunia nyata: LOWER()/ILIKE untuk case-insensitive. Ingatkan '%xxx%' lambat di tabel besar.` },
    { label: 'IS NULL', render: S10, notes: `⚠️ SLIDE PALING SERING SALAH. Beri waktu ekstra.\n• Tegaskan via tabel: NULL ≠ 0 ≠ string kosong.\n• Demo: WHERE phone = NULL → 0 baris (kaget), lalu IS NULL → benar.\n• Tanya kelas KENAPA = NULL gagal (NULL = unknown, perbandingan tak pernah TRUE).\n• Sebut COALESCE untuk mengganti NULL dengan default.` },
    { label: 'AND vs OR', render: S11, notes: `• Pakai tabel kebenaran — telusuri tiap baris bareng kelas.\n• Tambahkan NOT (membalik kondisi).\n• Miskonsepsi umum: orang baca "OR" seperti bahasa sehari-hari (eksklusif). Luruskan pakai catatan.\n• Contoh konkret: "Jakarta DAN 2024" vs "Jakarta ATAU Surabaya".` },
    { label: 'Tanda kurung', render: S12, notes: `LANJUTAN langsung dari slide sebelumnya — momen "gotcha".\n• Tulis query TANPA kurung, tanyakan "apa hasilnya?" → tunjukkan beda (2 kartu).\n• Sebut urutan prioritas: NOT → AND → OR; kurung mengalahkan semuanya.\n• Aturan emas: campur AND+OR → SELALU kurung. Sumber bug senyap #1 di laporan nyata.` },
    { label: 'ORDER BY', render: S13, notes: `• ASC default — sering lupa, ingatkan.\n• Demo multi-kolom pakai tabel hasil: urut kota A→Z, lalu dalam kota urut tahun terbaru.\n• Sebut NULLS FIRST/LAST untuk posisi nilai kosong.\n• Catatan: ORDER BY berjalan di akhir (sambungkan ke slide urutan eksekusi).` },
    { label: 'LIMIT', render: S14, notes: `• Cerita nyata: query SELECT * tanpa LIMIT di tabel jutaan baris → browser/tool hang.\n• Kebiasaan: SELALU LIMIT saat eksplorasi awal.\n• Tunjuk OFFSET untuk paginasi (halaman ke-2).\n• Catatan dialek: SQL Server pakai TOP, standar pakai FETCH FIRST.` },
    { label: 'Fungsi agregat', render: S15, notes: `TRANSISI: dari "lihat baris" ke "ringkas baris".\n• Analogi: agregat = tombol Σ / AVERAGE di Excel.\n• Tunjuk tiga rasa COUNT: COUNT(*) vs COUNT(kolom) [abaikan NULL] vs COUNT(DISTINCT).\n• Demo satu per satu pakai tabel hasil agar terasa. Sebut bisa digabung WHERE.` },
    { label: 'GROUP BY', render: S16, notes: `KONSEP TERSULIT sesi ini. Pelan-pelan.\n• Analogi kuat: GROUP BY = Pivot Table (Rows = GROUP BY, Values = agregat).\n• Pakai panel 3 langkah: kelompokkan → hitung agregat per grup → satu baris per grup.\n• Tunjuk grouping multi-kolom (category, city).\n• ATURAN BESI: tiap kolom non-agregat di SELECT wajib ada di GROUP BY.` },
    { label: 'HAVING vs WHERE', render: S17, notes: `• Bedakan tegas pakai tabel: WHERE = sebelum grouping (baris), HAVING = sesudah (grup).\n• Kalimat kunci: "WHERE tidak bisa pakai COUNT(), HAVING bisa."\n• Telusuri contoh lengkap (WHERE + GROUP BY + HAVING dalam satu query).\n• Demo: WHERE COUNT(*)>100 → ERROR; pindah ke HAVING → berhasil.` },
    { label: 'Urutan eksekusi', render: S18, notes: `SLIDE "PEREKAT" — menyatukan semuanya.\n• Tekankan beda urutan TULIS vs EKSEKUSI (bandingkan baris atas dengan rangkaian langkah).\n• Bom pemahaman: alias SELECT tidak bisa dipakai di WHERE karena WHERE jalan duluan.\n• Jelaskan kenapa HAVING terpisah dari WHERE (GROUP BY di antara keduanya).` },
    { label: 'Error umum', render: S19, notes: `• Normalisasi error: "error itu wajar, bahkan analyst senior sering kena."\n• Telusuri tiap error + artinya; tambahkan 'must appear in GROUP BY' (nyambung slide 16).\n• Ajarkan checklist debugging: baca dari bawah, cek ejaan, pecah query jadi kecil.\n• Tawarkan: tempel error apa pun yang muncul di latihan ke channel diskusi.` },
    { label: 'Penutup', render: S20, notes: `RANGKUM & jembatani ke latihan.\n• Ulang 6 takeaway cepat — minta kelas sebutkan, jangan kamu yang baca semua.\n• Arahkan ke latihan SQL di platform (auto-graded).\n• Teaser sesi 5: JOIN — "ingat customer_id tadi? Itu kuncinya."\n• Buka sesi tanya-jawab.` },
  ],
}
