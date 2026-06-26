import { useState } from 'react'
import { Link } from 'react-router-dom'
import { zukanRepository } from '../api/zukanRepository'
import { useFavorites } from '../lib/favorites'
export default function ServiceList() {
  const services = zukanRepository.listServices()
  const { isFavorite, toggle } = useFavorites()
  const [onlyFav, setOnlyFav] = useState(false)
  const list = onlyFav ? services.filter(s => isFavorite(s.id)) : services
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">サービス {services.length} 件 / 構成パターン {zukanRepository.listPatterns().length} 件 / 共通ルール {zukanRepository.listCommonRules().length} 件</p>
        <label className="flex items-center gap-1 text-sm text-gray-600">
          <input type="checkbox" checked={onlyFav} onChange={e => setOnlyFav(e.target.checked)} /> お気に入りのみ
        </label>
      </div>
      {list.length === 0 ? <p className="text-gray-400">該当なし。</p> : (
        <ul className="space-y-3">
          {list.map(s => (
            <li key={s.id} className="relative">
              <Link to={`/service/${s.id}`} className="block rounded-lg border border-gray-200 p-4 pr-12 hover:border-gray-400 hover:bg-gray-50">
                <div className="flex items-baseline justify-between"><span className="font-semibold">{s.name}</span><span className="text-xs text-gray-400">{s.category} / Tier {s.tier}</span></div>
                <p className="mt-1 text-sm text-gray-700">{s.oneLiner}</p>
              </Link>
              <button onClick={() => toggle(s.id)} aria-label="お気に入り" className="absolute right-3 top-3 text-lg leading-none text-amber-500">
                {isFavorite(s.id) ? '★' : '☆'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
