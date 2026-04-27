import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'],
  variable: '--font-cormorant', display: 'swap',
})
const interTight = Inter_Tight({
  subsets: ['latin'], weight: ['400', '500', '600'],
  variable: '--font-inter-tight', display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'], weight: ['400', '500'],
  variable: '--font-jetbrains', display: 'swap',
})

export const metadata: Metadata = {
  title: 'Wholeness Index™ — A reading of the four domains',
  description: 'The Index assesses four domains whose alignment is the precondition for meaningful contribution — and returns the specific constraint holding the rest.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${interTight.variable} ${jetbrainsMono.variable}`}>
      <body style={{
        fontFamily: '"Inter Tight", Inter, system-ui, sans-serif',
        backgroundColor: 'var(--cream-100)',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.6  0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        backgroundRepeat: 'repeat', minHeight: '100vh',
      }}>
        {children}
      </body>
    </html>
  )
}
