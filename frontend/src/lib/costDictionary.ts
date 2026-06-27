import { zukanRepository } from '../api/zukanRepository'

export type CostKind = '見落としやすい課金' | '課金される軸'
export interface CostItem {
  kind: CostKind
  service: string
  serviceId: string
  gotcha?: string
  axes?: string[]
  relative?: string
}

// 想定外請求になりやすい課金軸のキーワード（NAT・転送・ログ・クロス AZ・スナップショット 等）
const HIDDEN_AXIS_WORDS = ['転送', 'NAT', 'ログ', 'クロス', 'IOPS', 'スナップ', 'リクエスト', '残存', '保持']
const hasHiddenAxis = (axes: string[]) => axes.some(a => HIDDEN_AXIS_WORDS.some(w => a.includes(w)))

// 派生ビュー規則.md F-SVC-11 を忠実に集約（文章生成はしない・読み取り専用・具体額は持たない）
export function buildCostDictionary(): CostItem[] {
  const items: CostItem[] = []
  for (const s of zukanRepository.listServices()) {
    const axes = s.cost?.meteredAxes ?? []
    const relative = s.cost?.relative
    if (s.costGotcha) {
      items.push({ kind: '見落としやすい課金', service: s.name, serviceId: s.id, gotcha: s.costGotcha, axes, relative })
    } else if (hasHiddenAxis(axes)) {
      items.push({ kind: '課金される軸', service: s.name, serviceId: s.id, axes, relative })
    }
  }
  // 明示された「見落としやすい課金」を先頭へ
  return items.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === '見落としやすい課金' ? -1 : 1))
}
