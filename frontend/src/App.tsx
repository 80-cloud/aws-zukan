import { Routes, Route, Link } from 'react-router-dom'
import ServiceList from './components/ServiceList'
import ServiceDetail from './components/ServiceDetail'
import PatternList from './components/PatternList'
import PatternDetail from './components/PatternDetail'
import CommonRules from './components/CommonRules'
export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-3xl items-baseline gap-6 px-8 py-4">
          <Link to="/" className="text-lg font-bold">AWS 図鑑</Link>
          <nav className="flex gap-4 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">サービス</Link>
            <Link to="/patterns" className="hover:text-gray-900">構成パターン</Link>
            <Link to="/rules" className="hover:text-gray-900">共通ルール</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl p-8">
        <Routes>
          <Route path="/" element={<ServiceList />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/patterns" element={<PatternList />} />
          <Route path="/pattern/:id" element={<PatternDetail />} />
          <Route path="/rules" element={<CommonRules />} />
        </Routes>
      </main>
    </div>
  )
}
