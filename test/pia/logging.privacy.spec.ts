import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('PIA logging controls', () => {
  it('should NOT record full client IP addresses in server logs by default', () => {
    const policyRationale = 'Data minimization principle'

    // Evidence: config/default.yaml -> log.anonymize_ip defaults to false
    const defaultConfig = readFileSync(new URL('../../config/default.yaml', import.meta.url), 'utf8')
    const anonymizeLine = defaultConfig.match(/anonymize_ip:\s*(true|false)/)
    const logsAnonymizeIpByDefault = anonymizeLine?.[1] === 'true'

    expect(logsAnonymizeIpByDefault, policyRationale).toBe(true)
  })
})
