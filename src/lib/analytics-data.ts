import 'server-only'
import { prisma } from './prisma'

export type DailyStat = { date: string; count: number }
export type BlockTypeStat = { type: string; count: number }

function last30Days(): string[] {
  const days: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function groupByDate(items: { createdAt: Date }[]): DailyStat[] {
  const days = last30Days()
  const map = new Map(days.map(d => [d, 0]))
  for (const item of items) {
    const key = item.createdAt.toISOString().slice(0, 10)
    if (map.has(key)) map.set(key, map.get(key)! + 1)
  }
  return days.map(date => ({ date, count: map.get(date) ?? 0 }))
}

export async function getUserGrowth(): Promise<DailyStat[]> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const users = await prisma.user.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  return groupByDate(users)
}

export async function getWebsiteGrowth(): Promise<DailyStat[]> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const websites = await prisma.website.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  return groupByDate(websites)
}

export async function getBlockTypeDistribution(): Promise<BlockTypeStat[]> {
  const rows = await prisma.pageBlock.groupBy({
    by: ['type'],
    _count: { type: true },
    orderBy: { _count: { type: 'desc' } },
  })
  return rows.map(r => ({ type: r.type, count: r._count.type }))
}

export async function getUserConversionStats() {
  const [totalUsers, usersWithWebsites, usersWithPublished] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { websites: { some: {} } } }),
    prisma.user.count({ where: { websites: { some: { isPublished: true } } } }),
  ])
  return { totalUsers, usersWithWebsites, usersWithPublished }
}

export async function getGrowthRate() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  const [usersCurrent, usersPrevious, sitesCurrent, sitesPrevious] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.website.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.website.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
  ])

  const calcRate = (current: number, previous: number) =>
    previous > 0 ? Math.round(((current - previous) / previous) * 100) : current > 0 ? 100 : 0

  return {
    userGrowthRate: calcRate(usersCurrent, usersPrevious),
    websiteGrowthRate: calcRate(sitesCurrent, sitesPrevious),
  }
}

export async function getContentStats() {
  const [totalPages, totalBlocks, websitesWithCatalog] = await Promise.all([
    prisma.page.count(),
    prisma.pageBlock.count(),
    prisma.website.count({ where: { blocks: { some: { type: 'CATALOG' } } } }),
  ])
  return {
    totalPages,
    totalBlocks,
    websitesWithCatalog,
    avgBlocksPerPage: totalPages > 0 ? Math.round(totalBlocks / totalPages) : 0,
  }
}

export async function getTotalStats() {
  const [totalUsers, totalWebsites, totalViewsAgg, publishedCount, totalBlocks] = await Promise.all([
    prisma.user.count(),
    prisma.website.count(),
    prisma.website.aggregate({ _sum: { pageViews: true } }),
    prisma.website.count({ where: { isPublished: true } }),
    prisma.pageBlock.count(),
  ])

  return {
    totalUsers,
    totalWebsites,
    totalViews: totalViewsAgg._sum.pageViews ?? 0,
    publishedCount,
    totalBlocks,
    avgBlocksPerSite: totalWebsites > 0 ? Math.round(totalBlocks / totalWebsites) : 0,
    publishRate: totalWebsites > 0 ? Math.round((publishedCount / totalWebsites) * 100) : 0,
  }
}
