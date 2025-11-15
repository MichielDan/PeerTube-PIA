import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('PIA GeoIP enrichment', () => {
  it('should disable GeoIP lookups unless operators opt in with a DPIA justification', () => {
    const policyRationale = 'Data minimization and proportionality'

    // Evidence: config/default.yaml -> geo_ip.enabled: true with remote database downloads by default
    const defaultConfig = readFileSync(new URL('../../config/default.yaml', import.meta.url), 'utf8')
    const geoIpEnabledLine = defaultConfig.match(/geo_ip:\s*\n\s+enabled:\s*(true|false)/)

    expect(geoIpEnabledLine, 'config/default.yaml should define geo_ip.enabled').toBeTruthy()

    const geoIpDisabledByDefault = geoIpEnabledLine?.[1] === 'false'

    expect(geoIpDisabledByDefault, policyRationale).toBe(true)
  })
})
