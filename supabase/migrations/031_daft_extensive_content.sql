-- ============================================================
-- 031: Extensive Materi for Data Analyst Fast Track (F01–F11)
--
-- Rewrites every session's content to be ~3–4× more extensive
-- than migration 027, adding several real-life (mostly Indonesian
-- business) examples for each theory/concept.
--
-- Also prepends a "Live Session Schedule" banner to every session
-- so each lesson shows the exact day + time (WIB) of its live class
-- for the July 2026 cohort (times mirror migration 026).
--
-- Dollar-quoting ($da_id$ / $da_en$) lets markdown contain
-- apostrophes and newlines freely.
-- ============================================================

-- ── F01 — Cleaning and Shaping Incoming Data ───────────────
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Angkatan Juli 2026):** Sabtu, 4 Juli 2026 · 09.00 WIB

# Sesi 1 — Membersihkan dan Merapihkan Data yang Diterima

Sebagai data analyst, sekitar **70–80% waktumu** habis untuk membersihkan data — bukan menganalisis. Data yang kamu terima dari lapangan, form pendaftaran, ekspor sistem kasir, atau unduhan marketplace hampir selalu berantakan: ada duplikat, sel kosong, spasi tersembunyi, tanggal beda format, dan angka yang tersimpan sebagai teks. Sesi ini mengajarkan cara mengubah data mentah yang kacau menjadi dataset yang rapi dan siap dianalisis.

## Kenapa Data Kotor Berbahaya

Satu baris duplikat bisa menggelembungkan total penjualan. Satu spasi tak terlihat (`"Jakarta "` vs `"Jakarta"`) membuat dua kota dianggap berbeda. Analisis sehebat apa pun akan salah kalau datanya kotor. Prinsipnya: **garbage in, garbage out**.

**Contoh nyata dampak data kotor:**
- **Toko online:** Satu pesanan yang tercatat dua kali karena refresh halaman membuat laporan omzet Oktober terlihat naik 12% — padahal itu semu. Keputusan menambah stok jadi salah.
- **HR:** Nama karyawan `"Budi Santoso"` dan `"budi  santoso"` (dua spasi) dihitung sebagai dua orang, sehingga headcount divisi tampak lebih besar dari kenyataan.
- **Keuangan:** Angka `"1.000.000"` yang tersimpan sebagai teks tidak ikut terjumlah di `SUM`, membuat total biaya bulanan lebih kecil dari seharusnya.
- **Marketing:** Alamat email `"andi@gmail.com "` (ada spasi di akhir) gagal dikirimi kampanye karena dianggap tidak valid.

## 1. Identifikasi Duplikat dan Data Kosong

### Menemukan & Menghapus Duplikat
- **Cara cepat:** blok data → **Data → Remove Duplicates**
- **Menandai dulu sebelum menghapus** (lebih aman):
```
=COUNTIF($A$2:$A$100, A2) > 1
```
Rumus ini bernilai `TRUE` untuk baris yang muncul lebih dari sekali.
- **Conditional Formatting → Highlight Cells Rules → Duplicate Values** untuk menyorotnya secara visual.

**Contoh nyata mendeteksi duplikat:**
- **E-commerce:** Kolom `order_id` seharusnya unik. `=COUNTIF(A:A, A2) > 1` menandai order yang ter-input ganda oleh dua admin.
- **Database member:** Satu pelanggan mendaftar dua kali dengan nomor HP sama. Tandai duplikat berdasarkan kolom `no_hp`, bukan `nama` (nama bisa kembar).
- **Absensi:** Karyawan tap dua kali di mesin fingerprint. Duplikat pada kombinasi `nik + tanggal` menunjukkan tap ganda yang perlu dibersihkan.

> ⚠️ Tentukan dulu **kolom kunci** yang menentukan "duplikat". Dua pelanggan bernama sama tapi ber-NIK berbeda **bukan** duplikat.

### Menemukan Sel Kosong
- **Go To Special** (`Ctrl+G` → Special → Blanks) untuk memilih semua sel kosong sekaligus.
- Menghitung sel kosong: `=COUNTBLANK(A2:A100)`
- Mengecek satu sel: `=ISBLANK(A2)`

**Contoh nyata sel kosong:**
- **Survei kepuasan:** Responden melewati pertanyaan "pendapatan bulanan". Sel kosong harus diputuskan: dibuang, diisi "Tidak menjawab", atau diisi rata-rata.
- **Data penjualan:** Kolom `diskon` kosong berarti "tidak ada diskon" (isi 0), tetapi kolom `harga` kosong berarti data rusak (harus diselidiki). Kosong tidak selalu berarti nol!
- **Data cabang:** Beberapa baris tidak punya `nama_cabang`. Gunakan Go To Special → Blanks lalu isi turun (fill down) dari baris di atasnya.

> ⚠️ Hati-hati: sel yang "terlihat kosong" bisa berisi spasi. `ISBLANK` akan menganggapnya **tidak kosong**.

## 2. Tips Error Handling

Rumus sering menghasilkan error seperti `#N/A`, `#DIV/0!`, `#VALUE!`. Bungkus rumus agar laporan tetap rapi:

| Rumus | Fungsi |
|---|---|
| `=IFERROR(rumus, "—")` | Menangani **semua** jenis error |
| `=IFNA(rumus, "tidak ada")` | Khusus error `#N/A` (mis. dari VLOOKUP) |

**Contoh nyata error handling:**
- **Pencapaian target:** `=Penjualan/Target` menghasilkan `#DIV/0!` untuk cabang baru yang target-nya belum diisi (0). Bungkus: `=IFERROR(Penjualan/Target, "Belum ada target")`.
- **Lookup produk:** `VLOOKUP` gagal menemukan kode produk yang salah ketik. `=IFERROR(VLOOKUP(A2, data, 2, FALSE), "Kode tidak dikenal")` membuat laporan tetap bersih, bukan penuh `#N/A`.
- **Konversi angka:** `=VALUE(A2)` error jika sel berisi teks non-angka. `=IFERROR(VALUE(A2), 0)` mengubah yang gagal menjadi 0.

```
=IFERROR(VLOOKUP(A2, data, 2, FALSE), "Tidak ditemukan")
=IFERROR(B2/C2, 0)
```

## 3. Merapikan Isian Data dengan Fungsi Teks

| Fungsi | Contoh | Hasil |
|---|---|---|
| `TRIM` | `=TRIM("  Budi  ")` | `Budi` |
| `CONCAT` | `=CONCAT(A2," ",B2)` | `Budi Santoso` |
| `LEFT` | `=LEFT("INV-2024",3)` | `INV` |
| `RIGHT` | `=RIGHT("INV-2024",4)` | `2024` |
| `MID` | `=MID("INV-2024-01",5,4)` | `2024` |
| `UPPER`/`LOWER`/`PROPER` | `=PROPER("budi santoso")` | `Budi Santoso` |
| `SUBSTITUTE` | `=SUBSTITUTE("Rp1.000","Rp","")` | `1.000` |

**Contoh nyata fungsi teks di dunia kerja:**
- **Form pendaftaran:** Nama ketikan user `"  aNDi   wijaya "` → `=PROPER(TRIM(A2))` menghasilkan `"Andi Wijaya"` yang rapi.
- **Kode invoice:** Dari `"INV-2026-0453"` ambil tahun dengan `=MID(A2,5,4)` → `"2026"`, dan nomor urut dengan `=RIGHT(A2,4)` → `"0453"`.
- **Nomor HP:** Menyeragamkan `"0812-3456-7890"` → `=SUBSTITUTE(A2,"-","")` menghasilkan `"081234567890"`.
- **Email:** Ambil domain dari `"andi@tokopedia.com"` untuk mengelompokkan pelanggan korporat: `=MID(A2, FIND("@",A2)+1, 100)` → `"tokopedia.com"`.
- **NIK/KTP:** Ambil kode wilayah 6 digit pertama dengan `=LEFT(A2,6)` untuk memetakan asal daerah karyawan.

### Memisahkan & Menggabungkan
- **Text to Columns** (Data → Text to Columns) untuk memecah `"Budi,Jakarta"` menjadi dua kolom.
- **Flash Fill** (`Ctrl+E`) — Excel menebak pola dari contoh yang kamu ketik.

**Contoh nyata:**
- **Alamat gabungan:** `"Jl. Merdeka No.5, Bandung, Jawa Barat"` dipecah jadi kolom jalan, kota, provinsi dengan Text to Columns (pemisah koma).
- **Nama lengkap:** Kolom `"Budi Santoso"` dipecah jadi `nama_depan` dan `nama_belakang` untuk sapaan email personal.
- **Flash Fill:** Ketik `"B. Santoso"` di samping `"Budi Santoso"`, tekan `Ctrl+E`, Excel otomatis menyingkat seluruh kolom.

## Alur Kerja Pembersihan Data (Checklist)

1. **Buat salinan** data mentah — jangan pernah menimpa aslinya.
2. Hapus baris & kolom yang benar-benar kosong.
3. `TRIM` semua kolom teks untuk menghapus spasi tersembunyi.
4. Standarkan kapitalisasi (`PROPER`/`UPPER`).
5. Periksa & tangani duplikat.
6. Perbaiki tipe data (angka tersimpan sebagai teks → `VALUE`).
7. Bungkus rumus rawan error dengan `IFERROR`.

> **Studi kasus mini:** Kamu menerima ekspor 5.000 transaksi dari kasir. Buat salinan → `TRIM` kolom nama produk → hapus 37 order duplikat berdasarkan `order_id` → ubah `total` dari teks ke angka dengan `VALUE` → bungkus rumus margin dengan `IFERROR`. Hasilnya: dataset yang bisa dipercaya untuk dianalisis.

## Kesimpulan Utama
- Data kotor menghasilkan kesimpulan yang salah — bersihkan dulu, analisis kemudian.
- `TRIM` adalah penyelamat: spasi tersembunyi adalah sumber bug paling umum.
- Kosong tidak selalu berarti nol — pahami konteks tiap kolom.
- `IFERROR`/`IFNA` membuat laporanmu terlihat profesional, bukan penuh `#N/A`.
- Selalu simpan salinan data mentah sebelum mengubah apa pun.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Saturday, 4 July 2026 · 09.00 WIB

# Session 1 — Cleaning and Shaping Incoming Data

As a data analyst, roughly **70–80% of your time** goes to cleaning data — not analyzing it. Data you receive from the field, sign-up forms, POS exports, or marketplace downloads is almost always messy: duplicates, blank cells, hidden spaces, mixed date formats, and numbers stored as text. This session teaches you how to turn chaotic raw data into a tidy, analysis-ready dataset.

## Why Dirty Data Is Dangerous

A single duplicate row can inflate total sales. One invisible space (`"Jakarta "` vs `"Jakarta"`) makes two cities look different. The best analysis in the world is wrong if the data is dirty. The principle: **garbage in, garbage out**.

**Real-world impact of dirty data:**
- **Online store:** One order recorded twice because of a page refresh makes October revenue look 12% higher — a phantom gain. The decision to restock becomes wrong.
- **HR:** Employee names `"Budi Santoso"` and `"budi  santoso"` (double space) are counted as two people, inflating a division's headcount.
- **Finance:** The value `"1,000,000"` stored as text is skipped by `SUM`, making the monthly cost total smaller than reality.
- **Marketing:** The email `"andi@gmail.com "` (trailing space) fails to receive a campaign because it's treated as invalid.

## 1. Identify Duplicates and Blank Data

### Finding & Removing Duplicates
- **Quick way:** select the data → **Data → Remove Duplicates**
- **Flag before deleting** (safer):
```
=COUNTIF($A$2:$A$100, A2) > 1
```
This is `TRUE` for any row that appears more than once.
- **Conditional Formatting → Highlight Cells Rules → Duplicate Values** to highlight them visually.

**Real examples of detecting duplicates:**
- **E-commerce:** The `order_id` column should be unique. `=COUNTIF(A:A, A2) > 1` flags orders double-entered by two staff.
- **Member database:** A customer signs up twice with the same phone number. Flag duplicates by `phone`, not `name` (names can legitimately repeat).
- **Attendance:** An employee taps twice on the fingerprint machine. Duplicates on the `employee_id + date` combination reveal double taps to clean.

> ⚠️ Decide the **key column(s)** that define a "duplicate" first. Two customers with the same name but different ID numbers are **not** duplicates.

### Finding Blank Cells
- **Go To Special** (`Ctrl+G` → Special → Blanks) to select every blank cell at once.
- Count blanks: `=COUNTBLANK(A2:A100)`
- Check one cell: `=ISBLANK(A2)`

**Real examples of blank cells:**
- **Satisfaction survey:** A respondent skips the "monthly income" question. You must decide what to do with the blank: drop it, fill "No answer", or impute the average.
- **Sales data:** A blank `discount` means "no discount" (fill 0), but a blank `price` means broken data (must investigate). Blank does not always mean zero!
- **Branch data:** Some rows lack a `branch_name`. Use Go To Special → Blanks, then fill down from the row above.

> ⚠️ Careful: a cell that "looks empty" may contain a space. `ISBLANK` will treat it as **not empty**.

## 2. Error Handling Tips

Formulas often produce errors like `#N/A`, `#DIV/0!`, `#VALUE!`. Wrap formulas to keep reports clean:

| Formula | Purpose |
|---|---|
| `=IFERROR(formula, "—")` | Handles **all** error types |
| `=IFNA(formula, "not found")` | Only `#N/A` errors (e.g. from VLOOKUP) |

**Real examples of error handling:**
- **Target attainment:** `=Sales/Target` returns `#DIV/0!` for a new branch whose target is still 0. Wrap it: `=IFERROR(Sales/Target, "No target yet")`.
- **Product lookup:** `VLOOKUP` fails on a mistyped product code. `=IFERROR(VLOOKUP(A2, data, 2, FALSE), "Unknown code")` keeps the report clean instead of full of `#N/A`.
- **Number conversion:** `=VALUE(A2)` errors when a cell holds non-numeric text. `=IFERROR(VALUE(A2), 0)` turns failures into 0.

```
=IFERROR(VLOOKUP(A2, data, 2, FALSE), "Not found")
=IFERROR(B2/C2, 0)
```

## 3. Shaping Data with Text Functions

| Function | Example | Result |
|---|---|---|
| `TRIM` | `=TRIM("  Budi  ")` | `Budi` |
| `CONCAT` | `=CONCAT(A2," ",B2)` | `Budi Santoso` |
| `LEFT` | `=LEFT("INV-2024",3)` | `INV` |
| `RIGHT` | `=RIGHT("INV-2024",4)` | `2024` |
| `MID` | `=MID("INV-2024-01",5,4)` | `2024` |
| `UPPER`/`LOWER`/`PROPER` | `=PROPER("budi santoso")` | `Budi Santoso` |
| `SUBSTITUTE` | `=SUBSTITUTE("Rp1,000","Rp","")` | `1,000` |

**Real examples of text functions at work:**
- **Sign-up form:** A user-typed name `"  aNDi   wijaya "` → `=PROPER(TRIM(A2))` yields a clean `"Andi Wijaya"`.
- **Invoice code:** From `"INV-2026-0453"` extract the year with `=MID(A2,5,4)` → `"2026"`, and the sequence with `=RIGHT(A2,4)` → `"0453"`.
- **Phone number:** Standardize `"0812-3456-7890"` → `=SUBSTITUTE(A2,"-","")` yields `"081234567890"`.
- **Email:** Extract the domain from `"andi@tokopedia.com"` to group corporate customers: `=MID(A2, FIND("@",A2)+1, 100)` → `"tokopedia.com"`.
- **National ID:** Take the first 6 digits (region code) with `=LEFT(A2,6)` to map employees' home regions.

### Splitting & Joining
- **Text to Columns** (Data → Text to Columns) to split `"Budi,Jakarta"` into two columns.
- **Flash Fill** (`Ctrl+E`) — Excel guesses the pattern from the example you type.

**Real examples:**
- **Combined address:** `"Jl. Merdeka No.5, Bandung, West Java"` split into street, city, province columns via Text to Columns (comma delimiter).
- **Full name:** A `"Budi Santoso"` column split into `first_name` and `last_name` for personalized email greetings.
- **Flash Fill:** Type `"B. Santoso"` next to `"Budi Santoso"`, press `Ctrl+E`, and Excel abbreviates the whole column automatically.

## Data Cleaning Workflow (Checklist)

1. **Make a copy** of the raw data — never overwrite the original.
2. Remove fully blank rows & columns.
3. `TRIM` all text columns to strip hidden spaces.
4. Standardize capitalization (`PROPER`/`UPPER`).
5. Check & handle duplicates.
6. Fix data types (numbers stored as text → `VALUE`).
7. Wrap error-prone formulas in `IFERROR`.

> **Mini case study:** You receive a POS export of 5,000 transactions. Make a copy → `TRIM` the product-name column → remove 37 duplicate orders by `order_id` → convert `total` from text to number with `VALUE` → wrap the margin formula in `IFERROR`. Result: a trustworthy dataset ready to analyze.

## Key Takeaways
- Dirty data leads to wrong conclusions — clean first, analyze second.
- `TRIM` is a lifesaver: hidden spaces are the most common source of bugs.
- Blank does not always mean zero — understand each column's context.
- `IFERROR`/`IFNA` make your reports look professional instead of full of `#N/A`.
- Always keep a copy of the raw data before changing anything.
$da_en$
WHERE session_number = 'F01';

-- ── F02 — Presenting Data to Stakeholder Needs ─────────────
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Angkatan Juli 2026):** Sabtu, 4 Juli 2026 · 13.00 WIB

# Sesi 2 — Menyajikan Data Sesuai Kebutuhan Stakeholder

Stakeholder tidak butuh ribuan baris data — mereka butuh **jawaban**. Seorang manajer bertanya "Berapa penjualan Jakarta bulan ini?", bukan "Kirimi saya 10.000 baris transaksi". Sesi ini mengajarkan logika rumus, statistik dasar, serta cara menyaring dan meringkas data agar tepat sasaran.

## 1. Logika Rumus & Referensi Sel

### Relatif vs Absolut
- `A1` — **relatif**: ikut bergeser saat rumus disalin.
- `$A$1` — **absolut**: terkunci, tidak bergeser.
- `$A1` / `A$1` — **campuran**: hanya kolom / hanya baris yang terkunci.

> Gunakan `$` saat merujuk ke satu sel tetap (mis. tarif pajak di `$B$1`) yang dipakai banyak baris.

**Contoh nyata referensi absolut:**
- **PPN:** Tarif PPN 11% ada di sel `$B$1`. Rumus `=A2*$B$1` disalin ke 500 baris — semua tetap merujuk ke tarif yang sama. Tanpa `$`, baris ke-3 keliru merujuk `B2`.
- **Kurs:** Konversi harga USD ke Rupiah memakai kurs di `$E$1`. `=D2*$E$1` menjaga kurs tetap saat disalin ke bawah.
- **Komisi:** Persentase komisi sales di `$H$1`. `=Penjualan*$H$1` menghitung komisi tiap sales dengan satu angka acuan.

## 2. Statistik Dasar

| Rumus | Arti |
|---|---|
| `=SUM(range)` | Total |
| `=COUNT(range)` | Menghitung sel **berisi angka** |
| `=COUNTA(range)` | Menghitung sel **terisi** (apa pun) |
| `=AVERAGE(range)` | Rata-rata (mean) |
| `=MEDIAN(range)` | Nilai tengah |
| `=MIN` / `=MAX` | Terkecil / terbesar |

**Contoh nyata statistik dasar:**
- **Ritel:** `SUM(penjualan)` untuk total omzet, `AVERAGE(penjualan)` untuk rata-rata harian, `MAX` untuk hari puncak (mis. saat gajian tanggal 25).
- **HR:** `COUNTA(nama_karyawan)` menghitung total karyawan; `COUNT(gaji)` hanya menghitung yang punya angka gaji (magang tanpa gaji tak terhitung).
- **Customer Service:** `MEDIAN(waktu_respon)` lebih jujur daripada `AVERAGE` bila ada satu tiket yang tak terjawab 3 hari dan mendongkrak rata-rata.

> 💡 **Mean vs Median:** jika ada nilai ekstrem (mis. satu pembelian Rp1 miliar di antara transaksi ratusan ribu), median lebih mewakili "tipikal" daripada mean. Contoh: gaji rata-rata di startup bisa terlihat tinggi karena gaji CEO — median menunjukkan gaji karyawan biasa yang sebenarnya.

## 3. SORT & FILTER

- **Sort** (Data → Sort) — mengurutkan, bisa multi-level (mis. wilayah lalu pendapatan).
- **Filter** (`Ctrl+Shift+L`) — menampilkan hanya baris yang relevan tanpa menghapus data.
- **Fungsi dinamis** `SORT()` dan `FILTER()` (Excel 365) menghasilkan tabel yang ter-update otomatis:
```
=FILTER(A2:D100, C2:C100="Jakarta")
=SORT(A2:D100, 4, -1)   // urut kolom ke-4, menurun
```

**Contoh nyata SORT & FILTER:**
- **Sort multi-level:** Urutkan tim sales dulu per **wilayah** (A→Z), lalu per **omzet** (besar→kecil), agar manajer melihat sales terbaik di tiap wilayah.
- **Filter cepat:** Dari 10.000 transaksi, filter `status = "Refund"` untuk melihat hanya pesanan yang dikembalikan.
- **FILTER dinamis:** `=FILTER(data, wilayah="Bandung")` membuat "mini-laporan Bandung" yang otomatis diperbarui saat data baru masuk — cocok untuk dashboard.

## 4. Rumus Kondisional & Wildcard

### IF dan IF Bertingkat
```
=IF(B2>=75, "Lulus", "Gagal")
=IFS(B2>=90,"A", B2>=75,"B", B2>=60,"C", TRUE,"D")
```

**Contoh nyata IF:**
- **KPI:** `=IF(Pencapaian>=100%, "Tercapai", "Belum")` menandai sales yang capai target.
- **Grading pelatihan:** `IFS` mengubah nilai ujian jadi huruf A–D untuk sertifikat peserta.
- **Segmentasi pelanggan:** `=IF(Belanja>5000000, "VIP", "Reguler")` melabeli pelanggan untuk program loyalitas.

### SUMIF / COUNTIF / AVERAGEIF (dan versi -IFS)
```
=SUMIF(region, "Jakarta", sales)
=COUNTIF(status, "completed")
=SUMIFS(sales, region, "Jakarta", status, "completed")
```

**Contoh nyata -IF/-IFS:**
- **Laporan wilayah:** `=SUMIF(wilayah, "Jakarta", omzet)` menjumlah omzet hanya untuk Jakarta.
- **Funnel:** `=COUNTIF(status, "completed")` menghitung berapa pesanan sukses vs total.
- **Kriteria ganda:** `=SUMIFS(omzet, wilayah, "Jakarta", bulan, "Juli", kategori, "Elektronik")` menjawab pertanyaan spesifik manajer dalam satu rumus.
- **HR:** `=AVERAGEIFS(gaji, divisi, "Marketing", status, "Tetap")` menghitung rata-rata gaji karyawan tetap divisi Marketing.

### Wildcard
- `*` — banyak karakter apa pun
- `?` — tepat satu karakter

```
=COUNTIF(A:A, "Jakarta*")    // semua yang diawali "Jakarta"
=SUMIF(produk, "*Mouse*", qty) // mengandung kata "Mouse"
```

**Contoh nyata wildcard:**
- `"Jakarta*"` menangkap "Jakarta Pusat", "Jakarta Barat", dst. dalam satu hitungan.
- `"*Mouse*"` menjumlah semua varian produk yang mengandung kata "Mouse" (Mouse Wireless, Gaming Mouse, dll.).
- `"BDG-??"` menangkap kode cabang Bandung dua digit seperti "BDG-01", "BDG-02".

## Mindset Penyajian Data
1. Mulai dari **pertanyaan** stakeholder, bukan dari data.
2. Ringkas ke level keputusan (total, rata-rata, persentase).
3. Sembunyikan detail; tampilkan kesimpulan.
4. Beri label & format angka (Rp, %, ribuan) agar mudah dibaca.

> **Studi kasus mini:** Manajer bertanya "Kategori mana yang paling laku di Jakarta bulan Juli?" Jangan kirim 20.000 baris. Gunakan `SUMIFS(omzet, wilayah, "Jakarta", bulan, "Juli")` per kategori, urutkan menurun dengan SORT, sajikan 3 teratas. Selesai.

## Kesimpulan Utama
- Kunci sel dengan `$` agar rumus tetap benar saat disalin.
- `SUMIFS`/`COUNTIFS` adalah tulang punggung pelaporan berbasis kriteria.
- Median lebih tahan terhadap nilai ekstrem daripada mean.
- Wildcard `*` dan `?` membuat pencarian fleksibel.
- Sajikan jawaban, bukan data mentah.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Saturday, 4 July 2026 · 13.00 WIB

# Session 2 — Presenting Data to Stakeholder Needs

Stakeholders don't need thousands of rows — they need **answers**. A manager asks "What were Jakarta's sales this month?", not "Send me 10,000 transaction rows". This session covers formula logic, basic statistics, and how to filter and summarize data so it hits the mark.

## 1. Formula Logic & Cell References

### Relative vs Absolute
- `A1` — **relative**: shifts when the formula is copied.
- `$A$1` — **absolute**: locked, never shifts.
- `$A1` / `A$1` — **mixed**: only column / only row is locked.

> Use `$` when referring to one fixed cell (e.g. a tax rate in `$B$1`) reused across many rows.

**Real examples of absolute references:**
- **VAT:** An 11% VAT rate sits in `$B$1`. The formula `=A2*$B$1` copied to 500 rows all reference the same rate. Without `$`, row 3 wrongly references `B2`.
- **Exchange rate:** Converting USD prices to Rupiah uses a rate in `$E$1`. `=D2*$E$1` keeps the rate fixed when copied down.
- **Commission:** A sales commission percentage in `$H$1`. `=Sales*$H$1` computes each rep's commission from one reference figure.

## 2. Basic Statistics

| Formula | Meaning |
|---|---|
| `=SUM(range)` | Total |
| `=COUNT(range)` | Counts cells **containing numbers** |
| `=COUNTA(range)` | Counts **non-empty** cells (anything) |
| `=AVERAGE(range)` | Mean |
| `=MEDIAN(range)` | Middle value |
| `=MIN` / `=MAX` | Smallest / largest |

**Real examples of basic statistics:**
- **Retail:** `SUM(sales)` for total revenue, `AVERAGE(sales)` for the daily average, `MAX` for the peak day (e.g. payday on the 25th).
- **HR:** `COUNTA(employee_name)` counts total employees; `COUNT(salary)` counts only those with a salary figure (unpaid interns excluded).
- **Customer Service:** `MEDIAN(response_time)` is more honest than `AVERAGE` when one ticket left unanswered for 3 days skews the mean.

> 💡 **Mean vs Median:** when extreme values exist (e.g. one Rp1 billion purchase among transactions of hundreds of thousands), the median represents the "typical" value better. Example: average salary at a startup can look high because of the CEO's pay — the median reveals what a regular employee actually earns.

## 3. SORT & FILTER

- **Sort** (Data → Sort) — order data, can be multi-level (e.g. region then revenue).
- **Filter** (`Ctrl+Shift+L`) — show only relevant rows without deleting data.
- **Dynamic functions** `SORT()` and `FILTER()` (Excel 365) produce auto-updating tables:
```
=FILTER(A2:D100, C2:C100="Jakarta")
=SORT(A2:D100, 4, -1)   // sort by 4th column, descending
```

**Real examples of SORT & FILTER:**
- **Multi-level sort:** Sort the sales team first by **region** (A→Z), then by **revenue** (high→low), so a manager sees the top rep in each region.
- **Quick filter:** From 10,000 transactions, filter `status = "Refund"` to see only returned orders.
- **Dynamic FILTER:** `=FILTER(data, region="Bandung")` builds a "mini Bandung report" that auto-refreshes as new data arrives — perfect for dashboards.

## 4. Conditional Formulas & Wildcards

### IF and Nested IF
```
=IF(B2>=75, "Pass", "Fail")
=IFS(B2>=90,"A", B2>=75,"B", B2>=60,"C", TRUE,"D")
```

**Real examples of IF:**
- **KPI:** `=IF(Attainment>=100%, "Met", "Not met")` flags reps who hit target.
- **Training grades:** `IFS` turns exam scores into A–D letters for participants' certificates.
- **Customer segmentation:** `=IF(Spend>5000000, "VIP", "Regular")` labels customers for a loyalty program.

### SUMIF / COUNTIF / AVERAGEIF (and -IFS versions)
```
=SUMIF(region, "Jakarta", sales)
=COUNTIF(status, "completed")
=SUMIFS(sales, region, "Jakarta", status, "completed")
```

**Real examples of -IF/-IFS:**
- **Regional report:** `=SUMIF(region, "Jakarta", revenue)` totals revenue for Jakarta only.
- **Funnel:** `=COUNTIF(status, "completed")` counts successful orders vs the total.
- **Multiple criteria:** `=SUMIFS(revenue, region, "Jakarta", month, "July", category, "Electronics")` answers a manager's specific question in one formula.
- **HR:** `=AVERAGEIFS(salary, division, "Marketing", status, "Permanent")` computes the average salary of permanent Marketing staff.

### Wildcards
- `*` — any number of characters
- `?` — exactly one character

```
=COUNTIF(A:A, "Jakarta*")    // anything starting with "Jakarta"
=SUMIF(product, "*Mouse*", qty) // contains the word "Mouse"
```

**Real examples of wildcards:**
- `"Jakarta*"` captures "Jakarta Pusat", "Jakarta Barat", etc. in one count.
- `"*Mouse*"` sums every product variant containing the word "Mouse" (Wireless Mouse, Gaming Mouse, etc.).
- `"BDG-??"` captures two-digit Bandung branch codes like "BDG-01", "BDG-02".

## Data Presentation Mindset
1. Start from the stakeholder's **question**, not from the data.
2. Summarize to decision level (totals, averages, percentages).
3. Hide detail; show the conclusion.
4. Label and format numbers (Rp, %, thousands) for readability.

> **Mini case study:** A manager asks "Which category sold best in Jakarta in July?" Don't send 20,000 rows. Use `SUMIFS(revenue, region, "Jakarta", month, "July")` per category, sort descending with SORT, present the top 3. Done.

## Key Takeaways
- Lock cells with `$` so formulas stay correct when copied.
- `SUMIFS`/`COUNTIFS` are the backbone of criteria-based reporting.
- The median resists extreme values better than the mean.
- Wildcards `*` and `?` make matching flexible.
- Deliver the answer, not the raw data.
$da_en$
WHERE session_number = 'F02';

-- ── F03 — Joining & Highlighting Datasets ──────────────────
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Angkatan Juli 2026):** Minggu, 5 Juli 2026 · 09.00 WIB

# Sesi 3 — Menggabungkan & Highlight Dataset

Data jarang berada di satu tempat. Daftar transaksi ada di satu tabel, detail produk di tabel lain, data pelanggan di tabel ketiga. Sesi ini mengajarkan cara **menggabungkan** tabel dengan fungsi lookup dan **menyoroti** kondisi penting secara visual.

## 1. Alur Berpikir Pembuatan Laporan Data

Sebelum menulis rumus, jawab dulu:
1. **Pertanyaan bisnis apa** yang harus dijawab?
2. **Data apa** yang dibutuhkan, dan dari tabel mana?
3. **Kunci penghubung** (key) apa yang sama di kedua tabel? (mis. `product_id`)
4. Bagaimana hasilnya **disajikan**?

**Contoh nyata pemetaan sebelum lookup:**
- **E-commerce:** Tabel `transaksi` hanya punya `product_id` dan `qty`. Untuk laporan omzet, kamu butuh `harga` dan `nama_produk` dari tabel `master_produk`. Kunci: `product_id`.
- **HR:** Tabel `absensi` punya `nik`, tabel `karyawan` punya nama & divisi. Gabungkan lewat `nik` untuk laporan kehadiran per divisi.
- **Sekolah/pelatihan:** Tabel `nilai` punya `id_peserta`, tabel `peserta` punya nama & kelas. Kunci: `id_peserta`.

## 2. VLOOKUP & HLOOKUP

```
=VLOOKUP(nilai_cari, tabel, nomor_kolom, FALSE)
```
- `FALSE` = pencocokan **persis** (hampir selalu yang kamu mau).
- **Keterbatasan VLOOKUP:** hanya mencari ke **kanan** dari kolom kunci, dan rusak jika kolom disisipkan.

```
=VLOOKUP(A2, produk!$A$2:$D$50, 3, FALSE)
```

`HLOOKUP` sama, tapi mencari secara **horizontal** (data tersusun per baris).

**Contoh nyata VLOOKUP:**
- **Ambil harga:** `=VLOOKUP(product_id, master_produk, 3, FALSE)` menarik harga produk ke tabel transaksi.
- **Ambil nama pelanggan:** Dari `customer_id` di tabel order, tarik nama pelanggan untuk invoice.
- **Grade karyawan:** `=VLOOKUP(nilai_kpi, tabel_grade, 2, TRUE)` — di sini `TRUE` (approximate) tepat karena mencari rentang (0–59 = D, 60–74 = C, dst.).

> 💡 Gunakan `FALSE` untuk kode/ID (harus persis), dan `TRUE` hanya untuk mencocokkan **rentang** angka yang terurut.

## 3. Teknik Tingkat Lanjut

### XLOOKUP (modern, fleksibel)
```
=XLOOKUP(nilai_cari, range_cari, range_hasil, "Tidak ada")
```
- Bisa mencari ke **kiri maupun kanan**.
- Argumen "jika tidak ditemukan" sudah bawaan (tak perlu `IFERROR`).
- Tahan terhadap penyisipan kolom.

**Contoh nyata XLOOKUP:**
- **Cari ke kiri:** Kolom `nama` ada di sebelah kiri `product_id`. VLOOKUP tak bisa; `=XLOOKUP(id, kolom_id, kolom_nama)` bisa.
- **Pesan ramah:** `=XLOOKUP(kode, daftar_kode, daftar_harga, "Produk baru — belum ada harga")` langsung menampilkan pesan, bukan `#N/A`.

### INDEX-MATCH (klasik yang andal)
```
=INDEX(range_hasil, MATCH(nilai_cari, range_cari, 0))
```
- `MATCH` mencari **posisi**, `INDEX` mengambil **nilai** di posisi itu.
- Bekerja di semua versi Excel; lebih cepat pada dataset besar.

**Contoh nyata INDEX-MATCH:**
- **Dataset 100.000 baris:** INDEX-MATCH memproses lebih cepat daripada VLOOKUP karena tidak memindai seluruh tabel.
- **Lookup dua arah:** `=INDEX(tabel, MATCH(produk, kolom_produk, 0), MATCH("Q3", baris_kuartal, 0))` mengambil nilai di persilangan baris produk & kolom kuartal.

| | VLOOKUP | XLOOKUP | INDEX-MATCH |
|---|---|---|---|
| Cari ke kiri | ❌ | ✅ | ✅ |
| Tahan sisip kolom | ❌ | ✅ | ✅ |
| Tersedia di semua versi | ✅ | ❌ (365) | ✅ |

> 💡 Coba langsung di **Playground → Simulator XLOOKUP**.

## 4. Conditional Formatting

Menyoroti kondisi data secara otomatis:
- **Highlight Cells Rules** — nilai > / < ambang, teks tertentu, duplikat.
- **Top/Bottom Rules** — 10 teratas, di atas rata-rata.
- **Data Bars / Color Scales / Icon Sets** — "heatmap" mini di dalam sel.
- **Rumus kustom**, mis. soroti seluruh baris jika margin < 10%:
```
=$E2 < 0.1
```

**Contoh nyata Conditional Formatting:**
- **Stok kritis:** Soroti merah otomatis bila `stok < stok_minimum` agar tim gudang langsung sadar perlu restock.
- **Target sales:** Data Bars di kolom pencapaian membuat "grafik mini" di tiap sel — sekilas terlihat siapa yang jauh dari target.
- **Kadaluarsa:** Soroti kuning bila tanggal kedaluwarsa < 30 hari dari hari ini (`=$C2-TODAY()<30`).
- **Nilai ujian:** Color Scale hijau→merah memvisualkan sebaran nilai peserta pelatihan dalam sekejap.
- **Piutang jatuh tempo:** Soroti seluruh baris invoice yang `status="Belum bayar"` DAN `jatuh_tempo<TODAY()`.

## Kesimpulan Utama
- Gabungkan tabel lewat **kunci** yang sama dengan fungsi lookup.
- `XLOOKUP` dan `INDEX-MATCH` lebih unggul daripada `VLOOKUP`.
- Selalu pakai pencocokan persis (`FALSE` / `0`) untuk ID; `TRUE` hanya untuk rentang terurut.
- Conditional Formatting mengubah angka menjadi insight yang langsung terlihat.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Sunday, 5 July 2026 · 09.00 WIB

# Session 3 — Joining & Highlighting Datasets

Data rarely lives in one place. The transaction list is in one table, product details in another, customer data in a third. This session teaches you how to **join** tables with lookup functions and **highlight** important conditions visually.

## 1. The Reporting Thought Process

Before writing a formula, answer:
1. **What business question** must be answered?
2. **What data** is needed, and from which table?
3. **What key** is shared between the two tables? (e.g. `product_id`)
4. How will the result be **presented**?

**Real examples of mapping before a lookup:**
- **E-commerce:** The `transactions` table only has `product_id` and `qty`. For a revenue report you need `price` and `product_name` from the `product_master` table. Key: `product_id`.
- **HR:** The `attendance` table has `employee_id`; the `employees` table has name & division. Join on `employee_id` for a per-division attendance report.
- **School/training:** The `grades` table has `participant_id`; the `participants` table has name & class. Key: `participant_id`.

## 2. VLOOKUP & HLOOKUP

```
=VLOOKUP(lookup_value, table, column_number, FALSE)
```
- `FALSE` = **exact** match (almost always what you want).
- **VLOOKUP limitation:** only looks to the **right** of the key column, and breaks if columns are inserted.

```
=VLOOKUP(A2, products!$A$2:$D$50, 3, FALSE)
```

`HLOOKUP` is the same but searches **horizontally** (data laid out in rows).

**Real examples of VLOOKUP:**
- **Pull a price:** `=VLOOKUP(product_id, product_master, 3, FALSE)` brings the product price into the transactions table.
- **Pull a customer name:** From `customer_id` in the orders table, fetch the customer name for an invoice.
- **Employee grade:** `=VLOOKUP(kpi_score, grade_table, 2, TRUE)` — here `TRUE` (approximate) is correct because it matches ranges (0–59 = D, 60–74 = C, etc.).

> 💡 Use `FALSE` for codes/IDs (must be exact), and `TRUE` only to match **sorted numeric ranges**.

## 3. Advanced Techniques

### XLOOKUP (modern, flexible)
```
=XLOOKUP(lookup_value, lookup_range, return_range, "Not found")
```
- Can look **left or right**.
- Built-in "if not found" argument (no `IFERROR` needed).
- Resilient to inserted columns.

**Real examples of XLOOKUP:**
- **Look left:** The `name` column sits to the left of `product_id`. VLOOKUP can't; `=XLOOKUP(id, id_col, name_col)` can.
- **Friendly message:** `=XLOOKUP(code, code_list, price_list, "New product — no price yet")` shows a message instead of `#N/A`.

### INDEX-MATCH (the reliable classic)
```
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
```
- `MATCH` finds the **position**, `INDEX` returns the **value** at that position.
- Works in every Excel version; faster on large datasets.

**Real examples of INDEX-MATCH:**
- **100,000-row dataset:** INDEX-MATCH processes faster than VLOOKUP because it doesn't scan the whole table.
- **Two-way lookup:** `=INDEX(table, MATCH(product, product_col, 0), MATCH("Q3", quarter_row, 0))` fetches the value at the intersection of a product row and quarter column.

| | VLOOKUP | XLOOKUP | INDEX-MATCH |
|---|---|---|---|
| Look left | ❌ | ✅ | ✅ |
| Survives column insert | ❌ | ✅ | ✅ |
| Available everywhere | ✅ | ❌ (365) | ✅ |

> 💡 Try it live in **Playground → XLOOKUP Simulator**.

## 4. Conditional Formatting

Highlight data conditions automatically:
- **Highlight Cells Rules** — values > / < threshold, specific text, duplicates.
- **Top/Bottom Rules** — top 10, above average.
- **Data Bars / Color Scales / Icon Sets** — a mini heatmap inside cells.
- **Custom formula**, e.g. highlight a whole row when margin < 10%:
```
=$E2 < 0.1
```

**Real examples of Conditional Formatting:**
- **Critical stock:** Auto-highlight red when `stock < min_stock` so the warehouse team instantly sees what to restock.
- **Sales target:** Data Bars in the attainment column create a "mini chart" in each cell — at a glance you see who's far from target.
- **Expiry:** Highlight yellow when the expiry date is < 30 days away (`=$C2-TODAY()<30`).
- **Exam scores:** A green→red Color Scale visualizes the spread of participants' scores instantly.
- **Overdue receivables:** Highlight the whole invoice row where `status="Unpaid"` AND `due_date<TODAY()`.

## Key Takeaways
- Join tables via a shared **key** using lookup functions.
- `XLOOKUP` and `INDEX-MATCH` beat `VLOOKUP`.
- Always use exact match (`FALSE` / `0`) for IDs; `TRUE` only for sorted ranges.
- Conditional Formatting turns numbers into instantly visible insight.
$da_en$
WHERE session_number = 'F03';

-- ── F04 — Pivot Tables for Insight ─────────────────────────
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Angkatan Juli 2026):** Minggu, 5 Juli 2026 · 13.00 WIB

# Sesi 4 — Pivot Table untuk Dapatkan Insight

Pivot Table adalah alat paling kuat di spreadsheet untuk seorang analyst. Ia meringkas ribuan baris menjadi insight dalam hitungan detik — **tanpa satu pun rumus**.

## 1. Apa Itu Pivot Table?

Bayangkan 50.000 baris transaksi. Pertanyaan: "Berapa pendapatan per kategori per bulan?" Dengan rumus, itu rumit. Dengan Pivot Table, cukup seret-dan-letakkan beberapa field.

**Cara membuat:** pilih data → **Insert → PivotTable**.

**Contoh nyata kapan Pivot Table menyelamatkan:**
- **Ritel:** Ekspor 80.000 baris transaksi setahun. Dalam 10 detik: pendapatan per cabang per bulan.
- **Marketplace:** Ribuan review produk. Pivot menghitung rata-rata rating per kategori tanpa rumus.
- **HR:** 2.000 baris data absensi. Pivot menghitung total keterlambatan per divisi per bulan.

## 2. Anatomi Pivot Table

Pivot Table punya 4 area:

| Area | Fungsi | Contoh |
|---|---|---|
| **Rows** | Kategori vertikal | Nama produk, wilayah |
| **Columns** | Kategori horizontal | Bulan, status |
| **Values** | Angka yang diringkas | Sum pendapatan, count order |
| **Filters** | Saringan keseluruhan | Tahun = 2026 |

**Contoh nyata susunan area:**
- **Laporan penjualan:** Rows = Kategori, Columns = Bulan, Values = Sum(Omzet), Filter = Wilayah. Hasil: matriks omzet kategori × bulan untuk satu wilayah.
- **Laporan CS:** Rows = Agen, Columns = Prioritas tiket, Values = Count(Tiket). Hasil: beban kerja tiap agen per level prioritas.
- **Laporan HR:** Rows = Divisi, Values = Average(Gaji) & Count(NIK). Hasil: rata-rata gaji dan jumlah karyawan per divisi.

## 3. Mengubah Agregasi

Klik kanan pada field Values → **Summarize Values By**:
- **Sum** — total (default untuk angka)
- **Count** — jumlah baris
- **Average** — rata-rata
- **Max / Min**

Dan **Show Values As**:
- **% of Grand Total** — kontribusi tiap baris
- **% of Column Total**
- **Running Total** — akumulasi
- **% Difference From** — pertumbuhan vs periode sebelumnya

**Contoh nyata "Show Values As":**
- **Kontribusi kategori:** "% of Grand Total" menunjukkan Elektronik menyumbang 42% omzet — angka yang langsung dipakai manajemen.
- **Akumulasi:** "Running Total" pada omzet bulanan menunjukkan progres menuju target tahunan.
- **Pertumbuhan:** "% Difference From" bulan sebelumnya menandai bulan mana yang tumbuh/turun tanpa menghitung manual.

## 4. Pivot Table Advanced

### Grouping
Klik kanan pada field tanggal → **Group** → kelompokkan ke Bulan / Kuartal / Tahun. Bisa juga mengelompokkan angka ke dalam rentang (mis. umur 20–29, 30–39).

**Contoh nyata grouping:**
- **Tanggal → Bulan:** 365 baris tanggal harian dikelompokkan jadi 12 bulan agar tren tahunan terbaca.
- **Umur → Rentang:** Data pelanggan dikelompokkan ke 18–25, 26–35, 36–45 untuk analisis demografi.
- **Harga → Tier:** Produk dikelompokkan ke rentang harga (< 50rb, 50–200rb, > 200rb) untuk melihat segmen mana yang paling laku.

### Calculated Field
**PivotTable Analyze → Fields, Items & Sets → Calculated Field**, mis. `= Profit / Revenue` untuk margin.

**Contoh nyata:** Buat field `Margin %` = `Profit / Revenue`, atau `AOV` (Average Order Value) = `Revenue / Jumlah Order`, langsung di dalam Pivot.

### Slicer & Timeline
- **Slicer** — tombol filter visual yang interaktif.
- **Timeline** — slicer khusus tanggal.

**Contoh nyata:** Dashboard direktur dengan Slicer "Wilayah" dan Timeline "Bulan" — satu klik memfilter seluruh laporan, cocok untuk presentasi rapat.

## 5. Studi Kasus Perkantoran

> *"Kategori produk mana yang tumbuh paling cepat tahun ini, dan di wilayah mana?"*

1. Rows: Kategori → Columns: Bulan → Values: Sum(Pendapatan).
2. Group Bulan ke Kuartal.
3. Show Values As → **% Difference From** kuartal sebelumnya.
4. Tambahkan Slicer Wilayah.
5. Baca: kategori dengan persentase tertinggi adalah pemenangnya.

> **Studi kasus lain:** *"Divisi mana yang paling sering terlambat?"* Rows = Divisi, Values = Count(Keterlambatan), Filter = Bulan. Urutkan menurun → divisi teratas jadi fokus perbaikan disiplin.

## Kesimpulan Utama
- Pivot Table meringkas data besar tanpa rumus.
- Ingat 4 area: Rows, Columns, Values, Filters.
- "Show Values As" mengubah angka mentah menjadi persen & tren.
- Grouping merapikan tanggal/angka menjadi kelompok yang bermakna.
- Slicer membuat laporanmu interaktif untuk stakeholder.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Sunday, 5 July 2026 · 13.00 WIB

# Session 4 — Pivot Tables for Insight

The Pivot Table is the most powerful spreadsheet tool an analyst has. It summarizes thousands of rows into insight in seconds — **without a single formula**.

## 1. What Is a Pivot Table?

Imagine 50,000 transaction rows. The question: "What's revenue by category by month?" With formulas, that's hard. With a Pivot Table, you just drag-and-drop a few fields.

**To create:** select the data → **Insert → PivotTable**.

**Real examples of when a Pivot Table saves you:**
- **Retail:** An 80,000-row yearly transaction export. In 10 seconds: revenue by branch by month.
- **Marketplace:** Thousands of product reviews. A Pivot computes average rating per category with no formulas.
- **HR:** 2,000 rows of attendance data. A Pivot counts total late arrivals by division by month.

## 2. Anatomy of a Pivot Table

A Pivot Table has 4 areas:

| Area | Purpose | Example |
|---|---|---|
| **Rows** | Vertical categories | Product name, region |
| **Columns** | Horizontal categories | Month, status |
| **Values** | The numbers summarized | Sum of revenue, count of orders |
| **Filters** | Overall filter | Year = 2026 |

**Real examples of arranging the areas:**
- **Sales report:** Rows = Category, Columns = Month, Values = Sum(Revenue), Filter = Region. Result: a category × month revenue matrix for one region.
- **CS report:** Rows = Agent, Columns = Ticket priority, Values = Count(Tickets). Result: each agent's workload per priority level.
- **HR report:** Rows = Division, Values = Average(Salary) & Count(Employee ID). Result: average salary and headcount per division.

## 3. Changing the Aggregation

Right-click a Values field → **Summarize Values By**:
- **Sum** — total (default for numbers)
- **Count** — number of rows
- **Average** — mean
- **Max / Min**

And **Show Values As**:
- **% of Grand Total** — each row's contribution
- **% of Column Total**
- **Running Total** — cumulative
- **% Difference From** — growth vs prior period

**Real examples of "Show Values As":**
- **Category contribution:** "% of Grand Total" shows Electronics contributes 42% of revenue — a number management uses immediately.
- **Cumulative:** "Running Total" on monthly revenue shows progress toward the annual target.
- **Growth:** "% Difference From" the previous month flags which months grew or declined without manual math.

## 4. Advanced Pivot Tables

### Grouping
Right-click a date field → **Group** → roll up into Month / Quarter / Year. You can also group numbers into ranges (e.g. age 20–29, 30–39).

**Real examples of grouping:**
- **Date → Month:** 365 daily date rows rolled into 12 months so the yearly trend is readable.
- **Age → Range:** Customer data grouped into 18–25, 26–35, 36–45 for demographic analysis.
- **Price → Tier:** Products grouped into price ranges (< 50k, 50–200k, > 200k) to see which segment sells most.

### Calculated Field
**PivotTable Analyze → Fields, Items & Sets → Calculated Field**, e.g. `= Profit / Revenue` for margin.

**Real example:** Create a `Margin %` field = `Profit / Revenue`, or `AOV` (Average Order Value) = `Revenue / Order count`, right inside the Pivot.

### Slicer & Timeline
- **Slicer** — interactive visual filter buttons.
- **Timeline** — a slicer specifically for dates.

**Real example:** A director's dashboard with a "Region" Slicer and a "Month" Timeline — one click filters the whole report, perfect for meeting presentations.

## 5. Office Case Study

> *"Which product category is growing fastest this year, and in which region?"*

1. Rows: Category → Columns: Month → Values: Sum(Revenue).
2. Group Month into Quarters.
3. Show Values As → **% Difference From** previous quarter.
4. Add a Region Slicer.
5. Read it: the category with the highest percentage is the winner.

> **Another case:** *"Which division is late most often?"* Rows = Division, Values = Count(Late arrivals), Filter = Month. Sort descending → the top division becomes the focus for discipline improvement.

## Key Takeaways
- Pivot Tables summarize big data with no formulas.
- Remember the 4 areas: Rows, Columns, Values, Filters.
- "Show Values As" turns raw numbers into percentages & trends.
- Grouping tidies dates/numbers into meaningful buckets.
- Slicers make your report interactive for stakeholders.
$da_en$
WHERE session_number = 'F04';

-- ── F05 — Exploratory Data Analysis (EDA) ──────────────────
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Angkatan Juli 2026):** Kamis, 9 Juli 2026 · 19.30 WIB

# Sesi 5 — Exploratory Data Analysis (EDA)

EDA adalah proses **memahami data sebelum mengambil kesimpulan**. Sebelum membuat dashboard atau model, kamu harus tahu: seperti apa bentuk datanya, di mana anomalinya, dan hubungan apa yang tersembunyi.

## Apa Itu EDA?

EDA = menjelajah data secara sistematis untuk menemukan pola, anomali, dan hubungan. Diperkenalkan oleh statistikawan John Tukey, intinya: **biarkan data berbicara dulu** sebelum kamu memaksakan hipotesis.

**Contoh nyata kenapa EDA penting:**
- **Toko online:** Sebelum menyimpulkan "penjualan turun", EDA mengungkap ternyata hanya satu kategori yang anjlok, sisanya stabil.
- **HR:** Sebelum bilang "karyawan resign banyak", EDA menunjukkan resign terkonsentrasi di satu divisi dengan satu manajer tertentu.
- **Bank:** Sebelum membangun model kredit macet, EDA menemukan 5% data usia bernilai 999 (kode "tidak diisi") yang harus dibersihkan dulu.

## 1. Analisis Univariate (Satu Variabel)

Memahami **satu kolom** pada satu waktu.

### Untuk data numerik
- **Tendensi sentral:** mean, median, modus.
- **Sebaran:** range, standar deviasi, IQR.
- **Bentuk distribusi:** normal, miring kanan (skewed), bimodal — lihat lewat histogram.
- **Outlier:** nilai ekstrem. Aturan IQR:
```
Batas bawah = Q1 − 1.5 × IQR
Batas atas  = Q3 + 1.5 × IQR
```

**Contoh nyata univariate numerik:**
- **Harga produk:** Histogram menunjukkan distribusi miring kanan — kebanyakan produk murah, sedikit produk mahal. Median (Rp75rb) lebih mewakili daripada mean (Rp180rb).
- **Nilai transaksi:** Aturan IQR menandai satu order Rp50 juta sebagai outlier — ternyata pembelian grosir korporat, bukan error.
- **Usia pelanggan:** Modus di 25–30 tahun memberi tahu marketing siapa audiens utama.

### Untuk data kategori
- **Frekuensi** tiap kategori (Pivot Table Count).
- Kategori dominan vs ekor panjang.

**Contoh nyata univariate kategori:**
- **Metode pembayaran:** 60% e-wallet, 30% transfer, 10% COD → keputusan mempromosikan e-wallet.
- **Kota:** 3 kota menyumbang 70% order (ekor panjang kota kecil) → fokuskan iklan ke 3 kota itu.
- **Alasan komplain:** Kategori "pengiriman lambat" mendominasi → sinyal masalah logistik.

## 2. Analisis Bivariate (Dua Variabel)

Memahami **hubungan antara dua kolom**.

| Tipe pasangan | Alat |
|---|---|
| Numerik vs Numerik | Scatter plot, korelasi |
| Kategori vs Numerik | Box plot, rata-rata per grup |
| Kategori vs Kategori | Crosstab (Pivot Table) |

### Korelasi
`=CORREL(rangeA, rangeB)` → nilai antara −1 dan +1.
- +1 hubungan positif sempurna, −1 negatif sempurna, 0 tidak ada hubungan linier.

**Contoh nyata bivariate:**
- **Diskon vs jumlah order (numerik×numerik):** Korelasi +0,7 → makin besar diskon, makin banyak order. Tapi cek juga marginnya!
- **Wilayah vs omzet (kategori×numerik):** Box plot menunjukkan Jakarta punya median tertinggi tapi juga paling banyak outlier.
- **Channel vs status order (kategori×kategori):** Crosstab menunjukkan order dari Instagram punya tingkat refund lebih tinggi daripada dari website.

> ⚠️ **Korelasi ≠ kausalitas.** Penjualan es krim dan kasus tenggelam berkorelasi — karena sama-sama naik saat musim panas, bukan karena saling menyebabkan. Contoh bisnis: penjualan payung dan jas hujan berkorelasi tinggi, tapi payung tidak "menyebabkan" orang beli jas hujan — hujan-lah penyebab keduanya.

## 3. Menggali Insight

Untuk setiap temuan, tanyakan:
- **Apa** yang menonjol? (puncak, lembah, outlier)
- **Mengapa** itu terjadi? (cari penyebab di kolom lain)
- **So what?** — apa artinya bagi bisnis?

**Contoh nyata rantai berpikir:**
- *Apa?* Omzet Maret anjlok. *Mengapa?* Filter menunjukkan hanya kategori Fashion yang turun. *Kenapa Fashion?* Bertepatan dengan habisnya stok item terlaris. *So what?* Rekomendasi: perbaiki perencanaan stok item hero.

## 4. Menyampaikan Rekomendasi

Ubah temuan menjadi rekomendasi yang **spesifik & dapat ditindaklanjuti**:

❌ "Penjualan Jakarta rendah."
✅ "Penjualan Jakarta turun 18% sejak Maret, terkonsentrasi pada kategori Elektronik. Rekomendasi: audit stok Elektronik di gudang Jakarta dalam 2 minggu."

**Contoh nyata lain:**
- ❌ "Banyak pelanggan tidak balik lagi." → ✅ "Repeat rate turun dari 34% ke 21% pada pelanggan yang pertama kali pakai kurir X. Rekomendasi: evaluasi kurir X untuk pengiriman pertama."
- ❌ "Karyawan sering telat." → ✅ "Keterlambatan naik 25% di divisi Operasional setiap Senin. Rekomendasi: geser jam mulai Senin atau evaluasi beban akhir pekan."

## Kesimpulan Utama
- EDA dilakukan **sebelum** analisis lanjutan — kenali datamu dulu.
- Univariate = satu kolom; bivariate = hubungan dua kolom.
- Deteksi outlier dengan aturan IQR — tapi selidiki, jangan langsung buang.
- Korelasi bukan kausalitas.
- Setiap insight harus berakhir dengan rekomendasi yang konkret.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Thursday, 9 July 2026 · 19.30 WIB

# Session 5 — Exploratory Data Analysis (EDA)

EDA is the process of **understanding data before drawing conclusions**. Before building a dashboard or a model, you must know: what the data looks like, where the anomalies are, and what relationships are hidden.

## What Is EDA?

EDA = systematically exploring data to find patterns, anomalies, and relationships. Introduced by statistician John Tukey, the core idea is: **let the data speak first** before you force a hypothesis.

**Real examples of why EDA matters:**
- **Online store:** Before concluding "sales dropped", EDA reveals only one category crashed while the rest held steady.
- **HR:** Before saying "attrition is high", EDA shows resignations concentrated in one division under one particular manager.
- **Bank:** Before building a default model, EDA finds 5% of age values are 999 (a "not filled" code) that must be cleaned first.

## 1. Univariate Analysis (One Variable)

Understanding **one column** at a time.

### For numeric data
- **Central tendency:** mean, median, mode.
- **Spread:** range, standard deviation, IQR.
- **Distribution shape:** normal, right-skewed, bimodal — see it via a histogram.
- **Outliers:** extreme values. The IQR rule:
```
Lower bound = Q1 − 1.5 × IQR
Upper bound = Q3 + 1.5 × IQR
```

**Real examples of numeric univariate:**
- **Product price:** A histogram shows a right-skewed distribution — mostly cheap products, a few expensive ones. The median (Rp75k) represents better than the mean (Rp180k).
- **Transaction value:** The IQR rule flags one Rp50M order as an outlier — turns out it's a corporate bulk purchase, not an error.
- **Customer age:** A mode at 25–30 tells marketing who the core audience is.

### For categorical data
- **Frequency** of each category (Pivot Table Count).
- Dominant category vs the long tail.

**Real examples of categorical univariate:**
- **Payment method:** 60% e-wallet, 30% transfer, 10% COD → a decision to promote e-wallet.
- **City:** 3 cities contribute 70% of orders (a long tail of small cities) → focus ads on those 3 cities.
- **Complaint reason:** The "slow delivery" category dominates → a signal of a logistics problem.

## 2. Bivariate Analysis (Two Variables)

Understanding the **relationship between two columns**.

| Pair type | Tool |
|---|---|
| Numeric vs Numeric | Scatter plot, correlation |
| Categorical vs Numeric | Box plot, average per group |
| Categorical vs Categorical | Crosstab (Pivot Table) |

### Correlation
`=CORREL(rangeA, rangeB)` → a value between −1 and +1.
- +1 perfect positive, −1 perfect negative, 0 no linear relationship.

**Real examples of bivariate:**
- **Discount vs order count (numeric×numeric):** Correlation +0.7 → bigger discounts, more orders. But check the margin too!
- **Region vs revenue (categorical×numeric):** A box plot shows Jakarta has the highest median but also the most outliers.
- **Channel vs order status (categorical×categorical):** A crosstab shows orders from Instagram have a higher refund rate than website orders.

> ⚠️ **Correlation ≠ causation.** Ice-cream sales and drowning incidents correlate — because both rise in summer, not because one causes the other. Business example: umbrella and raincoat sales correlate strongly, but umbrellas don't "cause" raincoat purchases — rain causes both.

## 3. Extracting Insight

For every finding, ask:
- **What** stands out? (peaks, valleys, outliers)
- **Why** did it happen? (look for the cause in other columns)
- **So what?** — what does it mean for the business?

**Real example of the reasoning chain:**
- *What?* March revenue crashed. *Why?* Filtering shows only the Fashion category fell. *Why Fashion?* It coincided with the best-selling item going out of stock. *So what?* Recommendation: fix stock planning for hero items.

## 4. Delivering Recommendations

Turn findings into **specific, actionable** recommendations:

❌ "Jakarta sales are low."
✅ "Jakarta sales dropped 18% since March, concentrated in Electronics. Recommendation: audit Electronics stock at the Jakarta warehouse within 2 weeks."

**More real examples:**
- ❌ "Many customers don't return." → ✅ "Repeat rate fell from 34% to 21% for customers whose first order used courier X. Recommendation: review courier X for first deliveries."
- ❌ "Employees are often late." → ✅ "Lateness rose 25% in Operations every Monday. Recommendation: shift the Monday start time or review weekend workload."

## Key Takeaways
- EDA happens **before** advanced analysis — know your data first.
- Univariate = one column; bivariate = relationship between two columns.
- Detect outliers with the IQR rule — but investigate before discarding.
- Correlation is not causation.
- Every insight must end with a concrete recommendation.
$da_en$
WHERE session_number = 'F05';

-- ── F06 — Data Visualization ───────────────────────────────
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Angkatan Juli 2026):** Selasa, 14 Juli 2026 · 19.30 WIB

# Sesi 6 — Visualisasi Data

Visualisasi yang baik membuat insight **langsung terlihat**. Visualisasi yang buruk menyesatkan. Sesi ini mengajarkan prinsip memilih chart, mendesain dashboard, dan membuatnya interaktif.

## 1. Prinsip Visualisasi Data

### Memilih Chart yang Tepat
| Tujuan | Chart Terbaik |
|---|---|
| Membandingkan nilai | Bar chart |
| Tren waktu | Line chart |
| Komposisi (bagian dari keseluruhan) | Pie/Donut (maks 5 irisan) atau Stacked bar |
| Distribusi | Histogram, Box plot |
| Hubungan | Scatter plot |
| Geografis | Map |

**Contoh nyata memilih chart:**
- **Bandingkan omzet 5 cabang → Bar chart.** Bukan pie, karena membandingkan panjang batang lebih akurat daripada sudut irisan.
- **Tren pengunjung website 12 bulan → Line chart.** Garis menunjukkan naik-turun antar bulan dengan jelas.
- **Komposisi metode bayar → Donut** (hanya 3–4 kategori). Kalau ada 15 metode, pakai bar.
- **Sebaran gaji karyawan → Histogram/Box plot** untuk melihat rentang dan outlier.
- **Belanja iklan vs penjualan → Scatter plot** untuk melihat apakah iklan berdampak.

### 5 Prinsip Visualisasi Efektif
1. **Kejelasan** — satu chart, satu pesan.
2. **Konteks** — selalu beri judul, label sumbu, satuan.
3. **Akurasi** — bar chart mulai dari nol; jangan memotong sumbu.
4. **Kesederhanaan** — buang "chart junk" (gridline berlebih, efek 3D, bayangan).
5. **Warna** — gunakan dengan tujuan, bukan dekorasi. Maks ~7 warna; perhatikan keterbacaan untuk buta warna.

**Contoh nyata prinsip akurasi:** Bar chart omzet yang sumbunya dimulai dari 90 (bukan 0) membuat selisih 92 vs 95 terlihat seperti 3x lipat — menyesatkan bos. Mulai dari nol agar jujur.

## 2. Pemanfaatan PivotChart

PivotChart adalah chart yang terhubung langsung ke Pivot Table — ikut berubah saat data difilter. **Insert → PivotChart**. Tambahkan Slicer agar audiens bisa mengeksplorasi sendiri.

**Contoh nyata:** PivotChart omzet per kategori yang, saat Slicer "Wilayah" diklik ke "Bandung", langsung berganti menampilkan data Bandung — tanpa membuat chart baru.

## 3. Merancang Dashboard yang Baik

- **KPI terpenting di kiri-atas** (mata membaca dari sana).
- Kelompokkan chart yang berkaitan.
- Warna & font konsisten di seluruh dashboard.
- Satu filter tanggal/wilayah yang mengendalikan semua chart.
- Beri ruang kosong (white space) — jangan padat berlebihan.

### Layout Tipikal
```
┌───────────┬───────────┬───────────┐
│  KPI 1    │  KPI 2    │  KPI 3    │  ← scorecard
├───────────┴─────┬─────┴───────────┤
│  Tren (line)    │  Komposisi (bar)│
├─────────────────┼─────────────────┤
│  Tabel detail   │  Map / kategori │
└─────────────────┴─────────────────┘
```

**Contoh nyata dashboard:**
- **Dashboard penjualan direktur:** KPI (Omzet, Order, AOV) di atas; line tren bulanan; bar per kategori; map per provinsi. Satu Slicer bulan mengendalikan semua.
- **Dashboard CS:** KPI (Total tiket, Avg respon, % selesai); line volume tiket harian; bar per agen.
- **Dashboard HR:** KPI (Headcount, Turnover %, Avg tenure); bar per divisi; tren rekrutmen.

## 4. Dashboard Interaktif dengan Pivot Chart

Gabungkan beberapa PivotChart + Slicer + Timeline pada satu sheet. Hubungkan satu Slicer ke beberapa Pivot (**Report Connections**) agar satu klik memfilter seluruh dashboard.

**Contoh nyata:** Dalam rapat, direktur klik Slicer "Q3" pada Timeline → seluruh dashboard (KPI, tren, kategori, map) langsung menyesuaikan ke Q3. Presentasi jadi hidup dan interaktif.

## Kesimpulan Utama
- Pilih chart sesuai tujuan, bukan selera.
- Satu chart = satu pesan; buang elemen yang tidak perlu.
- Bar chart selalu mulai dari nol agar tidak menyesatkan.
- KPI penting di kiri-atas; warna & font konsisten.
- PivotChart + Slicer = dashboard interaktif tanpa coding.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Tuesday, 14 July 2026 · 19.30 WIB

# Session 6 — Data Visualization

Good visualization makes insight **instantly visible**. Bad visualization misleads. This session covers principles for choosing charts, designing dashboards, and making them interactive.

## 1. Data Visualization Principles

### Choosing the Right Chart
| Goal | Best Chart |
|---|---|
| Compare values | Bar chart |
| Trend over time | Line chart |
| Composition (part of a whole) | Pie/Donut (max 5 slices) or Stacked bar |
| Distribution | Histogram, Box plot |
| Relationship | Scatter plot |
| Geographic | Map |

**Real examples of choosing a chart:**
- **Compare revenue of 5 branches → Bar chart.** Not a pie, because comparing bar lengths is more accurate than slice angles.
- **12-month website visitors → Line chart.** A line shows the month-to-month ups and downs clearly.
- **Payment-method composition → Donut** (only 3–4 categories). With 15 methods, use a bar.
- **Salary spread → Histogram/Box plot** to see the range and outliers.
- **Ad spend vs sales → Scatter plot** to see whether ads have an impact.

### 5 Principles of Effective Visualization
1. **Clarity** — one chart, one message.
2. **Context** — always add titles, axis labels, units.
3. **Accuracy** — bar charts start at zero; don't truncate axes.
4. **Simplicity** — remove "chart junk" (excess gridlines, 3D effects, shadows).
5. **Color** — use it purposefully, not decoratively. Max ~7 colors; consider colorblind readability.

**Real example of the accuracy principle:** A revenue bar chart whose axis starts at 90 (not 0) makes a 92 vs 95 difference look 3× — misleading the boss. Start at zero to be honest.

## 2. Leveraging PivotCharts

A PivotChart is wired directly to a Pivot Table — it updates as data is filtered. **Insert → PivotChart**. Add a Slicer so the audience can explore on their own.

**Real example:** A revenue-by-category PivotChart that, when the "Region" Slicer is clicked to "Bandung", instantly switches to Bandung data — without building a new chart.

## 3. Designing a Good Dashboard

- **Most important KPIs top-left** (the eye reads from there).
- Group related charts together.
- Consistent colors & fonts across the whole dashboard.
- One date/region filter controlling all charts.
- Leave white space — don't overcrowd.

### Typical Layout
```
┌───────────┬───────────┬───────────┐
│  KPI 1    │  KPI 2    │  KPI 3    │  ← scorecards
├───────────┴─────┬─────┴───────────┤
│  Trend (line)   │ Composition(bar)│
├─────────────────┼─────────────────┤
│  Detail table   │ Map / category  │
└─────────────────┴─────────────────┘
```

**Real dashboard examples:**
- **Director's sales dashboard:** KPIs (Revenue, Orders, AOV) on top; monthly trend line; bar by category; map by province. One month Slicer controls everything.
- **CS dashboard:** KPIs (Total tickets, Avg response, % resolved); daily ticket-volume line; bar by agent.
- **HR dashboard:** KPIs (Headcount, Turnover %, Avg tenure); bar by division; hiring trend.

## 4. Interactive Dashboards with Pivot Charts

Combine several PivotCharts + Slicers + Timeline on one sheet. Connect one Slicer to multiple Pivots (**Report Connections**) so a single click filters the entire dashboard.

**Real example:** In a meeting, the director clicks the "Q3" Slicer on the Timeline → the whole dashboard (KPIs, trend, category, map) instantly adjusts to Q3. The presentation becomes live and interactive.

## Key Takeaways
- Choose charts by goal, not by taste.
- One chart = one message; remove what isn't needed.
- Bar charts always start at zero so they don't mislead.
- Important KPIs top-left; consistent colors & fonts.
- PivotChart + Slicer = an interactive dashboard with no coding.
$da_en$
WHERE session_number = 'F06';

-- ── F07 — Introduction to Power BI ─────────────────────────
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Angkatan Juli 2026):** Kamis, 16 Juli 2026 · 19.30 WIB

# Sesi 7 — Introduce Power BI

Power BI adalah tool Business Intelligence dari Microsoft untuk membangun dashboard interaktif berskala besar — melampaui kemampuan spreadsheet. Sesi ini mengenalkan alurnya: dari menghubungkan data hingga mempublikasikan dashboard.

## Apa Itu Power BI?

Power BI menghubungkan banyak sumber data, membersihkannya, memodelkan hubungan antar-tabel, lalu menyajikannya sebagai dashboard yang bisa di-drill-down. Tiga komponen utamanya:
- **Power BI Desktop** — tempat membangun (gratis).
- **Power BI Service** — tempat publish & berbagi (cloud).
- **Power BI Mobile** — melihat di ponsel.

**Contoh nyata kapan butuh Power BI, bukan Excel:**
- **Data jutaan baris:** Excel melambat/mentok di ~1 juta baris; Power BI menangani puluhan juta.
- **Refresh otomatis:** Dashboard penjualan yang harus update tiap pagi dari database — Power BI menjadwalkan refresh, Excel harus manual.
- **Banyak sumber:** Menggabungkan data dari database, file Excel, dan Google Analytics dalam satu laporan.
- **Berbagi ke banyak orang:** 50 manajer cabang melihat dashboard yang sama, masing-masing memfilter cabangnya.

## 1. Jenis Chart & Fitur Power BI

### Panel utama
- **Fields pane** — daftar tabel & kolom.
- **Visualizations pane** — pilihan visual.
- **Filters pane** — saringan tingkat visual/halaman/laporan.

### Visual umum
Bar/Column, Line, Card (KPI tunggal), Matrix (mirip Pivot), Map, Slicer, Gauge, Treemap.

**Contoh nyata pemakaian visual:**
- **Card:** Menampilkan "Total Omzet: Rp2,4 M" besar di pojok dashboard.
- **Matrix:** Tabel omzet kategori × bulan dengan subtotal — mirip Pivot tapi interaktif.
- **Map:** Sebaran penjualan per provinsi dengan ukuran bubble sesuai omzet.
- **Gauge:** Progres pencapaian target bulan ini (mis. jarum di 78%).

## 2. Power Query — Membersihkan Data

Sebelum membangun visual, data dibersihkan di **Power Query Editor**:
- Hapus kolom, ubah tipe data, ganti nilai.
- Split/merge kolom, unpivot.
- Setiap langkah **terekam** dan otomatis diulang saat data di-refresh.

**Contoh nyata keunggulan Power Query:** Bulan lalu kamu bersihkan file penjualan (hapus 3 kolom, ubah tanggal, TRIM nama). Bulan ini tinggal ganti file sumber — semua langkah pembersihan otomatis terulang. Di Excel biasa kamu harus mengulang manual.

## 3. Data Model & Relationship

Hubungkan tabel melalui kunci yang sama (mis. `product_id`) di tampilan **Model**. Ini setara dengan VLOOKUP, tetapi sekali atur untuk seluruh laporan.

**Contoh nyata:** Tabel `Penjualan`, `Produk`, `Pelanggan`, dan `Kalender` dihubungkan via kunci masing-masing. Sekali dihubungkan, semua visual bisa memakai kolom dari tabel mana pun tanpa VLOOKUP berulang.

## 4. Pengenalan DAX

**DAX** (Data Analysis Expressions) untuk membuat **measure** (perhitungan dinamis):
```
Total Revenue = SUM(Sales[Amount])
Avg Order     = AVERAGE(Sales[Amount])
Revenue YoY % = DIVIDE([Total Revenue] - [Revenue LY], [Revenue LY])
```

**Contoh nyata measure DAX:**
- **% Pencapaian Target** = `DIVIDE([Total Revenue], [Target])` — otomatis menyesuaikan saat difilter per cabang.
- **Jumlah Pelanggan Aktif** = `DISTINCTCOUNT(Sales[CustomerID])`.
- **Pertumbuhan MoM** = membandingkan bulan ini vs bulan lalu, dinamis mengikuti filter Slicer.

## 5. Menyusun & Memublikasikan Dashboard

1. **Get Data** → hubungkan sumber (Excel, CSV, database).
2. **Transform** di Power Query.
3. **Model** — atur relationship.
4. **Build** — seret field ke kanvas, atur layout, tambah slicer.
5. **Publish** ke Power BI Service → bagikan tautan / sematkan (embed).
6. **Schedule refresh** agar data selalu terbaru.

> **Studi kasus mini:** Impor 3 file penjualan cabang → gabungkan di Power Query → hubungkan ke tabel Produk → buat measure Omzet & Margin → susun 1 halaman: Card KPI, line tren, bar kategori, map provinsi, Slicer bulan → Publish → jadwalkan refresh harian. Manajer tinggal buka tautan setiap pagi.

## Kesimpulan Utama
- Power BI = Power Query (bersihkan) + Model (hubungkan) + Visual (sajikan) + DAX (hitung).
- Power Query merekam langkah dan mengulanginya otomatis saat refresh.
- Measure DAX bersifat dinamis mengikuti filter.
- Publish ke Service untuk berbagi dashboard secara online.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Thursday, 16 July 2026 · 19.30 WIB

# Session 7 — Introduction to Power BI

Power BI is Microsoft's Business Intelligence tool for building large-scale interactive dashboards — beyond what spreadsheets can do. This session introduces the flow: from connecting data to publishing a dashboard.

## What Is Power BI?

Power BI connects many data sources, cleans them, models relationships between tables, then presents everything as a dashboard you can drill into. Its three main components:
- **Power BI Desktop** — where you build (free).
- **Power BI Service** — where you publish & share (cloud).
- **Power BI Mobile** — view on your phone.

**Real examples of when you need Power BI, not Excel:**
- **Millions of rows:** Excel slows/stalls near ~1 million rows; Power BI handles tens of millions.
- **Auto refresh:** A sales dashboard that must update every morning from a database — Power BI schedules the refresh; Excel needs manual work.
- **Many sources:** Combining data from a database, an Excel file, and Google Analytics in one report.
- **Sharing with many:** 50 branch managers see the same dashboard, each filtering to their branch.

## 1. Chart Types & Power BI Features

### Main panes
- **Fields pane** — list of tables & columns.
- **Visualizations pane** — visual choices.
- **Filters pane** — visual/page/report-level filters.

### Common visuals
Bar/Column, Line, Card (single KPI), Matrix (like a Pivot), Map, Slicer, Gauge, Treemap.

**Real examples of using visuals:**
- **Card:** Shows a big "Total Revenue: Rp2.4B" in the dashboard corner.
- **Matrix:** A category × month revenue table with subtotals — like a Pivot but interactive.
- **Map:** Sales distribution by province with bubble size scaled to revenue.
- **Gauge:** Progress toward this month's target (e.g. needle at 78%).

## 2. Power Query — Cleaning Data

Before building visuals, data is cleaned in the **Power Query Editor**:
- Remove columns, change data types, replace values.
- Split/merge columns, unpivot.
- Every step is **recorded** and re-applied automatically on refresh.

**Real example of Power Query's advantage:** Last month you cleaned a sales file (removed 3 columns, fixed dates, TRIMmed names). This month you just swap the source file — every cleaning step replays automatically. In plain Excel you'd redo it all by hand.

## 3. Data Model & Relationships

Connect tables via a shared key (e.g. `product_id`) in the **Model** view. This is the equivalent of VLOOKUP, but set up once for the entire report.

**Real example:** `Sales`, `Products`, `Customers`, and `Calendar` tables connected via their keys. Once linked, every visual can use columns from any table without repeated VLOOKUPs.

## 4. Introduction to DAX

**DAX** (Data Analysis Expressions) creates **measures** (dynamic calculations):
```
Total Revenue = SUM(Sales[Amount])
Avg Order     = AVERAGE(Sales[Amount])
Revenue YoY % = DIVIDE([Total Revenue] - [Revenue LY], [Revenue LY])
```

**Real examples of DAX measures:**
- **% of Target** = `DIVIDE([Total Revenue], [Target])` — auto-adjusts when filtered per branch.
- **Active Customers** = `DISTINCTCOUNT(Sales[CustomerID])`.
- **MoM Growth** = compares this month vs last, dynamically following the Slicer filter.

## 5. Building & Publishing a Dashboard

1. **Get Data** → connect a source (Excel, CSV, database).
2. **Transform** in Power Query.
3. **Model** — set up relationships.
4. **Build** — drag fields onto the canvas, arrange layout, add slicers.
5. **Publish** to the Power BI Service → share a link / embed it.
6. **Schedule refresh** so data stays current.

> **Mini case study:** Import 3 branch sales files → combine in Power Query → link to the Products table → create Revenue & Margin measures → lay out one page: KPI Cards, trend line, category bar, province map, month Slicer → Publish → schedule a daily refresh. Managers just open the link each morning.

## Key Takeaways
- Power BI = Power Query (clean) + Model (connect) + Visuals (present) + DAX (calculate).
- Power Query records steps and replays them automatically on refresh.
- DAX measures are dynamic and respond to filters.
- Publish to the Service to share dashboards online.
$da_en$
WHERE session_number = 'F07';

-- ── F08 — Introduction to SQL ──────────────────────────────
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Angkatan Juli 2026):** Senin, 20 Juli 2026 · 19.30 WIB

# Sesi 8 — Introduce SQL: SELECT, Filter, & Agregasi

SQL adalah skill **nomor satu** yang dicek recruiter data analyst. Saat data sudah terlalu besar untuk spreadsheet, SQL-lah jawabannya. Sesi ini membawamu dari nol sampai bisa menulis query agregasi.

## Apa Itu Database?

**Database** adalah sistem penyimpanan data yang terorganisir — seperti sekumpulan tabel Excel, tetapi mampu menampung jutaan baris, diakses banyak orang sekaligus, dan menjaga konsistensi data. Database **relasional** menyimpan data dalam tabel yang saling terhubung lewat **kunci** (key).

Contoh database e-commerce: `customers`, `products`, `orders`, `order_items`.

**Contoh nyata database di sekitarmu:**
- **Aplikasi ojek online:** tabel `driver`, `penumpang`, `perjalanan`, `pembayaran`.
- **Sistem sekolah:** tabel `siswa`, `guru`, `kelas`, `nilai`.
- **Marketplace:** tabel `penjual`, `produk`, `pesanan`, `ulasan`.

## Apa Itu SQL?

**SQL** = *Structured Query Language*. Kamu mendeskripsikan **apa** data yang diinginkan, database yang mengurus **bagaimana** mengambilnya.

## 1. SELECT — Meminta Data

```sql
SELECT name, email, city
FROM customers;
```
- `SELECT *` mengambil **semua** kolom (gunakan secukupnya).
- `AS` untuk mengganti nama kolom hasil:
```sql
SELECT name AS customer_name, city AS location
FROM customers;
```

**Contoh nyata SELECT:**
- Ambil daftar nama & no HP pelanggan untuk broadcast promo.
- Ambil `nama_produk` dan `harga` untuk katalog.
- `SELECT nama, gaji AS penghasilan FROM karyawan` untuk laporan HR.

## 2. WHERE — Memfilter Baris

```sql
SELECT name, city
FROM customers
WHERE membership = 'premium';
```

Operator: `=`, `<>`, `>`, `<`, `>=`, `<=`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`.

```sql
WHERE price BETWEEN 150000 AND 500000
WHERE region IN ('Jakarta','Bandung')
WHERE name LIKE 'A%'        -- diawali huruf A
```

**Contoh nyata WHERE:**
- **Pelanggan VIP:** `WHERE total_belanja > 5000000`.
- **Order bulan ini:** `WHERE tanggal BETWEEN '2026-07-01' AND '2026-07-31'`.
- **Kota tertentu:** `WHERE kota IN ('Jakarta','Surabaya','Medan')`.
- **Cari nama:** `WHERE nama LIKE '%budi%'` menemukan semua yang mengandung "budi".
- **Data belum lengkap:** `WHERE no_hp IS NULL` menemukan pelanggan tanpa nomor HP.

## 3. AND / OR — Menggabungkan Kondisi

```sql
SELECT * FROM orders
WHERE status = 'completed' AND total_amount > 500000;

SELECT * FROM customers
WHERE city = 'Jakarta' OR city = 'Surabaya';
```

**Contoh nyata:** `WHERE status='completed' AND metode_bayar='e-wallet' AND tanggal >= '2026-07-01'` — order sukses via e-wallet bulan Juli.

## 4. ORDER BY & LIMIT

```sql
SELECT name, price
FROM products
ORDER BY price DESC   -- tertinggi dulu
LIMIT 5;              -- 5 teratas
```

**Contoh nyata:** "10 produk terlaris" = `ORDER BY qty_terjual DESC LIMIT 10`. "5 pelanggan dengan belanja terbesar" = `ORDER BY total_belanja DESC LIMIT 5`.

## 5. Agregasi — Meringkas Data

Fungsi agregat menggabungkan banyak baris menjadi satu nilai:

| Fungsi | Arti |
|---|---|
| `COUNT(*)` | Jumlah baris |
| `SUM(col)` | Total |
| `AVG(col)` | Rata-rata |
| `MIN` / `MAX` | Terkecil / terbesar |

```sql
SELECT COUNT(*) AS total_customers FROM customers;
SELECT AVG(price) AS avg_price FROM products;
```

**Contoh nyata agregasi:**
- `SELECT SUM(total) FROM orders WHERE bulan='Juli'` → total omzet Juli.
- `SELECT COUNT(*) FROM orders WHERE status='refund'` → jumlah refund.
- `SELECT MAX(total) FROM orders` → transaksi terbesar.

### GROUP BY — Agregasi per Kelompok
```sql
SELECT region, COUNT(*) AS jumlah
FROM customers
GROUP BY region;

SELECT category, AVG(price) AS rata_harga
FROM products
GROUP BY category;
```

**Contoh nyata GROUP BY:**
- **Omzet per kota:** `SELECT kota, SUM(total) FROM orders GROUP BY kota`.
- **Jumlah karyawan per divisi:** `SELECT divisi, COUNT(*) FROM karyawan GROUP BY divisi`.
- **Rata-rata rating per kategori:** `SELECT kategori, AVG(rating) FROM produk GROUP BY kategori`.

### HAVING — Memfilter Hasil Agregasi
`WHERE` memfilter baris **sebelum** dikelompokkan; `HAVING` memfilter **setelah** agregasi.
```sql
SELECT category, AVG(price) AS rata_harga
FROM products
GROUP BY category
HAVING AVG(price) > 300000;
```

**Contoh nyata HAVING:** "Kota dengan lebih dari 100 pelanggan" = `GROUP BY kota HAVING COUNT(*) > 100`. "Kategori dengan omzet di atas 10 juta" = `GROUP BY kategori HAVING SUM(total) > 10000000`.

## Urutan Eksekusi SQL
Walau ditulis `SELECT` dulu, database mengeksekusi dengan urutan:
`FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`.

## Error Umum
- Lupa tanda kutip tunggal pada teks: `WHERE city = Jakarta` ❌ → `'Jakarta'` ✅
- Memakai `WHERE` untuk hasil agregasi (harusnya `HAVING`).
- Salah nama kolom/tabel.

> 💡 Latihan langsung ada di **Playground → SQL** dan di latihan sesi ini — jalankan query nyata di browser.

## Kesimpulan Utama
- `SELECT ... FROM` mengambil kolom; `WHERE` memfilter baris.
- `ORDER BY` mengurutkan, `LIMIT` membatasi.
- Agregasi (`COUNT/SUM/AVG`) + `GROUP BY` meringkas data per kelompok.
- `HAVING` memfilter hasil agregasi; `WHERE` memfilter baris mentah.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Monday, 20 July 2026 · 19.30 WIB

# Session 8 — Introduce SQL: SELECT, Filter, & Aggregation

SQL is the **number-one** skill recruiters check for data analysts. When data is too big for a spreadsheet, SQL is the answer. This session takes you from zero to writing aggregation queries.

## What Is a Database?

A **database** is an organized data-storage system — like a set of Excel tables, but able to hold millions of rows, be accessed by many people at once, and enforce consistency. A **relational** database stores data in tables connected by **keys**.

Example e-commerce database: `customers`, `products`, `orders`, `order_items`.

**Real examples of databases around you:**
- **Ride-hailing app:** `driver`, `passenger`, `trip`, `payment` tables.
- **School system:** `student`, `teacher`, `class`, `grade` tables.
- **Marketplace:** `seller`, `product`, `order`, `review` tables.

## What Is SQL?

**SQL** = *Structured Query Language*. You describe **what** data you want; the database handles **how** to fetch it.

## 1. SELECT — Asking for Data

```sql
SELECT name, email, city
FROM customers;
```
- `SELECT *` returns **all** columns (use sparingly).
- `AS` renames the output column:
```sql
SELECT name AS customer_name, city AS location
FROM customers;
```

**Real examples of SELECT:**
- Pull a list of customer names & phone numbers for a promo broadcast.
- Pull `product_name` and `price` for a catalog.
- `SELECT name, salary AS income FROM employees` for an HR report.

## 2. WHERE — Filtering Rows

```sql
SELECT name, city
FROM customers
WHERE membership = 'premium';
```

Operators: `=`, `<>`, `>`, `<`, `>=`, `<=`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`.

```sql
WHERE price BETWEEN 150000 AND 500000
WHERE region IN ('Jakarta','Bandung')
WHERE name LIKE 'A%'        -- starts with A
```

**Real examples of WHERE:**
- **VIP customers:** `WHERE total_spend > 5000000`.
- **This month's orders:** `WHERE date BETWEEN '2026-07-01' AND '2026-07-31'`.
- **Specific cities:** `WHERE city IN ('Jakarta','Surabaya','Medan')`.
- **Name search:** `WHERE name LIKE '%budi%'` finds anything containing "budi".
- **Incomplete data:** `WHERE phone IS NULL` finds customers without a phone number.

## 3. AND / OR — Combining Conditions

```sql
SELECT * FROM orders
WHERE status = 'completed' AND total_amount > 500000;

SELECT * FROM customers
WHERE city = 'Jakarta' OR city = 'Surabaya';
```

**Real example:** `WHERE status='completed' AND payment='e-wallet' AND date >= '2026-07-01'` — successful e-wallet orders in July.

## 4. ORDER BY & LIMIT

```sql
SELECT name, price
FROM products
ORDER BY price DESC   -- highest first
LIMIT 5;              -- top 5
```

**Real example:** "Top 10 best-sellers" = `ORDER BY qty_sold DESC LIMIT 10`. "Top 5 customers by spend" = `ORDER BY total_spend DESC LIMIT 5`.

## 5. Aggregation — Summarizing Data

Aggregate functions collapse many rows into one value:

| Function | Meaning |
|---|---|
| `COUNT(*)` | Number of rows |
| `SUM(col)` | Total |
| `AVG(col)` | Average |
| `MIN` / `MAX` | Smallest / largest |

```sql
SELECT COUNT(*) AS total_customers FROM customers;
SELECT AVG(price) AS avg_price FROM products;
```

**Real examples of aggregation:**
- `SELECT SUM(total) FROM orders WHERE month='July'` → July's total revenue.
- `SELECT COUNT(*) FROM orders WHERE status='refund'` → number of refunds.
- `SELECT MAX(total) FROM orders` → the largest transaction.

### GROUP BY — Aggregating per Group
```sql
SELECT region, COUNT(*) AS count
FROM customers
GROUP BY region;

SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category;
```

**Real examples of GROUP BY:**
- **Revenue per city:** `SELECT city, SUM(total) FROM orders GROUP BY city`.
- **Headcount per division:** `SELECT division, COUNT(*) FROM employees GROUP BY division`.
- **Average rating per category:** `SELECT category, AVG(rating) FROM products GROUP BY category`.

### HAVING — Filtering Aggregated Results
`WHERE` filters rows **before** grouping; `HAVING` filters **after** aggregation.
```sql
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 300000;
```

**Real example of HAVING:** "Cities with more than 100 customers" = `GROUP BY city HAVING COUNT(*) > 100`. "Categories with revenue above 10 million" = `GROUP BY category HAVING SUM(total) > 10000000`.

## SQL Order of Execution
Although you write `SELECT` first, the database executes in this order:
`FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`.

## Common Errors
- Forgetting single quotes around text: `WHERE city = Jakarta` ❌ → `'Jakarta'` ✅
- Using `WHERE` on aggregated results (should be `HAVING`).
- Wrong column/table name.

> 💡 Hands-on practice is in **Playground → SQL** and in this session's exercises — run real queries in the browser.

## Key Takeaways
- `SELECT ... FROM` picks columns; `WHERE` filters rows.
- `ORDER BY` sorts, `LIMIT` caps the result.
- Aggregation (`COUNT/SUM/AVG`) + `GROUP BY` summarizes data per group.
- `HAVING` filters aggregated results; `WHERE` filters raw rows.
$da_en$
WHERE session_number = 'F08';

-- ── F09 — Final Project & Portfolio ────────────────────────
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Angkatan Juli 2026):** Selasa, 21 Juli 2026 · 19.30 WIB

# Sesi 9 — Final Project dan Portofolio

Sertifikat membuktikan kamu hadir; **portofolio** membuktikan kamu bisa. Bagi perekrut data analyst, portofolio adalah bukti nyata kemampuanmu menyelesaikan masalah dari awal sampai akhir.

## Kenapa Portofolio Penting

- Menunjukkan **proses berpikir**, bukan hanya hasil.
- Membuktikan kamu bisa bekerja dengan data nyata yang berantakan.
- Menjadi bahan obrolan saat interview.

**Contoh nyata dampak portofolio:**
- Dua kandidat sama-sama punya sertifikat. Yang punya portofolio "Analisis Churn Pelanggan Telco" dengan dashboard interaktif dipanggil duluan.
- Saat interview, portofolio menjadi bahan cerita: "Ceritakan proyek ini" jauh lebih mudah dijawab daripada pertanyaan teori abstrak.
- Recruiter sering menilai portofolio 30 detik pertama — proyek yang rapi dan jelas menang.

## Struktur Storytelling untuk Deck Portofolio

Susun deck mengikuti alur naratif:

1. **Konteks** — latar belakang & pertanyaan bisnis.
2. **Masalah** — apa yang ingin dipecahkan, kenapa penting.
3. **Data & Metodologi** — sumber data, cara membersihkan & menganalisis.
4. **Analisis** — temuan kunci, didukung visual.
5. **Insight** — apa arti temuan itu.
6. **Rekomendasi** — langkah konkret yang disarankan.
7. **Dampak** — perkiraan nilai bisnis.

> Setiap slide punya **satu pesan utama** yang ditulis sebagai judul slide.

**Contoh nyata judul slide yang kuat:**
- ❌ "Grafik Penjualan" → ✅ "Omzet Q3 turun 15%, dipicu anjloknya kategori Fashion"
- ❌ "Data Pelanggan" → ✅ "70% pendapatan datang dari 3 kota — peluang ekspansi terfokus"

## Tips Portofolio yang Menarik

- **Tunjukkan proses**, bukan hanya dashboard akhir — sertakan cuplikan pembersihan data & query.
- Pakai **bahasa bisnis**, bukan jargon teknis.
- Setiap chart harus menjawab sebuah pertanyaan.
- Konsistenkan warna, font, dan format angka.
- 1 proyek mendalam > 5 proyek dangkal.

**Contoh nyata 3 proyek portofolio yang memikat:**
1. **Analisis Penjualan Ritel:** dari data mentah kasir → dashboard omzet + rekomendasi restock.
2. **Analisis Churn Pelanggan:** EDA + segmentasi → siapa yang berhenti langganan & kenapa.
3. **Analisis Operasional/HR:** data absensi → pola keterlambatan & rekomendasi kebijakan.

## Memublikasikan Portofolio

| Platform | Cocok untuk |
|---|---|
| **LinkedIn** | Visibilitas ke perekrut |
| **Notion / Google Sites** | Halaman portofolio rapi |
| **Tableau Public / Power BI** | Dashboard interaktif |
| **GitHub** | Kode SQL/Python |

Sertakan tautan ke dataset, dashboard, dan deck. Tulis ringkasan 2–3 kalimat di awal agar pembaca langsung paham nilainya.

**Contoh nyata publikasi:** Posting di LinkedIn dengan format: 1 kalimat masalah, 1 GIF dashboard, 3 bullet insight, tautan ke deck lengkap. Post seperti ini sering menarik perhatian recruiter dan menghasilkan koneksi.

## Checklist Final Project
- [ ] Pertanyaan bisnis jelas
- [ ] Data dibersihkan & terdokumentasi
- [ ] Analisis menjawab pertanyaan
- [ ] Minimal 3 temuan + visual pendukung
- [ ] Rekomendasi spesifik & terukur
- [ ] Deck rapi dengan alur storytelling
- [ ] Dipublikasikan & tautannya dibagikan

## Kesimpulan Utama
- Portofolio = bukti kemampuan; lebih penting dari sertifikat.
- Susun dengan alur storytelling: konteks → masalah → analisis → rekomendasi.
- Tunjukkan proses dan pakai bahasa bisnis.
- Publikasikan agar mudah ditemukan perekrut.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Tuesday, 21 July 2026 · 19.30 WIB

# Session 9 — Final Project & Portfolio

A certificate proves you showed up; a **portfolio** proves you can do the work. For data-analyst recruiters, a portfolio is concrete evidence you can solve a problem end to end.

## Why a Portfolio Matters

- Shows your **thought process**, not just the result.
- Proves you can work with messy, real-world data.
- Becomes a talking point in interviews.

**Real examples of a portfolio's impact:**
- Two candidates both hold a certificate. The one with a "Telco Customer Churn Analysis" portfolio and an interactive dashboard gets called first.
- In interviews, the portfolio becomes the story: "Tell me about this project" is far easier to answer than abstract theory questions.
- Recruiters often judge a portfolio in the first 30 seconds — a clean, clear project wins.

## Storytelling Structure for a Portfolio Deck

Build the deck along a narrative arc:

1. **Context** — background & business question.
2. **Problem** — what you're solving, why it matters.
3. **Data & Methodology** — data sources, how you cleaned & analyzed.
4. **Analysis** — key findings, backed by visuals.
5. **Insight** — what the findings mean.
6. **Recommendation** — the concrete steps you advise.
7. **Impact** — the estimated business value.

> Each slide has **one key message**, written as the slide title.

**Real examples of strong slide titles:**
- ❌ "Sales Chart" → ✅ "Q3 revenue fell 15%, driven by a crash in Fashion"
- ❌ "Customer Data" → ✅ "70% of revenue comes from 3 cities — a focused expansion opportunity"

## Tips for an Engaging Portfolio

- **Show the process**, not just the final dashboard — include snippets of data cleaning & queries.
- Use **business language**, not technical jargon.
- Every chart should answer a question.
- Keep colors, fonts, and number formats consistent.
- 1 deep project > 5 shallow ones.

**Real examples of 3 compelling portfolio projects:**
1. **Retail Sales Analysis:** from raw POS data → a revenue dashboard + restock recommendations.
2. **Customer Churn Analysis:** EDA + segmentation → who unsubscribed and why.
3. **Operations/HR Analysis:** attendance data → lateness patterns & policy recommendations.

## Publishing a Portfolio

| Platform | Best for |
|---|---|
| **LinkedIn** | Visibility to recruiters |
| **Notion / Google Sites** | A tidy portfolio page |
| **Tableau Public / Power BI** | Interactive dashboards |
| **GitHub** | SQL/Python code |

Include links to the dataset, dashboard, and deck. Write a 2–3 sentence summary up top so readers grasp the value instantly.

**Real example of publishing:** A LinkedIn post formatted as: 1 sentence on the problem, 1 dashboard GIF, 3 insight bullets, a link to the full deck. Posts like this often catch recruiters' attention and lead to connections.

## Final Project Checklist
- [ ] Clear business question
- [ ] Data cleaned & documented
- [ ] Analysis answers the question
- [ ] At least 3 findings + supporting visuals
- [ ] Specific, measurable recommendations
- [ ] Polished deck with a storytelling arc
- [ ] Published & link shared

## Key Takeaways
- A portfolio = proof of ability; more important than a certificate.
- Build it with a storytelling arc: context → problem → analysis → recommendation.
- Show the process and use business language.
- Publish it so recruiters can find you.
$da_en$
WHERE session_number = 'F09';

-- ── F10 — BNSP Prep: Identifying Business Process ──────────
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Angkatan Juli 2026):** Rabu, 22 Juli 2026 · 19.30 WIB

# Sesi 10 — Kelas Persiapan BNSP: Mengidentifikasi Business Process

Uji kompetensi **BNSP** Data Analyst menuntut kamu berpikir seperti pemecah masalah bisnis, bukan sekadar pengolah angka. Sesi ini melatih tiga fondasi: memahami proses bisnis, menemukan akar masalah, dan merumuskan masalah.

## 1. Business Process (Proses Bisnis)

**Proses bisnis** adalah rangkaian langkah yang dijalankan organisasi untuk mencapai tujuan (mis. proses penjualan: prospek → penawaran → order → pengiriman → pembayaran).

Sebagai analyst, kamu memetakan proses untuk menemukan **di mana data dihasilkan** dan **di mana masalah muncul**.

### Cara Memetakan
- Identifikasi **input → aktivitas → output** tiap langkah.
- Tandai titik pengukuran (mis. lead time, tingkat konversi, error rate).
- Cari **bottleneck** — langkah yang paling lambat/sering gagal.

**Contoh nyata proses bisnis & titik datanya:**
- **E-commerce (order → kirim):** titik data = waktu konfirmasi bayar, waktu packing, waktu serah ke kurir, waktu sampai. Bottleneck sering di packing.
- **Restoran (pesan → sajikan):** titik data = waktu order masuk, waktu masak, waktu antar. Bottleneck di dapur saat jam sibuk.
- **Rekrutmen HR (lamar → terima):** titik data = jumlah pelamar, lolos screening, lolos interview, terima offer. Bottleneck sering di tahap interview yang lambat dijadwalkan.

## 2. Root Cause Analysis (Analisis Akar Masalah)

Masalah yang terlihat sering hanya **gejala**. RCA menggali sampai akar.

### Teknik 5 Whys
Tanyakan "mengapa" berulang kali:
> Penjualan turun → *mengapa?* Pelanggan berkurang → *mengapa?* Banyak komplain → *mengapa?* Pengiriman lambat → *mengapa?* Gudang kekurangan staf → *mengapa?* Tidak ada perencanaan kapasitas. **← akar masalah**

**Contoh nyata 5 Whys lain:**
- Konversi checkout turun → *mengapa?* Banyak yang batal di halaman bayar → *mengapa?* Loading lambat → *mengapa?* Gambar produk terlalu besar → *mengapa?* Tidak ada kompresi → *mengapa?* Belum ada standar upload. **← akar masalah**

### Diagram Fishbone (Ishikawa)
Mengelompokkan kemungkinan penyebab ke kategori: **Man, Machine, Method, Material, Measurement, Environment**. Berguna untuk masalah kompleks dengan banyak faktor.

**Contoh nyata Fishbone** untuk "tingkat retur produk tinggi": Man (packing kurang teliti), Machine (mesin seal rusak), Method (SOP QC lemah), Material (kemasan tipis), Measurement (tak ada cek kualitas), Environment (gudang lembap).

## 3. Problem Statement (Rumusan Masalah)

Rumusan masalah yang baik bersifat **spesifik, terukur, dan terikat konteks**.

**Formula:** *[Metrik] telah [berubah berapa] sejak [kapan], pada [segmen], menyebabkan [dampak bisnis].*

❌ "Penjualan bermasalah."
✅ "Tingkat konversi checkout turun dari 4,2% menjadi 2,8% sejak Maret 2026, terutama pada pengguna mobile, menyebabkan potensi kehilangan pendapatan ~Rp450 juta/bulan."

**Contoh nyata problem statement lain:**
- ✅ "Tingkat retur naik dari 3% ke 9% sejak peralihan ke kemasan baru pada April 2026, menyebabkan tambahan biaya ongkir balik ~Rp120 juta/bulan."
- ✅ "Turnover karyawan divisi Sales naik dari 8% ke 22% dalam 6 bulan terakhir, menyebabkan biaya rekrutmen ulang meningkat dan target penjualan tak tercapai."

### Ciri Problem Statement yang Kuat
- Berbasis data, bukan opini.
- Menyebut metrik, besaran, waktu, dan segmen.
- Netral — belum menyimpulkan solusi.

## Kesimpulan Utama
- Petakan proses bisnis untuk menemukan titik data & bottleneck.
- Gunakan 5 Whys / Fishbone untuk membedakan gejala dari akar masalah.
- Rumusan masalah harus spesifik, terukur, dan menyebut dampak bisnis.
- Ini adalah kompetensi inti yang diuji di BNSP.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Wednesday, 22 July 2026 · 19.30 WIB

# Session 10 — BNSP Prep: Identifying Business Process

The **BNSP** Data Analyst competency exam expects you to think like a business problem-solver, not just a number-cruncher. This session drills three foundations: understanding business processes, finding root causes, and framing the problem.

## 1. Business Process

A **business process** is the sequence of steps an organization runs to reach a goal (e.g. the sales process: lead → quote → order → delivery → payment).

As an analyst, you map the process to find **where data is generated** and **where problems occur**.

### How to Map It
- Identify **input → activity → output** of each step.
- Mark measurement points (e.g. lead time, conversion rate, error rate).
- Find the **bottleneck** — the slowest / most failure-prone step.

**Real examples of a business process & its data points:**
- **E-commerce (order → ship):** data points = payment confirmation time, packing time, courier handover time, delivery time. The bottleneck is often packing.
- **Restaurant (order → serve):** data points = order-in time, cooking time, serving time. The bottleneck is the kitchen at peak hours.
- **HR recruitment (apply → hire):** data points = applicants, screening pass, interview pass, offer accepted. The bottleneck is often the slow-to-schedule interview stage.

## 2. Root Cause Analysis

The visible problem is often just a **symptom**. RCA digs to the root.

### The 5 Whys Technique
Ask "why" repeatedly:
> Sales dropped → *why?* Fewer customers → *why?* Many complaints → *why?* Slow delivery → *why?* Warehouse understaffed → *why?* No capacity planning. **← root cause**

**Another real 5 Whys example:**
- Checkout conversion fell → *why?* Many abandon at the payment page → *why?* Slow loading → *why?* Product images too large → *why?* No compression → *why?* No upload standard exists. **← root cause**

### Fishbone (Ishikawa) Diagram
Groups possible causes into categories: **Man, Machine, Method, Material, Measurement, Environment**. Useful for complex problems with many factors.

**Real Fishbone example** for "high product return rate": Man (careless packing), Machine (broken sealing machine), Method (weak QC SOP), Material (thin packaging), Measurement (no quality check), Environment (humid warehouse).

## 3. Problem Statement

A good problem statement is **specific, measurable, and context-bound**.

**Formula:** *[Metric] has [changed how much] since [when], in [segment], causing [business impact].*

❌ "Sales have a problem."
✅ "Checkout conversion fell from 4.2% to 2.8% since March 2026, mainly on mobile users, causing an estimated ~Rp450M/month in lost revenue."

**More real problem-statement examples:**
- ✅ "The return rate rose from 3% to 9% since switching to new packaging in April 2026, causing ~Rp120M/month in extra return-shipping cost."
- ✅ "Sales-division turnover rose from 8% to 22% over the last 6 months, driving up re-hiring costs and causing missed sales targets."

### Traits of a Strong Problem Statement
- Data-based, not opinion.
- States metric, magnitude, time, and segment.
- Neutral — doesn't pre-conclude a solution.

## Key Takeaways
- Map the business process to find data points & bottlenecks.
- Use 5 Whys / Fishbone to separate symptoms from root causes.
- A problem statement must be specific, measurable, and state business impact.
- These are core competencies tested by BNSP.
$da_en$
WHERE session_number = 'F10';

-- ── F11 — BNSP Prep: Portfolio Mentoring ───────────────────
UPDATE public.sessions SET
content_id = $da_id$> 🗓️ **Jadwal Live Session (Angkatan Juli 2026):** Kamis, 23 Juli 2026 · 19.30 WIB

# Sesi 11 — Kelas Persiapan BNSP: Mentoring Portofolio

Sesi terakhir sebelum ujian BNSP. Fokusnya: menyusun **laporan analisis data** yang meyakinkan dengan teknik storytelling, lalu mematangkan portofolio akhir melalui review mendalam bersama mentor.

## Membuat Laporan Analisis Data dengan Storytelling

Laporan untuk uji kompetensi harus mengikuti struktur yang jelas dan dapat dipertanggungjawabkan.

### Struktur Laporan Standar
1. **Latar Belakang & Tujuan** — konteks bisnis dan pertanyaan.
2. **Rumusan Masalah** — spesifik dan terukur (lihat Sesi 10).
3. **Sumber & Persiapan Data** — asal data, langkah pembersihan.
4. **Metodologi** — teknik analisis yang dipakai dan alasannya.
5. **Hasil Analisis** — temuan didukung visual yang relevan.
6. **Insight & Pembahasan** — makna temuan terhadap masalah.
7. **Rekomendasi** — langkah konkret, terukur, dan berprioritas.
8. **Kesimpulan** — ringkasan dan dampak yang diharapkan.

**Contoh nyata alur laporan** (kasus retur tinggi):
- *Latar belakang:* biaya retur membengkak. *Rumusan:* retur naik 3%→9% sejak ganti kemasan. *Data:* 12 bulan order + log retur. *Metodologi:* EDA + crosstab jenis kemasan × status retur. *Hasil:* retur tertinggi pada produk pecah-belah dengan kemasan baru. *Insight:* kemasan baru kurang pelindung. *Rekomendasi:* kembalikan bubble wrap untuk kategori pecah-belah. *Kesimpulan:* estimasi hemat Rp100 juta/bulan.

### Prinsip Storytelling
- Mulai dari masalah yang dipedulikan stakeholder.
- Susun temuan sebagai alur logis menuju rekomendasi.
- Tiap visual menjawab satu pertanyaan dan diberi narasi.
- Tutup dengan "so what" — nilai bisnis yang dihasilkan.

## Review Mendalam Portofolio (Checklist Pra-Ujian)

- [ ] Rumusan masalah jelas, terukur, berbasis data.
- [ ] Proses pembersihan data terdokumentasi & dapat direplikasi.
- [ ] Analisis sesuai metodologi yang dipilih.
- [ ] Visual benar (chart tepat, sumbu mulai nol, berlabel).
- [ ] Insight terhubung langsung ke rumusan masalah.
- [ ] Rekomendasi spesifik & dapat ditindaklanjuti.
- [ ] Laporan mengalir secara naratif, bukan kumpulan chart acak.
- [ ] Siap menjelaskan setiap keputusan analisis saat ditanya asesor.

## Tips Menghadapi Asesor
- Pahami **mengapa** kamu memilih tiap teknik — asesor akan bertanya.
- Jujur soal keterbatasan data; tunjukkan kesadaran analitis.
- Latih presentasi 5–10 menit yang ringkas dan percaya diri.

**Contoh nyata pertanyaan asesor & cara menjawab:**
- *"Kenapa pakai median, bukan mean?"* → "Karena ada outlier transaksi grosir yang membuat mean bias; median lebih mewakili transaksi tipikal."
- *"Bagaimana memastikan datanya bersih?"* → "Saya cek duplikat pada order_id, TRIM kolom teks, dan validasi tanggal — terdokumentasi di sheet pembersihan."
- *"Apa keterbatasan analisismu?"* → "Data hanya 6 bulan, jadi pola musiman tahunan belum tertangkap penuh."

## Kesimpulan Utama
- Laporan analisis mengikuti struktur baku dari masalah hingga rekomendasi.
- Storytelling menghubungkan setiap bagian menjadi alur yang meyakinkan.
- Gunakan checklist pra-ujian untuk mematangkan portofolio.
- Siap menjelaskan setiap keputusan analisis kepada asesor BNSP.
$da_id$,
content_en = $da_en$> 🗓️ **Live Session Schedule (July 2026 Cohort):** Thursday, 23 July 2026 · 19.30 WIB

# Session 11 — BNSP Prep: Portfolio Mentoring

The final session before the BNSP exam. The focus: building a convincing **data analysis report** with storytelling, then polishing the final portfolio through a deep review with a mentor.

## Creating a Data Analysis Report with Storytelling

A report for the competency exam must follow a clear, defensible structure.

### Standard Report Structure
1. **Background & Objective** — business context and the question.
2. **Problem Statement** — specific and measurable (see Session 10).
3. **Data Sources & Preparation** — where the data came from, cleaning steps.
4. **Methodology** — the analysis techniques used and why.
5. **Analysis Results** — findings backed by relevant visuals.
6. **Insight & Discussion** — what findings mean for the problem.
7. **Recommendations** — concrete, measurable, prioritized steps.
8. **Conclusion** — summary and expected impact.

**Real example of the report arc** (high-return case):
- *Background:* return costs ballooned. *Problem:* returns rose 3%→9% since the packaging change. *Data:* 12 months of orders + return logs. *Methodology:* EDA + crosstab of packaging type × return status. *Results:* returns highest on fragile products with the new packaging. *Insight:* the new packaging is under-protective. *Recommendation:* restore bubble wrap for fragile categories. *Conclusion:* estimated Rp100M/month savings.

### Storytelling Principles
- Start from a problem the stakeholder cares about.
- Arrange findings as a logical path toward the recommendation.
- Each visual answers one question and gets a narrative.
- Close with the "so what" — the business value delivered.

## Deep Portfolio Review (Pre-Exam Checklist)

- [ ] Problem statement is clear, measurable, data-based.
- [ ] Data cleaning process documented & reproducible.
- [ ] Analysis matches the chosen methodology.
- [ ] Visuals correct (right chart, axis starts at zero, labeled).
- [ ] Insights connect directly to the problem statement.
- [ ] Recommendations specific & actionable.
- [ ] The report flows as a narrative, not a random pile of charts.
- [ ] Ready to explain every analytical decision when asked.

## Tips for Facing the Assessor
- Know **why** you chose each technique — the assessor will ask.
- Be honest about data limitations; show analytical awareness.
- Rehearse a concise, confident 5–10 minute presentation.

**Real examples of assessor questions & how to answer:**
- *"Why use the median, not the mean?"* → "Because a wholesale-transaction outlier biases the mean; the median better represents the typical transaction."
- *"How did you ensure the data was clean?"* → "I checked duplicates on order_id, TRIMmed text columns, and validated dates — documented in the cleaning sheet."
- *"What are the limitations of your analysis?"* → "The data covers only 6 months, so annual seasonality isn't fully captured."

## Key Takeaways
- An analysis report follows a standard structure from problem to recommendation.
- Storytelling links every section into a convincing arc.
- Use the pre-exam checklist to finalize the portfolio.
- Be ready to justify every analytical decision to the BNSP assessor.
$da_en$
WHERE session_number = 'F11';
