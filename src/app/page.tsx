import LandingNavbar from '@/components/landing/LandingNavbar'
import LandingHero from '@/components/landing/LandingHero'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Zap, Paintbrush, Globe, Smartphone, MousePointer2, CheckCircle2 } from 'lucide-react'

export default async function HomePage() {
  const session = await getSession()
  if (session?.userId) {
    redirect('/dashboard')
  }

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-indigo-500 selection:text-white">
      <LandingNavbar />
      
      <main>
        <LandingHero />

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-900/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-20 animate-fade-up">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Apapun Bisnis Anda.<br />Katalogi Solusinya.</h2>
              <p className="max-w-2xl mx-auto text-slate-400 text-lg">Semua fitur yang Anda butuhkan untuk membangun katalog profesional tanpa bantuan desainer atau programmer.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards with Premium Styling */}
              <FeatureCard 
                icon={<Paintbrush className="w-6 h-6 text-pink-400" />}
                title="Desain Kustom"
                description="Pilih tema, warna, dan font yang sesuai dengan identitas merk Anda."
              />
              <FeatureCard 
                icon={<MousePointer2 className="w-6 h-6 text-indigo-400" />}
                title="Sangat Mudah"
                description="Drag & drop builder yang intuitif. Cukup klik, ketik, dan kustom sesuai keinginan."
              />
              <FeatureCard 
                icon={<Globe className="w-6 h-6 text-cyan-400" />}
                title="Domain Anda"
                description="Katalog profesional dengan slug cantik yang mudah diingat pelanggan."
              />
              <FeatureCard 
                icon={<Smartphone className="w-6 h-6 text-orange-400" />}
                title="Mobile First"
                description="Tampilan optimal di semua perangkat mobile pelanggan Anda. 100% responsif."
              />
              <FeatureCard 
                icon={<Zap className="w-6 h-6 text-yellow-400" />}
                title="Performa Tinggi"
                description="Cepat diakses, tanpa lag. Tak ada lagi pelanggan kabur gara-gara web lambat."
              />
              <FeatureCard 
                icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
                title="Selamanya Gratis"
                description="Gunakan fitur inti kami tanpa biaya sepeserpun. Mulai bisnis Anda hari ini."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 relative">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Siap Buat Katalog <br /> Terbaik Anda?</h2>
                <Link 
                  href="/login?signup=true" 
                  className="inline-flex bg-white text-indigo-700 font-bold px-10 py-5 rounded-2xl hover:bg-slate-100 transition-all text-xl shadow-xl active:scale-95"
                >
                  Mulai Sekarang — Gratis
                </Link>
                <p className="mt-8 text-indigo-200 font-medium">Bersenang-senanglah membangun, kami yang urus teknisnya.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Basic Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>&copy; 2026 Katalogi. Karya anak bangsa untuk UMKM dunia.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.08] hover:border-white/20 transition-all hover:-translate-y-2">
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}
