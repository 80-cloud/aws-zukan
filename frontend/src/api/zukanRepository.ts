import type { Service, Pattern, CommonRule } from './types'
import servicesJson from '@data/services.json'
import patternsJson from '@data/patterns.json'
import commonRulesJson from '@data/common-rules.json'
const services = servicesJson as Service[]
const patterns = patternsJson as Pattern[]
const commonRules = commonRulesJson as CommonRule[]
export const zukanRepository = {
  listServices: (): Service[] => services,
  getService: (id: string): Service | null => services.find(s => s.id === id) ?? null,
  listPatterns: (): Pattern[] => patterns,
  listCommonRules: (): CommonRule[] => commonRules,
}
