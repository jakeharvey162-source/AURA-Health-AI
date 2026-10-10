# Emergency Guardian — patient safety and judge demonstration

## Emergency story: a patient at home thinks she is in labour

1. The patient notices painful contractions. **AURA does not know this automatically.** She or a caregiver taps the prominent **SOS** action in the AURA app, or reports "I think I am in labour" in the check-in. The latter is flagged locally for prompt clinical advice. Neither is a diagnosis.
2. When SOS is opened, the first action is to use the **phone's emergency dialer**. In the clearly selected **South Africa** setting, the app opens `tel:112` only after a human taps the dialer link. In other regions, the user must enter the verified local number. The OS/user completes the call; AURA does **not** dispatch an ambulance or confirm one has been sent.
3. The patient or caregiver may choose possible labour, bleeding, breathing difficulty, collapse, or other concern. The form prepares a **patient-entered, unverified** note; it does not infer medications, allergies, exact gestational age, clinical urgency, or hospital assignment.
4. Location can be requested **only after the user taps Add my location and grants device permission**. It is displayed in a report; it is not automatically transmitted. If permission, GPS, or connectivity is unavailable, the patient can still call and describe their address.
5. Copy/share controls require an affirmative checkbox. Copying to the clipboard or opening the OS share sheet does **not** constitute successful hospital delivery. The report states explicitly that it was not sent. A person chooses the recipient and checks that the recipient is a legitimate medical provider.
6. Real electronic hospital handoff would require a verified receiving facility/integration, patient consent or another valid legal basis, end-to-end security, minimum-necessary data, a timestamped acknowledgement of receipt, audit logging, and operational/clinical governance. **None of these are claimed in this prototype.** There is no automatic ambulance booking, location tracking in the background, hidden SMS, or push to a hospital.

## Can AURA work from a locked phone?

**Not through this PWA.** A web page cannot promise a button above the OS lockscreen. On supported Android phones, users can configure the device's built-in Emergency SOS to quickly reach emergency services from a locked device. For AURA itself, the SOS control is visible **whenever the web app is open**. Future native integrations might offer user-configured app shortcuts/approved lockscreen functionality, subject to platform policies, permissions, and on-device acceptance testing. Android 14+ restricts full-screen intents; they are not a general lockscreen bypass. Do not pitch this as implemented.

## Judge questions: honest answers

**How does AURA detect panic?** In the present prototype, through explicit patient/caregiver input and deterministic warning signs. It cannot passively detect contractions, read thoughts, recognize fainting, or monitor a locked phone.

**Does pressing SOS automatically call an ambulance?** No. It opens a phone dialer with the emergency number. The user still has to complete the call. No provider dispatch integration exists.

**When is a report sent to the hospital?** Never automatically today. The user may create and manually share a note. AURA displays *not sent* rather than fabricating a receipt. A real medical integration would need verified recipient, applicable consent/legal basis, secure sending, audit trail and delivery acknowledgement.

**What happens with no internet?** Client-side warning rules and the UI can work if the PWA was previously installed/cached, but placing an emergency call depends on the phone/mobile emergency network; the hospital does not receive a report from AURA without an actual connection/integration.

**Is this clinically approved?** No. This is a prototype with deterministic demonstration rules, not a medical device or clinician substitute. Use only fictional patient information in demonstrations.

## Test cases

- Immediate SOS visible before logging in; tested on 390px and 1365px viewport sizes
- The country selector never presents South Africa's number as universal
- User-mediated dialer action, no programmatic emergency calls
- Possible labour and severe bleeding escalate after being **reported**, not inferred remotely
- Consent required before copying/sharing health data
- No false claim of report delivery or dispatch
- No prior geolocation request; only an explicit click requests geolocation
- Browser navigation/refresh and language-switch tests maintained

Official policy references: [Android full-screen-intent limits](https://source.android.com/docs/core/permissions/fsi-limits), [Google Play policy](https://support.google.com/googleplay/android-developer/answer/13392821), [South African 112 legislation](https://www.gov.za/sites/default/files/gcis_document/201409/b65b-010.pdf), [POPIA special health data](https://popia.co.za/section-32-authorisation-concerning-data-subjects-health-or-sex-life/).
