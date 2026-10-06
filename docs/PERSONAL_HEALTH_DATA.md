# How AURA builds the personal health picture

With consent and provenance, AURA can combine:
- patient-entered symptoms, symptom diaries and measurements;
- confirmed voice entries;
- home devices/wearables where supported;
- clinician-approved care plans;
- connected EHR/FHIR records;
- lab/diagnostic results;
- medications/allergies from verified records or confirmed entry;
- uploaded documents after extraction + confirmation;
- caregiver input when authorized.

Each datum records source, timestamp and verification state. Patient-generated information complements clinical records; it does not silently overwrite them. Baseline/change detection should prefer verified longitudinal measurements and show provenance to clinicians.
