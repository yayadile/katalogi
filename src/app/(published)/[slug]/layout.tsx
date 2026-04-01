import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Katalogi',
}

export default function PublishedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Minimal layout: no dashboard navbar
  return <>{children}</>
}
