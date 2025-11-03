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
    const avoidsIpStorage = !/setContactFormIp\(req\.ip/.test(contactControllerSource)
    const contactFormAvoidsIpStorage = avoidsIpStorage

    expect(contactFormAvoidsIpStorage, policyRationale).toBe(true)
  })
})
