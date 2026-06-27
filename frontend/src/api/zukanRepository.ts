import type { Service, Pattern, CommonRule } from './types'
import servicesJson from '@data/services.json'
import patternsJson from '@data/patterns.json'
import commonRulesJson from '@data/common-rules.json'
import scenarioNotesJson from '@data/scenario-notes.json'
const services = servicesJson as Service[]
const patterns = patternsJson as Pattern[]
const commonRules = commonRulesJson as CommonRule[]
const scenarioNotes = scenarioNotesJson as Record<string, string>
export const zukanRepository = {
  listServices: (): Service[] => services,
  getService: (id: string): Service | null => services.find(s => s.id === id) ?? null,
  listPatterns: (): Pattern[] => patterns,
  getPattern: (id: string): Pattern | null => patterns.find(p => p.id === id) ?? null,
  listCommonRules: (): CommonRule[] => commonRules,
  getScenarioNote: (tag: string): string | null => scenarioNotes[tag] ?? null,
}
