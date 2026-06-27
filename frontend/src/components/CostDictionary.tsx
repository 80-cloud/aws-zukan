import { Link } from 'react-router-dom'
import { buildCostDictionary } from '../lib/costDictionary'

const KIND_STYLE: Record<string, string> = {
  '見落としやすい課金': 'bg-amber-50', '課金される軸': 'bg-gray-50',
}

export default function CostDictionary() {
  const items = buildCostDictionary()
  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">隠れコスト辞典（既存データから横断集約・読み取り専用・具体額は持たず定性表現） {items.length} 件</p>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className={`rounded-lg p-4 ${KIND_STYLE[it.kind] ?? 'bg-gray-50'}`}>
            <div className="flex items-baseline justify-between gap-2">
              <Link to={`/service/${it.serviceId}`} className="font-semibold text-blue-600 hover:underline">{it.service}</Link>
              <span className="shrink-0 text-xs text-gray-500">{it.kind}{it.relative ? ` ・コスト感 ${it.relative}` : ''}</span>
            </div>
            {it.gotcha && <p className="mt-1 text-sm text-gray-700">{it.gotcha}</p>}
            {it.axes?.length ? <p className="mt-1 text-xs text-gray-500">課金される軸: {it.axes.join(' / ')}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
