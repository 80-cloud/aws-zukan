import { Link } from 'react-router-dom'
import { buildSecurityCatalog } from '../lib/securityCatalog'

const KIND_STYLE: Record<string, string> = {
  'アンチパターン': 'bg-rose-50', '実体験': 'bg-amber-50', '基本ルール': 'bg-blue-50', '弱い構成': 'bg-gray-50',
}
// 各項目がどのデータ由来かを明示するための「出典」ラベル（重複でなく横断であることを示す）
const SRC_LABEL: Record<string, string> = {
  'アンチパターン': '構成パターン', '弱い構成': '構成パターン',
  '実体験': 'サービス', '基本ルール': '共通ルール',
}

export default function SecurityCatalog() {
  const items = buildSecurityCatalog()
  const counts = items.reduce<Record<string, number>>((m, it) => ({ ...m, [it.kind]: (m[it.kind] ?? 0) + 1 }), {})
  return (
    <div>
      <p className="mb-1 text-sm text-gray-600">
        セキュリティ注意カタログ — 構成パターン・不適合構成・サービスの各データを「安全性」の観点で横断的に集めたインデックス。
        同じ項目が他画面にも出るのは重複ではなく、別の軸での見え方です（読み取り専用）。
      </p>
      <p className="mb-4 text-xs text-gray-500">
        {items.length} 件（{Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(' / ')}）
      </p>
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
              {it.link && <Link to={it.link.to} className="text-blue-600 hover:underline">出典: {SRC_LABEL[it.kind] ? SRC_LABEL[it.kind] + '「' + it.link.label + '」' : it.link.label} →</Link>}
              {it.source && <a href={it.source} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">公式</a>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
