# AURA release gates

## Hackathon release candidate
- Production build succeeds in CI.
- Deterministic emergency path passes offline unit tests.
- Medication and dose voice entities always require confirmation.
- Service worker and manifest are present.
- No secret/service-role Supabase key exists in client source.
- Health tables use RLS and ownership policies.
- Synthetic data only in demos/tests.
- Accessibility critical path does not rely on color alone.
- Safety limitations are visible in product and README.

## Not equivalent to clinical release
Passing these gates establishes a software/hackathon release candidate, not regulatory approval or clinical efficacy.
