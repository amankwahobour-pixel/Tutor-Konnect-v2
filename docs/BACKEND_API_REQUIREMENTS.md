# Backend API Requirements for TutorKonnect Frontend

This document describes all backend API endpoints, request payloads, and response structures needed by the frontend. Endpoints already implemented by the existing backend are marked with **[EXISTS]**.

## Table of Contents
1. [Authentication](#authentication)
2. [Profiles](#profiles)
3. [Tutor Profiles](#tutor-profiles)
4. [Bookings / Lessons](#bookings--lessons)
5. [Reviews](#reviews)
6. [Parent Feature (NEW)](#parent-feature-new)
7. [Notifications (NEW)](#notifications-new)
8. [Homework & Assignments (NEW)](#homework--assignments-new)
9. [Progress Reports (NEW)](#progress-reports-new)
10. [Learning Goals (NEW)](#learning-goals-new)
11. [Location Sharing (NEW)](#location-sharing-new)
12. [Database Schema Changes](#database-schema-changes)

---

## Authentication

All endpoints (except auth) require `Authorization: Bearer <token>` header.

| Method | Path | Status |
|--------|------|--------|
| POST | `/api/v2/auth/login` | **[EXISTS]** Email login |
| POST | `/api/v1/auth/signup` | **[EXISTS]** Email signup |
| POST | `/api/v1/auth/verify-phone` | **[EXISTS]** OTP verification |
| POST | `/api/v1/auth/resend-email-verification` | **[EXISTS]** |
| POST | `/api/v1/auth/logout` | **[EXISTS]** |

### Required Changes
- Add `parent` to the `UserRole` enum (currently only `STUDENT` and `TUTOR`).
- Add `parent` to the `profiles.role` CHECK constraint.

---

## Profiles

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v1/profiles/tutors` | **[EXISTS]** |
| GET | `/api/v1/profiles/students` | **[EXISTS]** |
| GET | `/api/v1/profiles/tutors/search?name=` | **[EXISTS]** |
| POST | `/api/v1/profiles` | **[EXISTS]** |
| GET | `/api/v1/profiles/:id` | **[EXISTS]** |
| PUT | `/api/v1/profiles/:id` | **[EXISTS]** |

### Required New Endpoints

#### `GET /api/v1/profiles/search?phone=&code=&id=`
Search for a student by phone number, parent code, or student ID for linking.

**Query Parameters:**
- `phone` (string, optional) — phone number to search
- `code` (string, optional) — parent code (same as phone number)
- `id` (string, optional) — student UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "Kofi Dankwa",
    "phone_number": "+233551112233",
    "profile_photo": null,
    "role": "student",
    "verification_status": "approved"
  }
}
```

---

## Tutor Profiles

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v1/tutors` | **[EXISTS]** |
| GET | `/api/v1/tutors/:userId` | **[EXISTS]** |
| GET | `/api/v1/tutors/:userId/earnings` | **[EXISTS]** |
| POST | `/api/v1/tutors` | **[EXISTS]** |
| PUT | `/api/v1/tutors/:userId` | **[EXISTS]** |
| PATCH | `/api/v1/tutors/:userId/field` | **[EXISTS]** |

### Required Changes
- `GET /api/v1/tutors/:userId` should return the tutor's `full_name` and `profile_photo` from the joined `profiles` table (currently returns `user_id` only).

---

## Bookings / Lessons

The existing booking system covers creation, acceptance, confirmation, completion, and cancellation. The frontend needs these additional endpoints:

### Required New Endpoints

#### `GET /api/v1/bookings?student_id=&status=`
Get bookings for a student, optionally filtered by status.

**Query Parameters:**
- `student_id` (uuid, required) — the student's profile ID
- `status` (string, optional) — filter by booking status
- `limit` (number, optional, default 50)
- `offset` (number, optional, default 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tutor_id": "uuid",
      "student_id": "uuid",
      "subject": "Mathematics",
      "status": "confirmed",
      "scheduled_time": "2026-08-04T14:00:00Z",
      "start_time": "2026-08-04T14:00:00Z",
      "end_time": "2026-08-04T15:00:00Z",
      "total_amount": 45.00,
      "meet_link": "https://meet.google.com/...",
      "tutor": { "id": "uuid", "full_name": "Kwame Mensah", "profile_photo": null },
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

#### `GET /api/v1/bookings?tutor_id=&status=`
Same as above but filtered by tutor.

---

## Reviews

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/v1/bookings/:bookingId/review` | **[EXISTS]** |
| POST | `/api/v1/bookings/:bookingId/review` | **[EXISTS]** |
| PUT | `/api/v1/bookings/:bookingId/review` | **[EXISTS]** |
| GET | `/api/v1/tutors/:tutorId/reviews` | **[EXISTS]** |
| GET | `/api/v1/students/:studentId/reviews` | **[EXISTS]** |

---

## Parent Feature (NEW)

All parent endpoints require authentication. The `parent_id` is derived from the authenticated user's token.

### `GET /api/v1/parent/profile`
Get the authenticated parent's profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "Yaw Dankwa",
    "phone_number": "+233555556677",
    "avatar_url": null,
    "notification_prefs": {
      "lesson_booking": true,
      "lesson_cancellation": true,
      "homework": true,
      "attendance": true,
      "payment": true,
      "progress_report": true,
      "linking_request": true
    },
    "created_at": "...",
    "updated_at": "..."
  }
}
```

### `PUT /api/v1/parent/profile`
Update the parent's profile.

**Request Body:**
```json
{
  "full_name": "Yaw Dankwa",
  "phone_number": "+233555556677",
  "avatar_url": "https://...",
  "notification_prefs": { "lesson_booking": false }
}
```

### `GET /api/v1/parent/wards`
Get all approved wards (linked students) for the authenticated parent.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "full_name": "Kofi Dankwa",
      "phone_number": "+233551112233",
      "profile_photo": null,
      "role": "student",
      "verification_status": "approved",
      "link_id": "uuid",
      "relation": "Son",
      "link_status": "approved",
      "linked_at": "2026-07-04T..."
    }
  ]
}
```

### `POST /api/v1/parent/wards/link`
Request to link with a student. The student must approve before access is granted.

**Request Body:**
```json
{
  "ward_id": "uuid",
  "relation": "Father",
  "parent_code": "+233551112233"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "parent_id": "uuid",
    "ward_id": "uuid",
    "status": "pending",
    "relation": "Father",
    "parent_code": "+233551112233",
    "requested_at": "...",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

### `DELETE /api/v1/parent/wards/:linkId`
Revoke a ward link (parent-initiated unlink).

### `GET /api/v1/parent/wards/:wardId/summary`
Get a comprehensive summary for a ward.

**Response:**
```json
{
  "success": true,
  "data": {
    "ward": { "id": "uuid", "full_name": "Kofi Dankwa", "..." : "..." },
    "upcoming_lessons": [...],
    "active_subjects": [...],
    "attendance_rate": 88,
    "pending_homework": 2,
    "active_goals": 3,
    "unread_notifications": 2
  }
}
```

### `GET /api/v1/parent/wards/:wardId/subjects`
### `GET /api/v1/parent/wards/:wardId/tutors`
### `GET /api/v1/parent/wards/:wardId/lessons`
### `GET /api/v1/parent/wards/:wardId/attendance`
### `GET /api/v1/parent/wards/:wardId/homework`
### `GET /api/v1/parent/wards/:wardId/assignments`
### `GET /api/v1/parent/wards/:wardId/progress-reports`
### `GET /api/v1/parent/wards/:wardId/learning-goals`
### `GET /api/v1/parent/wards/:wardId/payments`

Each returns `{ success: true, data: [...] }` with the relevant array.

---

## Notifications (NEW)

### `GET /api/v1/parent/notifications`
Get all notifications for the authenticated parent.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "parent_id": "uuid",
      "ward_id": "uuid",
      "ward_name": "Kofi Dankwa",
      "type": "lesson_booking",
      "title": "New lesson booked",
      "body": "Mathematics lesson scheduled for tomorrow.",
      "data": { "booking_id": "uuid" },
      "is_read": false,
      "created_at": "..."
    }
  ]
}
```

### `GET /api/v1/parent/notifications/unread-count`
Returns `{ "success": true, "data": { "count": 3 } }`

### `PUT /api/v1/parent/notifications/:id/read`
Mark a single notification as read.

### `PUT /api/v1/parent/notifications/read-all`
Mark all notifications as read.

### `DELETE /api/v1/parent/notifications/:id`
Delete a notification.

---

## Homework & Assignments (NEW)

### Database Tables

```sql
CREATE TABLE homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tutor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'submitted', 'graded', 'overdue')),
  grade text,
  feedback text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tutor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'submitted', 'graded')),
  max_score integer,
  score integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Endpoints

#### `GET /api/v1/students/:studentId/homework`
Returns homework for a student.

#### `POST /api/v1/bookings/:bookingId/homework`
Tutor assigns homework.

**Request:**
```json
{
  "title": "Algebra Worksheet 5",
  "description": "Complete problems 1-20",
  "due_date": "2026-08-10T23:59:59Z"
}
```

#### `PUT /api/v1/homework/:id`
Update homework status (student submits, tutor grades).

---

## Progress Reports (NEW)

### Database Table

```sql
CREATE TABLE progress_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tutor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  period text NOT NULL,
  overall_grade text,
  attendance_rate integer NOT NULL DEFAULT 0,
  assignments_completed integer NOT NULL DEFAULT 0,
  assignments_total integer NOT NULL DEFAULT 0,
  average_score integer,
  strengths text[],
  areas_for_improvement text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Endpoints

#### `GET /api/v1/students/:studentId/progress-reports`
#### `POST /api/v1/students/:studentId/progress-reports` (tutor only)

---

## Learning Goals (NEW)

### Database Table

```sql
CREATE TABLE learning_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  subject text,
  target_date timestamptz NOT NULL,
  progress_percent integer NOT NULL DEFAULT 0
    CHECK (progress_percent BETWEEN 0 AND 100),
  status text NOT NULL DEFAULT 'on_track'
    CHECK (status IN ('on_track', 'at_risk', 'achieved', 'overdue')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Endpoints

#### `GET /api/v1/students/:studentId/learning-goals`
#### `POST /api/v1/students/:studentId/learning-goals`
#### `PUT /api/v1/learning-goals/:id`

---

## Location Sharing (NEW)

### Database Changes

```sql
ALTER TABLE bookings ADD COLUMN location_sharing_consent boolean NOT NULL DEFAULT false;
ALTER TABLE bookings ADD COLUMN location_lat decimal(10,7);
ALTER TABLE bookings ADD COLUMN location_lng decimal(10,7);
ALTER TABLE bookings ADD COLUMN location_shared_at timestamptz;
ALTER TABLE bookings ADD COLUMN location_expires_at timestamptz;
```

### Endpoint

#### `PUT /api/v1/bookings/:bookingId/location-consent`
Toggle location sharing consent for an in-person lesson.

**Request:**
```json
{ "consent": true }
```

**Business Rules:**
- Location sharing is only available for in-person lessons (no `meet_link`).
- Location sharing is only active during the lesson window (between `start_time` and `end_time`).
- Consent can be revoked at any time.
- When consent is revoked, `location_lat`, `location_lng`, and `location_shared_at` are cleared.

---

## Database Schema Changes Summary

1. **`profiles.role` CHECK constraint**: Add `'parent'` value
2. **`UserRole` enum**: Add `PARENT = 'parent'`
3. **New tables**: `homework`, `assignments`, `progress_reports`, `learning_goals`
4. **Modified tables**: `bookings` (add location columns)
5. **Parent linking table**: `parent_ward_links` (id, parent_id, ward_id, status, relation, parent_code, requested_at, responded_at, timestamps)
6. **Parent profile table**: `parent_profiles` (id, full_name, phone_number, avatar_url, notification_prefs, timestamps)
7. **Parent notifications table**: `parent_notifications` (id, parent_id, ward_id, type, title, body, data, is_read, created_at)
