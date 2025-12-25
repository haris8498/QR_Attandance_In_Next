import '@/src/index.css'
import { Toaster } from '@/src/components/ui/toaster'

export const metadata = {
  title: 'QR Attendance System',
  description: 'Smart Role-Based Attendance Tracking',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover',
  generator: 'Hostinger Horizons',
  mobileWebAppCapable: 'yes',
  appleMobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'default',
  formatDetection: {
    telephone: false,
  },
  themeColor: '#1E40AF',
  icons: {
    icon: '/vite.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileColor" content="#1E40AF" />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
