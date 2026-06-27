import { Routes, Route, Link } from 'react-router-dom'
import ServiceList from './components/ServiceList'
import ServiceDetail from './components/ServiceDetail'
import PatternList from './components/PatternList'
import PatternDetail from './components/PatternDetail'
import CommonRules from './components/CommonRules'
import Compare from './components/Compare'
import SecurityCatalog from './components/SecurityCatalog'
import CostDictionary from './components/CostDictionary'
import ScenarioSearch from './components/ScenarioSearch'
import About from './components/About'
import AntiPatternCatalog from './components/AntiPatternCatalog'
export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-4xl flex-wrap items-baseline gap-x-6 gap-y-1 px-8 py-4">
          <Link to="/" className="text-lg font-bold">AWS 図鑑</Link>
          <nav className="flex flex-wrap gap-4 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">サービス</Link>
            <Link to="/patterns" className="hover:text-gray-900">構成パターン</Link>
            <Link to="/scenarios" className="hover:text-gray-900">事例</Link>
            <Link to="/antipatterns" className="hover:text-gray-900">不適合構成</Link>
            <Link to="/security" className="hover:text-gray-900">セキュリティ</Link>
            <Link to="/cost" className="hover:text-gray-900">コスト</Link>
            <Link to="/rules" className="hover:text-gray-900">共通ルール</Link>
            <Link to="/compare" className="hover:text-gray-900">比較</Link>
            <Link to="/about" className="hover:text-gray-900">設計思想</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-8">
        <Routes>
          <Route path="/" element={<ServiceList />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/patterns" element={<PatternList />} />
          <Route path="/pattern/:id" element={<PatternDetail />} />
          <Route path="/scenarios" element={<ScenarioSearch />} />
          <Route path="/antipatterns" element={<AntiPatternCatalog />} />
          <Route path="/security" element={<SecurityCatalog />} />
          <Route path="/cost" element={<CostDictionary />} />
          <Route path="/rules" element={<CommonRules />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}
