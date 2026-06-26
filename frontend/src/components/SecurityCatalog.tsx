import { Link } from 'react-router-dom'
import { buildSecurityCatalog } from '../lib/securityCatalog'

const KIND_STYLE: Record<string, string> = {
  'アンチパターン': 'bg-rose-50', '実体験': 'bg-amber-50', '基本ルール': 'bg-blue-50', '弱い構成': 'bg-gray-50',
}

export default function SecurityCatalog() {
  const items = buildSecurityCatalog()
  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">セキュリティ注意カタログ（既存データから横断集約・読み取り専用） {items.length} 件</p>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className={`rounded-lg p-4 ${KIND_STYLE[it.kind] ?? 'bg-gray-50'}`}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold">{it.point}</span>
              <span className="shrink-0 text-xs text-gray-500">{it.kind}</span>
            </div>
            {it.why && <p className="mt-1 text-sm text-gray-700">{it.why}</p>}
            {it.correct && <p className="mt-1 text-sm text-gray-600">正しい型: {it.correct}</p>}
            <div className="mt-1 flex gap-3 text-xs">
              {it.link && <Link to={it.link.to} className="text-blue-600 hover:underline">{it.link.label} →</Link>}
              {it.source && <a href={it.source} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">出典</a>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
