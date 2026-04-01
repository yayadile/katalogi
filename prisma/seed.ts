// Ganti baris 1 yang tadinya { PrismaClient }
import { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client/extension' // Tergantung instalasi Prisma 7 kamu
import bcrypt from 'bcryptjs'

// Cara inisialisasi yang lebih aman di Prisma 7
const prisma = new (require('@prisma/client').PrismaClient)() 

async function main() {
  async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  // 1. Create a dummy user
  const user = await prisma.user.upsert({
    where: { email: 'demo@katalogi.id' },
    update: {},
    create: {
      email: 'demo@katalogi.id',
      name: 'Demo User',
      passwordHash: passwordHash,
    },
  })

  // 2. Create a website
  const website = await prisma.website.upsert({
    where: { slug: 'toko-demo' },
    update: {},
    create: {
      userId: user.id,
      slug: 'toko-demo',
      title: 'Toko Demo Saya',
      description: 'Website toko demo Katalogi',
      themeConfig: {
        primaryColor: '#3b82f6',
        fontFamily: 'Inter',
        secondaryColor: '#1e293b',
      },
      isPublished: true,
      blocks: {
        create: [
          {
            type: 'HERO',
            sortOrder: 1,
            content: {
              headline: 'Selamat Datang',
              subtext: 'Toko online terbaik',
              ctaText: 'Lihat Produk',
              bgImage: '',
            },
          },
          {
            type: 'CATALOG',
            sortOrder: 2,
            content: {
              title: 'Produk Unggulan',
              items: [
                { id: '1', name: 'Produk A', price: 150000, image: '', desc: 'Deskripsi produk A' },
                { id: '2', name: 'Produk B', price: 200000, image: '', desc: 'Deskripsi produk B' },
              ],
            },
          },
          {
            type: 'CONTACT',
            sortOrder: 3,
            content: {
              title: 'Hubungi Kami',
              email: 'hello@toko-demo.id',
              whatsapp: '6281234567890',
              address: 'Jakarta, Indonesia',
            },
          },
        ],
      },
    },
  })

  console.log({ user, website })
}

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
