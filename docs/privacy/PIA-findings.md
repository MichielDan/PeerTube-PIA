# PeerTube Privacy Impact Assessment Findings

## Summary
- PeerTube stores identifiable account records, registration requests, and contact submissions that may contain sensitive narratives in addition to mandatory identifiers. 【F:server/core/models/user/user.ts†L240-L318】【F:server/core/models/user/user-registration.ts†L52-L108】【F:server/core/lib/emailer.ts†L200-L222】
- Authentication, analytics, and logging subsystems collect IP addresses, device details, and activity histories with long default retention windows and optional redistribution to plugins or federated peers. 【F:server/core/lib/auth/oauth.ts†L189-L238】【F:server/core/lib/views/video-views-manager.ts†L43-L98】【F:config/default.yaml†L236-L404】
- Default configuration enables extensive federation, plugin catalogue lookups, GeoIP enrichment, P2P trackers, and optional telemetry exports that extend personal data processing beyond the hosting instance. 【F:config/default.yaml†L345-L446】【F:server/core/helpers/geo-ip.ts†L21-L117】【F:server/core/lib/opentelemetry/metrics.ts†L24-L70】

## Assessment Scope and Method
This review examined the PeerTube server source code, configuration defaults, and supporting utilities within the `server/` and `config/` directories. Findings focus on how personal data is collected, stored, transmitted, or exposed by core services. No production code was executed or modified; conclusions are based on static analysis of repository content.

## Detailed Findings

### 1. User Accounts and Registrations
| Item | Details |
| --- | --- |
| Description | Core account records persist usernames, emails, pending email changes, password hashes, NSFW preferences, and usage toggles within `UserModel`. Registration requests additionally retain the applicant's stated reason, optional channel details, and moderation responses even before approval. 【F:server/core/models/user/user.ts†L240-L318】【F:server/core/models/user/user-registration.ts†L52-L108】 |
| Risks | Registration reasons and moderation notes can contain special-category personal data; combined with identifiers they increase profiling risk. Prolonged retention of declined or pending applications may exceed data minimization principles. |
| Recommendations | Define retention schedules for rejected/pending registrations, purge unused fields promptly, and ensure privacy notices explain how narrative responses are handled. Limit staff access to sensitive moderation text and provide redaction workflows. |

### 2. Authentication and Session Tracking
| Item | Details |
| --- | --- |
| Description | OAuth token issuance records login IPs, user agents, timestamps, and ongoing activity metadata; these fields are updated by a scheduler whenever authenticated requests occur. Plugins receive token events containing usernames and IP addresses through hook callbacks. 【F:server/core/lib/auth/oauth.ts†L189-L238】【F:server/core/models/oauth/oauth-token.ts†L90-L152】【F:server/core/lib/schedulers/update-token-session-scheduler.ts†L1-L44】【F:server/core/controllers/api/users/token.ts†L87-L130】 |
| Risks | Persistent linkage of accounts to IP and device fingerprints can create detailed access logs vulnerable to misuse or breach. Exposure of these attributes to third-party plugins expands the trust boundary and may complicate breach notification obligations. |
| Recommendations | Establish retention limits or anonymization for historical session metadata, especially IP fields. Vet plugins handling authentication hooks and document contractual expectations. Offer administrators guidance on minimizing IP storage where lawful basis is weak. |

### 3. Video Viewing Analytics and History
| Item | Details |
| --- | --- |
| Description | Viewing endpoints capture viewer IP, device traits, and optional session identifiers before hashing into per-viewer records. GeoIP lookups enrich the data with country and region fields, which are stored alongside watch segments and duration. Viewing statistics can be federated back to a video's origin instance, while authenticated viewers also have personal watch history (video/timecode pairs) retained indefinitely by default. 【F:server/core/controllers/api/videos/view.ts†L34-L69】【F:server/core/lib/views/video-views-manager.ts†L43-L71】【F:server/core/lib/views/shared/video-viewer-stats.ts†L53-L188】【F:server/core/models/view/local-video-viewer.ts†L24-L103】【F:server/core/models/view/local-video-viewer.ts†L409-L436】【F:server/core/models/user/user-video-history.ts†L26-L134】【F:config/default.yaml†L355-L404】 |
| Risks | Detailed behavioral telemetry (precise watch sections, geolocation, and session identifiers) increases surveillance risk and, when federated, shares viewer behaviour with remote controllers. Default `-1` retention values keep watch histories indefinitely, potentially conflicting with user expectations or regional data-retention limits. |
| Recommendations | Configure finite retention for viewing analytics and personal histories, and communicate federation of watch events in privacy notices. Provide user-facing controls to disable geolocation or view history tracking, and consider disabling remote sharing where not required. |

### 4. Federation and Activity Sharing
| Item | Details |
| --- | --- |
| Description | ActivityPub is enabled by default, broadcasting actor metadata and watch actions to remote instances. Watch events include durations, timestamps, and optional location data derived from GeoIP processing. 【F:config/default.yaml†L423-L439】【F:server/core/lib/views/video-views-manager.ts†L20-L71】【F:server/core/lib/activitypub/send/send-create.ts†L80-L85】【F:server/core/models/view/local-video-viewer.ts†L409-L436】 |
| Risks | Federated exchanges extend personal data processing to third parties with independent policies, creating joint-controller or processor considerations. Geo-enriched watch data may be considered personal data when combined with account identifiers on the origin server. |
| Recommendations | Maintain inter-instance data sharing agreements or policy statements, provide administrators tools to restrict federation scope, and update user transparency materials to cover remote processing of viewing activity. |

### 5. Logging and Audit Trails
| Item | Details |
| --- | --- |
| Description | HTTP request logging records client IPs via Morgan, with anonymization disabled by default. Client-side error reporting accepts user agent strings, stack traces, and optional usernames. Dedicated audit logs capture user identifiers plus object metadata for CRUD actions, while debug endpoints expose the requester’s IP. 【F:server/server.ts†L176-L191】【F:config/default.yaml†L236-L254】【F:server/core/controllers/api/server/logs.ts†L20-L61】【F:server/core/helpers/audit-logger.ts†L35-L99】【F:server/core/controllers/api/server/debug.ts†L30-L78】 |
| Risks | Broad log collection elevates breach impact and may include special-category data if stack traces or audit payloads capture user content. Lack of enforced retention or IP anonymization settings can contravene data minimization obligations. |
| Recommendations | Enable IP anonymization where feasible, set retention and access policies for log archives, and review audit log scopes to ensure only necessary attributes are retained. Document debug endpoint usage and protect it through administrative controls. |

### 6. Contact and Support Channels
| Item | Details |
| --- | --- |
| Description | Contact submissions are rate-limited by hashing requester IPs in Redis, and duplicate attempts trigger log entries containing the raw IP. The stored payload forwards names, email addresses, and message bodies to administrators via the job queue. 【F:server/core/middlewares/validators/server.ts†L40-L68】【F:server/core/lib/redis.ts†L183-L201】【F:server/core/lib/redis.ts†L360-L399】【F:server/core/lib/emailer.ts†L200-L222】 |
| Risks | Even hashed IP keys may be subject to privacy regulation, while plain-text logging of duplicate submissions discloses addresses to staff. Contact messages can contain unstructured personal data requiring careful handling and retention discipline. |
| Recommendations | Suppress IP values in informational logs, set explicit expiration for contact-related Redis keys and email archives, and notify users of message handling practices. Consider providing secure messaging guidance to discourage submission of sensitive data. |

### 7. Peer-to-Peer Distribution and Tracker
| Item | Details |
| --- | --- |
| Description | The bundled BitTorrent tracker maintains in-memory counters of announcing peers keyed by IP and infohash, blocks excessive requests, and logs abnormal activity. Tracker functionality is enabled and private by default. 【F:server/core/controllers/tracker.ts†L15-L139】【F:config/default.yaml†L345-L353】 |
| Risks | Serving as a tracker necessitates exposure of end-user IP addresses to any participants in a swarm, which may create additional disclosure obligations. In-memory counters and warnings can surface IPs in administrative logs. |
| Recommendations | Publish tracker data handling policies, allow administrators to disable or externalize the tracker where jurisdictionally required, and review logging to minimize unnecessary IP visibility. |

### 8. Client Cookies and Preferences
| Item | Details |
| --- | --- |
| Description | PeerTube sets a `clientLanguage` cookie for three months to remember user locale preferences, using `SameSite=None` and the `Secure` flag. Cookie parsing is enabled globally for server routes. 【F:server/core/helpers/i18n.ts†L83-L93】【F:server/server.ts†L248-L256】 |
| Risks | Although low-risk, the cookie persists across embedded contexts due to `SameSite=None`, which may require disclosure under cookie consent regulations depending on jurisdiction. |
| Recommendations | Ensure consent banners or privacy notices describe this preference cookie, and evaluate whether a shorter lifespan aligns better with data minimization norms. |

### 9. Telemetry and External Service Calls
| Item | Details |
| --- | --- |
| Description | Configuration defaults permit optional OpenTelemetry metrics export via a Prometheus endpoint, GeoIP database downloads from external hosts, plugin catalogue lookups against `packages.joinpeertube.org`, and version checks from `joinpeertube.org`. The GeoIP helper retrieves databases over HTTP(S) and enriches viewer data with resulting geolocation info. 【F:config/default.yaml†L236-L446】【F:server/core/helpers/geo-ip.ts†L21-L117】【F:server/core/lib/opentelemetry/metrics.ts†L24-L70】 |
| Risks | Contacting external services may transfer IP addresses or operational metadata outside the operator's jurisdiction. GeoIP enrichment adds inferred location data that can be inaccurate yet treated as personal data, and telemetry exports could leak identifiers if not scoped carefully. |
| Recommendations | Review data processing agreements with external providers, allow administrators to disable outbound checks when policy requires, and document the nature of telemetry/GeoIP data in privacy notices. Apply IP filtering or proxying where necessary to comply with localisation rules. |

### 10. Plugin Ecosystem and Extensibility
| Item | Details |
| --- | --- |
| Description | Core services invoke plugin hooks with contextual data such as requester IP addresses and signup eligibility, enabling third-party extensions to inspect or modify flows. The server configuration manager explicitly shares requester IPs when assessing signup permissions. 【F:server/core/controllers/api/users/token.ts†L87-L117】【F:server/core/lib/server-config-manager.ts†L426-L452】 |
| Risks | Plugins effectively act with server-level privileges, so poorly governed extensions could exfiltrate personal data or weaken compliance commitments without upstream visibility. |
| Recommendations | Maintain a curated plugin list, require due diligence before deployment, and log plugin access to sensitive hooks. Communicate to administrators that enabling plugins may expand their controller responsibilities under privacy law. |

## Overall Recommendations
1. **Governance:** Establish formal policies covering retention, access control, and data-sharing with federated peers, plugins, and third-party services. Regularly review configuration defaults against local regulatory requirements.
2. **Transparency:** Update privacy notices to explain federation behaviour, analytics tracking, cookie usage, tracker operation, and involvement of external services so users can make informed choices.
3. **User Controls:** Offer toggles for view history, analytics sharing, and contact with external services where possible, and document how to exercise access/erasure rights across federated environments.
4. **Security:** Limit exposure of raw IP addresses in logs, enforce least privilege for administrators, and audit plugin activities to detect anomalous data access.
