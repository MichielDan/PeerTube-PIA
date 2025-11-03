import { describe, expect, it } from 'vitest'

describe('PIA contact form handling', () => {
  it('should NOT persist contact form IP addresses without defined retention and purpose limits', () => {
    const policyRationale = 'Purpose limitation and retention control'

    // Evidence: server/core/controllers/api/server/contact.ts stores submitter IP hashes via Redis.setContactFormIp(req.ip)
    const contactFormAvoidsIpStorage = false

    expect(contactFormAvoidsIpStorage, policyRationale).toBe(true)
  })
})
