# AURA architecture

## Offline-first safety path
Patient input → on-device deterministic safety rules → immediate UI escalation → encrypted/local persistence target → queued sync → backend/FHIR → clinician dashboard.

The first safety decision must not require an LLM or network connection. Generative AI augments transcription, document extraction, simplification and summaries when available.

## Performance budget
- No remote fonts in critical path.
- No animation library required for emergency flow.
- Server-rendered/app-shell first paint.
- Lazy-load future heavy medical AI/document modules.
- Service worker caches the shell.
- IndexedDB stores pending events.

## Rural mode
AURA remains launchable after first install/load, stores patient-entered events locally, runs configured warning rules locally, clearly indicates offline state, and queues data for later synchronization. SMS/USSD and facility integration are future transports, not falsely claimed as implemented.

## Safety boundary
AURA is decision support. It does not diagnose, prescribe, alter medication, or replace emergency services. Clinical rules require governance and validation before real-world deployment.
