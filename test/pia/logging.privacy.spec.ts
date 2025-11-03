import { describe, expect, it } from 'vitest'

describe('PIA logging controls', () => {
  it('should NOT record full client IP addresses in server logs by default', () => {
    const policyRationale = 'Data minimization principle'

    // Evidence: config/default.yaml -> log.anonymize_ip: false
    const logsAnonymizeIpByDefault = false

    expect(logsAnonymizeIpByDefault, policyRationale).toBe(true)
  })
})
