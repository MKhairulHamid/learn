import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-primary-100">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Page not found</h1>
        <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
        <Button className="mt-6" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    </div>
  )
}
