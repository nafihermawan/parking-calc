import { useState } from "react"

type RateType = "flat" | "progresif" | "progresif-terbatas"

interface Skema {
  id: number
  nama: string
  lokasi: string
  tipe: RateType
  tarifAwal: number
  jamAwal: number
  tarifBerikutnya: number
  waktuBerikutnya: number
  tarifMaksimal: number
  gracePeriod: number
}

const skemaData: Skema[] = [
  {
    id: 1,
    nama: "Mall Grand Indonesia",
    lokasi: "Jakarta Pusat",
    tipe: "progresif",
    tarifAwal: 5000,
    jamAwal: 1,
    tarifBerikutnya: 3000,
    waktuBerikutnya: 1,
    tarifMaksimal: 0,
    gracePeriod: 15,
  },
  {
    id: 2,
    nama: "Bandara Soekarno-Hatta",
    lokasi: "Tangerang",
    tipe: "progresif-terbatas",
    tarifAwal: 7000,
    jamAwal: 1,
    tarifBerikutnya: 5000,
    waktuBerikutnya: 1,
    tarifMaksimal: 50000,
    gracePeriod: 10,
  },
  {
    id: 3,
    nama: "Stasiun Gambir",
    lokasi: "Jakarta Pusat",
    tipe: "flat",
    tarifAwal: 4000,
    jamAwal: 1,
    tarifBerikutnya: 4000,
    waktuBerikutnya: 1,
    tarifMaksimal: 0,
    gracePeriod: 10,
  },
  {
    id: 4,
    nama: "RS Cipto Mangunkusumo",
    lokasi: "Jakarta Pusat",
    tipe: "progresif",
    tarifAwal: 3000,
    jamAwal: 2,
    tarifBerikutnya: 2000,
    waktuBerikutnya: 1,
    tarifMaksimal: 0,
    gracePeriod: 30,
  },
  {
    id: 5,
    nama: "Kantor Walikota Bandung",
    lokasi: "Bandung",
    tipe: "progresif-terbatas",
    tarifAwal: 2000,
    jamAwal: 1,
    tarifBerikutnya: 1000,
    waktuBerikutnya: 2,
    tarifMaksimal: 10000,
    gracePeriod: 15,
  },
]

const tipeLabel: Record<RateType, string> = {
  flat: "Flat",
  progresif: "Progresif",
  "progresif-terbatas": "Progresif Terbatas",
}

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

export default function CariSkema() {
  const [search, setSearch] = useState("")
  const [filterTipe, setFilterTipe] = useState<RateType | "semua">("semua")

  const filtered = skemaData.filter((s) => {
    const matchSearch =
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.lokasi.toLowerCase().includes(search.toLowerCase())
    const matchTipe = filterTipe === "semua" || s.tipe === filterTipe
    return matchSearch && matchTipe
  })

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Cari Skema Parkir
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama tempat atau lokasi..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={filterTipe}
          onChange={(e) => setFilterTipe(e.target.value as RateType | "semua")}
          className="border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="semua">Semua Tipe</option>
          <option value="flat">Flat</option>
          <option value="progresif">Progresif</option>
          <option value="progresif-terbatas">Progresif Terbatas</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-8">Skema tidak ditemukan</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{s.nama}</h3>
                  <p className="text-sm text-gray-500">{s.lokasi}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {tipeLabel[s.tipe]}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {s.tipe !== "flat" && (
                  <>
                    <span className="text-gray-500">Tarif Awal</span>
                    <span className="text-gray-800 font-medium">{formatRupiah(s.tarifAwal)}</span>
                    <span className="text-gray-500">{s.tipe === "progresif" ? "Jam Awal" : "Waktu Awal"}</span>
                    <span className="text-gray-800 font-medium">{s.jamAwal} jam</span>
                    <span className="text-gray-500">Tarif Berikutnya</span>
                    <span className="text-gray-800 font-medium">{formatRupiah(s.tarifBerikutnya)}</span>
                    <span className="text-gray-500">Waktu Berikutnya</span>
                    <span className="text-gray-800 font-medium">{s.waktuBerikutnya} jam</span>
                  </>
                )}
                {s.tipe === "progresif-terbatas" && (
                  <span className="text-gray-500">Tarif Maksimal</span>
                )}
                {s.tipe === "progresif-terbatas" && (
                  <span className="text-gray-800 font-medium">{formatRupiah(s.tarifMaksimal)}</span>
                )}
                <span className="text-gray-500">Grace Period</span>
                <span className="text-gray-800 font-medium">{s.gracePeriod} menit</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
