# Emergency workflow

1. Deterministic local warning rules run without network/LLM.
2. A large accessible warning screen explains that AURA is not diagnosing.
3. If connectivity and explicit location permission are available, query nearby emergency-capable facilities using a supported location provider.
4. Offer calling/navigation using the device/platform. Never hard-code a universal emergency number.
5. Build an Emergency Handoff Card from known data only: symptoms/onset, confirmed measurements, pregnancy status if known, medications/allergies if confirmed, recent relevant events and clinician contact if available.
6. Share/transmit the handoff only with explicit consent and only to a verified receiving integration. Otherwise show it for the patient/caregiver/clinician to read or present.
7. Offline: warning + cached handoff still work; network-dependent lookup/transmission does not pretend to work.

Nearest does not automatically mean clinically appropriate. Facility selection should account for emergency capability, maternity capability where relevant, operating status and jurisdiction-specific referral rules.
