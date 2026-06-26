import { Link } from 'react-router-dom'
import { zukanRepository } from '../api/zukanRepository'
export default function PatternList() {
  const patterns = zukanRepository.listPatterns()
  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">構成パターン {patterns.length} 件</p>
      <ul className="space-y-3">
        {patterns.map(p => (
          <li key={p.id}>
            <Link to={`/pattern/${p.id}`} className="block rounded-lg border border-gray-200 p-4 hover:border-gray-400 hover:bg-gray-50">
              <span className="font-semibold">{p.name}</span>
              <p className="mt-1 text-sm text-gray-700">{p.goal}</p>
              <div className="mt-2 flex flex-wrap gap-1">{p.scenarioTags?.map(t => <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{t}</span>)}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
