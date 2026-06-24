import { useState } from "react"

type RateType = "flat" | "progresif" | "progresif-terbatas"

interface Result {
  exact: string
  rounded: string
  fee: number
}

const rateOptions: { value: RateType; label: string }[] = [
  { value: "flat", label: "Flat" },
  { value: "progresif", label: "Progresif" },
  { value: "progresif-terbatas", label: "Progresif Terbatas" },
]

function App() {
  const [dateIn, setDateIn] = useState("")
  const [timeIn, setTimeIn] = useState("")
  const [dateOut, setDateOut] = useState("")
  const [timeOut, setTimeOut] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Rate type
  const [rateType, setRateType] = useState<RateType>("flat")

  // Shared
  const [gracePeriod, setGracePeriod] = useState("")

  // Flat
  const [tarifDasar, setTarifDasar] = useState("")

  // Progresif
  const [tarifAwal, setTarifAwal] = useState("")
  const [jamAwal, setJamAwal] = useState("")
  const [tarifBerikutnya, setTarifBerikutnya] = useState("")

  // Progresif Terbatas
  const [waktuAwal, setWaktuAwal] = useState("")
  const [waktuBerikutnya, setWaktuBerikutnya] = useState("")
  const [tarifMaksimal, setTarifMaksimal] = useState("")
  const [waktuMaksimal, setWaktuMaksimal] = useState<12 | 24>(24)

  const formatRupiah = (nominal: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(nominal)

  const handleCalculate = () => {
    setError(null)

    if (!dateIn || !timeIn || !dateOut || !timeOut) {
      setError("Isi semua field tanggal dan waktu")
      return
    }

    const masuk = new Date(`${dateIn}T${timeIn}`)
    const keluar = new Date(`${dateOut}T${timeOut}`)

    if (isNaN(masuk.getTime()) || isNaN(keluar.getTime())) {
      setError("Format tanggal atau waktu tidak valid")
      return
    }

    if (keluar <= masuk) {
      setError("Waktu keluar harus setelah waktu masuk")
      return
    }

    const diffMs = keluar.getTime() - masuk.getTime()
    const totalMenit = Math.floor(diffMs / 60000)
    const durasiBulat = Math.ceil(totalMenit / 60)

    const jam = Math.floor(totalMenit / 60)
    const menit = totalMenit % 60

    const exactParts: string[] = []
    if (jam > 0) exactParts.push(`${jam} jam`)
    if (menit > 0) exactParts.push(`${menit} menit`)
    const exact = exactParts.length > 0 ? exactParts.join(" ") : "0 menit"
    const rounded = `${durasiBulat} jam`

    // Hitung tarif — reset per 24 jam
    let fee = 0
    const gp = Number(gracePeriod) || 0

    if (totalMenit > gp) {
      const fullDays = Math.floor(durasiBulat / 24)
      const remainder = durasiBulat % 24

      const calcSegmen = (jam: number): number => {
        if (jam <= 0) return 0
        if (rateType === "flat") {
          const td = Number(tarifDasar) || 0
          return jam * td
        }
        if (rateType === "progresif") {
          const ta = Number(tarifAwal) || 0
          const ja = Number(jamAwal) || 0
          const tb = Number(tarifBerikutnya) || 0
          if (jam <= ja) return ta
          return ta + (jam - ja) * tb
        }
        // progresif-terbatas
        const ta = Number(tarifAwal) || 0
        const wa = Number(waktuAwal) || 0
        const tb = Number(tarifBerikutnya) || 0
        const wb = Number(waktuBerikutnya) || 0
        const tm = Number(tarifMaksimal) || 0

        let f = 0
        if (jam <= wa) {
          f = ta
        } else {
          const r = jam - wa
          const blocks = Math.ceil(r / wb)
          f = ta + blocks * tb
        }
        if (jam > waktuMaksimal) return tm
        if (tm > 0 && f > tm) return tm
        return f
      }

      for (let i = 0; i < fullDays; i++) {
        fee += calcSegmen(24)
      }
      fee += calcSegmen(remainder)
    }

    setResult({ exact, rounded, fee })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 pt-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Kalkulator Parkir
        </h1>

        <div className="space-y-4">
          {/* Tanggal & Jam Masuk */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tanggal & Jam Masuk
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateIn}
                onChange={(e) => setDateIn(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="time"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tanggal & Jam Keluar */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tanggal & Jam Keluar
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateOut}
                onChange={(e) => setDateOut(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="time"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Rate Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tipe Tarif
            </label>
            <div className="flex gap-2">
              {rateOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRateType(opt.value)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                    rateType === opt.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Rate Fields */}
          {rateType === "flat" && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tarif Dasar (Rp/jam)</label>
                <input
                  type="number"
                  min="0"
                  value={tarifDasar}
                  onChange={(e) => setTarifDasar(e.target.value)}
                  placeholder="5000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Grace Period (menit)</label>
                <input
                  type="number"
                  min="0"
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(e.target.value)}
                  placeholder="15"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {rateType === "progresif" && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tarif Awal (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={tarifAwal}
                  onChange={(e) => setTarifAwal(e.target.value)}
                  placeholder="5000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Jam Awal</label>
                <input
                  type="number"
                  min="1"
                  value={jamAwal}
                  onChange={(e) => setJamAwal(e.target.value)}
                  placeholder="2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tarif Berikutnya (Rp/jam)</label>
                <input
                  type="number"
                  min="0"
                  value={tarifBerikutnya}
                  onChange={(e) => setTarifBerikutnya(e.target.value)}
                  placeholder="3000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Grace Period (menit)</label>
                <input
                  type="number"
                  min="0"
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(e.target.value)}
                  placeholder="15"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {rateType === "progresif-terbatas" && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tarif Awal (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={tarifAwal}
                  onChange={(e) => setTarifAwal(e.target.value)}
                  placeholder="5000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Waktu Awal (jam)</label>
                <input
                  type="number"
                  min="1"
                  value={waktuAwal}
                  onChange={(e) => setWaktuAwal(e.target.value)}
                  placeholder="2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tarif Berikutnya (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={tarifBerikutnya}
                  onChange={(e) => setTarifBerikutnya(e.target.value)}
                  placeholder="3000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Waktu Berikutnya (jam/blok)</label>
                <input
                  type="number"
                  min="1"
                  value={waktuBerikutnya}
                  onChange={(e) => setWaktuBerikutnya(e.target.value)}
                  placeholder="2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tarif Maksimal (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={tarifMaksimal}
                  onChange={(e) => setTarifMaksimal(e.target.value)}
                  placeholder="30000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Waktu Maksimal</label>
                <select
                  value={waktuMaksimal}
                  onChange={(e) => setWaktuMaksimal(Number(e.target.value) as 12 | 24)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value={12}>12 Jam</option>
                  <option value={24}>24 Jam</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Grace Period (menit)</label>
                <input
                  type="number"
                  min="0"
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(e.target.value)}
                  placeholder="15"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Hitung Button */}
          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-lg cursor-pointer transition-colors"
          >
            Hitung
          </button>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && !error && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-2">
              <p className="text-blue-600 font-medium mb-1">Hasil</p>
              <div className="flex justify-between">
                <span className="text-blue-500">Durasi sebenarnya</span>
                <span className="font-semibold text-blue-700">{result.exact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-500">Durasi pembulatan</span>
                <span className="font-semibold text-blue-700">{result.rounded}</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-2">
                <span className="text-blue-600 font-medium">Tarif Parkir</span>
                <span className="font-bold text-blue-800">{formatRupiah(result.fee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 font-medium">Tarif Inap</span>
                <span className="font-bold text-blue-800">{formatRupiah(0)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
