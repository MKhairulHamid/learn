-- Migration 008: Expand session content for sessions 09 and 10
-- Rich educational content for complete beginners

UPDATE sessions SET
  content_en = $en09$
# Session 9: Data Storytelling & Analysis Report Writing

## The Difference Between a Data Dump and a Data Story

Imagine two analysts are both asked to answer the same question: "Why did sales drop last quarter?"

**Analyst A (data dump):**
Produces a 47-slide presentation. Slides 1–10 are methodology. Slides 11–30 are charts of every metric imaginable. Slide 38 contains the actual answer, buried between two less important findings. The executive meeting runs 90 minutes, and by the end, no one is sure what they should do next.

**Analyst B (data story):**
Opens with: "Sales dropped 18% in Q3 because we lost a key enterprise customer (23% of our revenue) in July, and organic acquisition fell short of compensating for it. I recommend we prioritize retention efforts for our remaining top 10 accounts and accelerate the Q4 SMB acquisition campaign."

Then she spends the next 20 minutes showing the evidence and answering questions.

Both analysts looked at the same data. Only Analyst B drove a decision.

**The core problem with data dumps:**
- They force the audience to do the work of synthesis
- They bury the insight in a sea of supporting information
- They don't tell the audience what to do
- They protect the analyst ("I showed you everything") but fail the organization

**Data storytelling** is the discipline of organizing data, insights, and recommendations into a clear, compelling narrative that drives action.

---

## Why Most Analyst Reports Fail to Drive Decisions

In research on business communication, the following patterns kill analyst reports:

1. **No clear recommendation** — findings without action items leave decision-makers hanging
2. **Burying the lead** — putting the main finding on slide 30 instead of slide 1
3. **Speaking to data, not to people** — "The regression coefficient of -0.34 suggests..." vs "When we raise prices by 10%, we lose about 8% of customers"
4. **No clear "so what"** — presenting a number without explaining why it matters
5. **Treating all findings as equally important** — creating a laundry list instead of a prioritized argument
6. **Missing the audience** — using technical language with a non-technical executive, or being too simplistic with a data-savvy team

---

## The Pyramid Principle

Barbara Minto, a former McKinsey consultant, developed the Pyramid Principle in the 1970s. It remains the gold standard for structuring analytical communication.

**The core idea:** Start with your conclusion. Then provide the supporting arguments. Then the supporting evidence.

Most people write the opposite way — they walk through all the evidence, build up to the arguments, and finally arrive at the conclusion. This is the "mystery novel" structure, fine for entertainment but terrible for business communication.

**The pyramid structure:**

```
                     [ANSWER/RECOMMENDATION]
                      "We should do X because..."
                    /           |           \
          [Argument 1]    [Argument 2]    [Argument 3]
           "Reason A"     "Reason B"      "Reason C"
            /     \          |            /     \
        [Fact]  [Fact]    [Fact]      [Fact]  [Fact]
```

**Example:**

> **Answer:** We should expand into the Surabaya market in Q2.
>
> **Argument 1:** Market opportunity is significant — Surabaya has the second-largest e-commerce user base in Indonesia, with 12M active buyers.
>
> **Argument 2:** Competitive advantage exists — our 2-day delivery is already possible via existing logistics partnerships.
>
> **Argument 3:** Financial model is positive — breakeven at 18 months with conservative assumptions.

Notice how the answer comes first. If the executive only has 30 seconds, they hear the recommendation. If they have 30 minutes, they get the full argument and evidence.

**The MECE principle (Mutually Exclusive, Collectively Exhaustive):**
Your supporting arguments should cover the complete picture (collectively exhaustive) without overlapping (mutually exclusive). If Argument 1 and Argument 2 are basically saying the same thing, merge them.

---

## The SCR Framework: Situation → Complication → Resolution

Another powerful structure, especially for executive presentations:

**Situation:** Establish shared context. What was true before the problem? Keep this brief — your audience likely already knows the situation.

> "Our business has been growing steadily at 15% YoY for the past three years."

**Complication:** Introduce the disruption or problem. This is the "but" — the reason we are having this conversation.

> "However, Q3 results show only 2% growth, significantly below target."

**Resolution:** Your answer — the insight and recommendation.

> "Analysis reveals three root causes: [X, Y, Z]. To return to 15% growth, I recommend [Action 1, Action 2, Action 3]."

The SCR framework works because it mirrors natural storytelling structure. Every good story has a state of equilibrium (Situation), a disruption (Complication), and a resolution. Our brains are wired to engage with this pattern.

---

## Finding the "So What": Turning Numbers into Insights into Actions

The analytical chain has three levels:

```
Number → Insight → Action

"Revenue was Rp 4.2B last quarter"
        ↓
"This is 18% below the same quarter last year, the largest YoY decline in 5 years"
        ↓
"We must launch emergency customer retention measures within 30 days to stop the decline"
```

To find the "so what," ask yourself:
1. **Compared to what?** (target, last year, competitor, industry average)
2. **Is this good or bad?** (context)
3. **Why?** (root cause)
4. **What should we do about it?** (recommendation)

**Practice converting numbers to insights:**

| Number (weak) | Insight (strong) |
|---------------|-----------------|
| "We had 12,000 orders in October" | "Orders grew 34% MoM, driven by the 10.10 promotion — our highest single-month volume ever" |
| "Customer satisfaction score: 7.2/10" | "CSAT dropped from 8.1 to 7.2 in 60 days, coinciding with the new checkout flow launch — UX may be the culprit" |
| "We spent Rp 180M on marketing" | "Marketing spend returned Rp 3.40 for every Rp 1 spent — 70% above our 2.0x target" |

---

## Structuring an Analysis Report

A well-structured analysis report has these sections:

### 1. Executive Summary

The executive summary is read by everyone. The rest of the report is often read by no one. Therefore: **the executive summary must stand alone**.

How to write an executive summary in 3 sentences:
1. **Context sentence:** What question were you trying to answer and why?
2. **Finding sentence:** What is the single most important thing you found?
3. **Recommendation sentence:** What should the organization do as a result?

> "We analyzed Q3 sales performance to understand why revenue fell 18% below target. The primary driver was the loss of PT Maju Jaya (our largest client, 23% of revenue), combined with a 40% drop in new enterprise acquisition. We recommend an emergency account health review for the top 20 clients and allocating Rp 500M to a dedicated enterprise acquisition campaign for Q4."

Three sentences. Any executive can read this in 15 seconds. If they want more, the rest of the report is there.

### 2. Background and Objective

Why was this analysis conducted? What decision does it support? What was the specific question?

Keep this to one short paragraph or 3 bullet points. Don't write a history of the company.

### 3. Methodology

This section answers: "How did you do this analysis, and should I trust it?"

Include:
- **Data sources:** Where did the data come from? (e.g., "Salesforce CRM, extracted October 31, 2024")
- **Time period:** What date range was analyzed?
- **Key assumptions:** What did you assume that isn't proven? (e.g., "Attributed revenue to the region of the sales representative")
- **Limitations:** What can't this analysis tell you? (e.g., "We do not have competitor data, so market share analysis is estimated")

Being upfront about limitations builds credibility. Hiding them destroys it when they're discovered.

### 4. Key Findings

Lead with the most impactful finding, not the most interesting one. Structure each finding as:

1. **The headline** (one bold sentence stating the finding as a fact)
2. **The evidence** (charts, tables, numbers that support it)
3. **The interpretation** (why this matters)

Limit to 3–5 key findings. If you have 12 "key" findings, none of them are key.

### 5. Recommendations

This is the most valuable part of your report. Many analysts skip it or make it vague. Don't.

Good recommendations are:
- **Specific:** "Launch a 14-day email re-engagement campaign targeting 15,000 churned users from the past 90 days" (not "improve customer retention")
- **Measurable:** Include a target (reduce churn by 2 percentage points)
- **Prioritized:** What should happen first? Use a priority matrix (impact × effort)
- **Owned:** Who is responsible for implementing this?
- **Time-bound:** By when?

### 6. Appendix

Everything that didn't make it into the main report but might be asked about:
- Detailed data tables
- Methodology details
- Additional charts
- Sensitivity analysis

The appendix is your safety net. It shows you did thorough work without cluttering the main argument.

---

## Presenting to Different Stakeholders

The same analysis needs to be packaged differently for different audiences.

### CEO / CFO: Financial impact and strategic implications
- Lead with revenue, profit, or cost impact in absolute numbers and percentages
- Frame everything in terms of the company's strategic goals
- Be direct — they have 10 minutes, not 60
- Have the answer ready before you explain the analysis

> "This initiative will return Rp 2.4B in incremental revenue at a Rp 400M cost — a 6x ROI over 12 months."

### Operations team: Process efficiency and bottlenecks
- Speak in terms of volume, speed, error rates, and capacity
- Show the current state, the problem state, and the proposed future state
- Use process diagrams and before/after comparisons
- Be specific about which step in which process is the problem

### Marketing team: Campaign ROI and customer segments
- Show attribution clearly (which channels, which campaigns drove what)
- Speak their language: CAC, LTV, conversion rate, ROAS
- Segment analysis is highly valued — show how different customer groups behave differently
- Connect to creative decisions: "The video ads outperformed static by 3x"

---

## Slide Design for Analyst Presentations

**The core principle:** Slides are a visual aid, not a transcript.

If every word you plan to say is on the slide, there is no reason for you to be in the room.

**What goes on the slide:**
- The headline (one sentence, the "so what")
- One chart or visual
- 3–5 bullet points maximum (keywords, not sentences)
- The source of the data (small, at the bottom)

**What you say:**
- The context
- The nuance
- The caveats
- The story behind the chart

**The "assertion-evidence" slide format:**
- Slide title = the assertion (the finding, in a full sentence): *"Customer Churn Increased 40% After Pricing Change"*
- Slide body = the evidence (the chart or data that proves it)

Compare:
- Bad title: "Churn Analysis by Month"
- Good title: "Churn Spiked in September, Immediately After the 15% Price Increase"

---

## Handling Tough Questions from Stakeholders

**"Why didn't you look at X?"**
> "Good point — that was out of scope for this analysis but worth examining. I can add it to the follow-up. Can we schedule 30 minutes next week?"

Never make up an answer you don't have. It destroys trust permanently.

**"Your data is wrong."**
> "Thank you for flagging that. Can you tell me what you're seeing that differs? I want to reconcile the data." Then actually investigate — sometimes they are right.

**"How confident are you in this recommendation?"**
> Be honest about uncertainty. "I'm highly confident in the direction, less confident in the exact magnitude. Here are the key assumptions that could change the outcome..." Stakeholders respect intellectual honesty.

**The question you couldn't anticipate:**
> "That's a great question — I don't have that data in front of me, but I'll get you an answer by [specific date]." Then do it.

---

## Before and After: Rewriting a Bad Report

### Before (weak):
**Title:** Q3 Sales Data Analysis Report

"In Q3, total sales were Rp 4.2B. This compares to Q2 where sales were Rp 4.8B. The difference is Rp 600M. In the East region, sales were Rp 1.1B. In the West region, sales were Rp 2.1B. In the Central region, sales were Rp 1.0B. Month by month, July was Rp 1.5B, August was Rp 1.4B, and September was Rp 1.3B. The trend shows a decrease. Customer count was 1,240 in Q3 vs 1,380 in Q2."

### After (strong):
**Title:** Q3 Revenue Declined 12.5% — Three Actions Needed to Recover

"**Summary:** Q3 revenue fell Rp 600M (12.5%) from Q2, driven by a sequential monthly decline and a 10% drop in active customers. Immediate action on customer retention and East region performance is required.

**Finding 1:** Revenue declined every month of Q3 (July: Rp 1.5B → September: Rp 1.3B), suggesting structural deterioration, not a one-time event.

**Finding 2:** We lost 140 active customers between Q2 and Q3 — a 10% reduction. Retention, not acquisition, is the priority.

**Finding 3:** East region dramatically underperformed (23% of revenue vs. 44% in West), despite comparable market size. A separate East region review is recommended.

**Recommendations:** (1) Launch customer win-back campaign for 140 churned accounts. (2) Conduct East region sales team review by November 15. (3) Implement monthly churn early-warning dashboard."

---

## Common Mistakes Checklist

- [ ] Did you start with the recommendation or bury it at the end?
- [ ] Does every chart earn its place? Remove any chart that doesn't support a key finding.
- [ ] Is every finding linked to a "so what"?
- [ ] Did you write an executive summary that stands alone?
- [ ] Are your recommendations specific, measurable, and owned?
- [ ] Is the report calibrated for your audience's technical level?
- [ ] Did you acknowledge limitations honestly?

---

## Key Takeaways

1. Data storytelling is the skill that separates analysts who inform from analysts who influence.
2. The Pyramid Principle: start with your answer, then support it — never save the punchline for last.
3. The SCR framework (Situation → Complication → Resolution) mirrors natural storytelling and drives engagement.
4. Every number needs a "so what" — context, comparison, and a recommendation.
5. The executive summary must stand alone in 3 sentences.
6. Calibrate your communication for your audience — CFOs need financial impact, operations teams need process specifics.
7. Slides are visual aids, not transcripts. One assertion per slide, supported by evidence.

$en09$,
  content_id = $id09$
# Sesi 9: Data Storytelling & Penulisan Laporan Analisis

## Perbedaan antara Data Dump dan Data Story

Bayangkan dua analis sama-sama diminta menjawab pertanyaan yang sama: "Mengapa penjualan turun kuartal lalu?"

**Analis A (data dump):**
Menghasilkan presentasi 47 slide. Slide 1–10 adalah metodologi. Slide 11–30 adalah grafik dari setiap metrik yang bisa dibayangkan. Slide 38 berisi jawaban sebenarnya, terpendam di antara dua temuan yang kurang penting. Rapat eksekutif berlangsung 90 menit, dan di akhirnya, tidak ada yang yakin apa yang harus mereka lakukan selanjutnya.

**Analis B (data story):**
Membuka dengan: "Penjualan turun 18% di Q3 karena kita kehilangan pelanggan enterprise utama (23% dari pendapatan kita) di Juli, dan akuisisi organik tidak cukup untuk mengkompensasinya. Saya merekomendasikan prioritas upaya retensi untuk 10 akun teratas yang tersisa dan mempercepat kampanye akuisisi SMB Q4."

Kemudian ia menghabiskan 20 menit berikutnya menunjukkan bukti dan menjawab pertanyaan.

Kedua analis melihat data yang sama. Hanya Analis B yang mendorong keputusan.

**Inti masalah data dump:**
- Memaksa audiens melakukan pekerjaan sintesis sendiri
- Mengubur insight dalam lautan informasi pendukung
- Tidak memberi tahu audiens apa yang harus dilakukan
- Melindungi analis ("Saya sudah menunjukkan segalanya") tapi gagal melayani organisasi

---

## Mengapa Kebanyakan Laporan Analis Gagal Mendorong Keputusan

1. **Tidak ada rekomendasi yang jelas** — temuan tanpa item tindakan membuat pengambil keputusan menggantung
2. **Mengubur berita utama** — menempatkan temuan utama di slide 30 alih-alih slide 1
3. **Berbicara ke data, bukan ke orang** — "Koefisien regresi -0,34 menunjukkan..." vs "Ketika kita menaikkan harga 10%, kita kehilangan sekitar 8% pelanggan"
4. **Tidak ada "so what" yang jelas** — menyajikan angka tanpa menjelaskan mengapa itu penting
5. **Semua temuan dianggap sama pentingnya** — membuat daftar panjang alih-alih argumen yang diprioritaskan
6. **Salah sasaran audiens** — menggunakan bahasa teknis dengan eksekutif non-teknis

---

## Pyramid Principle

Barbara Minto, mantan konsultan McKinsey, mengembangkan Pyramid Principle pada tahun 1970-an. Ini tetap menjadi standar emas untuk menyusun komunikasi analitis.

**Ide intinya:** Mulai dengan kesimpulanmu. Kemudian berikan argumen pendukung. Kemudian bukti pendukung.

Kebanyakan orang menulis dengan cara sebaliknya — mereka melalui semua bukti, membangun argumen, dan akhirnya sampai pada kesimpulan. Ini adalah struktur "novel misteri", baik untuk hiburan tapi buruk untuk komunikasi bisnis.

**Struktur piramida:**

```
                     [JAWABAN/REKOMENDASI]
                      "Kita harus melakukan X karena..."
                    /           |           \
        [Argumen 1]        [Argumen 2]    [Argumen 3]
         "Alasan A"         "Alasan B"    "Alasan C"
          /     \               |           /     \
      [Fakta] [Fakta]        [Fakta]    [Fakta] [Fakta]
```

**Prinsip MECE (Mutually Exclusive, Collectively Exhaustive):**
Argumen pendukungmu harus mencakup gambaran lengkap (collectively exhaustive) tanpa tumpang tindih (mutually exclusive).

---

## Framework SCR: Situation → Complication → Resolution

Struktur powerful lainnya, terutama untuk presentasi eksekutif:

**Situation:** Tetapkan konteks bersama. Apa yang terjadi sebelum masalah muncul?

> "Bisnis kita telah tumbuh stabil 15% YoY selama tiga tahun terakhir."

**Complication:** Perkenalkan gangguan atau masalah. Ini adalah "namun" — alasan kita sedang melakukan percakapan ini.

> "Namun, hasil Q3 menunjukkan hanya pertumbuhan 2%, jauh di bawah target."

**Resolution:** Jawabanmu — insight dan rekomendasi.

> "Analisis mengungkap tiga akar masalah: [X, Y, Z]. Untuk kembali ke pertumbuhan 15%, saya merekomendasikan [Tindakan 1, Tindakan 2, Tindakan 3]."

---

## Menemukan "So What": Mengubah Angka menjadi Insight menjadi Tindakan

Rantai analitis memiliki tiga tingkat:

```
Angka → Insight → Tindakan

"Pendapatan bulan lalu Rp 4,2 miliar"
        ↓
"Ini 18% di bawah kuartal yang sama tahun lalu, penurunan YoY terbesar dalam 5 tahun"
        ↓
"Kita harus meluncurkan langkah retensi pelanggan darurat dalam 30 hari untuk menghentikan penurunan"
```

Untuk menemukan "so what", tanyakan pada dirimu:
1. **Dibandingkan dengan apa?** (target, tahun lalu, kompetitor, rata-rata industri)
2. **Apakah ini baik atau buruk?** (konteks)
3. **Mengapa?** (akar masalah)
4. **Apa yang harus kita lakukan?** (rekomendasi)

---

## Menyusun Laporan Analisis

### 1. Executive Summary

Executive summary dibaca oleh semua orang. Sisanya sering tidak dibaca siapa pun. Oleh karena itu: **executive summary harus bisa berdiri sendiri**.

Cara menulis executive summary dalam 3 kalimat:
1. **Kalimat konteks:** Pertanyaan apa yang coba dijawab dan mengapa?
2. **Kalimat temuan:** Apa satu hal terpenting yang ditemukan?
3. **Kalimat rekomendasi:** Apa yang harus dilakukan organisasi?

> "Kami menganalisis kinerja penjualan Q3 untuk memahami mengapa pendapatan turun 18% di bawah target. Pendorong utamanya adalah kehilangan PT Maju Jaya (klien terbesar kami, 23% dari pendapatan), dikombinasikan dengan penurunan 40% dalam akuisisi enterprise baru. Kami merekomendasikan tinjauan kesehatan akun darurat untuk 20 klien teratas dan mengalokasikan Rp 500 juta untuk kampanye akuisisi enterprise khusus Q4."

### 2. Latar Belakang dan Tujuan

Mengapa analisis ini dilakukan? Keputusan apa yang didukungnya? Pertanyaan spesifiknya apa?

Simpan dalam satu paragraf pendek atau 3 poin. Jangan menulis sejarah perusahaan.

### 3. Metodologi

Bagian ini menjawab: "Bagaimana kamu melakukan analisis ini, dan apakah saya bisa mempercayainya?"

Sertakan:
- **Sumber data:** Data berasal dari mana?
- **Periode waktu:** Rentang tanggal apa yang dianalisis?
- **Asumsi utama:** Apa yang diasumsikan tapi tidak terbukti?
- **Keterbatasan:** Apa yang tidak bisa dijawab analisis ini?

Jujur tentang keterbatasan membangun kredibilitas. Menyembunyikannya menghancurkannya saat ditemukan.

### 4. Temuan Utama

Awali dengan temuan paling berdampak, bukan yang paling menarik. Susun setiap temuan sebagai:

1. **Headline** (satu kalimat tebal yang menyatakan temuan sebagai fakta)
2. **Bukti** (grafik, tabel, angka yang mendukungnya)
3. **Interpretasi** (mengapa ini penting)

Batasi 3–5 temuan utama. Jika kamu punya 12 temuan "utama", tidak ada yang benar-benar utama.

### 5. Rekomendasi

Ini adalah bagian paling berharga dari laporanmu. Banyak analis melewatkannya atau membuatnya samar. Jangan.

Rekomendasi yang baik:
- **Spesifik:** "Luncurkan kampanye email re-engagement 14 hari yang menargetkan 15.000 pengguna yang churned dalam 90 hari terakhir" (bukan "tingkatkan retensi pelanggan")
- **Terukur:** Sertakan target (kurangi churn 2 poin persentase)
- **Diprioritaskan:** Apa yang harus terjadi pertama?
- **Dimiliki:** Siapa yang bertanggung jawab mengimplementasikannya?
- **Terikat waktu:** Kapan batasnya?

### 6. Lampiran

Semua yang tidak masuk ke laporan utama tapi mungkin ditanyakan:
- Tabel data terperinci
- Detail metodologi
- Grafik tambahan
- Analisis sensitivitas

---

## Presentasi untuk Audiens yang Berbeda

### CEO / CFO: Dampak keuangan dan implikasi strategis
- Awali dengan dampak pendapatan, laba, atau biaya dalam angka absolut dan persentase
- Bingkai segalanya dalam konteks tujuan strategis perusahaan
- Langsung ke intinya — mereka punya 10 menit, bukan 60
- Siapkan jawaban sebelum menjelaskan analisis

### Tim Operasional: Efisiensi proses dan bottleneck
- Bicara dalam volume, kecepatan, tingkat kesalahan, dan kapasitas
- Tunjukkan kondisi saat ini, kondisi bermasalah, dan kondisi masa depan yang diusulkan
- Gunakan diagram proses dan perbandingan sebelum/sesudah

### Tim Marketing: ROI kampanye dan segmen pelanggan
- Tunjukkan atribusi dengan jelas (saluran mana, kampanye mana yang menghasilkan apa)
- Bicara bahasa mereka: CAC, LTV, conversion rate, ROAS
- Analisis segmen sangat dihargai

---

## Desain Slide untuk Presentasi Analis

**Prinsip inti:** Slide adalah alat bantu visual, bukan transkrip.

Jika setiap kata yang ingin kamu sampaikan ada di slide, tidak ada alasan untukmu berada di ruangan tersebut.

**Apa yang ada di slide:**
- Headline (satu kalimat, "so what"-nya)
- Satu grafik atau visual
- Maksimal 3–5 poin (kata kunci, bukan kalimat)
- Sumber data (kecil, di bagian bawah)

**Format slide "assertion-evidence":**
- Judul slide = pernyataan (temuan, dalam kalimat lengkap): *"Churn Pelanggan Meningkat 40% Setelah Perubahan Harga"*
- Isi slide = bukti (grafik atau data yang membuktikannya)

Bandingkan:
- Judul buruk: "Analisis Churn per Bulan"
- Judul bagus: "Churn Melonjak di September, Tepat Setelah Kenaikan Harga 15%"

---

## Menangani Pertanyaan Sulit dari Stakeholder

**"Mengapa kamu tidak melihat X?"**
> "Poin yang bagus — itu di luar lingkup untuk analisis ini tapi layak diperiksa. Bisakah kita jadwalkan 30 menit minggu depan?"

Jangan pernah mengarang jawaban yang tidak kamu miliki. Itu menghancurkan kepercayaan selamanya.

**"Datamu salah."**
> "Terima kasih sudah mengingatkan. Bisakah kamu memberitahu apa yang kamu lihat yang berbeda? Saya ingin merekonsiliasi datanya." Kemudian benar-benar investigasi.

**"Seberapa yakin kamu dengan rekomendasi ini?"**
> Jujurlah tentang ketidakpastian. Stakeholder menghargai kejujuran intelektual.

---

## Sebelum dan Sesudah: Menulis Ulang Laporan yang Buruk

### Sebelum (lemah):
**Judul:** Laporan Analisis Data Penjualan Q3

"Pada Q3, total penjualan adalah Rp 4,2 miliar. Ini dibandingkan dengan Q2 di mana penjualan adalah Rp 4,8 miliar. Perbedaannya adalah Rp 600 juta. Di wilayah Timur, penjualan adalah Rp 1,1 miliar. Di wilayah Barat, penjualan adalah Rp 2,1 miliar..."

### Sesudah (kuat):
**Judul:** Pendapatan Q3 Turun 12,5% — Tiga Tindakan Diperlukan untuk Pemulihan

"**Ringkasan:** Pendapatan Q3 turun Rp 600 juta (12,5%) dari Q2, didorong oleh penurunan bulanan berturutan dan penurunan 10% pelanggan aktif. Tindakan segera pada retensi pelanggan dan kinerja wilayah Timur diperlukan.

**Temuan 1:** Pendapatan menurun setiap bulan di Q3 (Juli: Rp 1,5M → September: Rp 1,3M), menunjukkan deteriorasi struktural, bukan peristiwa satu kali.

**Temuan 2:** Kita kehilangan 140 pelanggan aktif antara Q2 dan Q3 — pengurangan 10%. Retensi, bukan akuisisi, adalah prioritasnya.

**Rekomendasi:** (1) Luncurkan kampanye win-back pelanggan untuk 140 akun yang churned. (2) Lakukan tinjauan tim penjualan wilayah Timur sebelum 15 November. (3) Implementasikan dashboard peringatan dini churn bulanan."

---

## Poin-Poin Kunci

1. Data storytelling adalah kemampuan yang memisahkan analis yang menginformasikan dari analis yang mempengaruhi.
2. Pyramid Principle: mulai dengan jawabanmu, kemudian dukung — jangan simpan punch line untuk terakhir.
3. Framework SCR (Situation → Complication → Resolution) mencerminkan storytelling alami.
4. Setiap angka butuh "so what" — konteks, perbandingan, dan rekomendasi.
5. Executive summary harus berdiri sendiri dalam 3 kalimat.
6. Kalibrasi komunikasimu untuk audiensmu — CFO butuh dampak finansial, tim operasional butuh detail proses.
7. Slide adalah alat bantu visual, bukan transkrip. Satu pernyataan per slide, didukung oleh bukti.

$id09$
WHERE session_number = '09';

UPDATE sessions SET
  content_en = $en10$
# Session 10: Python for Data Analysts — Pandas, EDA & Visualization

## Why Python for Data Analysts?

You already know SQL and Excel. Why add Python? Here is the honest answer:

**Excel is best for:**
- Quick ad-hoc calculations on small-to-medium datasets
- Sharing with non-technical colleagues
- Financial models that live in spreadsheets
- Pivot tables and basic charts

**SQL is best for:**
- Querying databases
- Aggregating large tables efficiently
- Combining tables with JOINs
- Defining and transforming data in a database

**Python is best for:**
- Processing very large files (millions of rows) that crash Excel
- Automating repetitive data tasks (e.g., weekly report generation)
- Advanced statistics and machine learning
- Web scraping
- Cleaning messy, unstructured data
- Creating highly customized visualizations
- Building data pipelines

**The rule of thumb:** Use the simplest tool that gets the job done. If Excel handles it, use Excel. If you need SQL joins, use SQL. If you need to automate, scale, or do something complex, reach for Python.

---

## Setting Up: Google Colab

The single biggest barrier to learning Python is setup. Installing Python, pip, Anaconda, Jupyter — it can take hours and often goes wrong.

**Solution: Google Colab.** It is a free Jupyter notebook environment that runs entirely in your browser. No installation needed.

**Getting started:**
1. Go to **colab.research.google.com**
2. Sign in with your Google account
3. Click **New notebook**
4. You're ready to write Python

Google Colab comes with pandas, numpy, matplotlib, seaborn, and hundreds of other libraries **pre-installed**. Your notebooks are saved to Google Drive automatically.

**Colab keyboard shortcuts:**
- `Shift + Enter` — run current cell, move to next
- `Ctrl + Enter` — run current cell, stay
- `Ctrl + M B` — add cell below
- `Ctrl + M A` — add cell above
- `Ctrl + M D` — delete cell

---

## Python Basics Refresher for Absolute Beginners

Even if you have never written code before, these concepts are learnable in a single session.

### Variables

A variable is a named container for a value. Think of it like a labeled box.

```python
# Assign values to variables
revenue = 42000000        # An integer (whole number)
growth_rate = 0.18        # A float (decimal number)
company_name = "Tokobuku" # A string (text)
is_profitable = True      # A boolean (True or False)

# Print values
print(revenue)            # Output: 42000000
print(f"Revenue: {revenue:,}")  # Output: Revenue: 42,000,000
```

### Data Types

| Type | Example | When to use |
|------|---------|-------------|
| `int` | `42`, `1000`, `-5` | Counts, IDs, quantities |
| `float` | `3.14`, `0.18`, `-2.5` | Prices, rates, percentages |
| `str` | `"hello"`, `"Jakarta"` | Text, names, categories |
| `bool` | `True`, `False` | Flags, conditions |
| `list` | `[1, 2, 3]`, `["a", "b"]` | Ordered collection of items |
| `dict` | `{"name": "Andi", "age": 25}` | Key-value pairs |

### Lists

A list is an ordered collection. Think of it as a column in Excel.

```python
# Create a list
cities = ["Jakarta", "Surabaya", "Bandung", "Medan"]

# Access by index (starts at 0!)
print(cities[0])   # Jakarta
print(cities[-1])  # Medan (last item)

# Add an item
cities.append("Semarang")

# Loop through a list
for city in cities:
    print(city)
```

### Dictionaries

A dictionary stores key-value pairs. Think of it as a single row in Excel where each column has a name.

```python
# Create a dictionary
customer = {
    "name": "Andi Sutanto",
    "age": 32,
    "city": "Jakarta",
    "total_orders": 15,
    "is_premium": True
}

# Access values
print(customer["name"])        # Andi Sutanto
print(customer["total_orders"]) # 15

# Update a value
customer["total_orders"] = 16
```

### If Statements

Make decisions based on conditions.

```python
revenue = 5200000
target = 5000000

if revenue >= target:
    print("Target achieved!")
elif revenue >= target * 0.9:
    print("Within 10% of target — close!")
else:
    print("Below target. Review needed.")

# Output: Target achieved!
```

### For Loops

Repeat an action for each item in a sequence.

```python
# Calculate total revenue from a list of orders
orders = [150000, 320000, 89000, 450000, 210000]
total = 0

for order_value in orders:
    total = total + order_value

print(f"Total revenue: {total:,}")  # Total revenue: 1,219,000

# Cleaner version using sum()
total = sum(orders)
```

### Functions

A function is a reusable block of code. Think of it as a named formula.

```python
# Define a function
def calculate_growth_rate(current, previous):
    if previous == 0:
        return 0  # Avoid division by zero
    return (current - previous) / previous

# Call the function
q3_growth = calculate_growth_rate(current=4800000, previous=4200000)
print(f"Q3 Growth: {q3_growth:.1%}")  # Q3 Growth: 14.3%
```

### Importing Libraries

Python's power comes from its libraries. Import them at the top of your notebook.

```python
import numpy as np          # Numerical computing
import pandas as pd         # Data manipulation
import matplotlib.pyplot as plt   # Basic plotting
import seaborn as sns       # Statistical visualization
```

The `as np`, `as pd` are aliases — shortcuts so you type `pd.read_csv()` instead of `pandas.read_csv()`.

---

## NumPy Basics

NumPy (Numerical Python) provides arrays and mathematical operations. It is the foundation that pandas is built on.

**Why NumPy arrays instead of Python lists?**

```python
# Python list: slow, element by element
python_list = [1, 2, 3, 4, 5]
doubled_list = [x * 2 for x in python_list]  # Must loop

# NumPy array: fast, operates on entire array at once
import numpy as np
numpy_array = np.array([1, 2, 3, 4, 5])
doubled_array = numpy_array * 2  # No loop needed!
```

NumPy arrays are typically 10–100x faster than Python lists for numerical operations because they are stored contiguously in memory and operations are implemented in C.

```python
# Common NumPy operations
data = np.array([23, 45, 12, 67, 34, 89, 21, 56])

print(np.mean(data))    # 43.375 (average)
print(np.median(data))  # 39.5
print(np.std(data))     # 25.15 (standard deviation)
print(np.min(data))     # 12
print(np.max(data))     # 89
print(np.sum(data))     # 347
```

---

## Pandas: The Core Data Analysis Library

Pandas is to Python what Excel is to office computing — the primary tool for working with tabular data. The name comes from "Panel Data," a term from econometrics.

### Series vs DataFrame

**Series:** A single column of data with an index (like one column in Excel).

```python
import pandas as pd

# Create a Series
revenue = pd.Series([4200000, 4800000, 3900000, 5100000],
                    index=["Q1", "Q2", "Q3", "Q4"])
print(revenue)
# Q1    4200000
# Q2    4800000
# Q3    3900000
# Q4    5100000
```

**DataFrame:** Multiple columns — the complete table (like an entire Excel sheet).

```python
# Create a DataFrame from a dictionary
data = {
    "month": ["Jan", "Feb", "Mar", "Apr", "May"],
    "revenue": [4200000, 3800000, 4500000, 5100000, 4900000],
    "orders": [420, 380, 450, 510, 490],
    "region": ["North", "North", "South", "South", "East"]
}
df = pd.DataFrame(data)
print(df)
```

### Loading Data

```python
# Read CSV file
df = pd.read_csv("sales_data.csv")

# Read Excel file
df = pd.read_excel("sales_data.xlsx", sheet_name="Sheet1")

# Read from a URL (CSV on the internet)
df = pd.read_csv("https://example.com/data.csv")

# Read from Google Sheets (export as CSV)
url = "https://docs.google.com/spreadsheets/d/YOUR_ID/export?format=csv"
df = pd.read_csv(url)
```

### Exploring a New Dataset

When you first receive a dataset, run these commands to understand what you're working with:

```python
# Basic exploration
df.head()       # First 5 rows (great starting point)
df.tail()       # Last 5 rows
df.shape        # (number of rows, number of columns)
df.dtypes       # Data type of each column
df.columns      # List of column names
df.info()       # Summary: columns, dtypes, missing value counts

# Statistical summary
df.describe()   # Count, mean, std, min, 25%, 50%, 75%, max for numeric columns
df.describe(include="object")  # For text columns: count, unique, top, freq

# Check for missing values
df.isnull().sum()   # Count of missing values per column
df.isnull().sum() / len(df) * 100  # Percentage missing per column

# Check for duplicates
df.duplicated().sum()  # Number of fully duplicate rows
```

### Selecting Data

```python
# Select one column (returns a Series)
df["revenue"]

# Select multiple columns (returns a DataFrame)
df[["month", "revenue", "orders"]]

# Select rows by position (iloc = integer location)
df.iloc[0]      # First row
df.iloc[0:5]    # First 5 rows
df.iloc[-1]     # Last row

# Select rows by label (loc = label-based)
df.loc[0]       # Row with index label 0
df.loc[0:4]     # Rows with index labels 0 to 4 (inclusive!)

# Note the difference: iloc[0:5] gives 5 rows (0,1,2,3,4)
#                      loc[0:4]  gives 5 rows (0,1,2,3,4) — loc IS inclusive at the end
```

### Filtering Data

```python
# Boolean indexing — the most common way to filter
# Step 1: Create a boolean condition (True/False for each row)
is_north = df["region"] == "North"
print(is_north)  # True, True, False, False, False

# Step 2: Use it to filter
north_df = df[is_north]
# Or in one line:
north_df = df[df["region"] == "North"]

# Filter with multiple conditions
# AND: use & (not 'and')
# OR: use | (not 'or')
high_revenue_north = df[(df["region"] == "North") & (df["revenue"] > 4000000)]

# Using query() — reads more like English
high_revenue_north = df.query("region == 'North' and revenue > 4000000")
```

### Adding and Modifying Columns

```python
# Add a new column
df["avg_order_value"] = df["revenue"] / df["orders"]

# Add a column with conditional logic
df["performance"] = df["revenue"].apply(
    lambda x: "High" if x >= 5000000 else ("Medium" if x >= 4000000 else "Low")
)

# Or with np.where (faster for simple conditions)
import numpy as np
df["above_target"] = np.where(df["revenue"] >= 4500000, "Yes", "No")
```

### Handling Missing Values

Missing values in pandas are represented as `NaN` (Not a Number). They appear as blank cells in a CSV.

```python
# Detect missing values
df.isnull().sum()      # Count per column
df[df["revenue"].isnull()]  # Show rows where revenue is missing

# Drop rows with any missing values
df_clean = df.dropna()

# Drop rows only where a specific column is missing
df_clean = df.dropna(subset=["revenue"])

# Fill missing values
df["revenue"].fillna(0)              # Fill with zero
df["revenue"].fillna(df["revenue"].mean())  # Fill with mean
df["region"].fillna("Unknown")       # Fill text with placeholder
df["revenue"].fillna(method="ffill") # Forward fill (copy previous row's value)
```

**Decision guide: drop vs fill?**
- **Drop** when: missing data is random and only a small percentage of rows
- **Fill with mean/median** when: data is numerical and MAR (Missing At Random)
- **Fill with a placeholder** ("Unknown") when: categorical and missing is meaningful
- **Forward fill** when: time series data and previous value is a reasonable estimate

### GroupBy and Aggregation

GroupBy is the pandas equivalent of Excel's pivot table or SQL's GROUP BY.

```python
# Total revenue by region
df.groupby("region")["revenue"].sum()

# Multiple aggregations at once
df.groupby("region").agg(
    total_revenue=("revenue", "sum"),
    avg_revenue=("revenue", "mean"),
    order_count=("orders", "sum"),
    month_count=("month", "count")
)

# GroupBy with multiple columns
df.groupby(["region", "performance"])["revenue"].sum()
```

### Merging DataFrames

```python
# Create two DataFrames
orders = pd.DataFrame({
    "order_id": [1001, 1002, 1003],
    "customer_id": ["C001", "C002", "C001"],
    "amount": [250000, 180000, 320000]
})

customers = pd.DataFrame({
    "customer_id": ["C001", "C002", "C003"],
    "name": ["Andi", "Budi", "Cici"],
    "city": ["Jakarta", "Surabaya", "Bandung"]
})

# Left join: keep all orders, add customer info
result = orders.merge(customers, on="customer_id", how="left")
print(result)
# order_id  customer_id  amount   name       city
# 1001      C001         250000   Andi       Jakarta
# 1002      C002         180000   Budi       Surabaya
# 1003      C001         320000   Andi       Jakarta
```

### Other Useful Operations

```python
# Sort by a column
df.sort_values("revenue", ascending=False)   # Descending
df.sort_values(["region", "revenue"])        # Multiple columns

# Remove duplicates
df.drop_duplicates()                         # All columns must match
df.drop_duplicates(subset=["customer_id"])   # Specific column match

# Rename columns
df.rename(columns={"revenue": "Revenue", "orders": "Order Count"})

# String operations (for text columns)
df["region"].str.upper()           # NORTH, SOUTH, EAST
df["region"].str.lower()           # north, south, east
df["region"].str.contains("orth")  # True/False
df["region"].str.strip()           # Remove leading/trailing spaces
```

---

## Matplotlib & Seaborn for Visualization

### Matplotlib: The Foundation

Matplotlib is the base visualization library. It is powerful but verbose.

```python
import matplotlib.pyplot as plt

# Basic line chart
months = ["Jan", "Feb", "Mar", "Apr", "May"]
revenue = [4200000, 3800000, 4500000, 5100000, 4900000]

plt.figure(figsize=(10, 6))  # Width=10 inches, Height=6 inches
plt.plot(months, revenue, marker="o", color="steelblue", linewidth=2)
plt.title("Monthly Revenue", fontsize=16, fontweight="bold")
plt.xlabel("Month")
plt.ylabel("Revenue (IDR)")
plt.grid(True, alpha=0.3)    # Light gridlines
plt.tight_layout()            # Prevent label clipping
plt.show()
```

```python
# Bar chart
plt.figure(figsize=(10, 6))
plt.bar(months, revenue, color="steelblue", edgecolor="white")
plt.title("Monthly Revenue")
plt.xlabel("Month")
plt.ylabel("Revenue (IDR)")
plt.show()
```

### Seaborn: Statistical Visualization Made Easy

Seaborn is built on top of Matplotlib and provides beautiful statistical charts with less code.

```python
import seaborn as sns
import matplotlib.pyplot as plt

# Set a theme
sns.set_theme(style="whitegrid")

# Distribution plot (histogram + density)
sns.histplot(data=df, x="revenue", kde=True)
plt.title("Revenue Distribution")
plt.show()

# Box plot (shows median, quartiles, outliers)
sns.boxplot(data=df, x="region", y="revenue")
plt.title("Revenue Distribution by Region")
plt.show()

# Scatter plot with regression line
sns.regplot(data=df, x="orders", y="revenue")
plt.title("Orders vs Revenue Correlation")
plt.show()

# Heatmap (correlation matrix)
correlation_matrix = df[["revenue", "orders", "avg_order_value"]].corr()
sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", center=0)
plt.title("Correlation Matrix")
plt.show()
```

---

## Practical EDA Workflow: 5 Questions for Every Dataset

When you receive a new dataset, answer these 5 questions systematically:

### Question 1: What shape is my data?
```python
print(f"Rows: {df.shape[0]:,}")
print(f"Columns: {df.shape[1]}")
print(f"Missing values: {df.isnull().sum().sum():,}")
print(f"Duplicate rows: {df.duplicated().sum():,}")
df.dtypes
```

### Question 2: How is each variable distributed?
```python
# For numerical columns: histogram
df.hist(figsize=(15, 10), bins=20)
plt.tight_layout()
plt.show()

# For categorical columns: value counts
for col in df.select_dtypes(include="object").columns:
    print(f"\n{col}:")
    print(df[col].value_counts().head(10))
```

### Question 3: Are there outliers?
```python
# Box plot for all numerical columns
df.select_dtypes(include="number").boxplot(figsize=(15, 6))
plt.xticks(rotation=45)
plt.show()

# Statistical approach: values beyond 3 standard deviations
z_scores = (df["revenue"] - df["revenue"].mean()) / df["revenue"].std()
outliers = df[z_scores.abs() > 3]
print(f"Outliers in revenue: {len(outliers)}")
```

### Question 4: What relationships exist between variables?
```python
# Correlation matrix
df.corr(numeric_only=True).round(2)

# Pairplot (scatter matrix) for small number of variables
sns.pairplot(df[["revenue", "orders", "avg_order_value"]])
plt.show()
```

### Question 5: Are there trends over time?
```python
# If there's a date column, convert and sort
df["date"] = pd.to_datetime(df["date"])
df = df.sort_values("date")

# Plot trend
df.set_index("date")["revenue"].plot(figsize=(12, 4))
plt.title("Revenue Over Time")
plt.show()
```

---

## Automating Repetitive Excel Tasks

One of Python's biggest practical wins for analysts: automating tasks that would take hours in Excel.

```python
import openpyxl  # For reading/writing Excel files
from openpyxl.styles import Font, PatternFill, Alignment

# Example: Auto-generate a weekly report for 5 regions
import pandas as pd

# Load the data
df = pd.read_csv("weekly_sales.csv")

# Create a summary per region
summary = df.groupby("region").agg(
    total_revenue=("revenue", "sum"),
    total_orders=("orders", "sum"),
    avg_order_value=("revenue", lambda x: x.sum() / df.loc[x.index, "orders"].sum())
).round(0)

# Export to Excel with formatting
with pd.ExcelWriter("weekly_report.xlsx", engine="openpyxl") as writer:
    summary.to_excel(writer, sheet_name="Summary")
    df.to_excel(writer, sheet_name="Raw Data", index=False)

print("Report generated: weekly_report.xlsx")
```

With a script like this, what used to be a 2-hour weekly task becomes a 10-second automated run.

---

## Key Takeaways

1. Use Python when Excel is too slow, too manual, or when you need to automate.
2. Google Colab is the easiest way to start — no installation, runs in the browser.
3. Pandas is your main tool: `read_csv()`, `head()`, `describe()`, `groupby()`, `merge()`.
4. Always start EDA with: shape, data types, missing values, distributions, outliers.
5. Seaborn makes beautiful statistical charts with minimal code.
6. Python can automate repetitive Excel tasks — a huge time saver in real analyst work.

$en10$,
  content_id = $id10$
# Sesi 10: Python untuk Analis Data — Pandas, EDA & Visualisasi

## Mengapa Python untuk Analis Data?

Kamu sudah tahu SQL dan Excel. Mengapa harus belajar Python? Ini jawabannya yang jujur:

**Excel terbaik untuk:**
- Kalkulasi ad-hoc cepat pada dataset kecil-menengah
- Berbagi dengan kolega non-teknis
- Model keuangan yang hidup di spreadsheet
- Pivot table dan grafik dasar

**SQL terbaik untuk:**
- Mengquery database
- Mengagregasi tabel besar secara efisien
- Menggabungkan tabel dengan JOIN
- Mendefinisikan dan mentransformasi data di database

**Python terbaik untuk:**
- Memproses file yang sangat besar (jutaan baris) yang membuat Excel crash
- Mengotomatiskan tugas data yang berulang (misalnya, pembuatan laporan mingguan)
- Statistik lanjutan dan machine learning
- Membersihkan data yang berantakan dan tidak terstruktur
- Membangun pipeline data

**Aturan praktis:** Gunakan alat paling sederhana yang menyelesaikan pekerjaan. Jika Excel bisa, gunakan Excel. Jika butuh JOIN SQL, gunakan SQL. Jika perlu mengotomatiskan, menskalakan, atau melakukan sesuatu yang kompleks, gunakan Python.

---

## Persiapan: Google Colab

**Solusi: Google Colab.** Ini adalah lingkungan notebook Jupyter gratis yang berjalan sepenuhnya di browsermu. Tidak perlu instalasi.

**Memulai:**
1. Buka **colab.research.google.com**
2. Masuk dengan akun Google
3. Klik **New notebook**
4. Kamu siap menulis Python

Google Colab sudah dilengkapi pandas, numpy, matplotlib, seaborn, dan ratusan library lain yang **sudah terinstal**. Notebookmu tersimpan ke Google Drive secara otomatis.

**Shortcut keyboard Colab:**
- `Shift + Enter` — jalankan sel saat ini, pindah ke berikutnya
- `Ctrl + Enter` — jalankan sel saat ini, tetap di tempat
- `Ctrl + M B` — tambah sel di bawah

---

## Dasar-Dasar Python untuk Pemula Mutlak

### Variabel

Variabel adalah wadah bernama untuk sebuah nilai. Bayangkan seperti kotak berlabel.

```python
# Assign nilai ke variabel
pendapatan = 42000000        # Integer (bilangan bulat)
tingkat_pertumbuhan = 0.18   # Float (bilangan desimal)
nama_perusahaan = "Tokobuku" # String (teks)
menguntungkan = True         # Boolean (True atau False)

# Print nilai
print(pendapatan)            # Output: 42000000
print(f"Pendapatan: {pendapatan:,}")  # Output: Pendapatan: 42,000,000
```

### Tipe Data

| Tipe | Contoh | Kapan Digunakan |
|------|--------|-----------------|
| `int` | `42`, `1000`, `-5` | Hitungan, ID, kuantitas |
| `float` | `3.14`, `0.18`, `-2.5` | Harga, tingkat, persentase |
| `str` | `"halo"`, `"Jakarta"` | Teks, nama, kategori |
| `bool` | `True`, `False` | Flag, kondisi |
| `list` | `[1, 2, 3]`, `["a", "b"]` | Koleksi item berurutan |
| `dict` | `{"nama": "Andi", "umur": 25}` | Pasangan key-value |

### List

```python
kota = ["Jakarta", "Surabaya", "Bandung", "Medan"]
print(kota[0])   # Jakarta
print(kota[-1])  # Medan (item terakhir)
kota.append("Semarang")

for k in kota:
    print(k)
```

### Dictionary

```python
pelanggan = {
    "nama": "Andi Sutanto",
    "umur": 32,
    "kota": "Jakarta",
    "total_pesanan": 15,
    "premium": True
}

print(pelanggan["nama"])          # Andi Sutanto
print(pelanggan["total_pesanan"]) # 15
pelanggan["total_pesanan"] = 16
```

### If Statement

```python
pendapatan = 5200000
target = 5000000

if pendapatan >= target:
    print("Target tercapai!")
elif pendapatan >= target * 0.9:
    print("Dalam 10% dari target — hampir!")
else:
    print("Di bawah target. Perlu tinjauan.")
```

### For Loop

```python
pesanan = [150000, 320000, 89000, 450000, 210000]
total = 0

for nilai_pesanan in pesanan:
    total = total + nilai_pesanan

print(f"Total pendapatan: {total:,}")  # Total pendapatan: 1,219,000

# Versi lebih ringkas
total = sum(pesanan)
```

### Fungsi

```python
def hitung_pertumbuhan(sekarang, sebelumnya):
    if sebelumnya == 0:
        return 0
    return (sekarang - sebelumnya) / sebelumnya

pertumbuhan_q3 = hitung_pertumbuhan(sekarang=4800000, sebelumnya=4200000)
print(f"Pertumbuhan Q3: {pertumbuhan_q3:.1%}")  # Pertumbuhan Q3: 14.3%
```

### Mengimpor Library

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
```

---

## Dasar-Dasar NumPy

NumPy array jauh lebih cepat dari list Python untuk operasi numerik karena diimplementasikan dalam bahasa C.

```python
import numpy as np

# List Python: lambat, harus loop
python_list = [1, 2, 3, 4, 5]
doubled_list = [x * 2 for x in python_list]

# Array NumPy: cepat, beroperasi pada seluruh array sekaligus
numpy_array = np.array([1, 2, 3, 4, 5])
doubled_array = numpy_array * 2  # Tidak perlu loop!

# Operasi NumPy umum
data = np.array([23, 45, 12, 67, 34, 89, 21, 56])

print(np.mean(data))    # 43.375 (rata-rata)
print(np.median(data))  # 39.5
print(np.std(data))     # 25.15 (standar deviasi)
print(np.min(data))     # 12
print(np.max(data))     # 89
```

---

## Pandas: Library Analisis Data Inti

### Series vs DataFrame

**Series:** Satu kolom data dengan indeks.

```python
import pandas as pd

pendapatan = pd.Series([4200000, 4800000, 3900000, 5100000],
                       index=["Q1", "Q2", "Q3", "Q4"])
```

**DataFrame:** Beberapa kolom — tabel lengkap.

```python
data = {
    "bulan": ["Jan", "Feb", "Mar", "Apr", "Mei"],
    "pendapatan": [4200000, 3800000, 4500000, 5100000, 4900000],
    "pesanan": [420, 380, 450, 510, 490],
    "wilayah": ["Utara", "Utara", "Selatan", "Selatan", "Timur"]
}
df = pd.DataFrame(data)
```

### Memuat Data

```python
# Baca file CSV
df = pd.read_csv("data_penjualan.csv")

# Baca file Excel
df = pd.read_excel("data_penjualan.xlsx", sheet_name="Sheet1")

# Baca dari Google Sheets
url = "https://docs.google.com/spreadsheets/d/ID_KAMU/export?format=csv"
df = pd.read_csv(url)
```

### Mengeksplorasi Dataset Baru

```python
df.head()        # 5 baris pertama
df.tail()        # 5 baris terakhir
df.shape         # (jumlah baris, jumlah kolom)
df.dtypes        # Tipe data setiap kolom
df.info()        # Ringkasan: kolom, tipe data, jumlah nilai hilang
df.describe()    # Statistik deskriptif

# Cek nilai yang hilang
df.isnull().sum()
df.isnull().sum() / len(df) * 100  # Persentase yang hilang

# Cek duplikat
df.duplicated().sum()
```

### Memilih Data

```python
# Pilih satu kolom
df["pendapatan"]

# Pilih beberapa kolom
df[["bulan", "pendapatan", "pesanan"]]

# Pilih baris berdasarkan posisi (iloc)
df.iloc[0]      # Baris pertama
df.iloc[0:5]    # 5 baris pertama

# Pilih baris berdasarkan label (loc)
df.loc[0]       # Baris dengan label indeks 0
```

### Filter Data

```python
# Filter dengan kondisi boolean
wilayah_utara = df[df["wilayah"] == "Utara"]

# Filter dengan beberapa kondisi
pendapatan_tinggi_utara = df[(df["wilayah"] == "Utara") & (df["pendapatan"] > 4000000)]

# Menggunakan query() — lebih mudah dibaca
pendapatan_tinggi_utara = df.query("wilayah == 'Utara' and pendapatan > 4000000")
```

### Menambah dan Memodifikasi Kolom

```python
# Tambah kolom baru
df["nilai_pesanan_rata"] = df["pendapatan"] / df["pesanan"]

# Tambah kolom dengan logika kondisional
import numpy as np
df["di_atas_target"] = np.where(df["pendapatan"] >= 4500000, "Ya", "Tidak")
```

### Menangani Nilai yang Hilang

```python
# Hapus baris dengan nilai hilang
df_bersih = df.dropna()
df_bersih = df.dropna(subset=["pendapatan"])

# Isi nilai yang hilang
df["pendapatan"].fillna(0)
df["pendapatan"].fillna(df["pendapatan"].mean())
df["wilayah"].fillna("Tidak Diketahui")
```

**Panduan keputusan: hapus vs isi?**
- **Hapus** jika: data hilang secara acak dan hanya sebagian kecil baris
- **Isi dengan mean/median** jika: data numerik dan hilang secara acak
- **Isi dengan placeholder** jika: kategorikal dan hilang bermakna
- **Forward fill** jika: data time series dan nilai sebelumnya adalah estimasi yang wajar

### GroupBy dan Agregasi

```python
# Total pendapatan per wilayah
df.groupby("wilayah")["pendapatan"].sum()

# Beberapa agregasi sekaligus
df.groupby("wilayah").agg(
    total_pendapatan=("pendapatan", "sum"),
    rata_pendapatan=("pendapatan", "mean"),
    jumlah_pesanan=("pesanan", "sum"),
    jumlah_bulan=("bulan", "count")
)
```

### Menggabungkan DataFrame

```python
pesanan = pd.DataFrame({
    "order_id": [1001, 1002, 1003],
    "pelanggan_id": ["P001", "P002", "P001"],
    "jumlah": [250000, 180000, 320000]
})

pelanggan = pd.DataFrame({
    "pelanggan_id": ["P001", "P002", "P003"],
    "nama": ["Andi", "Budi", "Cici"],
    "kota": ["Jakarta", "Surabaya", "Bandung"]
})

# Left join: simpan semua pesanan, tambahkan info pelanggan
hasil = pesanan.merge(pelanggan, on="pelanggan_id", how="left")
```

---

## Matplotlib & Seaborn untuk Visualisasi

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Grafik garis dasar dengan Matplotlib
bulan = ["Jan", "Feb", "Mar", "Apr", "Mei"]
pendapatan = [4200000, 3800000, 4500000, 5100000, 4900000]

plt.figure(figsize=(10, 6))
plt.plot(bulan, pendapatan, marker="o", color="steelblue", linewidth=2)
plt.title("Pendapatan Bulanan", fontsize=16, fontweight="bold")
plt.xlabel("Bulan")
plt.ylabel("Pendapatan (IDR)")
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# Seaborn: distribusi
sns.set_theme(style="whitegrid")
sns.histplot(data=df, x="pendapatan", kde=True)
plt.title("Distribusi Pendapatan")
plt.show()

# Seaborn: box plot
sns.boxplot(data=df, x="wilayah", y="pendapatan")
plt.title("Distribusi Pendapatan per Wilayah")
plt.show()

# Seaborn: heatmap korelasi
matriks_korelasi = df[["pendapatan", "pesanan", "nilai_pesanan_rata"]].corr()
sns.heatmap(matriks_korelasi, annot=True, cmap="coolwarm", center=0)
plt.title("Matriks Korelasi")
plt.show()
```

---

## Alur Kerja EDA Praktis: 5 Pertanyaan untuk Setiap Dataset

### Pertanyaan 1: Seperti apa bentuk dataku?
```python
print(f"Baris: {df.shape[0]:,}")
print(f"Kolom: {df.shape[1]}")
print(f"Nilai hilang: {df.isnull().sum().sum():,}")
print(f"Baris duplikat: {df.duplicated().sum():,}")
```

### Pertanyaan 2: Bagaimana distribusi setiap variabel?
```python
df.hist(figsize=(15, 10), bins=20)
plt.tight_layout()
plt.show()

for col in df.select_dtypes(include="object").columns:
    print(f"\n{col}:")
    print(df[col].value_counts().head(10))
```

### Pertanyaan 3: Apakah ada outlier?
```python
df.select_dtypes(include="number").boxplot(figsize=(15, 6))
plt.xticks(rotation=45)
plt.show()

z_scores = (df["pendapatan"] - df["pendapatan"].mean()) / df["pendapatan"].std()
outlier = df[z_scores.abs() > 3]
print(f"Outlier dalam pendapatan: {len(outlier)}")
```

### Pertanyaan 4: Hubungan apa yang ada antara variabel?
```python
df.corr(numeric_only=True).round(2)

sns.pairplot(df[["pendapatan", "pesanan", "nilai_pesanan_rata"]])
plt.show()
```

### Pertanyaan 5: Apakah ada tren sepanjang waktu?
```python
df["tanggal"] = pd.to_datetime(df["tanggal"])
df = df.sort_values("tanggal")
df.set_index("tanggal")["pendapatan"].plot(figsize=(12, 4))
plt.title("Pendapatan Sepanjang Waktu")
plt.show()
```

---

## Mengotomatiskan Tugas Excel yang Berulang

```python
import pandas as pd

# Muat data
df = pd.read_csv("penjualan_mingguan.csv")

# Buat ringkasan per wilayah
ringkasan = df.groupby("wilayah").agg(
    total_pendapatan=("pendapatan", "sum"),
    total_pesanan=("pesanan", "sum")
).round(0)

# Ekspor ke Excel
with pd.ExcelWriter("laporan_mingguan.xlsx", engine="openpyxl") as writer:
    ringkasan.to_excel(writer, sheet_name="Ringkasan")
    df.to_excel(writer, sheet_name="Data Mentah", index=False)

print("Laporan dibuat: laporan_mingguan.xlsx")
```

Dengan skrip seperti ini, apa yang dulunya tugas mingguan 2 jam menjadi jalankan otomatis 10 detik.

---

## Poin-Poin Kunci

1. Gunakan Python ketika Excel terlalu lambat, terlalu manual, atau saat perlu mengotomatiskan.
2. Google Colab adalah cara termudah untuk memulai — tidak perlu instalasi, berjalan di browser.
3. Pandas adalah alat utamamu: `read_csv()`, `head()`, `describe()`, `groupby()`, `merge()`.
4. Selalu mulai EDA dengan: bentuk, tipe data, nilai hilang, distribusi, outlier.
5. Seaborn membuat grafik statistik yang indah dengan kode minimal.
6. Python bisa mengotomatiskan tugas Excel yang berulang — penghemat waktu yang luar biasa dalam pekerjaan analis nyata.

$id10$
WHERE session_number = '10';
