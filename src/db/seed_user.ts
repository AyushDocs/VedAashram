import { client } from './index';
import bcrypt from 'bcryptjs';

async function seed() {
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
    await client.execute(query);
  }

  console.log('User Seed complete!');
}

seed().catch(console.error);
