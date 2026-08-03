# Database

# Database Schema - TutorKonnect MVP

## Design Philosophy

The database schema is intentionally designed for long-term scalability while maintaining a lean MVP implementation strategy.

Not all tables, relationships, or workflows will be fully implemented in the initial release. Certain structures are included early to minimize future migration complexity and support platform growth as new features are introduced.

## Current Schema Version

**Version:** v1.0 - MVP Ready

## Tables Included

| Table | Purpose | MVP Usage |
|-------|---------|-----------|
| profiles | User profiles (extends Supabase Auth) | ✅ Full |
| tutor_profiles | Tutor-specific data | ✅ Full |
| tutor_documents | Uploaded verification docs | ✅ Full |
| verifications | Admin verification tracking | ⚠️ Manual review via dashboard |
| bookings | Session bookings | ✅ Full |
| payments | Mobile Money payments | ✅ Full |
| messages | In-app chat | ✅ Full |
| reviews | Ratings and feedback | ✅ Full |
| withdrawals | Tutor earnings payout | ⚠️ Manual processing |

## MVP vs Future

| Feature | In Schema | MVP Implementation |
|---------|-----------|--------------------|
| Phone OTP auth | ✅ | Supabase Auth |
| Tutor verification | ✅ | Manual admin review |
| Multiple documents per tutor | ✅ | Implemented |
| Booking with time slots | ✅ | Fully implemented |
| Google Meet links | ✅ | Implemented |
| Mobile Money payments | ✅ | Paystack integration |
| In-app messaging | ✅ | Implemented |
| Reviews & ratings | ✅ | Implemented |
| Tutor withdrawals | ✅ | Manual for MVP |
| Push notifications | ❌ | Post-MVP |
| Advanced search filters | ⚠️ | Basic only |
| Scheduling calendar | ⚠️ | Post-MVP |

## Setup Instructions

### 1. Create Supabase Project

- Go to [supabase.com](https://supabase.com)
- Create new project
- Save your database password

### 2. Run the Schema

- Open Supabase Dashboard → SQL Editor
- Copy contents of `schema.sql`
- Run the query

### 3. Set Up Storage Buckets

Run this in SQL Editor:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('tutor-verifications', 'tutor-verifications', false),
    ('tutor-photos', 'tutor-photos', true),
    ('session-files', 'session-files', false);

## Configure RLS Policies

RLS policies are included in `schema.sql`. They are automatically enabled when you run the schema.

## Environment Variables Needed

### Frontend (.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Backend (.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
DATABASE_URL=postgresql://...

### Maintenance Notes

### Adding Migrations

For future changes, create migration files in /database/migrations/ with naming format:

text

**001**\_add\_new\_table.sql

**002**\_alter\_bookings\_add\_column.sql

Manual Verification Workflow (**MVP**)

Tutor uploads documents → tutor\_documents table

Tutor profile has verification\_status = 'pending'

Admin (PM or Product Lead) reviews documents via Supabase dashboard

Admin updates verification\_status to 'approved' or 'rejected'

If approved, tutor\_profiles.verified = **TRUE**

Manual Withdrawal Workflow (**MVP**)

Tutor requests withdrawal → withdrawals table (status 'pending')

Admin processes payment manually via Mobile Money

Admin updates withdrawals.status to 'processed'

Admin updates tutor\_profiles.total\_earned

### Schema File Location

database/schema.sql - Complete schema with tables, indexes, **RLS**, and triggers
