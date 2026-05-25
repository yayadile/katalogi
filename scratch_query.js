const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const website = await prisma.website.findUnique({
    where: { id: 'cmplp6paf000130undkudieux' }
  });
  console.log("Website cmplp6paf000130undkudieux:", website);

  const website2 = await prisma.website.findUnique({
    where: { id: 'cmpl6lnok000e7sundw64aufg' }
  });
  console.log("Website cmpl6lnok000e7sundw64aufg:", website2);

  const all = await prisma.website.findMany({ select: { id: true, title: true }});
  console.log("All websites:", all);
}

main().catch(console.error).finally(() => prisma.$disconnect());
