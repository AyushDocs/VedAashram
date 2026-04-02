This is the complete, comprehensive master document for your Hospital Operating System. It integrates every detail from our discussion—from core basics to high-end competitive differentiators.

***

# Comprehensive Product Requirements Document: Hospital Operating System (HOS)

## 1. Core Domain Entities (The Data Backbone)
These are the non-negotiable data structures required for any hospital operation.

### 1.1 Patient Management
- [x] **Patient Profile (MRN):** Unique Medical Record Number generation. (Implemented VA-YYYY-XXXX logic)
- [x] **Demographics:** Name, age, gender, contact, address, national ID.
- [x] **Clinical Summary:** Blood group, allergies (drug/food/environment), chronic conditions.
- [x] **History:** Past medical history, surgical history, family history.
- [x] **Patient Tags:** High-risk, VIP, Frequent admission, etc.

### 1.2 Staff & Role-Based Access Control (RBAC)
- [x] **Profiles:** Name, credentials, specialization, department.
- [x] **Roles:** Doctor, Nurse, Admin, Technician, Pharmacist, Receptionist, Accountant.
- [x] **Schedules:** Shift timing, availability slots, leave management.
- [x] **Permissions:** View-only vs. Edit-rights for medical records and billing.

### 1.3 Facility & Resource Registry
- [x] **Ward Management:** Ward name, type (General, ICU, NICU, Emergency, Isolation).
- [x] **Room & Bed Mapping:** Room numbers, bed IDs, real-time occupancy status.
- [x] **Equipment/Machine Inventory:** Ventilators, ECG, Defibrillators, Syringe pumps (with ID and status).
- [x] **Asset Assignment:** Real-time tracking of which patient is using which machine.

---

## 2. Clinical Workflows & User Modules

### 2.1 The Patient Lifecycle
- [x] **Registration:** Walk-in or pre-booked appointment.
- [x] **OPD (Outpatient):** Consultation, vitals check, prescription, follow-up.
- [x] **IPD (Inpatient):** Admission, bed allocation, daily rounds, treatment plan, discharge.
- [x] **Emergency:** Fast-track registration, immediate bed assignment, triage level coding.

### 2.2 Doctor Workflow
- [x] **Consultation Dashboard:** View assigned patients, history, and current vitals.
- [x] **E-Prescribing:** Drug database, dosage, frequency, duration, and instructions.
- [ ] **Order Management:** Place orders for lab tests, radiology, or nursing procedures.
- [x] **Diagnosis Logging:** Primary and secondary diagnoses.

### 2.3 Nurse Workflow
- [x] **Vitals Monitoring:** Time-series logging of BP, HR, Temp, SpO2, Respiratory Rate.
- [ ] **MAR (Medication Administration Record):** Track what was prescribed vs. what was given (and when).
- [ ] **Care Plans:** Checklist of nursing tasks per patient.
- [x] **Handover Notes:** Shift-to-shift communication logs.

---

## 3. Medical Records & Clinical Standards

### 3.1 Electronic Health Record (EHR)
- [x] **Clinical Notes:** SOAP (Subjective, Objective, Assessment, Plan) format.
- [ ] **Structured Templates:** Department-specific forms (e.g., Cardiology vs. Pediatrics).
- [ ] **Document Management:** Uploading external scans, old reports, or consent forms.

### 3.2 Clinical Coding & Decision Support
- [ ] **ICD-10/11 Integration:** Searchable database for standardized diagnosis.
- [ ] **CPT Codes:** For standardized procedure recording.
- [ ] **Clinical Decision Support (CDS):** Drug-drug interaction alerts and allergy warnings during prescribing.

---

## 4. Operational & Financial Modules

### 4.1 Hospital-Grade Billing
- [x] **Automated Charge Capture:** Every consultation, bed day, and test automatically flows to the bill.
- [ ] **Package Management:** Fixed-cost surgery bundles or wellness packages.
- [ ] **Insurance Management:** Pre-authorization tracking, claim submission, TPA settlement.
- [x] **Payment Handling:** Cash, card, UPI, and split-payment (Insurance + Cash).

### 4.2 Pharmacy Management
- [x] **Inventory Control:** Batch tracking, expiry alerts, re-order level triggers.
- [x] **Dispensing Workflow:** Prescription verification and barcode-based dispensing.
- [ ] **Supplier Management:** Purchase orders and goods received notes (GRN).

### 4.3 Laboratory & Radiology (LIS/RIS)
- [x] **Test Lifecycle:** Sample collection → Lab processing → Result entry → Verification.
- [x] **Reference Ranges:** Age and gender-specific normal/abnormal flagging. (Implemented via JSON schema metadata)
- [ ] **Imaging Integration:** Link to PACS viewers or DICOM file attachments.

---

## 5. Advanced Differentiators (The "Stand-Out" Features)

### 5.1 Clinical Intelligence Layer
- [ ] **Early Warning Scores (EWS):** Automated NEWS2 or PEWS scores to detect patient deterioration.
- [ ] **Sepsis Alert System:** Screening vitals and labs for early sepsis indicators.
- [ ] **Clinical Timeline Reasoning:** Correlation engine (e.g., "Show BP changes relative to Drug X administration").

### 5.2 Voice-to-Structured EHR
- [ ] **Voice Dictation:** Ambient or direct speech-to-text for doctors.
- [ ] **AI Entity Extraction:** Converting natural speech into structured prescriptions and notes.
- [ ] **Human-in-the-loop:** Doctor verification before finalized commit.

### 5.3 Workflow Automation Engine
- [x] **Event-Triggered Tasks:** (e.g., "If patient is discharged, notify Cleaning Staff to prep Bed 4").
- [x] **Automatic Escalation:** (e.g., "If a STAT lab order is not fulfilled in 30 mins, alert the Lab Manager").
- [x] **Smart Resource Routing:** Automated bed/machine allocation based on clinical severity.

### 5.4 Digital Twin & Operational Ops
- [x] **Real-time Command Center:** Live heatmaps of bed occupancy, staff load, and equipment usage.
- [ ] **Predictive Capacity Planning:** Forecasting peak ER times or discharge bottlenecks.
- [ ] **Simulated Load Testing:** Testing "what-if" scenarios for hospital resources.

---

## 6. Connectivity & Interoperability

### 6.1 Standards & Integration
- [x] **HL7 FHIR Support:** Export/Import patient data in standard JSON resources.
- [x] **API First Architecture:** Secure REST/GraphQL endpoints for third-party integrations.
- [ ] **Device Integration:** Direct data pull from ICU monitors or ventilators (IoT).

### 6.2 Patient Engagement
- [x] **Patient Portal:** Access to reports, bills, and appointment history.
- [ ] **Omnichannel Notifications:** WhatsApp, SMS, and Email for reminders and results.
- [ ] **Remote Monitoring:** Basic post-discharge health tracking via mobile app.

---

## 7. System Architecture & Non-Functional Requirements

### 7.1 Performance & Reliability
- [ ] **Sub-200ms Latency:** For all core clinical data entry screens.
- [ ] **Offline-First / Edge Sync:** Local server operation during internet outages with auto-sync.
- [ ] **High Availability:** Database replication and automated failover.

### 7.2 Security & Compliance
- [ ] **Audit Trail:** Immutable logs of every record view, edit, or deletion.
- [x] **Data Encryption:** AES-256 for data at rest; TLS 1.3 for data in transit.
- [ ] **Multi-Tenant Support:** Manage multiple hospital branches with data isolation.
- [x] **Privacy Controls:** Masking sensitive patient data (HIV status, Psych notes) based on specific permissions. (Handled via Sanjeevni Secure Bridge Protocol)

### 7.3 UI/UX Priorities
- [x] **Minimal Click Path:** Focus on speed for doctors (maximum 3 clicks for common actions).
- [x] **Dark Mode / High Contrast:** For night-shift nurses.
- [x] **Multi-Device Support:** Seamless experience on Desktop, Tablet, and Mobile. (Responsive Layout)

---

## 8. Verification & Validation Strategy
- [ ] **Clinical Safety Test:** Attempt to prescribe a drug with a recorded allergy (must block).
- [ ] **Concurrency Test:** Two nurses updating vitals on the same patient simultaneously (must handle merge).
- [ ] **Financial Integrity Test:** Ensure total billing matches the sum of individual service entries.
- [ ] **Disaster Recovery Test:** Kill the database and restore from backup within a 15-minute RTO.
- [ ] **Audit Test:** Verify that an admin cannot delete their own access logs.

---

## 9. Implementation Roadmap Priority
1.  [x] **Phase 1 (MVP):** Registration, OPD/IPD, Basic EHR, Billing, RBAC.
2.  [x] **Phase 2 (Standard):** Pharmacy, Lab, Inventory, ICD-10, MAR, Insurance.
3.  [ ] **Phase 3 (Stand-Out):** EWS Alerts, Voice-to-EHR, Automation Engine, FHIR Interop, Digital Twin.