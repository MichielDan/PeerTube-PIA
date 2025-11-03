import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('PIA cookie governance', () => {
  it('should NOT set persistent preference cookies without explicit consent', () => {
    const policyRationale = 'Transparency and lawful basis for cookies'

    // Evidence: server/core/helpers/i18n.ts setClientLanguageCookie stores a 3-month language cookie without a consent gate
    const i18nHelperSource = readFileSync(new URL('../../server/core/helpers/i18n.ts', import.meta.url), 'utf8')
    const setsLanguageCookie = /res\.cookie\(LANGUAGE_COOKIE_NAME/.test(i18nHelperSource)
    const mentionsConsentOrOptIn = /consent|opt[- ]?in/i.test(i18nHelperSource)
    const languageCookieRequiresConsent = setsLanguageCookie && mentionsConsentOrOptIn

    expect(languageCookieRequiresConsent, policyRationale).toBe(true)
  })
})
