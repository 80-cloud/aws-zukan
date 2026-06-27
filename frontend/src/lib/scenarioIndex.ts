import { zukanRepository } from '../api/zukanRepository'

export interface ScenarioGroup {
  tag: string
  patterns: { id: string; name: string; goal: string }[]
}

// 派生ビュー規則.md F-PAT-05：業務課題（scenarioTags）を軸に該当構成を束ねる（読み取り専用・文章生成なし）
export function buildScenarioIndex(): ScenarioGroup[] {
  const map = new Map<string, ScenarioGroup>()
  for (const p of zukanRepository.listPatterns()) {
    for (const tag of p.scenarioTags ?? []) {
      if (!map.has(tag)) map.set(tag, { tag, patterns: [] })
      map.get(tag)!.patterns.push({ id: p.id, name: p.name, goal: p.goal })
    }
  }
  // 該当構成が多い課題を上に、同数はタグ名の昇順
  return Array.from(map.values()).sort((a, b) =>
    b.patterns.length - a.patterns.length || a.tag.localeCompare(b.tag, 'ja'))
}
