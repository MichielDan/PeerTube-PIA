import { describe, expect, it } from 'vitest'

describe('PIA storage limitation controls', () => {
  it('should NOT keep viewing history indefinitely for local users', () => {
    const policyRationale = 'Storage limitation principle'

    // Evidence: config/default.yaml -> history.videos.max_age: -1 (no automatic purge)
    const viewingHistoryHasRetentionLimit = false

    expect(viewingHistoryHasRetentionLimit, policyRationale).toBe(true)
  })
})
