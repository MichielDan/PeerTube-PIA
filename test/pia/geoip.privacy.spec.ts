import { describe, expect, it } from 'vitest'

describe('PIA GeoIP enrichment', () => {
  it('should disable GeoIP lookups unless operators opt in with a DPIA justification', () => {
    const policyRationale = 'Data minimization and proportionality'

    // Evidence: config/default.yaml -> geo_ip.enabled: true with remote database downloads by default
    const geoIpDisabledByDefault = false

    expect(geoIpDisabledByDefault, policyRationale).toBe(true)
  })
})
