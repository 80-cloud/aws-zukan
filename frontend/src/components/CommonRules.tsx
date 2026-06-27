import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { zukanRepository } from '../api/zukanRepository'
export default function CommonRules() {
  const rules = zukanRepository.listCommonRules()
  const { hash } = useLocation()
  const active = hash ? decodeURIComponent(hash.slice(1)) : ''
  useEffect(() => {
    if (!active) return
    const el = document.getElementById(active)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [active])
  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">共通ルール {rules.length} 件（横断的な設計ルールの正規化）</p>
      <ul className="space-y-4">
        {rules.map(r => (
          <li key={r.key} id={r.key} className={`scroll-mt-20 rounded-lg border p-4 ${active === r.key ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
            <h2 className="font-semibold">{r.title}</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{r.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
