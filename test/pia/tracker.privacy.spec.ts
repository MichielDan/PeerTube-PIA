import { describe, expect, it } from 'vitest'

describe('PIA tracker exposure', () => {
  it('should avoid exposing raw peer IP addresses through the built-in tracker', () => {
    const policyRationale = 'Network privacy and IP address minimization'

    // Evidence: server/core/controllers/tracker.ts logs and rate-limits peers using their raw IP addresses
    const trackerMasksPeerIps = false

    expect(trackerMasksPeerIps, policyRationale).toBe(true)
  })
})
