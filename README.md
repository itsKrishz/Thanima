# SARGAM'26 Alumni RSVP

A modern RSVP web application for **SARGAM'26 Alumni Registration**, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- Public alumni RSVP form with validation and duplicate prevention by phone number
- Kerala Onam-inspired design using the SARGAM color palette
- Secure admin login and dashboard
- Summary cards, searchable/sortable/paginated RSVP table
- CSV export for organizers

## Color Theme

| Name | Hex |
| --- | --- |
| Forest Green | `#163A24` |
| Muted Gold | `#CBA358` |
| Terracotta Crimson | `#A13847` |
| Rice Cream | `#F3EAD3` |

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a Supabase project and run the SQL migration:

```bash
supabase/migrations/001_create_rsvps.sql
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Add your Supabase URL and anon key to `.env.local`.

5. Create an admin user in Supabase Auth and set:

```json
{
  "role": "admin"
}
```

in the user's `app_metadata`.

6. Start the development server:

```bash
npm run dev
```

## Routes

- `/` — Public RSVP form
- `/admin/login` — Admin sign in
- `/admin` — Admin dashboard
- `/admin/export` — CSV export (admin only)

## Future Extensions

The project structure supports future features such as QR codes, ticketing, guest passes, email notifications, and multi-event management.
