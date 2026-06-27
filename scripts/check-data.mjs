import { readFileSync } from 'node:fs'

const load = (p) => JSON.parse(readFileSync(p, 'utf8'))
const services = load('data/services.json')
const patterns = load('data/patterns.json')
const rules = load('data/common-rules.json')

const serviceIds = new Set(services.map(s => s.id))
const ruleKeys = new Set(rules.map(r => r.key))
const AXES = ['security','availability','opsLoad','cost','scalability','governanceFit','migrationEase','vendorLockin']
const errors = []

const dup = (arr, label) => {
  const seen = new Set()
  for (const x of arr) { if (seen.has(x)) errors.push(`重複 ${label}: ${x}`); seen.add(x) }
}
dup(services.map(s => s.id), 'service id')
dup(patterns.map(p => p.id), 'pattern id')
dup(rules.map(r => r.key), 'rule key')

for (const s of services) {
  const refs = [...(s.related || []), ...(s.alternatives || []), ...((s.companions || []).map(c => c.serviceId))]
  for (const r of refs) if (!serviceIds.has(r)) errors.push(`service ${s.id}: 未知の service 参照 "${r}"`)
  for (const k of (s.commonRuleRefs || [])) if (!ruleKeys.has(k)) errors.push(`service ${s.id}: 未知の共通ルール "${k}"`)
  if (!s.name || !s.oneLiner || !s.category) errors.push(`service ${s.id}: 必須項目が欠落`)
}

for (const p of patterns) {
  const refs = [...(p.recommendedStack || []), ...((p.stackRoles || []).map(r => r.serviceId))]
  for (const a of (p.antiPatterns || [])) refs.push(...(a.stack || []))
  for (const r of refs) if (!serviceIds.has(r)) errors.push(`pattern ${p.id}: 未知の service 参照 "${r}"`)
  for (const ax of AXES) if (!p.evaluation || !p.evaluation[ax]) errors.push(`pattern ${p.id}: 評価軸 "${ax}" が欠落`)
  if (!p.name || !p.goal) errors.push(`pattern ${p.id}: 必須項目が欠落`)
}

for (const r of rules) if (!r.key || !r.title || !r.body) errors.push(`rule ${r.key}: 必須項目が欠落`)

console.log(`services=${services.length} patterns=${patterns.length} rules=${rules.length}`)
if (errors.length) {
  console.error(`\n❌ データ整合性エラー ${errors.length} 件:`)
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
}
console.log('✅ データ整合性チェック OK（参照切れ・必須欠落・ID 重複なし）')
