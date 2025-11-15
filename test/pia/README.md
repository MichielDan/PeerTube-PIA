# Privacy Impact Assessment Regression Evidence

These Vitest suites intentionally fail because they encode desired privacy guardrails that PeerTube's current defaults do not yet satisfy. They are meant to serve as executable evidence for the Privacy Impact Assessment and will start passing only after corresponding governance or product mitigations are implemented.
# PIA Tests (Intentional Failing)
Run: npx vitest run test/pia
Evidence: see docs/privacy/pia-test-evidence.txt
These tests intentionally fail to demonstrate current privacy gaps; they'll pass once mitigations are applied.

# What eact test checks
	•	Contact Form: verifies that submitter IP addresses are not stored without a defined purpose or retention limit.
	•	Cookies: checks that persistent preference cookies (e.g., language) are not set without explicit user consent.
	•	Federation: ensures individual viewing events are not federated to other instances unless users explicitly opt in.
	•	GeoIP: verifies GeoIP-based location enrichment is disabled by default (data minimization).
	•	Logging: checks that server logs anonymize client IP addresses by default.
	•	Plugins: ensures server plugins run in a sandbox or isolation environment to prevent unrestricted access to personal data.
	•	Retention: validates that user viewing history does not have infinite retention and enforces a defined maximum age.
	•	Tracker: ensures the built-in BitTorrent tracker does not expose or log raw peer IP addresses.
