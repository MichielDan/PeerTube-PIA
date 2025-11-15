import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('PIA federation guardrails', () => {
  it('should NOT federate individual viewing events without explicit opt-in', () => {
    const policyRationale = 'Purpose limitation and user consent'

    // Evidence: server/core/lib/views/shared/video-viewer-counters.ts federates "View" activities without configuration gates
    const viewerCountersSource = readFileSync(
      new URL('../../server/core/lib/views/shared/video-viewer-counters.ts', import.meta.url),
      'utf8'
    )

    const federatesViewers = /sendView\(\{/.test(viewerCountersSource)
    const mentionsOptInConfig = /config\.|CONFIG\./.test(viewerCountersSource)
    const referencesExplicitOptIn = /opt[- ]?in|consent/i.test(viewerCountersSource)

    const viewingEventsRequireExplicitOptIn = federatesViewers && (mentionsOptInConfig || referencesExplicitOptIn)

    expect(federatesViewers, 'video-viewer-counters.ts should dispatch sendView activities').toBe(true)
    expect(viewingEventsRequireExplicitOptIn, policyRationale).toBe(true)
  })
})
