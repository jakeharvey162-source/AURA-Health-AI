# Voice safety architecture

Speech is an input convenience, never medical truth.

Audio → ASR candidate transcript → medical entity extraction → confidence/ambiguity gate → speaker confirmation → clinician confirmation for care-plan facts → stored structured event.

## Misinterpretation controls
1. Preserve audio/transcript provenance when consent/policy permits.
2. Highlight uncertain words rather than autocorrecting silently.
3. Medication names and doses always require confirmation.
4. Numbers are read back with units.
5. Contradictory values trigger re-entry/repeat.
6. Code-switching is allowed; unsupported/low-confidence segments trigger “say again / type / show document”.
7. Emergency detection can use deterministic confirmed inputs and must not depend solely on generative interpretation.
8. Teach-back compares patient understanding with the clinician-approved plan; it does not invent a new plan.
