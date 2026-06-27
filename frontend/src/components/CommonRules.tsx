import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { zukanRepository } from '../api/zukanRepository'
export default function CommonRules() {
  const rules = zukanRepository.listCommonRules()
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])
  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">共通ルール {rules.length} 件（横断的な設計ルールの正規化）</p>
      <ul className="space-y-4">
        {rules.map(r => (
          <li key={r.key} id={r.key} className="scroll-mt-20 rounded-lg border border-gray-200 p-4 target:border-blue-400 target:bg-blue-50">
            <h2 className="font-semibold">{r.title}</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{r.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
