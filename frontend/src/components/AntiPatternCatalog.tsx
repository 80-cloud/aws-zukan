import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buildAntiPatternCatalog } from '../lib/antiPatternCatalog'

export default function AntiPatternCatalog() {
  const entries = buildAntiPatternCatalog()
  const [q, setQ] = useState('')
  const filtered = q
    ? entries.filter(e => e.serviceName.toLowerCase().includes(q.toLowerCase()) || e.serviceId.includes(q.toLowerCase()))
    : entries
  return (
    <div>
      <p className="mb-1 text-sm text-gray-500">不適合になりやすい構成 — 各構成で「この前提では不適合になりやすい」とされた選択を、サービス単位で集めたもの（読み取り専用）</p>
      <p className="mb-3 text-xs text-gray-400">いずれも前提条件つき。同じサービスでも要件次第で標準的な選択になり得る。{filtered.length} 件のサービス</p>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="サービス名で検索（例: EC2）"
        className="mb-5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      {filtered.length === 0 ? <p className="text-gray-400">該当なし。</p> : (
        <ul className="space-y-5">
          {filtered.map(e => (
            <li key={e.serviceId}>
              <h2 className="text-sm font-semibold text-gray-700">
                {e.exists
                  ? <Link to={`/service/${e.serviceId}`} className="text-blue-700 hover:underline">{e.serviceName}</Link>
                  : <span>{e.serviceName}</span>}
                <span className="text-gray-400">（{e.cases.length}）</span>
              </h2>
              <ul className="mt-2 space-y-2">
                {e.cases.map((c, i) => (
                  <li key={`${c.patternId}-${i}`} className="rounded-lg border border-gray-200 p-3">
                    <Link to={`/pattern/${c.patternId}`} className="font-medium hover:underline">{c.patternName}</Link>
                    <p className="mt-1 text-sm text-gray-600">{c.why}</p>
                    {c.source && (
                      <a href={c.source} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-blue-600 hover:underline">出典</a>
                    )}
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
