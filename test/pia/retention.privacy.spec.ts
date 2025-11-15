import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('PIA storage limitation controls', () => {
  it('should NOT keep viewing history indefinitely for local users', () => {
    const policyRationale = 'Storage limitation principle'

    // Evidence: config/default.yaml -> history.videos.max_age: -1 (no automatic purge)
    const defaultConfig = readFileSync(new URL('../../config/default.yaml', import.meta.url), 'utf8')
    const historyBlock = defaultConfig.match(/history:\s*\n\s+videos:\s*\n([\s\S]*?)\n\s*[a-z]/)

    expect(historyBlock, 'config/default.yaml should describe history.videos settings').toBeTruthy()

    const historyMaxAge = historyBlock?.[1].match(/max_age:\s*([^\n]+)/)?.[1].trim()
    expect(historyMaxAge, 'history.videos.max_age should be readable').toBeTruthy()

    const viewingHistoryHasRetentionLimit = historyMaxAge !== undefined && historyMaxAge !== '-1'

    expect(viewingHistoryHasRetentionLimit, policyRationale).toBe(true)
  })
})
