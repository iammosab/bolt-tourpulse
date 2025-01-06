import './globals.css'
    import { AuthProvider } from '@/context/AuthContext'

    export const metadata = {
      title: 'TourPulse',
      description: 'Tour Management Application',
    }

    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <body className="min-h-screen bg-gray-50">
            <AuthProvider>
              <main className="container mx-auto px-4">
                {children}
              </main>
            </AuthProvider>
          </body>
        </html>
      )
    }
