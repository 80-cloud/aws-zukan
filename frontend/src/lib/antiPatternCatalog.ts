import { zukanRepository } from '../api/zukanRepository'

export interface AntiPatternCase {
  patternId: string
  patternName: string
  why: string
  source?: string | null
}
export interface AntiPatternEntry {
  serviceId: string
  serviceName: string
  exists: boolean
  cases: AntiPatternCase[]
}

// 派生ビュー規則.md F-PAT-03：各構成の「不適合になりやすい構成」(antiPatterns)を
// サービス単位に集約し、「このサービスがどの前提で不適合になりやすいか」を逆引きできるようにする
// （読み取り専用・文章生成なし・前提条件つき）
export function buildAntiPatternCatalog(): AntiPatternEntry[] {
  const map = new Map<string, AntiPatternEntry>()
  for (const p of zukanRepository.listPatterns()) {
    for (const ap of p.antiPatterns ?? []) {
      for (const sid of ap.stack ?? []) {
        if (!map.has(sid)) {
          const svc = zukanRepository.getService(sid)
          map.set(sid, { serviceId: sid, serviceName: svc?.name ?? sid, exists: !!svc, cases: [] })
        }
        map.get(sid)!.cases.push({
          patternId: p.id, patternName: p.name, why: ap.why, source: ap.source ?? null,
        })
      }
    }
  }
  // 不適合の事例が多いサービスを上に、同数はサービス名の昇順
  return Array.from(map.values()).sort((a, b) =>
    b.cases.length - a.cases.length || a.serviceName.localeCompare(b.serviceName, 'ja'))
}
