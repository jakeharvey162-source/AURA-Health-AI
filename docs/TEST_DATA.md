# Realistic test resources

## Synthetic patients
Use Synthea FHIR R4 exports for fictional patient histories. Never present synthetic testing as clinical validation.

## Speech robustness
Benchmark transcription against AfriSpeech-Dialog / AfriSpeech-200 where licensing and access permit. Measure WER plus **critical medical entity error rate** for medication names, doses, symptoms and measurements.

## Persona UX
Run browser-based persona tests against the deployed/local app using personas in tests/personas.yaml. Capture completion, time-to-action, confusion points, inaccessible controls and emergency-path failures.

## FHIR conformance
When the FHIR backend is connected, use Inferno test kits for standards conformance.

## Release gates
- Emergency rule path works without network or LLM.
- No medication/dose extracted from speech is accepted without explicit confirmation.
- Low-confidence medical entities are visibly/readably flagged.
- Offline events persist and are idempotently syncable.
- Critical actions are keyboard accessible and do not depend on color.
- Synthetic patient and persona suites pass before demo/release candidate.
