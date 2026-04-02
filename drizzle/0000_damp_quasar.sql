CREATE TABLE `Appointment` (
	`id` text PRIMARY KEY NOT NULL,
	`patientName` text NOT NULL,
	`staffId` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'SCHEDULED' NOT NULL,
	`notes` text,
	FOREIGN KEY (`staffId`) REFERENCES `Staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `AssetAssignment` (
	`id` text PRIMARY KEY NOT NULL,
	`equipmentId` text NOT NULL,
	`patientId` text,
	`assignedBy` text NOT NULL,
	`startTime` text NOT NULL,
	`endTime` text,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	FOREIGN KEY (`equipmentId`) REFERENCES `Equipment`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assignedBy`) REFERENCES `Staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Bed` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'AVAILABLE' NOT NULL,
	`ward` text NOT NULL,
	`floor` text NOT NULL,
	`room` text NOT NULL,
	`department` text NOT NULL,
	`lastCleaned` text
);
--> statement-breakpoint
CREATE TABLE `Billing` (
	`id` text PRIMARY KEY NOT NULL,
	`patientId` text NOT NULL,
	`itemName` text NOT NULL,
	`category` text NOT NULL,
	`amount` real NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ClinicalNotes` (
	`id` text PRIMARY KEY NOT NULL,
	`patientId` text NOT NULL,
	`staffId` text NOT NULL,
	`type` text NOT NULL,
	`icdCode` text,
	`subjective` text,
	`objective` text,
	`assessment` text,
	`plan` text,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`staffId`) REFERENCES `Staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Equipment` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'AVAILABLE' NOT NULL,
	`serialNumber` text,
	`lastMaintenance` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Equipment_serialNumber_unique` ON `Equipment` (`serialNumber`);--> statement-breakpoint
CREATE TABLE `LabOrder` (
	`id` text PRIMARY KEY NOT NULL,
	`patientId` text NOT NULL,
	`staffId` text NOT NULL,
	`testName` text NOT NULL,
	`category` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`notes` text,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`staffId`) REFERENCES `Staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `LabResult` (
	`id` text PRIMARY KEY NOT NULL,
	`orderId` text NOT NULL,
	`resultJson` text NOT NULL,
	`verifiedBy` text,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`orderId`) REFERENCES `LabOrder`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`verifiedBy`) REFERENCES `Staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `MedicationAdmin` (
	`id` text PRIMARY KEY NOT NULL,
	`prescriptionId` text NOT NULL,
	`nurseId` text NOT NULL,
	`administeredAt` text NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`prescriptionId`) REFERENCES `Prescription`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`nurseId`) REFERENCES `Staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Patient` (
	`id` text PRIMARY KEY NOT NULL,
	`mrn` text NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`gender` text NOT NULL,
	`status` text NOT NULL,
	`diagnosis` text,
	`icdCode` text,
	`secondaryIcdCodes` text,
	`bloodGroup` text,
	`allergies` text,
	`chronicConditions` text,
	`tags` text,
	`bedId` text,
	`admissionDate` text,
	`triageLevel` integer,
	`isEmergency` integer DEFAULT false,
	`arrivalTime` text,
	`emergencyContact` text,
	FOREIGN KEY (`bedId`) REFERENCES `Bed`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Patient_mrn_unique` ON `Patient` (`mrn`);--> statement-breakpoint
CREATE TABLE `PharmacyInventory` (
	`id` text PRIMARY KEY NOT NULL,
	`drugName` text NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`unit` text NOT NULL,
	`batchNumber` text,
	`expiryDate` text,
	`reorderLevel` integer DEFAULT 10 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Prescription` (
	`id` text PRIMARY KEY NOT NULL,
	`patientId` text NOT NULL,
	`doctorId` text NOT NULL,
	`drugName` text NOT NULL,
	`dosage` text NOT NULL,
	`frequency` text NOT NULL,
	`route` text NOT NULL,
	`startDate` text NOT NULL,
	`endDate` text,
	`isActive` integer DEFAULT true NOT NULL,
	`notes` text,
	FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`doctorId`) REFERENCES `Staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Shift` (
	`id` text PRIMARY KEY NOT NULL,
	`staffId` text NOT NULL,
	`checkIn` text NOT NULL,
	`checkOut` text,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	FOREIGN KEY (`staffId`) REFERENCES `Staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Staff` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`specialty` text,
	`email` text NOT NULL,
	`phone` text,
	`isActive` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'PATIENT' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Vitals` (
	`id` text PRIMARY KEY NOT NULL,
	`patientId` text NOT NULL,
	`staffId` text NOT NULL,
	`recordedAt` text NOT NULL,
	`heartRate` integer,
	`bpSystolic` integer,
	`bpDiastolic` integer,
	`temp` real,
	`spO2` integer,
	`respiratoryRate` integer,
	`nursingNote` text,
	FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`staffId`) REFERENCES `Staff`(`id`) ON UPDATE no action ON DELETE no action
);
