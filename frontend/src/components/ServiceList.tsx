import { Link } from 'react-router-dom'
import { zukanRepository } from '../api/zukanRepository'
export default function ServiceList() {
  const services = zukanRepository.listServices()
  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">サービス {services.length} 件 / 構成パターン {zukanRepository.listPatterns().length} 件 / 共通ルール {zukanRepository.listCommonRules().length} 件</p>
      <ul className="space-y-3">
        {services.map(s => (
          <li key={s.id}>
            <Link to={`/service/${s.id}`} className="block rounded-lg border border-gray-200 p-4 hover:border-gray-400 hover:bg-gray-50">
              <div className="flex items-baseline justify-between"><span className="font-semibold">{s.name}</span><span className="text-xs text-gray-400">{s.category} / Tier {s.tier}</span></div>
              <p className="mt-1 text-sm text-gray-700">{s.oneLiner}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
