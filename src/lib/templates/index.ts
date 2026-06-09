export type TemplateBlock = {
  type: string
  content: Record<string, unknown>
}

export type WebsiteTemplate = {
  id: string
  name: string
  description: string
  category: string
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
    category: 'semua',
    image: 'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?q=80&w=600&auto=format&fit=crop',
    themeConfig: {
      primaryColor: '#4f46e5',
      secondaryColor: '#1e293b',
      fontFamily: 'Inter'
    },
    blocks: []
  },
  {
    id: 'portfolio',
    name: 'Profil & Portofolio',
    description: 'Pilihan tepat untuk desainer, fotografer, dan tenaga profesional.',
    category: 'jasa',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=600&auto=format&fit=crop',
    themeConfig: {
      primaryColor: '#4f46e5',
      secondaryColor: '#1e293b',
      fontFamily: 'Inter'
    },
    blocks: [
      {
        type: 'HERO',
        content: {
          headline: 'Halo, Saya Kreator.',
          subheadline: 'Membangun desain yang berpusat pada manusia.',
          ctaText: 'Hubungi Saya',
          ctaLink: '#contact',
          styles: { paddingTop: '100px', paddingBottom: '100px' }
        }
      },
      {
        type: 'HEADING',
        content: {
          text: 'Karya Terbaru',
          level: 2,
          styles: { paddingTop: '60px', paddingBottom: '20px', textAlign: 'center' }
        }
      },
      {
        type: 'GALLERY',
        content: {
          title: '',
          images: [],
          styles: { paddingBottom: '60px', backgroundColor: '#f8fafc' }
        }
      },
      {
        type: 'CONTACT',
        content: {
          title: 'Mari Bekerja Sama',
          email: 'hello@kreator.com',
          phone: '+62 812 3456 7890',
          styles: { paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#1e293b', color: '#ffffff' }
        }
      }
    ]
  },
  {
    id: 'store',
    name: 'Katalog & Toko',
    description: 'Etalase modern untuk menampilkan produk dan layanan bisnis Anda.',
    category: 'toko',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop',
    themeConfig: {
      primaryColor: '#059669',
      secondaryColor: '#0f172a',
      fontFamily: 'Inter'
    },
    blocks: [
      {
        type: 'HERO',
        content: {
          headline: 'Koleksi Terbaru 2026',
          subheadline: 'Temukan gaya baru Anda dengan penawaran spesial.',
          ctaText: 'Belanja Sekarang',
          ctaLink: '#catalog',
          styles: { paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#ecfdf5', textAlign: 'center' }
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
          styles: { paddingTop: '80px', paddingBottom: '80px' }
        }
      }
    ]
  },
  {
    id: 'kuliner',
    name: 'Warung & Kuliner',
    description: 'Tampilkan menu makanan dan minuman usaha kuliner Anda.',
    category: 'kuliner',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
    themeConfig: {
      primaryColor: '#d97706',
      secondaryColor: '#1c1917',
      fontFamily: 'Inter'
    },
    blocks: [
      {
        type: 'HERO',
        content: {
          headline: 'Selamat Datang di Dapur Kami',
          subheadline: 'Cita rasa autentik dari bahan-bahan pilihan terbaik.',
          ctaText: 'Lihat Menu',
          ctaLink: '#menu',
          styles: { paddingTop: '100px', paddingBottom: '100px', backgroundColor: '#fffbeb', textAlign: 'center' }
        }
      },
      {
        type: 'HEADING',
        content: {
          text: 'Menu Andalan',
          level: 2,
          styles: { paddingTop: '60px', paddingBottom: '20px', textAlign: 'center' }
        }
      },
      {
        type: 'CATALOG',
        content: {
          title: '',
          items: [
            { id: '1', name: 'Nasi Goreng Spesial', price: 'Rp 35.000', image: '' },
            { id: '2', name: 'Mie Ayam Bakso', price: 'Rp 25.000', image: '' },
            { id: '3', name: 'Es Campur Segar', price: 'Rp 15.000', image: '' }
          ],
          styles: { paddingTop: '20px', paddingBottom: '80px' }
        }
      },
      {
        type: 'CONTACT',
        content: {
          title: 'Pesan Sekarang',
          email: 'warung@email.com',
          phone: '+62 812 3456 7890',
          styles: { paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#1c1917', color: '#ffffff' }
        }
      }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion Store',
    description: 'Tampilan modern untuk brand fashion dan clothing line Anda.',
    category: 'toko',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop',
    themeConfig: {
      primaryColor: '#db2777',
      secondaryColor: '#0f172a',
      fontFamily: 'Inter'
    },
    blocks: [
      {
        type: 'HERO',
        content: {
          headline: 'Tampil Berani, Tampil Percaya Diri',
          subheadline: 'Koleksi fashion terbaru untuk gaya hidup modern.',
          ctaText: 'Lihat Koleksi',
          ctaLink: '#catalog',
          styles: { paddingTop: '100px', paddingBottom: '100px', backgroundColor: '#fdf2f8', textAlign: 'center' }
        }
      },
      {
        type: 'HEADING',
        content: {
          text: 'Galeri Lookbook',
          level: 2,
          styles: { paddingTop: '60px', paddingBottom: '20px', textAlign: 'center' }
        }
      },
      {
        type: 'GALLERY',
        content: {
          title: '',
          images: [],
          styles: { paddingBottom: '40px' }
        }
      },
      {
        type: 'HEADING',
        content: {
          text: 'Koleksi Terbaru',
          level: 3,
          styles: { paddingTop: '40px', paddingBottom: '20px', textAlign: 'center' }
        }
      },
      {
        type: 'CATALOG',
        content: {
          title: '',
          items: [
            { id: '1', name: 'Atasan Wanita', price: 'Rp 159.000', image: '' },
            { id: '2', name: 'Celana Jeans', price: 'Rp 299.000', image: '' },
            { id: '3', name: 'Jaket Denim', price: 'Rp 399.000', image: '' }
          ],
          styles: { paddingTop: '20px', paddingBottom: '80px' }
        }
      },
      {
        type: 'CONTACT',
        content: {
          title: 'Hubungi Kami',
          email: 'hello@fashionstore.com',
          phone: '+62 812 3456 7890',
          styles: { paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#0f172a', color: '#ffffff' }
        }
      }
    ]
  },
  {
    id: 'jasa',
    name: 'Jasa Profesional',
    description: 'Tampilkan layanan, portofolio, dan testimoni bisnis jasa Anda.',
    category: 'jasa',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    themeConfig: {
      primaryColor: '#2563eb',
      secondaryColor: '#0f172a',
      fontFamily: 'Inter'
    },
    blocks: [
      {
        type: 'HERO',
        content: {
          headline: 'Solusi Profesional untuk Bisnis Anda',
          subheadline: 'Konsultasi gratis dan hasil yang terukur.',
          ctaText: 'Jadwalkan Konsultasi',
          ctaLink: '#contact',
          styles: { paddingTop: '100px', paddingBottom: '100px', backgroundColor: '#eff6ff', textAlign: 'center' }
        }
      },
      {
        type: 'TEXT',
        content: {
          content: '<h2 style="font-size:1.75rem;font-weight:700;margin-bottom:1rem">Tentang Kami</h2><p style="font-size:1.05rem;line-height:1.7;color:#475569">Kami hadir untuk membantu bisnis Anda berkembang dengan solusi digital yang inovatif. Dengan pengalaman lebih dari 5 tahun, tim kami siap memberikan layanan terbaik.</p>',
          styles: { paddingTop: '80px', paddingBottom: '80px', maxWidth: '800px', margin: '0 auto' }
        }
      },
      {
        type: 'CONTACT',
        content: {
          title: 'Mulai Diskusi',
          email: 'hello@jasapro.com',
          phone: '+62 812 3456 7890',
          styles: { paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#0f172a', color: '#ffffff' }
        }
      }
    ]
  },
  {
    id: 'fotografi',
    name: 'Fotografi',
    description: 'Portofolio visual yang memukau untuk fotografer profesional.',
    category: 'jasa',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=600&auto=format&fit=crop',
    themeConfig: {
      primaryColor: '#1e293b',
      secondaryColor: '#0f172a',
      fontFamily: 'Inter'
    },
    blocks: [
      {
        type: 'HERO',
        content: {
          headline: 'Mengabadikan Momen Berharga',
          subheadline: 'Fotografi profesional untuk setiap momen spesial Anda.',
          ctaText: 'Lihat Portofolio',
          ctaLink: '#gallery',
          styles: { paddingTop: '100px', paddingBottom: '100px', backgroundColor: '#f8fafc', textAlign: 'center' }
        }
      },
      {
        type: 'HEADING',
        content: {
          text: 'Portofolio',
          level: 2,
          styles: { paddingTop: '60px', paddingBottom: '20px', textAlign: 'center' }
        }
      },
      {
        type: 'GALLERY',
        content: {
          title: '',
          images: [],
          styles: { paddingBottom: '80px' }
        }
      },
      {
        type: 'CONTACT',
        content: {
          title: 'Pesan Jadwal',
          email: 'hello@fotografer.com',
          phone: '+62 812 3456 7890',
          styles: { paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#1e293b', color: '#ffffff' }
        }
      }
    ]
  }
]
