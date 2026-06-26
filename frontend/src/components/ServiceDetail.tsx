import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { zukanRepository } from '../api/zukanRepository'
function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mt-6"><h2 className="text-sm font-semibold text-gray-500">{title}</h2><div className="mt-2 text-sm text-gray-800">{children}</div></section>
}
function Bullets({ items }: { items: string[] }) {
  if (!items?.length) return <span className="text-gray-400">—</span>
  return <ul className="list-disc space-y-1 pl-5">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
}
function ServiceChips({ ids }: { ids: string[] }) {
  if (!ids?.length) return <span className="text-gray-400">—</span>
  return <div className="flex flex-wrap gap-2">{ids.map(id => <Link key={id} to={`/service/${id}`} className="rounded-full border border-gray-200 px-2 py-0.5 text-xs hover:bg-gray-50">{id}</Link>)}</div>
}
export default function ServiceDetail() {
  const { id } = useParams()
  const s = id ? zukanRepository.getService(id) : null
  if (!s) return <div><p className="text-gray-700">サービスが見つかりませんでした。</p><Link to="/" className="text-sm text-blue-600 hover:underline">← 一覧へ</Link></div>
  return (
    <article>
      <Link to="/" className="text-sm text-blue-600 hover:underline">← 一覧へ</Link>
      <header className="mt-2">
        <div className="flex items-baseline justify-between"><h1 className="text-2xl font-bold">{s.name}</h1><span className="text-xs text-gray-400">{s.category} / Tier {s.tier}</span></div>
        <p className="mt-1 text-gray-700">{s.oneLiner}</p>
      </header>
      <Section title="主な用途"><Bullets items={s.mainUseCases} /></Section>
      <Section title="不適合になりやすい場面"><Bullets items={s.notSuitableFor} /></Section>
      <Section title="随伴サービス">{s.companions?.length ? <ul className="space-y-1">{s.companions.map(c => <li key={c.serviceId}><Link to={`/service/${c.serviceId}`} className="text-blue-600 hover:underline">{c.serviceId}</Link><span className="text-gray-500"> — {c.role}</span></li>)}</ul> : <span className="text-gray-400">—</span>}</Section>
      <Section title="関連"><ServiceChips ids={s.related} /></Section>
      <Section title="代替候補"><ServiceChips ids={s.alternatives} /></Section>
      {s.adoption && <Section title="採用判断"><dl className="space-y-1">{s.adoption.sla && <div><dt className="inline text-gray-500">SLA: </dt><dd className="inline">{s.adoption.sla}</dd></div>}{s.adoption.lockin && <div><dt className="inline text-gray-500">ロックイン: </dt><dd className="inline">{s.adoption.lockin}</dd></div>}{s.adoption.modernizeTo?.length ? <div><dt className="inline text-gray-500">移行先候補: </dt><dd className="inline">{s.adoption.modernizeTo.join(', ')}</dd></div> : null}</dl></Section>}
      {s.ops && <Section title="運用"><dl className="space-y-1">{s.ops.backup && <div><dt className="inline text-gray-500">バックアップ: </dt><dd className="inline">{s.ops.backup}</dd></div>}{s.ops.changeImpact && <div><dt className="inline text-gray-500">変更時の影響: </dt><dd className="inline">{s.ops.changeImpact}</dd></div>}{s.ops.failover && <div><dt className="inline text-gray-500">フェイルオーバー: </dt><dd className="inline">{s.ops.failover}</dd></div>}</dl></Section>}
      {(s.costGotcha || s.cost) && <Section title="コスト注意">{s.costGotcha && <p>{s.costGotcha}</p>}{s.cost?.relative && <p className="text-gray-500">相対コスト: {s.cost.relative}{s.cost.freeTier ? '・無料枠あり' : ''}</p>}</Section>}
      <Section title="本番前提"><Bullets items={s.productionPrereqs} /></Section>
      {s.realWorldNotes?.length ? <Section title="一次体験ノート（出典つき）"><ul className="space-y-2">{s.realWorldNotes.map((n, i) => <li key={i} className="rounded-md bg-amber-50 p-3"><p>{n.gotcha}</p><a href={n.source} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">出典</a></li>)}</ul></Section> : null}
      {s.links && Object.keys(s.links).length > 0 && <Section title="公式リンク"><div className="flex flex-wrap gap-3">{Object.entries(s.links).map(([k, url]) => <a key={k} href={url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">{k}</a>)}</div></Section>}
      <Section title="共通ルール"><Bullets items={s.commonRuleRefs} /></Section>
      <footer className="mt-8 text-xs text-gray-400">{s.updatedAt && <span>更新 {s.updatedAt} </span>}{s.verifiedAt && <span>/ 確認 {s.verifiedAt}</span>}</footer>
    </article>
  )
}
