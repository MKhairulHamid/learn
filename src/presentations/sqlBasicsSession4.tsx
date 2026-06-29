import { useState } from 'react'
import {
  Database, Table2, Search, Filter, ListOrdered, Sigma, Layers,
  AlertTriangle, CheckCircle2, XCircle, ArrowRight, Braces, KeyRound,
} from 'lucide-react'
import {
  BRAND, Shell, Glow, Tag, SlideTitle, Bullet, Card, Sql, DataTable,
  type Presentation,
} from './primitives'

/** Hero visual for the opening slide — uses the Talentiv hero image, with a
 *  branded SQL query→result card as a graceful fallback if the image fails. */
function HeroVisual() {
  const [failed, setFailed] = useState(false)
  if (!failed) {
    return (
      <img
        src={BRAND.heroImage}
        alt=""
        onError={() => setFailed(true)}
        className="w-full max-w-[480px] mx-auto drop-shadow-2xl"
      />
    )
  }
  return (
    <div className="max-w-[460px] mx-auto rounded-2xl border border-white/10 bg-[#0b1220]/80 shadow-2xl shadow-black/50 overflow-hidden">
      <div className="bg-white/[0.04] px-4 py-2 flex items-center gap-2 border-b border-white/[0.06]">
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
            rows={[
              ['Budi Santoso', 'Jakarta', 14],
              ['Sari Dewi', 'Jakarta', 9],
            ]}
          />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Data Analyst · Session 04 — SQL Dasar: SELECT, Filter, Aggregasi
   20 slides. High information density, step-by-step, instructor talking points.
───────────────────────────────────────────────────────────────────────────── */

// ── 01 · Opening (Talentiv brand) ──────────────────────────────────────────────
const S01 = (
  <div className="w-full h-full relative overflow-hidden flex items-center">
    <Glow className="top-1/4 left-1/3 w-[700px] h-[460px] bg-[#1FA79B]/20" />
    <Glow className="bottom-0 right-0 w-[500px] h-[400px] bg-[#6DC4AA]/12" />
    <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 grid lg:grid-cols-2 gap-8 items-center">
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
        <div className="mt-7 flex flex-wrap gap-2 text-xs">
          {['Unit SKKNI 3 & 4', 'SELECT · WHERE · ORDER BY', 'GROUP BY · HAVING', '20 slide'].map(t => (
            <span key={t} className="border border-white/10 bg-white/[0.04] rounded-full px-3 py-1 text-gray-300">{t}</span>
          ))}
        </div>
      </div>
      <div className="hidden lg:block">
        <HeroVisual />
      </div>
    </div>
  </div>
)

// ── 02 · What is a database ─────────────────────────────────────────────────────
const S02 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Mulai dari nol" />
      <SlideTitle sub="Bayangkan kamu menjalankan toko online dengan 10.000 pelanggan, 5.000 produk, dan 200.000 pesanan. Excel mulai lambat, sering crash, susah dipakai banyak orang sekaligus.">
        Apa itu <span className="text-[#6DC4AA]">Database</span>?
      </SlideTitle>
      <div className="grid sm:grid-cols-2 gap-5">
        <Card className="border-red-500/20 bg-red-500/[0.05]">
          <div className="flex items-center gap-2 mb-3 text-red-400 text-xs font-semibold uppercase tracking-widest">
            <XCircle size={14} /> Excel saat data membesar
          </div>
          <ul className="space-y-2.5">
            <Bullet tone="bad">Lambat & sering crash di atas puluhan ribu baris</Bullet>
            <Bullet tone="bad">Susah dipakai banyak orang bersamaan</Bullet>
            <Bullet tone="bad">Tidak ada aturan: harga bisa negatif, ID bisa kosong</Bullet>
          </ul>
        </Card>
        <Card className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <div className="flex items-center gap-2 mb-3 text-[#6DC4AA] text-xs font-semibold uppercase tracking-widest">
            <Database size={14} /> Database
          </div>
          <ul className="space-y-2.5">
            <Bullet>Jutaan–miliaran baris tanpa melambat</Bullet>
            <Bullet>Banyak orang membaca & menulis bersamaan</Bullet>
            <Bullet>Menegakkan aturan & menjaga data konsisten</Bullet>
            <Bullet>Tabel bisa <span className="text-[#6DC4AA] font-medium">saling terhubung</span></Bullet>
          </ul>
        </Card>
      </div>
      <p className="text-center text-sm text-gray-500 mt-6">
        Analogi: database = sekumpulan file Excel yang sangat terorganisir (disebut <span className="text-gray-300 font-mono">tabel</span>) — tapi jauh lebih kuat.
      </p>
    </div>
  </Shell>
)

// ── 03 · Relational tables ──────────────────────────────────────────────────────
const S03 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Database relasional" />
      <SlideTitle sub="Data disimpan di beberapa tabel yang terhubung lewat kolom bersama (key). Tabel orders tidak mengulang nama Budi — cukup simpan customer_id-nya.">
        Tabel yang <span className="text-[#6DC4AA]">saling terhubung</span>
      </SlideTitle>
      <div className="space-y-3">
        <DataTable
          caption="customers"
          columns={['customer_id', 'name', 'email', 'city']}
          highlightCol={0}
          rows={[
            [1, 'Budi Santoso', 'budi@email.com', 'Jakarta'],
            [2, 'Sari Dewi', 'sari@email.com', 'Surabaya'],
          ]}
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <DataTable
            caption="products"
            columns={['product_id', 'product_name', 'price', 'category']}
            rows={[
              [101, 'Wireless Mouse', 180000, 'Electronics'],
              [102, 'Notebook A5', 25000, 'Stationery'],
            ]}
          />
          <DataTable
            caption="orders"
            columns={['order_id', 'customer_id', 'product_id', 'qty']}
            highlightCol={1}
            rows={[
              [5001, 1, 101, 2],
              [5002, 2, 102, 5],
            ]}
          />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-400">
        <KeyRound size={15} className="text-[#1FA79B]" />
        <span><span className="text-[#6DC4AA] font-medium">customer_id</span> menghubungkan <span className="font-mono text-gray-300">orders</span> ke <span className="font-mono text-gray-300">customers</span> — tanpa duplikasi data.</span>
      </div>
    </div>
  </Shell>
)

// ── 04 · What is SQL ────────────────────────────────────────────────────────────
const S04 = (
  <Shell>
    <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
      <Tag label="Bahasanya" />
      <SlideTitle>
        SQL = <span className="text-[#6DC4AA]">Structured Query Language</span>
      </SlideTitle>
      <p className="text-gray-400 max-w-2xl mx-auto mt-2 mb-8">
        Bukan bahasa pemrograman biasa — ini <span className="text-gray-200 font-medium">bahasa query</span>.
        Kamu mendeskripsikan <span className="text-[#6DC4AA]">apa</span> data yang kamu mau, database mengurus <span className="text-gray-300">bagaimana</span> mengambilnya.
      </p>
      <div className="grid sm:grid-cols-3 gap-4 text-left">
        <Card>
          <div className="text-[#1FA79B] mb-2"><Braces size={20} /></div>
          <h3 className="font-semibold text-white text-sm mb-1">Cara baca</h3>
          <p className="text-xs text-gray-400">"S-Q-L" atau "sequel" — keduanya benar. Mayoritas profesional bilang <span className="text-gray-200">"sequel"</span>.</p>
        </Card>
        <Card>
          <div className="text-[#1FA79B] mb-2"><Database size={20} /></div>
          <h3 className="font-semibold text-white text-sm mb-1">Di mana dipakai</h3>
          <p className="text-xs text-gray-400">PostgreSQL, MySQL, SQL Server, SQLite, BigQuery, Snowflake — semua bicara SQL.</p>
        </Card>
        <Card className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <div className="text-[#6DC4AA] mb-2"><CheckCircle2 size={20} /></div>
          <h3 className="font-semibold text-white text-sm mb-1">Kenapa penting</h3>
          <p className="text-xs text-gray-300">Skill <span className="text-[#6DC4AA] font-semibold">#1</span> untuk seorang data analyst. Titik.</p>
        </Card>
      </div>
    </div>
  </Shell>
)

// ── 05 · SELECT basics ──────────────────────────────────────────────────────────
const S05 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Query pertama" />
      <SlideTitle sub="Setiap query SQL dimulai dengan SELECT — memberi tahu database: 'berikan aku kolom-kolom ini'.">
        <Search size={28} className="inline mr-2 text-[#1FA79B] mb-1" />
        Pernyataan <span className="text-[#6DC4AA]">SELECT</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-2 gap-5 items-start">
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Sintaks dasar</p>
          <Sql>{`SELECT kolom1, kolom2, kolom3
FROM nama_tabel;`}</Sql>
          <p className="text-xs text-gray-500">Titik koma <span className="font-mono text-gray-300">;</span> menandai akhir query. Selalu sertakan.</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest pt-2">Pilih kolom tertentu</p>
          <Sql>{`SELECT name, email, city
FROM customers;`}</Sql>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Semua kolom dengan *</p>
          <Sql>{`SELECT *
FROM customers;`}</Sql>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3.5 flex gap-2.5">
            <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/90">
              Pakai <span className="font-mono">SELECT *</span> secukupnya. Di tabel nyata dengan 50+ kolom, ini menarik banyak data yang tidak perlu.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 06 · Aliasing ───────────────────────────────────────────────────────────────
const S06 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Mempercantik output" />
      <SlideTitle sub="Ganti nama kolom di hasil query agar lebih mudah dibaca — pakai kata kunci AS.">
        Alias dengan <span className="text-[#6DC4AA]">AS</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-2 gap-6 items-center">
        <Sql>{`SELECT
    name  AS nama_pelanggan,
    email AS kontak_email,
    city  AS lokasi
FROM customers;`}</Sql>
        <div>
          <p className="text-xs text-gray-500 mb-2">Header kolom di output berubah:</p>
          <DataTable
            columns={['nama_pelanggan', 'kontak_email', 'lokasi']}
            rows={[
              ['Budi Santoso', 'budi@email.com', 'Jakarta'],
              ['Sari Dewi', 'sari@email.com', 'Surabaya'],
            ]}
          />
          <p className="text-xs text-gray-500 mt-3">Data tidak berubah — hanya label kolomnya. Berguna saat hasil dipakai untuk laporan.</p>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 07 · WHERE + comparison operators ───────────────────────────────────────────
const S07 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Menyaring baris" />
      <SlideTitle sub="WHERE mengambil hanya baris yang memenuhi kondisi. Anggap saja sebuah filter.">
        <Filter size={26} className="inline mr-2 text-[#1FA79B] mb-1" />
        Klausa <span className="text-[#6DC4AA]">WHERE</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-2 gap-6 items-start">
        <Sql>{`SELECT name, email, city
FROM customers
WHERE city = 'Jakarta';`}</Sql>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Operator perbandingan</p>
          <div className="rounded-xl border border-white/[0.08] overflow-hidden text-xs">
            {[
              ['=', 'Sama dengan', "city = 'Jakarta'"],
              ['!=  <>', 'Tidak sama', "city != 'Jakarta'"],
              ['>', 'Lebih besar', 'price > 100000'],
              ['<', 'Lebih kecil', 'price < 100000'],
              ['>=', 'Lebih besar / sama', 'price >= 100000'],
              ['<=', 'Lebih kecil / sama', 'price <= 100000'],
            ].map((r, i) => (
              <div key={i} className="grid grid-cols-[70px_1fr] gap-2 px-3 py-1.5 border-t border-white/[0.05] first:border-0 items-center">
                <span className="font-mono text-[#6DC4AA] font-semibold">{r[0]}</span>
                <span className="text-gray-400">{r[1]} <span className="text-gray-600 font-mono">— {r[2]}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 08 · BETWEEN + IN ───────────────────────────────────────────────────────────
const S08 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Menyaring lebih cerdas" />
      <SlideTitle><span className="text-[#6DC4AA]">BETWEEN</span> &amp; <span className="text-[#6DC4AA]">IN</span></SlideTitle>
      <div className="grid sm:grid-cols-2 gap-6 mt-4">
        <Card>
          <h3 className="font-semibold text-white mb-1">BETWEEN — rentang nilai</h3>
          <p className="text-xs text-gray-500 mb-3">Inklusif: kedua ujung ikut terhitung.</p>
          <Sql>{`SELECT product_name, price
FROM products
WHERE price BETWEEN 50000 AND 200000;`}</Sql>
          <p className="text-xs text-gray-500 mt-3">Sama dengan <span className="font-mono text-gray-400">price &gt;= 50000 AND price &lt;= 200000</span></p>
        </Card>
        <Card>
          <h3 className="font-semibold text-white mb-1">IN — cocok salah satu dari daftar</h3>
          <p className="text-xs text-gray-500 mb-3">Lebih ringkas daripada banyak OR.</p>
          <Sql>{`SELECT name, city
FROM customers
WHERE city IN ('Jakarta', 'Surabaya', 'Bandung');`}</Sql>
          <p className="text-xs text-gray-500 mt-3">Ganti <span className="font-mono text-gray-400">city = 'Jakarta' OR city = 'Surabaya' OR ...</span></p>
        </Card>
      </div>
    </div>
  </Shell>
)

// ── 09 · LIKE ───────────────────────────────────────────────────────────────────
const S09 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Pencocokan pola" />
      <SlideTitle sub="LIKE mencari kecocokan parsial dengan wildcard.">
        Pencarian teks dengan <span className="text-[#6DC4AA]">LIKE</span>
      </SlideTitle>
      <div className="flex justify-center gap-6 mb-5 text-sm">
        <div className="flex items-center gap-2"><span className="font-mono text-[#6DC4AA] text-lg">%</span><span className="text-gray-400">karakter apa pun (0 atau lebih)</span></div>
        <div className="flex items-center gap-2"><span className="font-mono text-[#6DC4AA] text-lg">_</span><span className="text-gray-400">tepat satu karakter</span></div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Email diakhiri @gmail.com</p>
          <Sql>{`WHERE email
LIKE '%@gmail.com'`}</Sql>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Nama diawali "Wireless"</p>
          <Sql>{`WHERE product_name
LIKE 'Wireless%'`}</Sql>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Nama tepat 5 karakter</p>
          <Sql>{`WHERE product_name
LIKE '_____'`}</Sql>
        </div>
      </div>
      <div className="mt-5 rounded-xl border border-[#1FA79B]/20 bg-[#1FA79B]/[0.06] p-3.5 text-xs text-gray-300">
        💡 Gabung dengan <span className="font-mono text-[#6DC4AA]">LOWER()</span> agar tidak case-sensitive:
        <span className="font-mono text-gray-200"> WHERE LOWER(product_name) LIKE '%wireless%'</span>
      </div>
    </div>
  </Shell>
)

// ── 10 · IS NULL ────────────────────────────────────────────────────────────────
const S10 = (
  <Shell>
    <div className="relative z-10 max-w-4xl mx-auto w-full">
      <Tag label="Nilai kosong" />
      <SlideTitle sub="NULL berarti 'tidak ada nilai' / 'tidak diketahui'. Ini BUKAN nol, dan BUKAN string kosong.">
        <span className="text-[#6DC4AA]">IS NULL</span> &amp; IS NOT NULL
      </SlideTitle>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Pelanggan belum mengisi nomor telepon</p>
          <Sql>{`SELECT name, email
FROM customers
WHERE phone IS NULL;`}</Sql>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Pesanan yang sudah dikirim</p>
          <Sql>{`SELECT order_id
FROM orders
WHERE shipped_date IS NOT NULL;`}</Sql>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-red-500/25 bg-red-500/[0.07] p-5 flex gap-4 items-center">
        <AlertTriangle size={28} className="text-red-400 shrink-0" />
        <div>
          <p className="font-semibold text-white mb-1">Aturan kritis</p>
          <p className="text-sm text-gray-300">
            Kamu <span className="text-red-300 font-semibold">TIDAK BISA</span> pakai <span className="font-mono">= NULL</span>.
            Harus pakai <span className="font-mono text-[#6DC4AA]">IS NULL</span>.
            <span className="font-mono text-gray-500"> WHERE phone = NULL</span> selalu mengembalikan 0 baris.
          </p>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 11 · AND vs OR + truth table ────────────────────────────────────────────────
const S11 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Menggabungkan kondisi" />
      <SlideTitle><span className="text-[#6DC4AA]">AND</span> vs <span className="text-[#6DC4AA]">OR</span></SlideTitle>
      <div className="grid sm:grid-cols-2 gap-6 mt-4 items-start">
        <div className="space-y-3">
          <Card>
            <h3 className="text-sm font-semibold text-white mb-1">AND — kedua kondisi harus benar</h3>
            <Sql>{`WHERE city = 'Jakarta'
  AND registration_year = 2024;`}</Sql>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-white mb-1">OR — setidaknya satu benar</h3>
            <Sql>{`WHERE city = 'Jakarta'
   OR city = 'Surabaya';`}</Sql>
          </Card>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Tabel kebenaran</p>
          <table className="w-full text-xs rounded-xl overflow-hidden border border-white/[0.08]">
            <thead>
              <tr className="bg-white/[0.04] text-gray-400">
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
                <tr key={i} className="border-t border-white/[0.05]">
                  <td className="px-3 py-1.5 text-gray-400">{r[0] as string}</td>
                  <td className="px-3 py-1.5 text-gray-400">{r[1] as string}</td>
                  <td className={`px-3 py-1.5 text-center ${r[2] ? 'text-[#6DC4AA]' : 'text-gray-600'}`}>{r[2] ? 'TRUE' : 'FALSE'}</td>
                  <td className={`px-3 py-1.5 text-center ${r[3] ? 'text-[#6DC4AA]' : 'text-gray-600'}`}>{r[3] ? 'TRUE' : 'FALSE'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 12 · Parentheses ────────────────────────────────────────────────────────────
const S12 = (
  <Shell>
    <div className="relative z-10 max-w-4xl mx-auto w-full">
      <Tag label="Jangan sampai salah logika" />
      <SlideTitle sub="Saat mencampur AND dan OR, selalu pakai tanda kurung untuk memperjelas maksudmu.">
        Gabung AND + OR → pakai <span className="text-[#6DC4AA]">( )</span>
      </SlideTitle>
      <p className="text-sm text-gray-400 mb-3 text-center">
        Pelanggan Jakarta yang belanja &gt; 1 juta, <span className="text-gray-200">ATAU</span> siapa pun yang VIP:
      </p>
      <Sql>{`SELECT name, city, total_spent, is_vip
FROM customers
WHERE (city = 'Jakarta' AND total_spent > 1000000) OR is_vip = TRUE;`}</Sql>
      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#1FA79B]/25 bg-[#1FA79B]/[0.06] p-4">
          <div className="flex items-center gap-2 text-[#6DC4AA] text-xs font-semibold mb-1"><CheckCircle2 size={14} /> Dengan kurung</div>
          <p className="text-xs text-gray-300">Syarat (Jakarta + &gt;1jt) dievaluasi dulu sebagai satu grup, baru di-OR dengan VIP. Sesuai maksud.</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold mb-1"><XCircle size={14} /> Tanpa kurung</div>
          <p className="text-xs text-gray-300">Logikanya berubah — AND dievaluasi lebih dulu dengan cara berbeda, hasil bisa salah total.</p>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 13 · ORDER BY ───────────────────────────────────────────────────────────────
const S13 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Mengurutkan hasil" />
      <SlideTitle>
        <ListOrdered size={26} className="inline mr-2 text-[#1FA79B] mb-1" />
        <span className="text-[#6DC4AA]">ORDER BY</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Naik (default)</p>
          <Sql>{`ORDER BY price;
-- ASC: rendah → tinggi`}</Sql>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Turun</p>
          <Sql>{`ORDER BY price DESC;
-- tinggi → rendah`}</Sql>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Beberapa kolom</p>
          <Sql>{`ORDER BY city ASC,
  registration_year DESC;`}</Sql>
        </div>
      </div>
      <p className="text-center text-sm text-gray-400 mt-6 max-w-2xl mx-auto">
        Kolom kedua hanya menjadi penentu urutan <span className="text-gray-200">di dalam</span> nilai kolom pertama yang sama —
        urutkan kota A→Z, lalu di tiap kota tampilkan pendaftaran terbaru dulu.
      </p>
    </div>
  </Shell>
)

// ── 14 · LIMIT ──────────────────────────────────────────────────────────────────
const S14 = (
  <Shell>
    <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
      <Tag label="Kebiasaan baik" />
      <SlideTitle sub="Di database nyata dengan jutaan baris, SELECT * tanpa LIMIT bisa membuat tool macet dan membebani server.">
        Selalu pakai <span className="text-[#6DC4AA]">LIMIT</span> saat eksplorasi
      </SlideTitle>
      <Sql className="text-left max-w-md mx-auto">{`SELECT *
FROM orders
LIMIT 10;   -- cukup ambil 10 baris pertama`}</Sql>
      <div className="grid sm:grid-cols-3 gap-3 mt-6 text-left">
        {[
          ['Tanpa LIMIT', 'Bisa menarik jutaan baris → tool query macet', 'bad'],
          ['Butuh waktu lama', 'Query bisa berjalan bermenit-menit', 'bad'],
          ['Dengan LIMIT', '"Tunjukkan sampelnya dulu" — cepat & aman', 'good'],
        ].map(([t, d, tone]) => (
          <div key={t as string} className={`rounded-xl border p-4 ${tone === 'good' ? 'border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]' : 'border-white/[0.08] bg-white/[0.02]'}`}>
            <p className={`text-sm font-semibold mb-1 ${tone === 'good' ? 'text-[#6DC4AA]' : 'text-gray-300'}`}>{t as string}</p>
            <p className="text-xs text-gray-400">{d as string}</p>
          </div>
        ))}
      </div>
    </div>
  </Shell>
)

// ── 15 · Aggregate functions ────────────────────────────────────────────────────
const S15 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Dari ribuan baris jadi satu angka" />
      <SlideTitle sub="Fungsi agregat meringkas banyak baris menjadi satu nilai ringkasan.">
        <Sigma size={26} className="inline mr-2 text-[#1FA79B] mb-1" />
        Fungsi <span className="text-[#6DC4AA]">Agregat</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-5 gap-3 mb-5">
        {[
          ['COUNT', 'jumlah baris'],
          ['SUM', 'total nilai'],
          ['AVG', 'rata-rata'],
          ['MIN', 'nilai terkecil'],
          ['MAX', 'nilai terbesar'],
        ].map(([f, d]) => (
          <div key={f} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-center">
            <p className="font-mono text-[#6DC4AA] font-semibold text-sm">{f}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{d}</p>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-5 items-center">
        <Sql>{`SELECT
    COUNT(*)      AS jumlah_pesanan,
    SUM(quantity) AS total_unit,
    AVG(price)    AS harga_rata2,
    MAX(price)    AS termahal
FROM orders;`}</Sql>
        <DataTable
          columns={['jumlah_pesanan', 'total_unit', 'harga_rata2', 'termahal']}
          rows={[[200000, 512340, 84500, 4200000]]}
        />
      </div>
    </div>
  </Shell>
)

// ── 16 · GROUP BY ───────────────────────────────────────────────────────────────
const S16 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Meringkas per kelompok" />
      <SlideTitle sub="GROUP BY mengelompokkan baris yang nilainya sama, lalu fungsi agregat dihitung per kelompok.">
        <Layers size={26} className="inline mr-2 text-[#1FA79B] mb-1" />
        <span className="text-[#6DC4AA]">GROUP BY</span>
      </SlideTitle>
      <div className="grid sm:grid-cols-2 gap-6 items-center">
        <Sql>{`SELECT
    category,
    COUNT(*)   AS jumlah_produk,
    AVG(price) AS harga_rata2
FROM products
GROUP BY category
ORDER BY jumlah_produk DESC;`}</Sql>
        <div>
          <DataTable
            columns={['category', 'jumlah_produk', 'harga_rata2']}
            rows={[
              ['Electronics', 1240, 850000],
              ['Stationery', 980, 32000],
              ['Fashion', 760, 175000],
            ]}
          />
          <p className="text-xs text-gray-500 mt-3">
            Aturan: kolom non-agregat di <span className="font-mono text-gray-300">SELECT</span> harus muncul di <span className="font-mono text-gray-300">GROUP BY</span>.
          </p>
        </div>
      </div>
    </div>
  </Shell>
)

// ── 17 · HAVING vs WHERE ────────────────────────────────────────────────────────
const S17 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Menyaring hasil agregat" />
      <SlideTitle><span className="text-[#6DC4AA]">HAVING</span> vs WHERE</SlideTitle>
      <div className="grid sm:grid-cols-2 gap-5 mt-4">
        <Card>
          <div className="font-mono text-[#6DC4AA] text-sm font-semibold mb-1">WHERE</div>
          <p className="text-xs text-gray-400 mb-3">Menyaring baris <span className="text-gray-200">sebelum</span> dikelompokkan. Tidak bisa pakai fungsi agregat.</p>
          <Sql>{`WHERE price > 100000`}</Sql>
        </Card>
        <Card className="border-[#1FA79B]/25 bg-[#1FA79B]/[0.06]">
          <div className="font-mono text-[#6DC4AA] text-sm font-semibold mb-1">HAVING</div>
          <p className="text-xs text-gray-400 mb-3">Menyaring kelompok <span className="text-gray-200">setelah</span> agregasi. Boleh pakai fungsi agregat.</p>
          <Sql>{`HAVING COUNT(*) > 100`}</Sql>
        </Card>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">Contoh lengkap — kategori dengan lebih dari 100 produk:</p>
      <Sql className="mt-2 max-w-2xl mx-auto">{`SELECT category, COUNT(*) AS jumlah
FROM products
GROUP BY category
HAVING COUNT(*) > 100;`}</Sql>
    </div>
  </Shell>
)

// ── 18 · Order of execution ─────────────────────────────────────────────────────
const S18 = (
  <Shell>
    <div className="relative z-10 max-w-4xl mx-auto w-full">
      <Tag label="Cara database membaca query" />
      <SlideTitle sub="Kamu MENULIS dengan urutan ini — tapi database MENGEKSEKUSI dengan urutan berbeda.">
        Urutan eksekusi SQL
      </SlideTitle>
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 mb-5 font-mono text-xs text-center text-gray-400">
        SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT
        <span className="block text-[10px] text-gray-600 mt-1">↑ urutan menulis</span>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-2">
        {['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY', 'LIMIT'].map((step, i, arr) => (
          <div key={step} className="flex items-center gap-2">
            <div className="rounded-lg border border-[#1FA79B]/30 bg-[#1FA79B]/[0.08] px-3 py-2 text-center">
              <div className="text-[10px] text-gray-500">{i + 1}</div>
              <div className="font-mono text-sm font-semibold text-[#6DC4AA]">{step}</div>
            </div>
            {i < arr.length - 1 && <ArrowRight size={14} className="text-gray-600" />}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gray-400 mt-6 max-w-2xl mx-auto">
        Inilah kenapa alias di <span className="font-mono text-gray-300">SELECT</span> belum bisa dipakai di <span className="font-mono text-gray-300">WHERE</span> —
        WHERE berjalan lebih dulu.
      </p>
    </div>
  </Shell>
)

// ── 19 · Common errors / cheat sheet ────────────────────────────────────────────
const S19 = (
  <Shell>
    <div className="relative z-10 max-w-5xl mx-auto w-full">
      <Tag label="Saat query gagal" />
      <SlideTitle>Error umum &amp; artinya</SlideTitle>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        {[
          ['column does not exist', 'Salah eja nama kolom, atau kolom tidak ada di tabel itu.'],
          ['table does not exist', 'Salah eja nama tabel, atau query di database/schema yang salah.'],
          ['syntax error at or near…', 'Typo keyword, koma hilang, atau tanda kurung belum ditutup.'],
          ['0 baris (tanpa error)', 'WHERE terlalu ketat — menyaring semuanya. Longgarkan kondisinya.'],
        ].map(([e, d]) => (
          <div key={e as string} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-amber-400 shrink-0" />
              <span className="font-mono text-xs text-amber-300">{e as string}</span>
            </div>
            <p className="text-xs text-gray-400 pl-6">{d as string}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl border border-[#1FA79B]/20 bg-[#1FA79B]/[0.06] p-4 text-sm text-gray-300 text-center">
        🐛 Strategi debug: baca pesan error dari <span className="text-gray-200">bawah ke atas</span>, cek nama kolom/tabel, lalu pecah query jadi bagian-bagian kecil.
      </div>
    </div>
  </Shell>
)

// ── 20 · Closing / takeaways (Talentiv brand) ───────────────────────────────────
const S20 = (
  <div className="w-full h-full relative overflow-hidden flex items-center">
    <Glow className="top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[480px] bg-[#1FA79B]/18" />
    <Glow className="bottom-0 right-1/4 w-[460px] h-[320px] bg-[#6DC4AA]/12" />
    <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
      <img src={BRAND.logoWhite} alt="Talentiv" className="h-8 mx-auto mb-8 object-contain opacity-90" />
      <Tag label="Kesimpulan utama" />
      <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-8">
        Kamu baru saja menguasai{' '}
        <span className="bg-gradient-to-r from-[#1FA79B] to-[#6DC4AA] bg-clip-text text-transparent">fondasi SQL.</span>
      </h2>
      <div className="grid sm:grid-cols-2 gap-3 text-left max-w-3xl mx-auto mb-8">
        {[
          'SELECT memilih kolom · FROM memilih tabel · WHERE menyaring baris',
          'Operator: = != > < BETWEEN IN LIKE IS NULL',
          'AND butuh keduanya · OR butuh salah satu · pakai ( ) saat dicampur',
          'Agregat: COUNT SUM AVG MIN MAX — diringkas per GROUP BY',
          'WHERE menyaring baris · HAVING menyaring kelompok',
          'Selalu LIMIT saat eksplorasi data',
        ].map(t => (
          <div key={t} className="flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
            <CheckCircle2 size={15} className="text-[#6DC4AA] mt-0.5 shrink-0" />
            <span className="text-sm text-gray-300">{t}</span>
          </div>
        ))}
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#1FA79B]/30 bg-[#1FA79B]/10 px-5 py-2.5">
        <Table2 size={15} className="text-[#6DC4AA]" />
        <span className="text-sm text-[#D1EDE5] font-medium">Sesi berikutnya: JOIN &amp; CTE — menggabungkan tabel</span>
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
    { label: 'Apa itu database', render: S02, notes: `TUJUAN: bangun intuisi sebelum sintaks.\n• Pakai analogi toko online — minta mereka bayangkan datanya sendiri.\n• Pancing: "Kenapa Excel gagal di skala besar?" Biarkan mereka jawab dulu.\n• Poin kunci: database menegakkan ATURAN (konsistensi) — ini yang Excel tidak punya.\n• Jangan masuk teknis dulu; ini slide intuisi.` },
    { label: 'Tabel relasional', render: S03, notes: `INTI: konsep relasi via key.\n• Tunjuk customer_id di tabel orders → "kenapa tidak simpan nama Budi langsung di sini?"\n• Jawaban: hindari duplikasi & inkonsistensi (istilah: normalisasi — sebut singkat saja).\n• Foreshadow: "Sesi depan kita JOIN tabel ini pakai key tadi."\n⚠️ Pastikan semua paham customer_id=1 muncul di dua tabel.` },
    { label: 'Apa itu SQL', render: S04, notes: `• Ringan & cepat. Soal pelafalan biasanya bikin kelas tertawa — pakai untuk cairkan suasana.\n• Tekankan "deklaratif": kita bilang APA, bukan BAGAIMANA.\n• Sebut: skill yang sama dipakai di BigQuery (sesi 7) & Python (sesi 10).\n⏱️ ~2 menit.` },
    { label: 'SELECT', render: S05, notes: `MULAI HANDS-ON di sini kalau ada playground.\n• Tulis query live, jangan cuma baca slide.\n• Demo perbedaan SELECT name,email vs SELECT * pada tabel nyata.\n• Tekankan titik koma & kebiasaan menulis kolom eksplisit (bukan *).\n• Mini-tantangan: minta satu peserta sebutkan 3 kolom yang ingin dia lihat.` },
    { label: 'Alias AS', render: S06, notes: `• Singkat. Tunjukkan output header berubah, datanya tidak.\n• Kapan berguna: hasil untuk laporan / ekspor ke stakeholder.\n• Catatan: AS bersifat opsional di banyak DB (boleh "name nama_pelanggan") tapi pakai AS biar jelas.` },
    { label: 'WHERE', render: S07, notes: `KONSEP BESAR: menyaring baris.\n• Analogi: WHERE = filter di Excel, tapi lebih kuat.\n• Live: jalankan tanpa WHERE (banyak baris) lalu tambah WHERE city='Jakarta'.\n• Ingatkan: teks pakai kutip tunggal 'Jakarta', angka tidak.\n• Operator !=  dan <> sama saja — tergantung DB.` },
    { label: 'BETWEEN & IN', render: S08, notes: `• BETWEEN itu INKLUSIF — tegaskan kedua ujung ikut. Sering jadi soal jebakan.\n• IN: tunjukkan betapa ribetnya kalau ditulis pakai OR berulang.\n• Tantangan cepat: "Tulis ulang IN ('A','B') pakai OR." → buktikan IN lebih ringkas.` },
    { label: 'LIKE', render: S09, notes: `• Wildcard % dan _ — gambar di papan kalau perlu.\n• Demo live ketiganya. Yang '_____' (5 underscore) sering bikin "aha".\n• Tips dunia nyata: LOWER() untuk pencarian case-insensitive — sangat sering dipakai.\n• Hati-hati: LIKE '%xxx%' lambat di tabel besar (sebut singkat).` },
    { label: 'IS NULL', render: S10, notes: `⚠️ SLIDE PALING SERING SALAH. Beri waktu ekstra.\n• Tegaskan 3x: NULL ≠ 0 ≠ string kosong.\n• Demo: WHERE phone = NULL → 0 baris (kaget), lalu IS NULL → benar.\n• Tanya kelas KENAPA = NULL gagal (NULL = unknown, jadi perbandingan tidak pernah TRUE).` },
    { label: 'AND vs OR', render: S11, notes: `• Pakai tabel kebenaran — telusuri tiap baris bareng kelas.\n• Miskonsepsi umum: orang baca "OR" seperti bahasa sehari-hari (eksklusif). Luruskan.\n• Contoh konkret: "Jakarta DAN 2024" vs "Jakarta ATAU Surabaya".` },
    { label: 'Tanda kurung', render: S12, notes: `LANJUTAN langsung dari slide sebelumnya — momen "gotcha".\n• Tulis query TANPA kurung, tanyakan "apa hasilnya?" → tunjukkan beda.\n• Aturan emas: campur AND+OR → SELALU kurung. Tidak ada pengecualian untuk pemula.\n• Ini sumber bug senyap #1 di laporan nyata.` },
    { label: 'ORDER BY', render: S13, notes: `• ASC default — sering lupa, ingatkan.\n• Demo multi-kolom: urut kota A→Z, lalu dalam kota urut tahun terbaru.\n• Catatan: ORDER BY berjalan di akhir (sambungkan ke slide urutan eksekusi nanti).` },
    { label: 'LIMIT', render: S14, notes: `• Cerita nyata: query SELECT * tanpa LIMIT di tabel jutaan baris → browser/tool hang.\n• Kebiasaan: SELALU LIMIT saat eksplorasi awal.\n• Catatan dialek: SQL Server pakai TOP, bukan LIMIT (sebut singkat).` },
    { label: 'Fungsi agregat', render: S15, notes: `TRANSISI: dari "lihat baris" ke "ringkas baris".\n• Analogi: agregat = tombol Σ / AVERAGE di Excel.\n• COUNT(*) vs COUNT(kolom): COUNT(kolom) abaikan NULL — poin penting tapi jangan terlalu dalam.\n• Demo satu per satu agar terasa.` },
    { label: 'GROUP BY', render: S16, notes: `KONSEP TERSULIT sesi ini. Pelan-pelan.\n• Analogi kuat: GROUP BY = Pivot Table.\n• Visualkan: baris dikelompokkan per category, lalu agregat dihitung per grup.\n• ATURAN BESI: tiap kolom non-agregat di SELECT wajib ada di GROUP BY — error klasik kalau lupa.` },
    { label: 'HAVING vs WHERE', render: S17, notes: `• Bedakan tegas: WHERE = sebelum grouping (baris), HAVING = sesudah (grup).\n• Kalimat kunci: "WHERE tidak bisa pakai COUNT(), HAVING bisa."\n• Demo: WHERE COUNT(*)>100 → ERROR; pindah ke HAVING → berhasil.` },
    { label: 'Urutan eksekusi', render: S18, notes: `SLIDE "PEREKAT" — menyatukan semuanya.\n• Tekankan beda urutan TULIS vs EKSEKUSI.\n• Bom pemahaman: alias SELECT tidak bisa dipakai di WHERE karena WHERE jalan duluan.\n• Ini menjelaskan banyak error yang mereka temui nanti.` },
    { label: 'Error umum', render: S19, notes: `• Normalisasi error: "error itu wajar, bahkan analyst senior sering kena."\n• Ajarkan baca pesan error, jangan panik.\n• Strategi: pecah query besar jadi potongan kecil sampai ketemu sumber error.\n• Tawarkan: tempel error apa pun yang muncul di latihan ke channel diskusi.` },
    { label: 'Penutup', render: S20, notes: `RANGKUM & jembatani ke latihan.\n• Ulang 6 takeaway cepat — minta kelas sebutkan, jangan kamu yang baca semua.\n• Arahkan ke latihan SQL di platform (auto-graded).\n• Teaser sesi 5: JOIN — "ingat customer_id tadi? Itu kuncinya."\n• Buka sesi tanya-jawab.` },
  ],
}
