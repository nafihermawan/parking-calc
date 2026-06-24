# parkir-calc

Kalkulator parkir — React 19 + TypeScript + Vite 8 + Tailwind CSS 4.

## Struktur

```
parkir-calc/
├── index.html
├── CONTEXT.md
└── src/
    ├── main.tsx
    ├── App.tsx          ← satu-satunya komponen React
    └── index.css
```

## Input

4 field: **tanggal masuk**, **jam masuk**, **tanggal keluar**, **jam keluar**.

## Logika Perhitungan Durasi

- Gabung `dateIn` + `timeIn` dan `dateOut` + `timeOut` jadi `Date` object.
- Validasi: semua field wajib, format valid, keluar > masuk.
- Hitung selisih menit (`Math.floor(diffMs / 60000)`).
- Durasi sebenarnya: X jam Y menit.
- Durasi pembulatan: `Math.ceil(totalMenit / 60)` — selalu round up ke jam penuh.

## Rate Type

Selector 3 tipe tarif: **Flat**, **Progresif**, **Progresif Terbatas**.

### Rule Reset per 24 Jam (berlaku semua tipe)

Durasi dipecah jadi kelipatan 24 jam + sisa. Tiap segmen 24 jam dihitung ulang dari tarif awal. Contoh: 26 jam = calcSegmen(24) + calcSegmen(2).

### Flat
- **Tarif dasar** (Rp/jam)
- **Grace period** (menit) — durasi <= grace → gratis
- Rumus per segmen: `jam * tarifDasar`

### Progresif
- **Tarif awal** (Rp) — harga blok untuk **jam awal** jam pertama
- **Jam awal** — berapa jam pertama dihitung flat
- **Tarif berikutnya** (Rp/jam) — per jam setelah jam awal
- **Grace period** (menit)
- Rumus per segmen: `if jam <= jamAwal → tarifAwal else tarifAwal + (jam - jamAwal) * tarifBerikutnya`

### Progresif Terbatas
- **Tarif awal** (Rp) — harga blok untuk **waktu awal** jam pertama
- **Waktu awal** (jam) — berapa jam pertama flat
- **Tarif berikutnya** (Rp) — per blok **waktu berikutnya**
- **Waktu berikutnya** (jam/blok) — interval tarif berikutnya
- **Tarif maksimal** (Rp) — batas maksimal per segmen 24 jam
- **Waktu maksimal** — dropdown 12 atau 24 jam
- **Grace period** (menit)
- Rumus per segmen:
  ```
  if jam <= waktuAwal → tarifAwal
  else:
    remaining = jam - waktuAwal
    blocks = ceil(remaining / waktuBerikutnya)
    total = tarifAwal + blocks * tarifBerikutnya
  if jam > waktuMaksimal → tarifMaksimal
  else if total > tarifMaksimal → tarifMaksimal
  ```

## Result Display

3 baris di card hasil:
- Durasi sebenarnya
- Durasi pembulatan
- Total tarif (format Rupiah via `Intl.NumberFormat("id-ID")`)
