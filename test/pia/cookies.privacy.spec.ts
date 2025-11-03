import { describe, expect, it } from 'vitest'

describe('PIA cookie governance', () => {
  it('should NOT set persistent preference cookies without explicit consent', () => {
    const policyRationale = 'Transparency and lawful basis for cookies'

    // Evidence: server/core/helpers/i18n.ts setClientLanguageCookie stores a 3-month language cookie without a consent gate
    const languageCookieRequiresConsent = false

    expect(languageCookieRequiresConsent, policyRationale).toBe(true)
  })
})
