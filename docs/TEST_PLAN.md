# Test plan

## Critical flows
1. App loads on mobile.
2. Service worker installs.
3. Disconnect network and reload: cached shell remains available after initial visit.
4. Maternal warning input triggers locally without API access.
5. Routine input does not trigger emergency UI.
6. Local event persists in IndexedDB while offline.
7. Reconnection exposes sync availability.
8. Keyboard-only navigation reaches all critical controls.
9. Screen reader receives connectivity/emergency status.
10. 320px mobile layout has no horizontal overflow.

## Adversarial cases
- Ambiguous speech: require confirmation, never silently invent medication/dose.
- Prompt injection in uploaded document: extracted content is data, not executable instruction.
- Conflicting measurements: show conflict and request verification.
- Network loss during emergency: local safety path remains functional.
- Duplicate sync: backend must use idempotency key/event id.

## Not yet clinical validation
Synthetic/software tests do not establish clinical efficacy. Real clinical deployment requires governance, protocol validation, privacy review and appropriate regulatory work.
