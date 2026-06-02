
export type TemplateBlock = {
  type: string
  content: Record<string, unknown>
}

export type WebsiteTemplate = {
  id: string
  name: string
  description: string
  image?: string
  themeConfig: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
  blocks: TemplateBlock[]
}

export type SectionLayout = {
  id: string
  name: string
  description: string
  blocks: TemplateBlock[]
}

export const FULL_TEMPLATES: WebsiteTemplate[] = [
  {
    id: 'blank',
    name: 'Kanvas Kosong',
    description: 'Awali kreativitas Anda dari awal dengan kanvas bersih.',
    image: 'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?q=80&w=600&auto=format&fit=crop',
    themeConfig: {
      primaryColor: '#4f46e5', // indigo-600
      secondaryColor: '#1e293b',
      fontFamily: 'Inter'
    },
    blocks: []
  },
  {
    id: 'portfolio',
    name: 'Profil & Portofolio',
    description: 'Pilihan tepat untuk desainer, fotografer, dan tenaga profesional.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=600&auto=format&fit=crop',
    themeConfig: {
      primaryColor: '#000000',
      secondaryColor: '#333333',
      fontFamily: 'Inter'
    },
    blocks: [
      {
        type: 'HERO',
        content: {
          headline: 'Halo, Saya Seorang Kreator.',
          subheadline: 'Membangun desain memukau yang berpusat pada manusia.',
          ctaText: 'Hubungi Saya',
          ctaLink: '#contact',
          styles: {
            paddingTop: '80px',
            paddingBottom: '80px',
          }
        }
      },
      {
        type: 'HEADING',
        content: {
          text: 'Karya Terbaik Saya',
          level: 2,
          styles: {
            paddingTop: '60px',
            paddingBottom: '20px',
            textAlign: 'center',
            backgroundColor: '#fafafa'
          }
        }
      },
      {
        type: 'GALLERY',
        content: {
          title: '',
          images: [],
          styles: {
            paddingBottom: '60px',
            backgroundColor: '#fafafa'
          }
        }
      },
      {
        type: 'CONTACT',
        content: {
          title: 'Mari Bekerja Sama',
          email: 'hello@kreator.com',
          phone: '+62 812 3456 7890',
          styles: {
            paddingTop: '80px',
            paddingBottom: '80px',
            backgroundColor: '#000000',
            color: '#ffffff'
          }
        }
      }
    ]
  },
  {
    id: 'store',
    name: 'Katalog & Toko',
    description: 'Etalase modern untuk menampilkan produk dan layanan bisnis Anda.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop',
    themeConfig: {
      primaryColor: '#059669', // emerald-600
      secondaryColor: '#0f172a',
      fontFamily: 'Inter'
    },
    blocks: [
      {
        type: 'HERO',
        content: {
          headline: 'Koleksi Musim Panas 2026',
          subheadline: 'Temukan gaya baru Anda dengan penawaran spesial.',
          ctaText: 'Belanja Sekarang',
          ctaLink: '#catalog',
          styles: {
            paddingTop: '60px',
            paddingBottom: '60px',
            backgroundColor: '#ecfdf5'
          }
        }
      },
      {
        type: 'CATALOG',
        content: {
          title: 'Produk Terlaris',
          items: [
            { id: '1', name: 'Kemeja Casual', price: 'Rp 199.000', image: '' },
            { id: '2', name: 'Celana Chino', price: 'Rp 249.000', image: '' },
            { id: '3', name: 'Sneakers Putih', price: 'Rp 399.000', image: '' }
          ],
          styles: {
            paddingTop: '80px',
            paddingBottom: '80px'
          }
        }
      }
    ]
  }
]

export const SECTION_LAYOUTS: SectionLayout[] = [
  {
    id: 'hero-split',
    name: 'Hero Terpusat Modern',
    description: 'Layout Hero dengan padding luas dan elegan.',
    blocks: [
      {
        type: 'HERO',
        content: {
          headline: 'Judul Besar Disini',
          subheadline: 'Tambahkan penjelasan menarik yang bisa memikat pengunjung website Anda.',
          ctaText: 'Aksi Sekarang',
          ctaLink: '#',
          styles: {
            paddingTop: '100px',
            paddingBottom: '100px',
            backgroundColor: '#f8fafc'
          }
        }
      }
    ]
  },
  {
    id: 'catalog-grid',
    name: 'Grid Katalog Produk',
    description: 'Katalog dengan ruang bernapas yang cukup.',
    blocks: [
      {
        type: 'CATALOG',
        content: {
          title: 'Produk Unggulan',
          items: [
            { id: '1', name: 'Produk A', price: 'Rp 99.000', image: '' },
            { id: '2', name: 'Produk B', price: 'Rp 199.000', image: '' },
            { id: '3', name: 'Produk C', price: 'Rp 299.000', image: '' }
          ],
          styles: {
            paddingTop: '40px',
            paddingBottom: '40px'
          }
        }
      }
    ]
  },
  {
    id: 'about-text',
    name: 'Artikel / Tentang',
    description: 'Blok teks dengan padding khusus baca.',
    blocks: [
      {
        type: 'TEXT',
        content: {
          content: '<h2>Cerita Kami</h2><p>Tuliskan sejarah, misi, dan visi dari usaha Anda di bagian ini. Pengunjung menyukai cerita yang otentik dan transparan.</p>',
          styles: {
            paddingTop: '60px',
            paddingBottom: '60px',
            paddingLeft: '20px',
            paddingRight: '20px'
          }
        }
      }
    ]
  }
]
