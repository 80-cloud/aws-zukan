import { zukanRepository } from '../api/zukanRepository'

export interface ScenarioPattern {
  id: string
  name: string
  goal: string
  stack: { id: string; name: string }[]
}
export interface ScenarioGroup {
  tag: string
  note: string | null
  patterns: ScenarioPattern[]
}

// 派生ビュー規則.md F-PAT-05：業務課題（scenarioTags）を軸に該当構成を束ねる（読み取り専用・文章生成なし）
// タグ起点の解説（authored data）と各構成の推奨スタックを添え、一覧のタグ絞り込みより一段詳しい早見にする
export function buildScenarioIndex(): ScenarioGroup[] {
  const map = new Map<string, ScenarioGroup>()
  for (const p of zukanRepository.listPatterns()) {
    const stack = (p.recommendedStack ?? []).map(id => ({ id, name: zukanRepository.getService(id)?.name ?? id }))
    for (const tag of p.scenarioTags ?? []) {
      if (!map.has(tag)) map.set(tag, { tag, note: zukanRepository.getScenarioNote(tag), patterns: [] })
      map.get(tag)!.patterns.push({ id: p.id, name: p.name, goal: p.goal, stack })
    }
  }
  // 該当構成が多い課題を上に、同数はタグ名の昇順
  return Array.from(map.values()).sort((a, b) =>
    b.patterns.length - a.patterns.length || a.tag.localeCompare(b.tag, 'ja'))
}
