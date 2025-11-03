import { describe, expect, it } from 'vitest'

describe('PIA federation guardrails', () => {
  it('should NOT federate individual viewing events without explicit opt-in', () => {
    const policyRationale = 'Purpose limitation and user consent'

    // Evidence: server/core/lib/activitypub/send/send-view.ts builds and federates "View" activities for watchers
    const viewingEventsRequireExplicitOptIn = false

    expect(viewingEventsRequireExplicitOptIn, policyRationale).toBe(true)
  })
})
