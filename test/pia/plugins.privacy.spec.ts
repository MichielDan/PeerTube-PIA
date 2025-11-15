import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('PIA plugin governance', () => {
  it('should enforce sandboxing or auditing for server plugins by default', () => {
    const policyRationale = 'Accountability and access control'

    // Evidence: server/core/lib/plugins/plugin-manager.ts loads server plugins with full access to register helpers and HTTP routes
    const pluginManagerSource = readFileSync(
      new URL('../../server/core/lib/plugins/plugin-manager.ts', import.meta.url),
      'utf8'
    )

    const loadsPluginsWithRequire = /require\(modulePath\)/.test(pluginManagerSource)
    const referencesSandboxing = /NodeVM|vm2|isolated-?vm|worker_threads|sandbox/i.test(pluginManagerSource)

    const pluginsRunWithSandbox = referencesSandboxing

    expect(loadsPluginsWithRequire, 'plugin-manager should dynamically load plugins for this assertion').toBe(true)
    expect(pluginsRunWithSandbox, policyRationale).toBe(true)
  })
})
