export default function AuthLayout({ children }) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </div>
      )
    }
