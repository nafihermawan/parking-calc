# Dokumentasi Perhitungan

## Prinsip Dasar

- Durasi parkir dibulatkan **ke atas** per jam (`Math.ceil(totalMenit / 60)`)
- Durasi lebih dari 24 jam akan dipecah menjadi **hari penuh** (kelipatan 24 jam) + **sisa**, lalu tiap segmen 24 jam dihitung terpisah dan dijumlahkan
- **Grace period**: jika total menit ≤ grace period, tarif = 0 (gratis)

## Rumus Umum

```
durasiBulat  = ceil(totalMenit / 60)
fullDays     = floor(durasiBulat / 24)
remainder    = durasiBulat % 24
totalTarif   = Σ calcSegmen(24) untuk setiap hari penuh + calcSegmen(remainder)
```

---

## 1. Flat

**Parameter:**

| Parameter | Keterangan |
|---|---|
| `tarifDasar` | Tarif per jam (Rp) |
| `gracePeriod` | Batas gratis (menit) |

**Rumus:**
```
tarif = jam × tarifDasar
```

**Contoh:** tarifDasar = 5000, parkir 3 jam → 3 × 5000 = Rp15.000

---

## 2. Progresif

**Parameter:**

| Parameter | Keterangan |
|---|---|
| `tarifAwal` | Tarif untuk jam-jam awal (Rp) |
| `jamAwal` | Jumlah jam yang dicakup tarif awal |
| `tarifBerikutnya` | Tarif per blok berikutnya (Rp) |
| `waktuBerikutnya` | Ukuran blok berikutnya (jam) |
| `gracePeriod` | Batas gratis (menit) |

**Rumus:**
```
jika jam ≤ jamAwal:
  tarif = tarifAwal

jika jam > jamAwal:
  sisa   = jam - jamAwal
  blok   = ceil(sisa / waktuBerikutnya)
  tarif  = tarifAwal + (blok × tarifBerikutnya)
```

**Contoh 1 (waktuBerikutnya = 1):**
tarifAwal = 5000, jamAwal = 2, tarifBerikutnya = 3000, waktuBerikutnya = 1, parkir 5 jam
- 2 jam pertama = 5000
- Sisa 3 jam → 3 blok × 3000 = 9000
- Total = Rp14.000

**Contoh 2 (waktuBerikutnya = 2):**
tarifAwal = 5000, jamAwal = 2, tarifBerikutnya = 3000, waktuBerikutnya = 2, parkir 5 jam
- 2 jam pertama = 5000
- Sisa 3 jam → ceil(3/2) = 2 blok × 3000 = 6000
- Total = Rp11.000

---

## 3. Progresif Terbatas

**Parameter:**

| Parameter | Keterangan |
|---|---|
| `tarifAwal` | Tarif untuk waktu awal (Rp) |
| `waktuAwal` | Jumlah jam yang dicakup tarif awal |
| `tarifBerikutnya` | Tarif per blok berikutnya (Rp) |
| `waktuBerikutnya` | Ukuran blok berikutnya (jam) |
| `tarifMaksimal` | Batas maksimal tarif (Rp) |
| `waktuMaksimal` | Jika durasi > ini, langsung kena tarifMaksimal (12 atau 24 jam) |
| `gracePeriod` | Batas gratis (menit) |

**Rumus:**
```
jika jam > waktuMaksimal:
  tarif = tarifMaksimal

jika jam ≤ waktuAwal:
  tarif = tarifAwal

jika jam > waktuAwal:
  sisa   = jam - waktuAwal
  blok   = ceil(sisa / waktuBerikutnya)
  tarif  = tarifAwal + (blok × tarifBerikutnya)

jika tarif > tarifMaksimal:
  tarif = tarifMaksimal
```

**Contoh:**
tarifAwal = 5000, waktuAwal = 2, tarifBerikutnya = 3000, waktuBerikutnya = 2, tarifMaksimal = 30000, waktuMaksimal = 24, parkir 7 jam
- 2 jam pertama = 5000
- Sisa 5 jam → ceil(5/2) = 3 blok × 3000 = 9000
- Total = Rp14.000 (kurang dari 30000, jadi tetap 14000)

---

## Perbandingan Tipe

| Aspek | Flat | Progresif | Progresif Terbatas |
|---|---|---|---|
| Cara hitung | Per jam flat | Per blok bertingkat | Per blok bertingkat + batas |
| Ada batas maksimal? | ❌ | ❌ | ✅ |
| Bisa set ukuran blok? | ❌ | ✅ | ✅ |
| Cocok untuk | Tarif seragam | Tarif progresif tanpa batas | Tarif progresif dengan batas harian |
