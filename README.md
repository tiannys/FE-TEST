# ContactApp — Full-Stack Contact Management

A full-stack contact management application built as a coding test.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React, TypeScript, CSS Modules |
| Backend | NestJS, Node.js, TypeScript |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (Passport.js + bcrypt) |
| DevOps | Docker Compose |

## Features

- ✅ **Bilingual UI** (EN/TH) with context-based i18n
- ✅ **Responsive** (desktop + mobile)
- ✅ **JWT Authentication** with login/register
- ✅ **Default Admin** account (`admin@contactapp.com` / `P@ssw0rd`)
- ✅ **Profile Management** — editable profile picture + name
- ✅ **Contact CRUD** — create, list, search, delete
- ✅ **Server-side Pagination** — 20/50/100 page size options
- ✅ **Search** — starts at 3+ characters, with clear button
- ✅ **Validation** — letters only (EN + TH), no spaces, age 1-150
- ✅ **Navigation** — sidebar with hamburger toggle, footer with contact links
- ✅ **Current Location** — opens Google Maps with geolocation

## Quick Start (Docker Compose)

```bash
docker-compose up --build
```

This starts:
- **MongoDB** on port `27017`
- **NestJS Backend** on port `4000`
- **Next.js Frontend** on port `3000`

Open http://localhost:3000 and login with:
```
Email:    admin@contactapp.com
Password: P@ssw0rd
```

## Local Development

### Backend
```bash
cd backend
npm install
# Start MongoDB locally first
npm run start:dev
```

### Frontend
```bash
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/register` | ❌ | Register |
| GET | `/api/users/profile` | ✅ | Get profile |
| PATCH | `/api/users/profile` | ✅ | Update profile |
| GET | `/api/contacts?page=1&limit=20&search=xxx` | ✅ | List contacts |
| POST | `/api/contacts` | ✅ | Create contact |
| DELETE | `/api/contacts/:id` | ✅ | Delete contact |

## Project Structure

```
├── docker-compose.yml        # Docker orchestration
├── Dockerfile                # Frontend container
├── src/                      # Next.js frontend
│   ├── app/                  # Pages (Home, Login, Contact List/Create)
│   ├── components/           # Navbar, Sidebar, Footer, Modal, etc.
│   ├── contexts/             # Auth, Language, Profile, Contact
│   ├── services/             # API client
│   └── i18n/                 # Translations
└── backend/                  # NestJS backend
    ├── Dockerfile
    └── src/
        ├── auth/             # JWT login/register
        ├── users/            # Profile CRUD
        ├── contacts/         # Contacts CRUD
        └── seed/             # Default admin + 100 contacts
```
