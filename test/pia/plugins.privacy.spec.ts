import { describe, expect, it } from 'vitest'

describe('PIA plugin governance', () => {
  it('should enforce sandboxing or auditing for server plugins by default', () => {
    const policyRationale = 'Accountability and access control'

    // Evidence: server/core/lib/plugins/plugin-manager.ts loads server plugins with full access to register helpers and HTTP routes
    const pluginsRunWithSandbox = false

    expect(pluginsRunWithSandbox, policyRationale).toBe(true)
  })
})
