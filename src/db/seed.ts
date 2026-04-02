import { client } from './index';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding VedAashram tactical environment...');
  
  await client.execute('PRAGMA foreign_keys = OFF;');

  const queries = [
    `DELETE FROM AssetAssignment;`,
    `DELETE FROM Equipment;`,
    `DELETE FROM PharmacyInventory;`,
    `DELETE FROM LabResult;`,
    `DELETE FROM LabOrder;`,
    `DELETE FROM Billing;`,
    `DELETE FROM ClinicalNotes;`,
    `DELETE FROM MedicationAdmin;`,
    `DELETE FROM Prescription;`,
    `DELETE FROM Vitals;`,
    `DELETE FROM Appointment;`,
    `DELETE FROM Patient;`,
    `DELETE FROM Bed;`,
    `DELETE FROM Staff;`,
    `DELETE FROM User;`,
    
    // User Table (Auth)
    `INSERT INTO User (id, email, password, role) VALUES 
      ('U1', 'admin@vedaashram.com', '${await bcrypt.hash('admin123', 10)}', 'ADMIN'),
      ('U2', 'ayush@vedaashram.com', '${await bcrypt.hash('doctor123', 10)}', 'DOCTOR'),
      ('U3', 'patient@vedaashram.com', '${await bcrypt.hash('patient123', 10)}', 'PATIENT');`,

    // Staff
    `INSERT INTO Staff (id, name, role, specialty, email, phone, isActive) VALUES 
      ('D001', 'Dr. Ayush', 'DOCTOR', 'Cardiology', 'ayush@vedaashram.com', '9876543210', 1),
      ('D002', 'Dr. Sarah', 'DOCTOR', 'Neurology', 'sarah@vedaashram.com', '9876543211', 1),
      ('N001', 'Nurse Joy', 'NURSE', 'Emergency', 'joy@vedaashram.com', '9876543212', 1);`,
    
    // Beds (Ward: ICU, General, Emergency)
    `INSERT INTO Bed (id, status, ward, floor, room, department, lastCleaned) VALUES 
      ('B-ICU-01', 'OCCUPIED', 'ICU-A', '1st Floor', 'Room 101', 'Critical Care', '2026-04-01T10:00:00Z'),
      ('B-ICU-02', 'AVAILABLE', 'ICU-A', '1st Floor', 'Room 102', 'Critical Care', '2026-04-01T11:00:00Z'),
      ('B-GEN-01', 'AVAILABLE', 'GEN-A', '2nd Floor', 'Room 201', 'General Medicine', '2026-04-01T08:00:00Z'),
      ('B-ER-01', 'AVAILABLE', 'ER-WARD', 'Ground', 'ER-Node 1', 'Emergency', '2026-04-02T08:00:00Z'),
      ('B-ER-02', 'AVAILABLE', 'ER-WARD', 'Ground', 'ER-Node 2', 'Emergency', '2026-04-02T08:30:00Z'),
      ('B-ER-03', 'AVAILABLE', 'ER-WARD', 'Ground', 'ER-Node 3', 'Emergency', '2026-04-02T09:00:00Z'),
      ('B-ER-04', 'AVAILABLE', 'ER-WARD', 'Ground', 'ER-Node 4', 'Emergency', '2026-04-02T09:30:00Z'),
      ('B-ER-05', 'AVAILABLE', 'ER-WARD', 'Ground', 'ER-Node 5', 'Emergency', '2026-04-02T10:00:00Z');`,
      
    // Patients (Emergency & IPD)
    `INSERT INTO Patient (id, mrn, name, age, gender, status, diagnosis, bloodGroup, tags, bedId, admissionDate, isEmergency, triageLevel, arrivalTime) VALUES 
      ('P001', 'VA-2026-0001', 'John Doe', 45, 'Male', 'CRITICAL', 'MI', 'O+', 'HIGH-RISK', 'B-ICU-01', '2026-03-30T14:00:00Z', 0, 1, '2026-03-30T14:00:00Z'),
      ('P-ER-01', 'VA-2026-1001', 'Unnamed Male 01', 30, 'Male', 'CRITICAL', 'Trauma (MVA)', 'AB-', 'ER-URGENT', 'B-ER-01', '2026-04-02T15:00:00Z', 1, 1, '2026-04-02T15:00:00Z'),
      ('P-ER-02', 'VA-2026-1002', 'Sarah Parker', 24, 'Female', 'OBSERVATION', 'Severe Abdominal Pain', 'B+', 'ER-STABLE', 'B-ER-02', '2026-04-02T16:00:00Z', 1, 3, '2026-04-02T16:00:00Z');`,

    // Pharmacy
    `INSERT INTO PharmacyInventory (id, drugName, quantity, unit, batchNumber, expiryDate, reorderLevel) VALUES 
      ('DRUG1', 'Epinephrine', 50, 'amp', 'E-001', '2027-12-31', 10),
      ('DRUG2', 'Atropine', 30, 'amp', 'A-002', '2026-11-20', 5),
      ('DRUG3', 'Normal Saline', 200, 'bag', 'NS-01', '2025-05-15', 50);`,

    // Equipment
    `INSERT INTO Equipment (id, name, type, status, serialNumber, lastMaintenance) VALUES 
      ('EQ-V-01', 'Ventilator Alpha-1', 'VENTILATOR', 'AVAILABLE', 'SN-V1001', '2026-03-01T00:00:00Z'),
      ('EQ-E-01', 'ECG Mobile Node', 'ECG', 'AVAILABLE', 'SN-E2001', '2026-03-15T00:00:00Z'),
      ('EQ-D-01', 'Defib-Tactical', 'DEFIBRILLATOR', 'AVAILABLE', 'SN-D3001', '2026-04-01T00:00:00Z');`
  ];

  for (const query of queries) {
    await client.execute(query);
  }

  await client.execute('PRAGMA foreign_keys = ON;');

  console.log('Tactical seeding complete!');
}

seed().catch(console.error);
