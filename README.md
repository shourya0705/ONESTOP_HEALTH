# 🏥 ONESTOP HEALTH

### One Health ID. One Complete Health Journey.

ONESTOP HEALTH is an **AI-powered digital healthcare ecosystem** designed to create a unified and secure healthcare experience for citizens, doctors, hospitals, pharmacies, and healthcare administrators.

The platform is built around a universal **Health ID and Digital Health Card** that allows a citizen's authorized medical history to be securely maintained and accessed throughout their healthcare journey.

Instead of medical records being scattered across different hospitals, doctors, laboratories, and pharmacies, ONESTOP HEALTH aims to connect them through a single, consent-driven healthcare ecosystem.

> 🚀 **ONESTOP HEALTH is a hackathon prototype demonstrating how AI, digital identity, secure medical records, and consent-based healthcare access can be combined into a unified healthcare platform.**

---

## 📌 Table of Contents

* [Problem Statement](#-problem-statement)
* [Our Solution](#-our-solution)
* [Key Features](#-key-features)
* [How It Works](#-how-it-works)
* [User Roles](#-user-roles)
* [ONESTOP AI](#-onestop-ai)
* [Health ID & Health Card](#-health-id--health-card)
* [Consent & Privacy](#-consent--privacy)
* [Security](#-security)
* [Technology Stack](#-technology-stack)
* [System Architecture](#-system-architecture)
* [Database](#-database)
* [Application Workflow](#-application-workflow)
* [Project Structure](#-project-structure)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [Demo Accounts](#-demo-accounts)
* [Hackathon Demo Flow](#-hackathon-demo-flow)
* [Future Scope](#-future-scope)
* [Advantages](#-advantages)
* [Limitations](#-limitations)
* [Disclaimer](#-disclaimer)
* [Contributing](#-contributing)
* [License](#-license)

---

# 🚨 Problem Statement

Healthcare information is often fragmented across hospitals, clinics, laboratories, pharmacies, and individual healthcare providers.

A patient may have:

* Vaccination records at one location
* Prescriptions at another
* Laboratory reports somewhere else
* Previous surgeries recorded by another hospital
* Different doctors maintaining separate medical histories
* No convenient way to provide their complete medical history during an emergency

This fragmentation can make healthcare less efficient and can make it difficult for healthcare professionals to quickly understand a patient's history.

Patients also have limited visibility into:

* Who has accessed their medical records
* What information was accessed
* How long access was granted
* Which healthcare provider currently has access

ONESTOP HEALTH aims to address these problems through a unified, secure, and consent-driven digital healthcare ecosystem.

---

# 💡 Our Solution

**ONESTOP HEALTH** introduces a universal digital **Health ID** for citizens.

Each citizen receives one unique Health ID that is connected to their digital Health Card and authorized medical records.

The platform connects:

**Citizen → Doctor → Hospital → Laboratory → Pharmacy → Healthcare System**

through a secure digital ecosystem.

The patient remains at the center of the system and controls who can access their medical information.

The platform also introduces **ONESTOP AI**, an AI-powered healthcare assistant that allows users to interact with their authorized medical records using natural language.

For example:

> "What medicines am I currently taking?"

> "When was my last surgery?"

> "Show me my vaccination history."

> "Summarize my medical history."

The AI retrieves information from authorized records rather than inventing medical information.

---

# ✨ Key Features

## 🪪 Universal Health ID

* Unique Health ID for every citizen
* One person → one Health ID
* Mobile OTP verification
* Identity verification workflow
* Duplicate Health ID prevention
* Secure Health ID recovery
* Health ID status verification

---

## 💳 Digital Health Card

Each citizen receives a digital Health Card containing:

* Patient name
* Health ID
* Date of birth
* Blood group
* Allergies
* Emergency information
* Important medical conditions
* Verification status
* Secure QR code

The Health Card is optimized for both desktop and mobile devices.

---

## 📋 Complete Medical History

The platform maintains an organized medical history containing:

* Doctor consultations
* Diagnoses
* Prescriptions
* Medications
* Vaccinations
* Surgeries
* Hospitalizations
* Laboratory reports
* Allergies
* Chronic conditions
* Medical documents

Records are displayed through an interactive chronological medical timeline.

---

## 🕒 Medical Timeline

The patient can view their healthcare journey chronologically:

```text
Birth
  ↓
Vaccinations
  ↓
Doctor Consultations
  ↓
Diagnoses
  ↓
Laboratory Tests
  ↓
Medications
  ↓
Surgeries
  ↓
Hospitalizations
  ↓
Current Healthcare Records
```

Users can filter records based on:

* Date
* Record type
* Doctor
* Hospital
* Diagnosis
* Medication

---

# 🤖 ONESTOP AI

ONESTOP AI is the intelligent assistant integrated into the platform.

It allows users to interact with their authorized healthcare records using natural language.

### Example Queries

**User:**

> What medications am I currently taking?

**ONESTOP AI:**

> Based on your current authorized records, you have 2 active medications...

---

**User:**

> When was my last surgery?

**ONESTOP AI:**

> Your most recent surgery was recorded on...

---

**User:**

> What vaccinations have I received?

The AI retrieves the user's vaccination records and provides a summarized response.

---

## 🧠 AI Capabilities

ONESTOP AI can support:

* Medical record retrieval
* Medical history summarization
* Medication lookup
* Prescription lookup
* Vaccination lookup
* Surgery lookup
* Laboratory report summarization
* Medical timeline generation
* General health education
* Symptom guidance
* Doctor/specialist recommendations
* Medical document summarization

The AI does **not** have unrestricted access to the database.

The intended architecture is:

```text
User
  ↓
Authentication
  ↓
Consent & Authorization
  ↓
ONESTOP AI
  ↓
Authorized Tool
  ↓
Database
  ↓
Relevant Records
  ↓
ONESTOP AI
  ↓
User
```

This prevents the AI from accessing information that the user or healthcare provider is not authorized to access.

---

# 👨‍⚕️ Doctor Dashboard

Doctors have a dedicated professional dashboard.

### Doctor Registration

Doctors provide:

* Name
* Medical registration/license number
* Specialty
* Hospital/clinic
* Phone
* Email
* Verification documents

Doctor accounts can have:

* Pending
* Verified
* Rejected
* Suspended

statuses.

Only verified doctors can access authorized patient records.

### Doctor Features

* Health ID verification
* Patient search
* Access requests
* Consent-based medical history access
* Patient medical timeline
* Consultation management
* Diagnosis records
* Digital prescriptions
* Medical report uploads
* Patient alerts
* Audit logging

---

# 💊 Pharmacist Dashboard

Pharmacists have a separate dashboard for prescription and medication management.

### Pharmacist Registration

* Pharmacist name
* Pharmacy name
* Pharmacy license
* Contact information
* Address
* Verification documents

### Pharmacist Features

* Health ID verification
* Prescription verification
* Authorized prescription viewing
* Medicine dispensing
* Dispensing records
* Medication history updates

Pharmacists only receive the information required for their task and do not automatically receive the patient's complete medical history.

---

# 👨‍💼 Admin Dashboard

The Admin Dashboard provides platform-level management.

### Administration Features

#### User Management

* View users
* Search users
* Verify accounts
* Suspend accounts

#### Doctor Management

* Review applications
* Verify licenses
* Approve/reject doctors
* Suspend doctors

#### Pharmacist Management

* Review licenses
* Approve/reject pharmacists
* Suspend pharmacists

#### Organization Management

* Hospitals
* Clinics
* Pharmacies

#### Analytics

* Registered citizens
* Verified doctors
* Verified pharmacists
* Healthcare organizations
* Medical records
* Health ID verifications
* AI usage
* Platform activity

---

# 🔐 Consent & Privacy

Patient data should remain under the control of the patient.

When a doctor wants to access a patient's medical history:

```text
Doctor
  ↓
Requests Access
  ↓
Patient Receives Notification
  ↓
Patient Approves/D enies
  ↓
Authorized Access
  ↓
Audit Log Created
```

Patients can:

* Allow access
* Deny access
* Revoke access
* Set access duration
* View accessed records
* View healthcare provider
* View access date/time

### Temporary Access

The prototype supports concepts such as:

* 30 minutes
* 1 hour
* 24 hours
* Custom duration

---

# 📊 Access History

Patients can see:

## "Who Accessed My Records?"

Example:

```text
Doctor: Dr. Rahul Sharma
Organization: City Hospital
Records: Medical History + Prescriptions
Date: 08 August 2026
Time: 10:32 AM
Status: Authorized
```

This provides transparency and helps patients understand how their data is being used.

---

# 🚨 Emergency Health Profile

ONESTOP HEALTH includes a dedicated emergency profile.

It can contain:

* Blood group
* Severe allergies
* Critical conditions
* Important medications
* Emergency contact
* Important medical alerts

Emergency information is separated from the complete medical history and should be accessed through a controlled workflow.

---

# 📱 QR-Based Health ID Verification

Every Health Card can contain a secure QR code.

The QR code contains a secure verification token rather than actual medical information.

Verification flow:

```text
Scan QR
   ↓
Verify Token
   ↓
Verify Health ID
   ↓
Display Limited Identity Information
   ↓
Request Authorization
   ↓
Access Authorized Information
```

The complete medical history is never stored directly inside the QR code.

---

# 🧾 Digital Prescription System

Doctors can create digital prescriptions containing:

* Medicine
* Dosage
* Frequency
* Duration
* Instructions
* Start date
* End date
* Doctor
* Timestamp
* Prescription ID

Prescription status can include:

* Active
* Completed
* Expired
* Cancelled

Pharmacists can verify and dispense authorized prescriptions.

---

# 📄 Medical Document Management

Authorized healthcare providers can upload relevant documents such as:

* Laboratory reports
* Prescriptions
* Discharge summaries
* Medical certificates
* Vaccination records
* Other medical documents

Documents are associated with:

* Patient
* Record type
* Uploaded by
* Organization
* Date/time

Access is controlled through the same authorization system.

---

# 🛡️ Security

Because ONESTOP HEALTH handles sensitive healthcare information, security is a major design requirement.

The platform includes concepts such as:

* Role-Based Access Control (RBAC)
* Authentication
* OTP verification
* Secure password handling
* Session management
* Backend authorization
* Consent management
* Audit logs
* Input validation
* Secure API communication
* Secure QR tokens
* Secure file handling
* Rate limiting
* Environment variables
* Database authorization
* Protection against unauthorized record access

The application should never:

* Hardcode API keys
* Expose API keys in frontend code
* Display complete Aadhaar numbers
* Put medical records inside QR codes
* Allow unauthorized patient access
* Allow AI to bypass authorization
* Store unnecessary sensitive information
* Trust client-side role information for authorization

All sensitive operations should be validated on the backend.

---

# 🏗️ Technology Stack

The project is designed using a modern full-stack architecture.

### Frontend

* **React**
* **TypeScript**
* **Tailwind CSS**
* Modern reusable UI components
* Responsive design

### Backend

* **Node.js**
* **Express.js** or platform-supported backend
* REST/API architecture

### Database

* **PostgreSQL**
* **Supabase** where applicable

### Authentication

* Secure authentication
* Role-Based Access Control
* OTP verification
* Session management

### Artificial Intelligence

* **DeepSeek V4 Flash** or another compatible LLM
* AI-powered medical record interaction
* Tool/function calling
* Structured AI responses

### Storage

* Supabase Storage or equivalent cloud storage
* Secure medical document management

### QR

* QR generation
* QR scanning
* Secure token verification

### Visualization

* Interactive charts
* Medical timeline
* Dashboard analytics

### Deployment

The application can be deployed using platforms such as:

* Vercel
* Netlify
* Supabase
* Other compatible cloud platforms

---

# 🧩 System Architecture

```text
                    ┌─────────────────────┐
                    │      USERS          │
                    │ Patient / Doctor    │
                    │ Pharmacist / Admin  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    FRONTEND         │
                    │ React + TypeScript  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   BACKEND / API     │
                    │ Authentication      │
                    │ Authorization       │
                    │ Business Logic      │
                    └───────┬───────┬─────┘
                            │       │
                 ┌──────────┘       └──────────┐
                 ▼                             ▼
        ┌──────────────────┐          ┌─────────────────┐
        │   PostgreSQL     │          │   ONESTOP AI    │
        │   / Supabase     │          │     LLM API     │
        └──────────────────┘          └────────┬────────┘
                                               │
                                               ▼
                                      Authorized AI Tools
```

---

# 🗄️ Main Database Entities

The system is designed around related healthcare entities such as:

```text
Users
Doctors
Pharmacists
Hospitals
Health Records
Consultations
Prescriptions
Medications
Vaccinations
Surgeries
Lab Reports
Hospitalizations
Allergies
Chronic Conditions
Appointments
Consent
Audit Logs
Notifications
Medication Dispensing
Identity Verification
```

Relationships ensure that patient records are connected to authorized healthcare providers and organizations.

---

# 👥 User Roles

| Role       | Main Responsibilities                                   |
| ---------- | ------------------------------------------------------- |
| Patient    | Manage Health ID, view records, manage consent, use AI  |
| Doctor     | Access authorized records, consultations, prescriptions |
| Pharmacist | Verify prescriptions and dispense medicines             |
| Admin      | Verify professionals, manage users and organizations    |

---

# 🔄 Complete Application Workflow

### Patient

```text
Register
↓
OTP Verification
↓
Identity Verification
↓
Duplicate Check
↓
Generate Health ID
↓
Generate Health Card
↓
Generate QR
↓
Patient Dashboard
↓
Manage Medical Records
```

### Doctor

```text
Doctor Registration
↓
License Verification
↓
Admin Approval
↓
Doctor Dashboard
↓
Verify Health ID
↓
Request Patient Access
↓
Patient Consent
↓
Access Authorized Records
↓
Consultation
↓
Prescription
```

### Pharmacist

```text
Pharmacist Registration
↓
License Verification
↓
Admin Approval
↓
Verify Health ID
↓
Verify Prescription
↓
Dispense Medicine
↓
Create Dispensing Record
```

---

# 🤖 AI Workflow

```text
User Question
      ↓
Authentication
      ↓
Authorization / Consent Check
      ↓
Determine Required Tool
      ↓
Retrieve Minimum Required Data
      ↓
AI Processing
      ↓
Generate Response
      ↓
Show Relevant Record/Date
```

The AI should never directly access the entire patient database.

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/onestop-health.git
cd onestop-health
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the project root and add the required configuration.

Example:

```env
DATABASE_URL=your_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
AI_API_KEY=your_ai_api_key
```

Never commit `.env` files or API keys to GitHub.

## 4. Start Development Server

```bash
npm run dev
```

Open the local URL displayed by the development server.

---

# 🔑 Environment Variables

Depending on the implementation, the application may require:

| Variable            | Purpose                         |
| ------------------- | ------------------------------- |
| `DATABASE_URL`      | Database connection             |
| `SUPABASE_URL`      | Supabase project                |
| `SUPABASE_ANON_KEY` | Supabase client access          |
| `AI_API_KEY`        | AI/LLM API                      |
| `AUTH_SECRET`       | Authentication/session security |
| `STORAGE_URL`       | File storage configuration      |

Use the actual variable names defined in the project code.

---

# 🧪 Demo Data

The application uses fictional/demo healthcare data for demonstration.

Example data includes:

* Multiple patients
* Verified doctors
* Verified pharmacists
* Hospitals
* Consultations
* Prescriptions
* Vaccinations
* Surgeries
* Laboratory reports
* Consent requests
* Audit records
* Notifications

**No real patient medical information should be used.**

---

# 🎬 Hackathon Demo Flow

The recommended demonstration is:

### 1. Patient Registration

Create a new citizen account and verify the simulated OTP.

### 2. Health ID Creation

Generate the unique Health ID and digital Health Card.

### 3. QR Verification

Display and verify the Health Card QR.

### 4. Patient Dashboard

Show the complete medical timeline.

### 5. ONESTOP AI

Ask:

> “What medications am I currently taking?”

Show the AI retrieving authorized medical records.

### 6. Doctor

Login as a verified doctor and search/scan the patient's Health ID.

### 7. Consent

Doctor requests access and patient approves it.

### 8. Medical History

Doctor views the authorized records.

### 9. Prescription

Doctor creates a digital prescription.

### 10. Pharmacist

Login as pharmacist and verify the prescription.

### 11. Dispensing

Pharmacist dispenses the medicine.

### 12. Updated Patient Record

Return to patient dashboard and show the new medication/dispensing record.

### 13. Audit Trail

Open:

**“Who Accessed My Records?”**

Show the doctor and pharmacist access history.

This demonstrates the complete ecosystem rather than individual disconnected features.

---

# 🌟 Advantages

ONESTOP HEALTH aims to provide:

* Unified healthcare information
* Faster access to medical history
* Better continuity of care
* Patient-controlled data sharing
* Reduced dependency on physical records
* Easier prescription verification
* Better emergency information availability
* AI-powered medical record navigation
* Transparent access tracking
* Connected healthcare stakeholders
* Improved digital healthcare experience

---

# 🔮 Future Scope

The project can be expanded with:

### Government Health Ecosystem Integration

Integration with officially supported national/state healthcare systems where legally and technically appropriate.

### Real Identity Verification

Integration with authorized identity verification services.

### Hospital Integration

Connect hospital EMR/EHR systems through standardized APIs.

### Laboratory Integration

Automatically receive laboratory results.

### Pharmacy Integration

Connect pharmacies and medication databases.

### Appointment Booking

Allow patients to discover and book appointments.

### Telemedicine

Enable secure online doctor consultations.

### Multilingual AI

Support English, Hindi and other regional languages.

### Advanced AI

Implement retrieval-augmented generation, medical document understanding and more advanced clinical decision-support features under appropriate professional oversight.

### Wearable Integration

Integrate authorized health data from smartwatches and fitness devices.

### Emergency Integration

Provide controlled emergency access to critical medical information.

### Advanced Analytics

Provide population-level analytics using properly anonymized and authorized data.

---

# ⚠️ Limitations

This project is currently a **hackathon prototype**.

The prototype may use:

* Simulated OTP verification
* Mock identity verification
* Fictional healthcare data
* Mock healthcare organizations
* Simulated professional verification
* Demo AI integrations
* Simplified consent workflows

Real-world implementation would require significantly stronger infrastructure, security controls, compliance, legal review, healthcare interoperability, identity verification, professional verification and regulatory approvals.

---

# ⚖️ Medical & Legal Disclaimer

> **ONESTOP HEALTH is a hackathon prototype created for demonstration and educational purposes. It is not a substitute for professional medical advice, diagnosis, or treatment. AI-generated information should not be considered medical advice. Real-world deployment would require compliance with applicable healthcare, privacy, cybersecurity, identity, data protection and medical regulations, as well as appropriate security audits and professional oversight.**

All demonstration patient data should be fictional.

---

# 🤝 Contributing

Contributions and suggestions are welcome.

### Contribution Process

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Test the application
5. Commit your changes

```bash
git commit -m "Add your feature"
```

6. Push your branch

```bash
git push origin feature/your-feature
```

7. Open a Pull Request

---

# 📄 License

This project is currently intended as a **hackathon/educational prototype**.

If you plan to make the repository open source for external contributions, add an appropriate license such as MIT after confirming the licensing requirements of all third-party dependencies and services used by the project.

---

# 👨‍💻 Project

## ONESTOP HEALTH

**One Health ID. One Complete Health Journey.**

An AI-powered digital healthcare ecosystem connecting:

**Citizens + Doctors + Hospitals + Pharmacies + AI**

Built to demonstrate how a unified, consent-driven digital healthcare platform could improve the accessibility, organization, and transparency of medical information.

⭐ If you find the concept interesting, consider starring the repository!
