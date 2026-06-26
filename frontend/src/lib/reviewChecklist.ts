import { zukanRepository } from '../api/zukanRepository'
import type { Pattern } from '../api/types'

export type CheckKind = '必須統制' | '共通観点' | '弱点警告' | '障害対策'
export interface CheckItem { kind: CheckKind; text: string }

const AXIS: Record<string, string> = {
  security: '安全性', availability: '可用性', opsLoad: '運用負荷', cost: 'コスト',
  scalability: '拡張性', governanceFit: '統制適合', migrationEase: '移行容易', vendorLockin: 'ベンダー依存',
}

export function buildReviewChecklist(p: Pattern): CheckItem[] {
  const items: CheckItem[] = []
  for (const g of p.requiredGovernance ?? []) items.push({ kind: '必須統制', text: `${g} は満たしているか？` })
  const rules = zukanRepository.listCommonRules()
  const keys = new Set<string>()
  for (const id of p.recommendedStack ?? []) {
    const s = zukanRepository.getService(id)
    for (const k of s?.commonRuleRefs ?? []) keys.add(k)
  }
  for (const k of keys) {
    const title = rules.find(r => r.key === k)?.title ?? k
    items.push({ kind: '共通観点', text: `${title} の観点は確認したか？` })
  }
  for (const [axis, mark] of Object.entries(p.evaluation ?? {})) {
    if (mark === '△' || mark === '✕') items.push({ kind: '弱点警告', text: `「${AXIS[axis] ?? axis}」が弱い（${mark}）。対策はあるか？` })
  }
  const needsFailover = (p.recommendedStack ?? []).some(id => {
    const s = zukanRepository.getService(id)
    return Boolean(s?.ops?.failover || s?.ops?.backup)
  })
  if (needsFailover) items.push({ kind: '障害対策', text: '障害時の代替・バックアップは要件に合うか？' })
  return items
}
