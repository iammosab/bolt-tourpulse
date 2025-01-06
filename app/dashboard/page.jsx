'use client'
    import ProtectedRoute from '@/components/ProtectedRoute'
    import { useAuth } from '@/context/AuthContext'

    function DashboardPage() {
      const { user } = useAuth()

      return (
        <ProtectedRoute>
          <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
              <p className="text-gray-600">
                This is your tour management dashboard. You can manage your tours, tourists, and excursions from here.
              </p>
            </div>
          </div>
        </ProtectedRoute>
      )
    }

    export default DashboardPage
