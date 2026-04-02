import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

async function seed() {
  const db = new Database('sqlite.db');
  
  console.log('Seeding secure users...');
  
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedDoctorPassword = await bcrypt.hash('doctor123', 10);
  const hashedPatientPassword = await bcrypt.hash('patient123', 10);
  
  const queries = [
    `DELETE FROM User;`,
    `INSERT INTO User (id, email, password, role) VALUES 
      ('U001', 'admin@vedaashram.com', '${hashedAdminPassword}', 'ADMIN'),
      ('U002', 'ayush@vedaashram.com', '${hashedDoctorPassword}', 'DOCTOR'),
      ('U003', 'patient@vedaashram.com', '${hashedPatientPassword}', 'PATIENT');`
  ];

  for (const query of queries) {
    db.exec(query);
  }

  console.log('User Seed complete!');
  db.close();
}

seed().catch(console.error);
