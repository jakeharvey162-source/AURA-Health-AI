# AURA Health AI

> **ForgeHacks Online 2026 — AI + Healthcare**  
> **Notice changes early. Explain simply. Escalate safely.**

AURA Health AI is an **offline-first, accessible health early-warning and care-continuity platform** that helps patients communicate meaningful health changes between visits and helps clinicians understand who may need attention and why.

AURA is not an autonomous doctor. It combines deterministic safety rules with AI-assisted speech, language, document understanding, summarization, confidence checking and longitudinal signal fusion. High-risk or uncertain information is escalated for human confirmation.

## The problem

Healthcare does not only happen inside a consultation. Symptoms change, medicines are taken, measurements move, test results arrive and patients may misunderstand instructions between visits. Those signals can be fragmented across memory, paper, messages and disconnected systems.

This becomes harder for people facing unreliable internet, language barriers, low digital literacy or disability. AURA is designed around that gap: **what changed since the last interaction, does it matter, and how can the patient and clinician close the loop?**

## Target users

- Patients managing health changes between appointments
- Pregnant and postpartum patients
- People in low-connectivity or rural environments
- Patients who prefer voice, simple language or multilingual interaction
- Clinicians who need concise, prioritized change summaries
- Caregivers supporting patients with permission

## What AURA does

### AURA Guardian
Builds a personal health timeline and focuses on **change from the person's baseline**, not just isolated values.

### Maternal Guardian
Demonstrates pregnancy-to-postpartum continuity using symptoms, measurements, appointments and clinician-approved instructions. Configured warning patterns can activate an urgent pathway without requiring an internet connection or LLM.

### CareBridge
Creates a shared continuity loop:
1. Clinician verifies the care plan.
2. AURA explains it in patient-friendly form.
3. The patient teaches the instructions back.
4. AURA detects mismatches or uncertainty.
5. Clinician remains the authority for clinical decisions.

### Emergency handoff
When a configured warning pattern is triggered, AURA leaves the normal conversational flow and prepares a concise handoff containing relevant patient-entered/connected information for clinical verification.

### Clinician Command Center
Prioritizes meaningful changes and explains **why** a patient was surfaced rather than presenting an unstructured message inbox.

### Universal access
AURA is designed around voice + text, large touch targets, keyboard navigation, screen-reader status, high contrast, reduced-motion support, simple-language interaction, multilingual/code-switched speech handling and offline operation.

## How AI is meaningfully used

AURA is intentionally more than a chatbot wrapper.

AI-capable layers include:
- speech transcription and multilingual/code-switched input
- medical entity extraction
- document understanding
- patient-friendly simplification
- timeline extraction and summarization
- longitudinal signal fusion
- confidence/ambiguity detection
- clinician-facing change summaries
- teach-back comparison

**Safety-critical escalation is separated from generative AI.** The first configured emergency decision can run locally and deterministically.

### Voice safety

Speech is treated as an input candidate, not medical truth:

```text
Audio
  ↓
ASR candidate transcript
  ↓
Medical entity extraction
  ↓
Confidence / ambiguity gate
  ↓
Patient confirmation
  ↓
Clinician confirmation where required
  ↓
Structured health event
```

Medication names and doses require explicit confirmation. Low-confidence medical entities are flagged instead of silently corrected. Numbers should be read back with units. Code-switched or unclear speech can fall back to repeat, type, or document capture.

## Offline-first architecture

```text
Patient / Caregiver
       ↓
Accessible PWA
       ↓
On-device safety rules ─────→ Immediate warning / emergency handoff
       ↓
IndexedDB local event queue
       ↓ when connected
Secure sync / Supabase
       ↓
FHIR-shaped health data
       ↓
Clinician Command Center
       ↓
CareBridge confirmation + teach-back
```

The service worker caches the application shell after the first successful load. Patient-entered events can be queued locally in IndexedDB. The critical safety-rule path does not require an LLM or network request.

## Technology

| Layer | Technology / approach |
| --- | --- |
| Frontend | Next.js, React, TypeScript |
| Offline | PWA service worker + IndexedDB |
| Safety logic | Deterministic TypeScript rules |
| Backend-ready | Supabase / PostgreSQL |
| Security | Row Level Security, ownership policies, security headers |
| Interoperability target | FHIR R4-shaped data |
| Synthetic testing | Synthea-compatible FHIR scenarios |
| Speech robustness | African-accent/code-switching benchmark strategy |
| Deployment | Vercel-ready configuration |
| CI | GitHub Actions release gates |

C++/WebAssembly is reserved for future compute-heavy on-device processing **only where profiling proves a measurable latency benefit**. It is deliberately not used for the accessible browser UI.

## Privacy and safety

AURA:
- does **not** diagnose disease
- does **not** prescribe medication
- does **not** tell a patient to stop or change medication
- does **not** replace emergency services or qualified clinicians
- requires confirmation for uncertain critical speech information
- uses RLS-ready data ownership controls
- never requires a Supabase service-role/secret key in the browser
- is tested with synthetic data rather than real PHI for the hackathon

A real clinical deployment would require clinical governance, validated protocols, privacy/security assessment and applicable regulatory review.

## Testing and evidence

The repository includes automated release gates and test documentation.

Current automated gates cover:
- production Next.js build
- local maternal warning-rule behavior
- urgent path without network dependency
- medication confirmation requirement
- dose confirmation requirement
- low-confidence speech confirmation

Additional test plans cover:
- offline reload and event persistence
- sync/idempotency behavior
- low-bandwidth/mobile conditions
- keyboard and screen-reader critical paths
- code-switching and African-accent speech
- ambiguous numbers and medication names
- prompt injection inside uploaded documents
- conflicting measurements
- synthetic longitudinal FHIR patients
- persona-based UX scenarios

See `docs/TEST_PLAN.md`, `docs/VOICE_SAFETY.md`, `docs/TEST_DATA.md`, `docs/RELEASE_GATES.md` and `docs/ARCHITECTURE.md`.

> Passing software and synthetic tests does not equal clinical validation.

## ForgeHacks judging alignment

### Real-World Impact & Relevance
AURA addresses the communication and continuity gap between healthcare interactions, with particular attention to patients facing connectivity, language, literacy or accessibility barriers.

### Technical Implementation & AI Use
AURA combines AI-assisted speech/NLP/document workflows with deterministic safety logic, offline persistence, structured health events, confidence verification and an interoperability path instead of using an LLM as a generic medical chatbot.

### Innovation & Creativity
The core differentiator is the combination of **personal baseline + Guardian change detection + patient/clinician CareBridge + teach-back + offline escalation**.

### Execution & Completeness
The repository contains a responsive PWA, offline architecture, patient and clinician experiences, safety logic, persistence, backend schema, CI tests and deployment configuration.

### Presentation & Communication
The product is intentionally demoable through one clear story: a patient reports a meaningful change, AURA recognizes a configured warning pattern locally, the clinician receives a structured explanation, and CareBridge closes the communication loop.

## Demo flow for judges

1. Open **My Health**.
2. Report: “I have had a severe headache since yesterday and my feet are more swollen.”
3. Enter the demo blood-pressure value.
4. Show AURA's local warning path and that it is not presented as a diagnosis.
5. Save the event locally and explain offline operation.
6. Switch to **Clinician** and show prioritization + reason.
7. Switch to **CareBridge** and demonstrate clinician confirmation + patient teach-back.
8. Open **Access** and explain multilingual/code-switching, screen-reader, high-contrast and low-connectivity design.

## Run locally

Requirements: Node.js 22+.

```bash
npm install
npm test
npm run dev
```

Production check:

```bash
npm run check
```

Then open `http://localhost:3000`.

## Environment

Copy `.env.example` and provide the public Supabase configuration when a dedicated AURA project is connected:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Never expose a Supabase secret/service-role key in client code.

## Repository structure

```text
app/                  Next.js patient/clinician experience
components/           reusable PWA/UI components
lib/                  safety, offline and backend helpers
public/               PWA manifest + service worker
supabase/migrations/  RLS-protected backend schema
tests/                automated safety tests + personas
docs/                 architecture, testing, voice safety and release gates
.github/workflows/    automated CI
```

## ForgeHacks submission checklist

- [x] Project title and clear short description
- [x] Official track identified: **AI + Healthcare**
- [x] Public GitHub source repository
- [x] Problem statement and target users
- [x] Technical approach and components
- [x] Explanation of AI/ML use
- [x] Real-world impact
- [x] Setup and run instructions
- [x] Testing/safety documentation
- [x] Architecture explanation
- [ ] Public deployment URL
- [ ] Final screenshots
- [ ] Public 2–4 minute demo video
- [ ] Final Devpost written submission

## Built for ForgeHacks Online 2026

AURA Health AI was substantially created during the ForgeHacks 2026 event window for the **AI + Healthcare** track.

**Project:** AURA Health AI  
**Track:** AI + Healthcare  
**Mission:** Make meaningful health changes easier to notice, communicate and act on—without replacing the healthcare professional.
