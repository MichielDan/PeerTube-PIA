import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('PIA contact form handling', () => {
  it('should NOT persist contact form IP addresses without defined retention and purpose limits', () => {
    const policyRationale = 'Purpose limitation and retention control'

    // Evidence: server/core/controllers/api/server/contact.ts stores submitter IP hashes via Redis.setContactFormIp(req.ip)
    const contactControllerSource = readFileSync(
      new URL('../../server/core/controllers/api/server/contact.ts', import.meta.url),
      'utf8'
    )
    const redisHelperSource = readFileSync(new URL('../../server/core/lib/redis.ts', import.meta.url), 'utf8')

    const storesContactIp = /setContactFormIp\(req\.ip/.test(contactControllerSource)
    const contactFormTtlMatch = redisHelperSource.match(/CONTACT_FORM_LIFETIME\s*=\s*([^\n]+)/)
    expect(contactFormTtlMatch, 'redis.ts should expose CONTACT_FORM_LIFETIME for DPIA context').toBeTruthy()

    const hasDocumentedRetentionControl = contactFormTtlMatch !== null && /CONTACT_FORM_LIFETIME\s*=\s*0/.test(contactFormTtlMatch[0])
    const contactFormAvoidsIpStorage = !storesContactIp || hasDocumentedRetentionControl

    expect(storesContactIp, 'contact.ts should demonstrate IP capture for this assertion').toBe(true)
    expect(contactFormAvoidsIpStorage, policyRationale).toBe(true)
  })
})
