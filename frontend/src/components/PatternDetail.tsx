import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { zukanRepository } from '../api/zukanRepository'
import { buildReviewChecklist } from '../lib/reviewChecklist'
const AXES: [string, string][] = [['security','安全性'],['availability','可用性'],['opsLoad','運用負荷'],['cost','コスト'],['scalability','拡張性'],['governanceFit','統制適合'],['migrationEase','移行容易'],['vendorLockin','ベンダー依存']]
function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mt-6"><h2 className="text-sm font-semibold text-gray-500">{title}</h2><div className="mt-2 text-sm text-gray-800">{children}</div></section>
}
function Bullets({ items }: { items: string[] }) {
  if (!items?.length) return <span className="text-gray-400">—</span>
  return <ul className="list-disc space-y-1 pl-5">{items.map((x,i) => <li key={i}>{x}</li>)}</ul>
}
function Chips({ ids }: { ids: string[] }) {
  if (!ids?.length) return <span className="text-gray-400">—</span>
  return <div className="flex flex-wrap gap-2">{ids.map(id => <Link key={id} to={`/service/${id}`} className="rounded-full border border-gray-200 px-2 py-0.5 text-xs hover:bg-gray-50">{id}</Link>)}</div>
}
export default function PatternDetail() {
  const { id } = useParams()
  const p = id ? zukanRepository.getPattern(id) : null
  if (!p) return <div><p className="text-gray-700">構成パターンが見つかりませんでした。</p><Link to="/patterns" className="text-sm text-blue-600 hover:underline">← 一覧へ</Link></div>
  const checklist = buildReviewChecklist(p)
  return (
    <article>
      <Link to="/patterns" className="text-sm text-blue-600 hover:underline">← 構成パターン一覧へ</Link>
      <h1 className="mt-2 text-2xl font-bold">{p.name}</h1>
      <p className="mt-1 text-gray-700">{p.goal}</p>
      <Section title="推奨スタック"><Chips ids={p.recommendedStack} /></Section>
      <Section title="この構成が向く理由"><p>{p.rationale}</p></Section>
      <Section title="評価（8軸 ◎○△）">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
          {AXES.map(([k,label]) => <div key={k} className="flex justify-between border-b border-gray-100 py-1"><span className="text-gray-500">{label}</span><span className="font-semibold">{p.evaluation?.[k] ?? '—'}</span></div>)}
        </div>
      </Section>
      <Section title="設計レビュー観点（既存データから自動生成）">
        <ul className="space-y-1">
          {checklist.map((c,i) => (
            <li key={i} className="flex gap-2">
              <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{c.kind}</span>
              <span>{c.text}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="向いている条件"><Bullets items={p.suitableConditions} /></Section>
      <Section title="必要な統制"><Bullets items={p.requiredGovernance} /></Section>
      <Section title="不適合になりやすい構成">
        {p.antiPatterns?.length ? <ul className="space-y-2">{p.antiPatterns.map((a,i) => <li key={i} className="rounded-md bg-rose-50 p-3"><div className="text-xs text-gray-500">{a.stack.join(' + ')}</div><p>{a.why}</p></li>)}</ul> : <span className="text-gray-400">—</span>}
      </Section>
      {p.optional?.length ? <Section title="任意の上積み"><Bullets items={p.optional} /></Section> : null}
      <Section title="代替案"><Chips ids={p.alternatives} /></Section>
      {p.realWorldNotes?.length ? <Section title="一次体験ノート（出典つき）"><ul className="space-y-2">{p.realWorldNotes.map((n,i) => <li key={i} className="rounded-md bg-amber-50 p-3"><p>{n.gotcha}</p><a href={n.source} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">出典</a></li>)}</ul></Section> : null}
      {p.notes ? <Section title="備考"><p>{p.notes}</p></Section> : null}
    </article>
  )
}
