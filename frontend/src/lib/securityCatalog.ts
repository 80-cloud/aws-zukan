import { zukanRepository } from '../api/zukanRepository'

export type SecKind = 'アンチパターン' | '基本ルール' | '実体験' | '弱い構成'
export interface SecItem {
  kind: SecKind
  point: string
  why?: string
  correct?: string
  source?: string
  link?: { to: string; label: string }
}

const SEC_WORDS = ['SSH', '公開', 'Public', 'パブリック', '権限', '暗号', 'セキュリティ', '0.0.0.0', '全開放', '隔離', '認証', 'IAM']
const isSec = (t: string) => SEC_WORDS.some(w => t.includes(w))

// 派生ビュー規則.md F-SEC-01 を忠実に集約（文章生成はしない・読み取り専用）
export function buildSecurityCatalog(): SecItem[] {
  const items: SecItem[] = []
  for (const p of zukanRepository.listPatterns()) {
    for (const a of p.antiPatterns ?? []) {
      if (!isSec(a.why)) continue
      items.push({
        kind: 'アンチパターン',
        point: `${p.name}：${a.stack.join(' + ')}`,
        why: a.why,
        correct: (p.requiredGovernance ?? []).join(' / ') || undefined,
        source: a.source ?? undefined,
        link: { to: `/pattern/${p.id}`, label: p.name },
      })
    }
    const sec = p.evaluation?.security
    if (sec === '△' || sec === '✕') {
      items.push({ kind: '弱い構成', point: `${p.name} はセキュリティ評価が ${sec}`, link: { to: `/pattern/${p.id}`, label: p.name } })
    }
  }
  for (const key of ['network', 'iam', 'encryption']) {
    const r = zukanRepository.listCommonRules().find(x => x.key === key)
    if (r) items.push({ kind: '基本ルール', point: r.title, why: r.body })
  }
  for (const s of zukanRepository.listServices()) {
    for (const n of s.realWorldNotes ?? []) {
      if (!isSec(n.gotcha)) continue
      items.push({ kind: '実体験', point: s.name, why: n.gotcha, source: n.source, link: { to: `/service/${s.id}`, label: s.name } })
    }
  }
  return items
}
