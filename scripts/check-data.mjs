import { readFileSync } from 'node:fs'

const load = (p) => JSON.parse(readFileSync(p, 'utf8'))
const services = load('data/services.json')
const patterns = load('data/patterns.json')
const rules = load('data/common-rules.json')
const scenarioNotes = load('data/scenario-notes.json')

const serviceIds = new Set(services.map(s => s.id))
const ruleKeys = new Set(rules.map(r => r.key))
const AXES = ['security', 'availability', 'opsLoad', 'cost', 'scalability', 'governanceFit', 'migrationEase', 'vendorLockin']
const EVAL_VALUES = new Set(['◎', '○', '△', '✕', '×'])
const ASSERTIVE = ['正解', '不正解', '一択']
const errors = []

const dup = (arr, label) => {
  const seen = new Set()
  for (const x of arr) { if (seen.has(x)) errors.push('重複 ' + label + ': ' + x); seen.add(x) }
}
dup(services.map(s => s.id), 'service id')
dup(patterns.map(p => p.id), 'pattern id')
dup(rules.map(r => r.key), 'rule key')

// §7「断定しすぎない」: データ本文に断定語が無いことを再帰スキャン
const scanAssertive = (obj, where) => {
  if (typeof obj === 'string') {
    for (const w of ASSERTIVE) if (obj.includes(w)) errors.push('断定語 "' + w + '": ' + where)
  } else if (Array.isArray(obj)) {
    for (const x of obj) scanAssertive(x, where)
  } else if (obj && typeof obj === 'object') {
    for (const x of Object.values(obj)) scanAssertive(x, where)
  }
}

for (const s of services) {
  const refs = [...(s.related || []), ...(s.alternatives || []), ...((s.companions || []).map(c => c.serviceId))]
  for (const r of refs) if (!serviceIds.has(r)) errors.push('service ' + s.id + ': 未知の service 参照 "' + r + '"')
  for (const k of (s.commonRuleRefs || [])) if (!ruleKeys.has(k)) errors.push('service ' + s.id + ': 未知の共通ルール "' + k + '"')
  if (!s.name || !s.oneLiner || !s.category) errors.push('service ' + s.id + ': 必須項目が欠落')
  if (!s.links || !s.links.overview) errors.push('service ' + s.id + ': links.overview が欠落')
  if (s.tier == null) errors.push('service ' + s.id + ': tier が欠落')
  for (const n of (s.realWorldNotes || [])) {
    if (!String(n.source || '').startsWith('http')) errors.push('service ' + s.id + ': realWorldNotes の source が http で始まらない')
  }
  scanAssertive(s, 'service ' + s.id)
}

for (const p of patterns) {
  const refs = [...(p.recommendedStack || []), ...((p.stackRoles || []).map(r => r.serviceId))]
  for (const a of (p.antiPatterns || [])) refs.push(...(a.stack || []))
  for (const r of refs) if (!serviceIds.has(r)) errors.push('pattern ' + p.id + ': 未知の service 参照 "' + r + '"')
  for (const ax of AXES) {
    const v = p.evaluation && p.evaluation[ax]
    if (!v) errors.push('pattern ' + p.id + ': 評価軸 "' + ax + '" が欠落')
    else if (!EVAL_VALUES.has(v)) errors.push('pattern ' + p.id + ': 評価軸 "' + ax + '" の値 "' + v + '" が ◎○△✕ 以外')
  }
  for (const a of (p.antiPatterns || [])) {
    if (a.source != null && !String(a.source).startsWith('http')) errors.push('pattern ' + p.id + ': antiPatterns の source が http で始まらない')
  }
  if (!p.name || !p.goal) errors.push('pattern ' + p.id + ': 必須項目が欠落')
  scanAssertive(p, 'pattern ' + p.id)
}

for (const r of rules) if (!r.key || !r.title || !r.body) errors.push('rule ' + r.key + ': 必須項目が欠落')

// scenario-notes のキーは実在の scenarioTag のみ（孤立した解説を防ぐ）
const allTags = new Set(patterns.flatMap(p => p.scenarioTags || []))
for (const tag of Object.keys(scenarioNotes)) {
  if (!allTags.has(tag)) errors.push('scenario-note "' + tag + '": どのパターンも持たないタグ')
  scanAssertive(scenarioNotes[tag], 'scenario-note ' + tag)
}

console.log('services=' + services.length + ' patterns=' + patterns.length + ' rules=' + rules.length)
if (errors.length) {
  console.error('\n❌ データ整合性エラー ' + errors.length + ' 件:')
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
}
console.log('✅ データ整合性チェック OK（参照・必須・ID重複・評価値範囲・出典http・断定語なし）')
