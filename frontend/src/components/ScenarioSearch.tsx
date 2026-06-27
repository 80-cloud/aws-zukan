import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buildScenarioIndex } from '../lib/scenarioIndex'

export default function ScenarioSearch() {
  const groups = buildScenarioIndex()
  const [q, setQ] = useState('')
  const filtered = q ? groups.filter(g => g.tag.toLowerCase().includes(q.toLowerCase())) : groups
  return (
    <div>
      <p className="mb-3 text-sm text-gray-500">事例（シナリオ）検索 — 業務課題から構成を探す（読み取り専用） {filtered.length} 件の課題</p>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="業務課題で検索（例: オンプレ移行）"
        className="mb-5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      {filtered.length === 0 ? <p className="text-gray-400">該当なし。</p> : (
        <ul className="space-y-5">
          {filtered.map(g => (
            <li key={g.tag}>
              <h2 className="text-sm font-semibold text-gray-700">{g.tag} <span className="text-gray-400">（{g.patterns.length}）</span></h2>
              <ul className="mt-2 space-y-2">
                {g.patterns.map(p => (
                  <li key={p.id}>
                    <Link to={`/pattern/${p.id}`} className="block rounded-lg border border-gray-200 p-3 hover:border-gray-400 hover:bg-gray-50">
                      <span className="font-medium">{p.name}</span>
                      <p className="mt-1 text-sm text-gray-600">{p.goal}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
