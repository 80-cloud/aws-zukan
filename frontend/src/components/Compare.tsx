import { useState } from 'react'
import type { Service } from '../api/types'
import { zukanRepository } from '../api/zukanRepository'

const rows: { label: string; render: (s: Service) => string }[] = [
  { label: 'カテゴリ', render: s => s.category },
  { label: 'Tier', render: s => String(s.tier) },
  { label: '一言', render: s => s.oneLiner },
  { label: '相対コスト', render: s => s.cost?.relative ?? '—' },
  { label: '無料枠', render: s => (s.cost?.freeTier ? 'あり' : '—') },
  { label: 'ロックイン', render: s => s.adoption?.lockin ?? '—' },
  { label: '難易度(技/運/組)', render: s => (s.difficulty ? `${s.difficulty.tech ?? '-'}/${s.difficulty.ops ?? '-'}/${s.difficulty.org ?? '-'}` : '—') },
  { label: '主な用途', render: s => s.mainUseCases?.join('、') ?? '—' },
  { label: '不適合になりやすい場面', render: s => s.notSuitableFor?.join('、') ?? '—' },
]

export default function Compare() {
  const all = zukanRepository.listServices()
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (id: string) =>
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev))
  const cols = all.filter(s => selected.includes(s.id))
  return (
    <div>
      <p className="mb-3 text-sm text-gray-500">比較するサービスを選択（最大4件）</p>
      <div className="mb-6 flex flex-wrap gap-2">
        {all.map(s => (
          <button
            key={s.id}
            onClick={() => toggle(s.id)}
            className={`rounded-full border px-3 py-1 text-xs ${selected.includes(s.id) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            {s.name}
          </button>
        ))}
      </div>
      {cols.length === 0 ? (
        <p className="text-gray-400">未選択です。上のボタンから選んでください。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b p-2 text-left text-gray-500"></th>
                {cols.map(s => <th key={s.id} className="border-b p-2 text-left">{s.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.label} className="align-top">
                  <td className="whitespace-nowrap border-b border-gray-100 p-2 font-medium text-gray-500">{r.label}</td>
                  {cols.map(s => <td key={s.id} className="border-b border-gray-100 p-2 text-gray-800">{r.render(s)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
