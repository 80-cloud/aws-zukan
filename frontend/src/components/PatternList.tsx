import { useState } from 'react'
import { Link } from 'react-router-dom'
import { zukanRepository } from '../api/zukanRepository'

const chip = (active: boolean) =>
  `rounded-full border px-3 py-1 text-xs ${active ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`

export default function PatternList() {
  const all = zukanRepository.listPatterns()
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('all')

  const tags = Array.from(new Set(all.flatMap(p => p.scenarioTags ?? [])))
  const filtered = all.filter(p => {
    if (tag !== 'all' && !(p.scenarioTags ?? []).includes(tag)) return false
    if (q) {
      const t = q.toLowerCase()
      if (!p.name.toLowerCase().includes(t) && !p.goal.toLowerCase().includes(t)) return false
    }
    return true
  })

  return (
    <div>
      <div className="mb-5 space-y-3">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="目的・名前で検索（例: 外部公開サイト）"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTag('all')} className={chip(tag === 'all')}>すべて</button>
          {tags.map(t => <button key={t} onClick={() => setTag(t)} className={chip(tag === t)}>{t}</button>)}
        </div>
        <p className="text-sm text-gray-500">{filtered.length} 件該当</p>
      </div>

      {filtered.length === 0 ? <p className="text-gray-400">該当なし。</p> : (
        <ul className="space-y-3">
          {filtered.map(p => (
            <li key={p.id}>
              <Link to={`/pattern/${p.id}`} className="block rounded-lg border border-gray-200 p-4 hover:border-gray-400 hover:bg-gray-50">
                <span className="font-semibold">{p.name}</span>
                <p className="mt-1 text-sm text-gray-700">{p.goal}</p>
                <div className="mt-2 flex flex-wrap gap-1">{p.scenarioTags?.map(t => <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{t}</span>)}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
