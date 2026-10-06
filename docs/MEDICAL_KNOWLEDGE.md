# Medical knowledge and freshness

AURA must not claim to contain all medical knowledge. Clinical content is a versioned, provenance-aware knowledge layer.

## Source priority
1. Local/national health authority and configured clinical protocol for the deployment jurisdiction.
2. WHO SMART Guidelines / Digital Adaptation Kits for supported pathways.
3. Clinician-approved institutional protocols.
4. Peer-reviewed evidence for non-decision-support explanatory context.

Every decision-support artifact should store source, version/publication date, retrieval/update date, jurisdiction and reviewer/approval state. Generative output must abstain when the relevant approved evidence is absent or conflicting.

## Current WHO pathway targets
WHO SMART currently publishes structured digital guidance for domains including antenatal care, postnatal care, pregnancy blood-pressure self-monitoring, HIV, TB, immunization, family planning and other areas. AURA should add domains deliberately rather than pretending universal coverage.

## Hallucination policy
- No fabricated diagnoses, medications, dosages, guidelines, citations or patient facts.
- Evidence required for clinical factual claims.
- “I don't have enough verified information” is a valid and preferred output.
- Patient-entered, document-extracted and speech-extracted facts preserve provenance and verification status.
- Medication/dose facts require confirmation.
- Conflicting sources escalate to clinician review.
- Benchmarks: MedHallu/Med-HALT-style adversarial cases plus AURA-specific patient-history fabrication traps.
