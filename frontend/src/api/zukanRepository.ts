import type { Service, Pattern, CommonRule } from './types'
import s from '@data/services.json'
import p from '@data/patterns.json'
import c from '@data/common-rules.json'
export const zukanRepository = {
  listServices: () => s as Service[],
  listPatterns: () => p as Pattern[],
  listCommonRules: () => c as CommonRule[],
}
