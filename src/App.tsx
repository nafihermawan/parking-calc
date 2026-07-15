import { useState } from "react"
import Calculator from "./Calculator"
import CariSkema from "./CariSkema"

type Page = "home" | "kalkulator" | "cari-skema"

export default function App() {
  const [page, setPage] = useState<Page>("home")

  if (page === "kalkulator") {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setPage("home")}
              className="text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
            >
              ← Kembali
            </button>
            <span className="font-bold text-gray-800">Parkir Calc</span>
          </div>
        </nav>
        <main className="flex justify-center p-4 pt-8">
          <Calculator />
        </main>
      </div>
    )
  }

  if (page === "cari-skema") {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setPage("home")}
              className="text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
            >
              ← Kembali
            </button>
            <span className="font-bold text-gray-800">Parkir Calc</span>
          </div>
        </nav>
        <main className="flex justify-center p-4 pt-8">
          <CariSkema />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Parkir Calc</h1>
          <p className="text-gray-500 text-lg">Kalkulator & pencarian skema parkir</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setPage("kalkulator")}
            className="w-full bg-white rounded-2xl shadow-lg p-8 text-left hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Kalkulator</h2>
                <p className="text-gray-500 text-sm">Hitung tarif parkir berdasarkan durasi & tipe tarif</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPage("cari-skema")}
            className="w-full bg-white rounded-2xl shadow-lg p-8 text-left hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Cari Skema</h2>
                <p className="text-gray-500 text-sm">Temukan skema tarif parkir berbagai tempat</p>
              </div>
            </div>
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-10">Parkir Calc v1.0</p>
      </div>
    </div>
  )
}
