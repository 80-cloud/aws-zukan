import { useState } from 'react'
import { Link } from 'react-router-dom'
import { zukanRepository } from '../api/zukanRepository'
import { useFavorites } from '../lib/favorites'
import { needsReview } from '../lib/freshness'

const CATEGORY_LABELS: Record<string, string> = {
  compute: 'コンピューティング', storage: 'ストレージ', database: 'データベース',
  networking: 'ネットワーキング', security: 'セキュリティ', monitoring: '監視・運用',
  integration: 'アプリ統合', management: '管理・ガバナンス',
  analytics: '分析・データ',
  devtools: '開発者ツール',
  ai: 'AI・機械学習',
}
const chip = (active: boolean) =>
  `rounded-full border px-3 py-1 ${active ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`

export default function ServiceList() {
  const all = zukanRepository.listServices()
  const { isFavorite, toggle } = useFavorites()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [freeOnly, setFreeOnly] = useState(false)
  const [onlyFav, setOnlyFav] = useState(false)
  const [reviewOnly, setReviewOnly] = useState(false)

  const categories = Array.from(new Set(all.map(s => s.category)))
  const filtered = all.filter(s => {
    if (cat !== 'all' && s.category !== cat) return false
    if (freeOnly && !s.cost?.freeTier) return false
    if (onlyFav && !isFavorite(s.id)) return false
    if (reviewOnly && !needsReview(s.verifiedAt)) return false
    if (q) {
      const t = q.toLowerCase()
      if (!s.name.toLowerCase().includes(t) && !s.oneLiner.toLowerCase().includes(t)) return false
    }
    return true
  })
  const groups = categories
    .map(c => ({ cat: c, items: filtered.filter(s => s.category === c) }))
    .filter(g => g.items.length > 0)

  return (
    <div>
      <div className="mb-5 space-y-3">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="サービス名・説明で検索"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button onClick={() => setCat('all')} className={chip(cat === 'all')}>すべて</button>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} className={chip(cat === c)}>{CATEGORY_LABELS[c] ?? c}</button>
          ))}
          <label className="ml-2 flex items-center gap-1 text-gray-600"><input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)} /> 無料枠あり</label>
          <label className="flex items-center gap-1 text-gray-600"><input type="checkbox" checked={onlyFav} onChange={e => setOnlyFav(e.target.checked)} /> お気に入り</label>
          <label className="flex items-center gap-1 text-gray-600"><input type="checkbox" checked={reviewOnly} onChange={e => setReviewOnly(e.target.checked)} /> 要確認のみ</label>
        </div>
        <p className="text-sm text-gray-500">{filtered.length} 件該当</p>
      </div>

      {groups.length === 0 ? <p className="text-gray-400">該当なし。</p> : groups.map(g => (
        <section key={g.cat} className="mb-6">
          <h2 className="mb-2 text-sm font-semibold text-gray-500">{CATEGORY_LABELS[g.cat] ?? g.cat}</h2>
          <ul className="space-y-3">
            {g.items.map(s => (
              <li key={s.id} className="relative">
                <Link to={`/service/${s.id}`} className="block rounded-lg border border-gray-200 p-4 pr-12 hover:border-gray-400 hover:bg-gray-50">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-xs text-gray-400">{needsReview(s.verifiedAt) && <span className="mr-2 rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">要確認</span>}Tier {s.tier}{s.cost?.freeTier ? ' / 無料枠' : ''}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{s.oneLiner}</p>
                </Link>
                <button onClick={() => toggle(s.id)} aria-label="お気に入り" className="absolute right-3 top-3 text-lg leading-none text-amber-500">
                  {isFavorite(s.id) ? '★' : '☆'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
