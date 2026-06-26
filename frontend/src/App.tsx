import { Routes, Route, Link } from 'react-router-dom'
import ServiceList from './components/ServiceList'
import ServiceDetail from './components/ServiceDetail'
export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-3xl px-8 py-4"><Link to="/" className="text-lg font-bold">AWS 図鑑</Link></div>
      </header>
      <main className="mx-auto max-w-3xl p-8">
        <Routes>
          <Route path="/" element={<ServiceList />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
        </Routes>
      </main>
    </div>
  )
}
