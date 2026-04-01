export type ContactContent = {
  title?: string
  email?: string
  whatsapp?: string
  address?: string
}

type ContactBlockProps = {
  content: ContactContent
  primaryColor?: string
}

export default function ContactBlock({ content, primaryColor = '#8b5cf6' }: ContactBlockProps) {
  const { title, email, whatsapp, address } = content

  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}`
    : null

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        {title && (
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{title}</h2>
            <div className="w-16 h-1 mx-auto rounded-full" style={{ background: primaryColor }} />
          </div>
        )}

        <div className="bg-slate-50 rounded-3xl p-8 space-y-5">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${primaryColor}15` }}
              >
                <svg className="w-6 h-6" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Email</p>
                <p className="text-slate-800 font-semibold group-hover:text-indigo-600 transition-colors">{email}</p>
              </div>
            </a>
          )}

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#25D36615' }}
              >
                <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.127.558 4.12 1.532 5.847L.056 23.964l6.283-1.645A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 11.999 0zm.001 21.818a9.812 9.812 0 01-5.031-1.384l-.359-.214-3.731.977.997-3.64-.235-.374A9.818 9.818 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">WhatsApp</p>
                <p className="text-slate-800 font-semibold group-hover:text-green-600 transition-colors">{whatsapp}</p>
              </div>
            </a>
          )}

          {address && (
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${primaryColor}15` }}
              >
                <svg className="w-6 h-6" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Alamat</p>
                <p className="text-slate-800 font-semibold">{address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
