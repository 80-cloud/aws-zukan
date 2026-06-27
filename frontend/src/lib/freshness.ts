// 鮮度管理 F-SVC-05：verifiedAt から一定期間を過ぎた（または未確認の）項目に「要確認」を出す。
// 読み取り専用・判定はしきい値の単純比較のみ（文章生成なし）。
export const FRESHNESS_THRESHOLD_DAYS = 180

export function staleDays(verifiedAt?: string, today: Date = new Date()): number | null {
  if (!verifiedAt) return null
  const v = new Date(verifiedAt)
  if (Number.isNaN(v.getTime())) return null
  return Math.floor((today.getTime() - v.getTime()) / 86400000)
}

// verifiedAt が無い（未確認）か、しきい値を超えていれば「要確認」
export function needsReview(verifiedAt?: string, today: Date = new Date()): boolean {
  const d = staleDays(verifiedAt, today)
  if (d === null) return true
  return d > FRESHNESS_THRESHOLD_DAYS
}
