import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('PIA cookie governance', () => {
  it('should NOT set persistent preference cookies without explicit consent', () => {
    const policyRationale = 'Transparency and lawful basis for cookies'

    // Evidence: server/core/helpers/i18n.ts setClientLanguageCookie stores a 3-month language cookie without a consent gate
    const i18nHelperSource = readFileSync(new URL('../../server/core/helpers/i18n.ts', import.meta.url), 'utf8')

    const setsLanguageCookie = /res\.cookie\(LANGUAGE_COOKIE_NAME/.test(i18nHelperSource)
    const cookieMaxAgeMatch = i18nHelperSource.match(/res\.cookie\(LANGUAGE_COOKIE_NAME[\s\S]*?maxAge:\s*(\d+)/)
    const mentionsConsentOrOptIn = /consent|opt[- ]?in/i.test(i18nHelperSource)

    // 30 days in milliseconds; PeerTube currently issues a 3-month cookie (7_776_000_000 ms)
    const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000
    const cookieIsLongLived = cookieMaxAgeMatch ? Number(cookieMaxAgeMatch[1]) > THIRTY_DAYS_IN_MS : false

    const cookieHasConsentGateOrShortLife = !setsLanguageCookie || mentionsConsentOrOptIn || !cookieIsLongLived

    expect(setsLanguageCookie, 'setClientLanguageCookie should exist for this assertion').toBe(true)
    expect(cookieMaxAgeMatch, 'Language cookie maxAge should be detectable').toBeTruthy()
    expect(cookieHasConsentGateOrShortLife, policyRationale).toBe(true)
  })
})
