export interface RealWorldNote { source: string; gotcha: string }
export interface Companion { serviceId: string; role: string }
export interface ServiceCost { freeTier?: boolean; meteredAxes?: string[]; relative?: string }
export interface ServiceDifficulty { tech?: number; ops?: number; org?: number }
export interface ServiceAdoption { region?: Record<string, boolean>; sla?: string; lockin?: string; modernizeTo?: string[]; [k: string]: unknown }
export interface ServiceOps { iacSupport?: Record<string, boolean>; backup?: string; changeImpact?: string; failover?: string; dataResidency?: string; [k: string]: unknown }
export interface Service {
  id: string; name: string; category: string; oneLiner: string; tier: number
  mainUseCases: string[]; notSuitableFor: string[]; companions: Companion[]
  related: string[]; alternatives: string[]; commonRuleRefs: string[]; productionPrereqs: string[]
  costGotcha?: string; cost?: ServiceCost; difficulty?: ServiceDifficulty
  adoption?: ServiceAdoption; ops?: ServiceOps; links?: Record<string, string>
  realWorldNotes?: RealWorldNote[]; updatedAt?: string; verifiedAt?: string
}
export interface AntiPattern { stack: string[]; why: string; source?: string | null }
export interface PatternEvaluation { security?: string; availability?: string; opsLoad?: string; cost?: string; scalability?: string; governanceFit?: string; migrationEase?: string; vendorLockin?: string; [k: string]: string | undefined }
export interface StackRole { serviceId: string; role: string }
export interface Pattern {
  id: string; name: string; goal: string; recommendedStack: string[]; rationale: string
  antiPatterns: AntiPattern[]; requiredGovernance: string[]; optional: string[]
  suitableConditions: string[]; alternatives: string[]; notes?: string; difficulty: number
  evaluation: PatternEvaluation; scenarioTags: string[]; realWorldNotes?: RealWorldNote[]
  stackRoles?: StackRole[]
}
export interface CommonRule { key: string; title: string; body: string }
