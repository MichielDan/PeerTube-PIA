import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('PIA tracker exposure', () => {
  it('should avoid exposing raw peer IP addresses through the built-in tracker', () => {
    const policyRationale = 'Network privacy and IP address minimization'

    // Evidence: server/core/controllers/tracker.ts logs and rate-limits peers using their raw IP addresses
    const trackerSource = readFileSync(new URL('../../server/core/controllers/tracker.ts', import.meta.url), 'utf8')
    const usesRawIpAssignments = /params\.httpReq\.ip|params\.ip|logger\.(warn|debug)\('Peer %s made abnormal requests \(%d\).', ip/.test(trackerSource)
    const trackerMasksPeerIps = usesRawIpAssignments === false

    expect(trackerMasksPeerIps, policyRationale).toBe(true)
  })
})
