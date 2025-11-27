# OE-Health: Oral e-Health Monitoring Platform

<div align="center">
  <h3>Complete Dental Clinic Record Management System</h3>
  <p>A sophisticated full-stack application enabling patients to store, access, and share their clinical dental data with healthcare providers</p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Business Logic](#business-logic)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

**OE-Health** (Oral e-Health) is a modern, production-ready dental health management platform that digitally transforms dental clinic operations. The system provides:

- **For Patients**: Secure access to complete dental health records, appointment scheduling, and direct communication with healthcare providers
- **For Doctors**: Comprehensive patient management, clinical data recording, appointment tracking, and patient surveys
- **For Clinics**: Multi-clinic support, role-based access control, and complete audit trails

### Project Metadata

- **Product Name**: TeethWallet / OE-Health
- **Version**: 1.0.0
- **Description**: Working to give you a complete, detailed and easy to access and manage in-hand dental clinic record
- **License**: Private
- **Author**: Eliyas Hossain <eliyas.ru1991@gmail.com>

---

## Key Features

### Patient Management
- Complete dental health history and records
- Appointment scheduling and tracking
- Survey-based health assessments
- Access to treatment history by tooth
- Medical history and medication tracking
- Direct messaging with doctors
- Multi-language support (English, Portuguese)

### Clinical Operations
- **Tooth-Level Data**: Individual tooth tracking with treatments and diagnostics
- **Appointment System**: Comprehensive scheduling with priorities, specializations, and durations
- **Survey System**: Conditional questionnaires with decision-tree logic
- **File Management**: Upload X-rays, documents, and clinical images
- **Real-time Notifications**: WebSocket-based alerts and updates
- **Audit Trail**: Complete tracking of who created/modified records and when

### Doctor Features
- Patient roster management
- Clinic management and invitations
- Appointment creation with clinical details
- Survey assignment and review
- Specialization management
- Real-time chat with patients

### Multi-Clinic Support
- Support for multiple clinics/companies
- Role-based access (Patient, Doctor, Admin, Clinic Owner)
- Clinic invitation workflow
- Doctor-patient access requests
- Company-specific data isolation

---

## Technology Stack

### Frontend (Nuxt 3)

**Core Framework**
- **Nuxt 3.0.0** - Meta-framework for Vue 3 with SSR/SSG
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development

**UI & Design**
- **Vuetify 3.0.0** - Material Design components
- **Tailwind CSS 6.1.3** - Utility-first CSS framework
- **Material Design Icons (@mdi/font 7.0.96)** - Icon library
- **Feather Icons** - Minimalist SVG icons

**State & Data**
- **Pinia 0.4.4** - Vue store management
- **Apollo Client (@nuxtjs/apollo 5.0.0-alpha.4)** - GraphQL client
- **VueUse 9.5.0** - Vue composition utilities

**Forms & Validation**
- **Vee-validate 4.7.3** - Form validation
- **Yup 0.32.11** - Schema validation

**Date & Time**
- **date-fns 2.29.3** - Date utilities
- **v-calendar 3.0.0-alpha.8** - Calendar component
- **@vuepic/vue-datepicker 3.6.8** - Date picker

**i18n & UX**
- **@nuxtjs/i18n 8.0.0-beta.4** - Internationalization
- **vue-toastification 2.0.0-rc.5** - Toast notifications
- **vue3-perfect-scrollbar 1.6.1** - Custom scrollbars

**Mobile**
- **Capacitor** - Cross-platform mobile deployment (iOS/Android)

### Backend (Django)

**Core Framework**
- **Django 4.1.3** - Python web framework
- **Python 3.10.8** - Programming language

**GraphQL**
- **Graphene 3.1.1** - GraphQL framework
- **graphene-django 3.0.0** - Django integration
- **graphene-file-upload 1.3.0** - File upload support
- **django-graphql-jwt 0.3.4** - JWT authentication

**Database**
- **PostgreSQL** (psycopg2-binary 2.9.5)
- **Django ORM** - Object-relational mapping

**Authentication**
- **PyJWT 2.6.0** - JSON Web Tokens
- **django-graphql-jwt** - JWT for GraphQL

**Real-time & Async**
- **Channels 4.0.0** - WebSocket support
- **channels-redis 4.0.0** - Redis backend for channels
- **Daphne 4.0.0** - ASGI server
- **Celery 5.2.7** - Distributed task queue
- **Redis 4.3.4** - In-memory data store

**File & Media**
- **Pillow 9.3.0** - Image processing
- **django-versatileimagefield 2.2** - Responsive images

**Utilities**
- **django-filter 22.1** - Queryset filtering
- **django-cors-headers 3.13.0** - CORS support
- **django-countries 7.4.2** - Country field
- **django-import-export 3.0.1** - CSV/Excel support
- **meilisearch 0.22.2** - Fast search engine

**Server & Deployment**
- **Gunicorn 20.1.0** - WSGI server
- **Uvicorn 0.19.0** - ASGI server
- **Docker** - Containerization
- **Nginx** - Reverse proxy

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Web Browser │  │ iOS App      │  │ Android App  │     │
│  │  (Nuxt 3)    │  │ (Capacitor)  │  │ (Capacitor)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                   HTTPS / WebSocket
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Nginx (Reverse Proxy)                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                │
│              ┌─────────────┴─────────────┐                 │
│              │                           │                 │
│  ┌───────────▼──────────┐   ┌───────────▼──────────┐     │
│  │  Nuxt 3 SSR Server   │   │  Django Backend      │     │
│  │  (Node.js)           │   │  (Gunicorn/Daphne)   │     │
│  └──────────────────────┘   └──────────────────────┘     │
│                                        │                    │
│                         ┌──────────────┴──────────────┐    │
│                         │                             │    │
│              ┌──────────▼──────────┐   ┌─────────────▼──┐ │
│              │  GraphQL API        │   │  WebSocket     │ │
│              │  (Graphene)         │   │  (Channels)    │ │
│              └─────────────────────┘   └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
┌───────────────▼──────┐   ┌───────────▼──────────┐
│   PostgreSQL         │   │   Redis              │
│   (Primary Database) │   │   (Cache & Queue)    │
└──────────────────────┘   └──────────────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   Celery Workers    │
                         │   (Async Tasks)     │
                         └─────────────────────┘
```

### Directory Structure

```
oehealth-nuxt-3-graphql/
├── frontend/                 # Nuxt 3 frontend application
│   ├── assets/              # Static assets (CSS, images)
│   ├── components/          # Vue components
│   │   ├── common/         # Shared components
│   │   ├── home/           # Homepage components
│   │   └── question/       # Survey/question components
│   ├── composables/        # Vue composition functions (business logic)
│   │   ├── useAuth.ts
│   │   ├── useAppointment.ts
│   │   ├── useChat.ts
│   │   └── ...
│   ├── layouts/            # Nuxt layouts
│   │   ├── default.vue     # Public pages layout
│   │   └── admin.vue       # Admin/authenticated layout
│   ├── middleware/         # Route guards
│   │   ├── auth.ts
│   │   ├── doctor.ts
│   │   └── patient.ts
│   ├── pages/              # Vue pages (auto-routing)
│   │   ├── index.vue       # Landing page
│   │   ├── start.vue       # Login/signup
│   │   └── admin/          # Admin panel pages
│   ├── plugins/            # Nuxt plugins
│   │   ├── apollo.ts       # GraphQL setup
│   │   ├── vuetify.ts      # UI framework
│   │   └── ...
│   ├── query/              # GraphQL queries/mutations
│   │   ├── auth.ts
│   │   ├── appointment.ts
│   │   ├── survey.ts
│   │   └── ...
│   ├── stores/             # Pinia stores
│   │   ├── auth.ts
│   │   ├── appointment.ts
│   │   ├── chat.ts
│   │   └── ...
│   ├── lang/               # i18n translation files
│   │   ├── en-US.json
│   │   └── pt-PT.json
│   ├── nuxt.config.ts      # Nuxt configuration
│   └── package.json
│
├── backend/                 # Django GraphQL backend
│   ├── apps/               # Django apps
│   │   ├── user/          # User management
│   │   ├── appointment/   # Appointment system
│   │   ├── survey/        # Survey/questionnaire
│   │   ├── chat/          # Messaging system
│   │   ├── notification/  # Notifications
│   │   └── common/        # Shared/reference data
│   ├── config/            # Django settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── schema/            # GraphQL schema
│   │   ├── schema.py      # Root schema
│   │   ├── query.py       # Queries
│   │   └── mutation.py    # Mutations
│   ├── requirements.txt   # Python dependencies
│   └── manage.py
│
├── app/                    # Alternative Quasar-based frontend
│   └── ...
│
├── ansible/               # Infrastructure as Code
│   ├── dev.yml           # Development playbook
│   ├── prod.yml          # Production playbook
│   ├── hosts             # Server inventory
│   └── requirements.yml  # Ansible roles
│
├── docker-compose.yml    # Docker orchestration
└── README.md            # This file
```

---

## Business Logic

### Core Business Workflows

#### 1. User Registration & Onboarding

**Flow:**
```
User enters details → Age check (< 18 = caregiver) → Email verification sent
→ User clicks link → Account activated → Assigned to "Patient" group
→ Can upgrade to Doctor (if age > 22)
```

**Business Rules:**
- Users under 18 require caregiver oversight
- Email verification mandatory
- Default role: Patient
- Doctor upgrade requires age verification

#### 2. Appointment Creation & Management

**Flow:**
```
Doctor selects patient → Choose date/time/duration → Add clinical details
(teeth, diagnosis, treatment) → Set priority & specialization
→ Attach files (optional) → Link surveys (optional)
→ Generate appointment code → Save
```

**Clinical Data Captured:**
- **Teeth**: Individual tooth tracking (numbered dental system)
- **Diagnosis**: Disease/condition identification
- **Treatment**: Treatment plan and procedures
- **Priority**: Urgency level (Low, Medium, High, Emergency)
- **Specialization**: Required specialty (Orthodontics, Endodontics, etc.)
- **Duration**: Appointment length
- **Files**: X-rays, clinical photos, documents

#### 3. Survey & Assessment System

**Flow:**
```
Doctor assigns survey to appointment → Patient views survey
→ Answers questions sequentially → Conditional questions appear/hide
based on answers → All responses recorded → Doctor reviews responses
```

**Features:**
- **Decision Tree Logic**: Questions can be conditional on previous answers
- **Question Types**: Multiple choice, text, rating scales
- **Multi-language**: Surveys available in English and Portuguese
- **Appointment Linking**: Surveys tied to specific appointments

#### 4. Doctor-Patient Connection

**Flow:**
```
Patient searches for doctor → Sends connection request
→ Doctor accepts/declines → If accepted, both can:
  - View appointment history
  - Exchange messages via chat
  - Share clinical data
```

#### 5. Clinic Management

**Flow:**
```
Doctor creates clinic OR joins existing clinic → Invites other doctors
→ Adds patients to clinic → Manages appointments within clinic context
→ Role-based permissions (Owner, Admin, Doctor)
```

**Multi-Clinic Support:**
- Doctors can belong to multiple clinics
- Patients can receive care from multiple clinics
- Data isolation by clinic
- Approval workflow for new members

#### 6. Real-time Communication

**Chat System:**
- One-on-one messaging between connected users
- Real-time delivery via WebSocket
- Message editing and deletion
- User blocking capability

**Notifications:**
- Appointment reminders
- New messages
- Connection requests
- Survey assignments
- Real-time delivery via WebSocket channels

---

## Getting Started

### Prerequisites

**Frontend:**
- Node.js 16+ or 18+
- npm 6.13.4+ or yarn 1.21.1+

**Backend:**
- Python 3.10.8
- PostgreSQL 12+
- Redis 6+

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd oehealth-nuxt-3-graphql
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database, Redis, and email settings

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load initial data (optional)
python manage.py loaddata initial_data.json

# Start development server
python manage.py runserver
```

**Environment Variables (Backend):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/oehealth
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-password

# JWT
JWT_SECRET_KEY=your-jwt-secret
JWT_EXPIRATION_DELTA=7  # days
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Configure environment variables
cp .env.example .env
# Edit .env with your API endpoint

# Start development server
npm run dev
# or
yarn dev
```

**Environment Variables (Frontend):**
```
NUXT_PUBLIC_API_URL=http://localhost:8000/graphql
NUXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

#### 4. Start Services (Development)

**Terminal 1 - PostgreSQL:**
```bash
# If using Docker
docker run --name oehealth-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=oehealth -p 5432:5432 -d postgres:14
```

**Terminal 2 - Redis:**
```bash
# If using Docker
docker run --name oehealth-redis -p 6379:6379 -d redis:6
```

**Terminal 3 - Celery Worker:**
```bash
cd backend
celery -A config worker -l info
```

**Terminal 4 - Django:**
```bash
cd backend
python manage.py runserver
```

**Terminal 5 - Nuxt:**
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend GraphQL API: http://localhost:8000/graphql
- Django Admin: http://localhost:8000/admin

---

## API Documentation

### GraphQL Schema

The API is fully GraphQL-based with the following structure:

#### Authentication

**Login:**
```graphql
mutation {
  tokenAuth(username: "user@example.com", password: "password") {
    token
    refreshToken
    user {
      id
      email
      firstName
      lastName
      groups {
        name
      }
    }
  }
}
```

**Register:**
```graphql
mutation {
  createUser(input: {
    email: "newuser@example.com"
    password: "securePassword123"
    firstName: "John"
    lastName: "Doe"
    dateOfBirth: "1990-01-01"
    gender: "M"
    languageId: 1
  }) {
    user {
      id
      email
    }
  }
}
```

#### Appointments

**Fetch Appointments:**
```graphql
query {
  appointments(patient: 123, langId: 1, isActive: true) {
    id
    startDate
    duration
    note
    patient {
      id
      firstName
      lastName
    }
    doctor {
      id
      firstName
      lastName
    }
    appointmentdetailSet {
      teeth
      diagnostic
      treatment
    }
  }
}
```

**Create Appointment:**
```graphql
mutation {
  createAppointment(input: {
    patientId: 123
    doctorId: 456
    companyId: 1
    startDate: "2024-12-25T10:00:00Z"
    duration: "60"
    note: "Regular checkup"
    languageId: 1
  }) {
    appointment {
      id
      startDate
      duration
    }
  }
}
```

#### Surveys

**Fetch Survey with Questions:**
```graphql
query {
  surveys(pk: 1) {
    id
    name
    surveyquestionSet {
      id
      questionText
      questionType
      surveyquestionresponseSet {
        id
        responseText
        responseValue
      }
    }
  }
}
```

**Submit Survey Response:**
```graphql
mutation {
  createAppointmentSurveyAnswer(input: {
    appointmentSurveyId: 1
    questionId: 10
    responseId: 25
    languageId: 1
  }) {
    appointmentSurveyQuestionResponse {
      id
      createdAt
    }
  }
}
```

#### Chat

**Fetch Conversations:**
```graphql
query {
  conversations {
    id
    sender {
      id
      firstName
      lastName
    }
    receiver {
      id
      firstName
      lastName
    }
    message
    isSeen
    createdAt
  }
}
```

#### Notifications

**Fetch Notifications:**
```graphql
query {
  notifications(userId: 123) {
    id
    notificationType
    notificationText
    isRead
    createdAt
    createdBy {
      id
      firstName
      lastName
    }
  }
}
```

### WebSocket API

**Notifications Channel:**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/notifications/')
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data)
  console.log('New notification:', notification)
}
```

---

## Database Schema

### Core Models

#### User Domain
- **User**: Extended Django user with profile, address, demographics
- **MultiLanguage**: Language support
- **UserLang**: Translated user data
- **UserSpecialization**: Doctor specialties

#### Appointment Domain
- **Appointment**: Core appointment entity
- **AppointmentDetail**: Clinical data (teeth, diagnosis, treatment)
- **AppointmentPriority**: Priority levels
- **AppointmentSpecialization**: Required specialty
- **AppointmentFile**: Attached files
- **AppointmentLang**: Translated notes
- **AppointmentShortCode**: Appointment codes

#### Survey Domain
- **Survey**: Questionnaire container
- **SurveysQuestion**: Questions with conditional logic
- **SurveyQuestionResponse**: Answer options
- **SurveyQuestionRelation**: Question dependencies
- **AppointmentSurvey**: Survey-appointment link
- **AppointmentSurveyQuestionResponse**: User responses

#### Common/Reference Domain
- **Company**: Dental clinics
- **CompanyUser**: User-company relationships
- **Tooth**: Dental numbering system
- **Treatment**: Treatment database
- **Diagnostic**: Disease database
- **Specialization**: Medical specialties
- **Priority**: Priority levels
- **Duration**: Appointment durations

#### Chat Domain
- **Connection**: User connections
- **Conversation**: Messages
- **Banned**: Blocked users

#### Notification Domain
- **Notification**: User notifications

### Key Relationships

```
User ──┬─── Appointment (as patient)
       ├─── Appointment (as doctor)
       ├─── CompanyUser
       ├─── Connection (as sender/receiver)
       ├─── Conversation (as sender/receiver)
       └─── Notification

Appointment ──┬─── AppointmentDetail
              ├─── AppointmentPriority
              ├─── AppointmentSpecialization
              ├─── AppointmentFile
              └─── AppointmentSurvey

Survey ──── SurveysQuestion ──── SurveyQuestionResponse

Company ──── CompanyUser ──── User
```

---

## Authentication & Authorization

### Authentication Flow

1. **JWT-based Authentication**
   - Token obtained via `tokenAuth` mutation
   - Access token valid for 7 days
   - Refresh token for token renewal
   - Token sent in Authorization header: `Bearer <token>`

2. **Registration**
   - Email verification required
   - Password hashing via Django
   - Default role: Patient

3. **Session Management**
   - Apollo middleware handles token attachment
   - Automatic token refresh
   - Logout clears tokens

### Authorization

**Role-Based Access Control:**
- **Patient**: View own records, schedule appointments, chat with doctors
- **Doctor**: Manage patients, create appointments, view clinic data
- **Admin**: Manage clinic, approve users
- **Clinic Owner**: Full clinic management

**Route Protection (Middleware):**
- `auth.ts`: Ensures user is logged in
- `doctor.ts`: Doctor role required
- `patient.ts`: Patient role required

**GraphQL Protection:**
- `@login_required` decorator on resolvers
- Business logic checks for ownership/access

---

## Deployment

### Docker Deployment

**Build and run with Docker Compose:**

```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

### Ansible Deployment

#### Prerequisites

**macOS:**
```bash
# Install Ansible
brew install ansible

# Install required roles
ansible-galaxy install -r ./ansible/requirements.yml
```

**Linux:**
```bash
# Install Ansible
sudo apt install ansible  # Ubuntu/Debian
sudo yum install ansible  # RHEL/CentOS

# Install required roles
ansible-galaxy install -r ./ansible/requirements.yml
```

#### Deploy to Production

```bash
# Deploy to production server
ansible-playbook -i ./ansible/hosts ./ansible/prod.yml -u egap
```

#### Deploy to Development

```bash
# Deploy to dev server
ansible-playbook -i ./ansible/hosts ./ansible/dev.yml -u ogap
```

### Production Checklist

- [ ] Set `DEBUG=False` in Django settings
- [ ] Configure production database (PostgreSQL)
- [ ] Set up Redis for caching and Celery
- [ ] Configure email backend (SMTP)
- [ ] Set strong `SECRET_KEY` and `JWT_SECRET_KEY`
- [ ] Configure SSL/TLS certificates
- [ ] Set up CORS allowed origins
- [ ] Configure static and media file serving (S3, CDN)
- [ ] Set up monitoring (Sentry, logs)
- [ ] Configure backup strategy for database
- [ ] Set up Celery workers and beat scheduler
- [ ] Configure WebSocket/Channels for production
- [ ] Set appropriate `ALLOWED_HOSTS`
- [ ] Enable rate limiting
- [ ] Set up log aggregation

---

## Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. **Run tests**
   ```bash
   # Backend tests
   cd backend
   python manage.py test

   # Frontend tests
   cd frontend
   npm run test
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

**Frontend (TypeScript/Vue):**
- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Follow Prettier formatting rules

**Backend (Python):**
- Follow PEP 8 style guide
- Use type hints where applicable
- Write docstrings for functions/classes

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## Project Statistics

- **Backend Models**: 30+ Django models
- **GraphQL Queries**: 40+ queries
- **GraphQL Mutations**: 50+ mutations
- **Frontend Pages**: 24 Vue pages
- **Frontend Components**: 16+ reusable components
- **Frontend Stores**: 12 Pinia stores
- **Frontend Composables**: 11 composition functions
- **Database Tables**: 35+ tables
- **Supported Languages**: 2 (English, Portuguese)

---

## Security Features

- JWT authentication with expiration
- Password hashing via Django
- Email verification
- Role-based access control
- CORS protection
- SQL injection prevention (Django ORM)
- CSRF protection
- SSL/TLS support
- Audit trail on sensitive operations
- User blocking/banning

---

## License

Private - All rights reserved

---

## Contact & Support

**Author**: Eliyas Hossain
**Email**: eliyas.ru1991@gmail.com

---

## Acknowledgments

This project demonstrates modern full-stack development practices with:
- Enterprise-grade architecture
- Real-time capabilities
- Type-safe development
- Comprehensive business logic
- Production-ready deployment

Built with modern technologies including Vue 3, Nuxt 3, Django, GraphQL, PostgreSQL, Redis, and more.
