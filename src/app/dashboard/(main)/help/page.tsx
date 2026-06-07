import { LifeBuoy, Clock } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-150 group-hover:bg-indigo-500/20 transition-all duration-500" />
        <div className="w-24 h-24 bg-white border border-gray-100 shadow-xl shadow-indigo-600/5 rounded-[2rem] flex items-center justify-center relative z-10 -rotate-3 group-hover:-rotate-12 transition-transform duration-500">
          <LifeBuoy className="w-12 h-12 text-indigo-600" />
        </div>
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-white border border-gray-100 shadow-lg rounded-2xl flex items-center justify-center z-20 rotate-6 animate-float-icon">
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Pusat Bantuan</h1>
      <p className="text-gray-500 text-lg max-w-md font-medium leading-relaxed">
        Fitur ini sedang dalam tahap pengembangan. Segera Anda bisa menemukan panduan lengkap dan layanan bantuan pelanggan di sini.
      </p>
    </div>
  )
}
