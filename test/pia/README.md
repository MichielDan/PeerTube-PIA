# Privacy Impact Assessment Regression Evidence

These Vitest suites intentionally fail because they encode desired privacy guardrails that PeerTube's current defaults do not yet satisfy. They are meant to serve as executable evidence for the Privacy Impact Assessment and will start passing only after corresponding governance or product mitigations are implemented.
# PIA Tests (Intentional Failing)
Run: npx vitest run test/pia
Evidence: see docs/privacy/pia-test-evidence.txt
These tests intentionally fail to demonstrate current privacy gaps; they'll pass once mitigations are applied.
