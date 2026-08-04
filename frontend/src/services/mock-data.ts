/**
 * Centralized mock data for UI development and demo purposes.
 *
 * This module is the SINGLE source of all mock/placeholder data in the frontend.
 * It is clearly separated from real API service layers so that when the backend
 * is ready, these can be removed without touching any screen or component code.
 *
 * Convention:
 * - Real API calls live in `src/features/<feature>/api/*.api.ts` and use `apiFetch`.
 * - Mock data lives here and is imported by API layers as fallbacks.
 * - Screens never import from this module directly.
 */

import type {
  UserProfile,
  Booking,
  Review,
  Payment,
  TutorDocument,
} from '@/types';
import type {
  ParentProfile,
  Ward,
  WardLink,
  WardSubject,
  WardTutor,
  WardLesson,
  WardAttendance,
  WardHomework,
  WardAssignment,
  WardProgressReport,
  WardLearningGoal,
  WardPayment,
  ParentNotification,
  LinkingRequest,
  WardSummary,
  LessonTrackingStatus,
} from '@/features/parent/types';

// ─── Helpers ──────────────────────────────────────────────────

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function hoursFromNow(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

// ─── Tutors ───────────────────────────────────────────────────

export const mockTutors: UserProfile[] = [
  {
    id: 'tutor-001',
    phone_number: '+233241234567',
    email: 'kwame.mensah@example.com',
    role: 'TUTOR',
    full_name: 'Kwame Mensah',
    profile_photo: undefined,
    bio: 'Experienced mathematics teacher with 8+ years helping students master algebra, calculus, and geometry.',
    subjects: ['Mathematics', 'Additional Mathematics', 'Statistics'],
    experience_years: 8,
    hourly_rate: 45,
    location: 'Accra, Ghana',
    verification_status: 'approved',
    total_sessions: 156,
    rating_avg: 4.8,
    rating_count: 42,
    availability_notes: 'Available Mon-Fri, 4PM-8PM',
    created_at: daysFromNow(-365),
    updated_at: daysFromNow(-2),
  },
  {
    id: 'tutor-002',
    phone_number: '+233242345678',
    email: 'ama.boateng@example.com',
    role: 'TUTOR',
    full_name: 'Ama Boateng',
    profile_photo: undefined,
    bio: 'Science enthusiast and certified teacher. I make physics and chemistry fun and accessible.',
    subjects: ['Physics', 'Chemistry', 'Integrated Science'],
    experience_years: 6,
    hourly_rate: 50,
    location: 'Kumasi, Ghana',
    verification_status: 'approved',
    total_sessions: 98,
    rating_avg: 4.9,
    rating_count: 31,
    availability_notes: 'Available Tue-Sat, 10AM-6PM',
    created_at: daysFromNow(-280),
    updated_at: daysFromNow(-5),
  },
  {
    id: 'tutor-003',
    phone_number: '+233243456789',
    email: 'yaw.owusu@example.com',
    role: 'TUTOR',
    full_name: 'Yaw Owusu',
    profile_photo: undefined,
    bio: 'English language and literature specialist. I help students excel in writing, comprehension, and grammar.',
    subjects: ['English Language', 'Literature in English'],
    experience_years: 5,
    hourly_rate: 40,
    location: 'Accra, Ghana',
    verification_status: 'pending',
    total_sessions: 24,
    rating_avg: 4.5,
    rating_count: 8,
    availability_notes: 'Available Mon-Thu, 2PM-7PM',
    created_at: daysFromNow(-120),
    updated_at: daysFromNow(-1),
  },
  {
    id: 'tutor-004',
    phone_number: '+233244567890',
    email: 'akosua.asante@example.com',
    role: 'TUTOR',
    full_name: 'Akosua Asante',
    profile_photo: undefined,
    bio: 'ICT professional with a passion for teaching coding, web development, and computer science fundamentals.',
    subjects: ['ICT', 'Computer Science', 'Web Development'],
    experience_years: 4,
    hourly_rate: 55,
    location: 'Tema, Ghana',
    verification_status: 'approved',
    total_sessions: 67,
    rating_avg: 4.7,
    rating_count: 19,
    availability_notes: 'Available Wed-Sun, 1PM-9PM',
    created_at: daysFromNow(-200),
    updated_at: daysFromNow(-3),
  },
];

// ─── Students (Wards) ─────────────────────────────────────────

export const mockWards: Ward[] = [
  {
    id: 'student-001',
    phone_number: '+233551112233',
    email: 'kofi.dankwa@example.com',
    role: 'STUDENT',
    full_name: 'Kofi Dankwa',
    profile_photo: undefined,
    verification_status: 'approved',
    created_at: daysFromNow(-180),
    updated_at: daysFromNow(-1),
    link_id: 'link-001',
    relation: 'Son',
    link_status: 'approved',
    linked_at: daysFromNow(-30),
  },
  {
    id: 'student-002',
    phone_number: '+233552223344',
    email: 'afia.dankwa@example.com',
    role: 'STUDENT',
    full_name: 'Afia Dankwa',
    profile_photo: undefined,
    verification_status: 'pending',
    created_at: daysFromNow(-90),
    updated_at: daysFromNow(-2),
    link_id: 'link-002',
    relation: 'Daughter',
    link_status: 'approved',
    linked_at: daysFromNow(-15),
  },
];

// ─── Parent Profile ───────────────────────────────────────────

export const mockParentProfile: ParentProfile = {
  id: 'parent-001',
  full_name: 'Yaw Dankwa',
  phone_number: '+233555556677',
  avatar_url: undefined,
  notification_prefs: {
    lesson_booking: true,
    lesson_cancellation: true,
    homework: true,
    attendance: true,
    payment: true,
    progress_report: true,
    linking_request: true,
  },
  created_at: daysFromNow(-60),
  updated_at: daysFromNow(-1),
};

// ─── Ward Subjects ────────────────────────────────────────────

export const mockWardSubjects: WardSubject[] = [
  {
    id: 'subj-math-kofi',
    name: 'Mathematics',
    tutor_id: 'tutor-001',
    tutor_name: 'Kwame Mensah',
    tutor_avatar: undefined,
    tutor_verified: true,
    progress_percent: 72,
    lessons_completed: 18,
    lessons_total: 25,
  },
  {
    id: 'subj-phys-kofi',
    name: 'Physics',
    tutor_id: 'tutor-002',
    tutor_name: 'Ama Boateng',
    tutor_avatar: undefined,
    tutor_verified: true,
    progress_percent: 55,
    lessons_completed: 11,
    lessons_total: 20,
  },
  {
    id: 'subj-eng-kofi',
    name: 'English Language',
    tutor_id: 'tutor-003',
    tutor_name: 'Yaw Owusu',
    tutor_avatar: undefined,
    tutor_verified: false,
    progress_percent: 40,
    lessons_completed: 6,
    lessons_total: 15,
  },
];

// ─── Ward Lessons ─────────────────────────────────────────────

export const mockWardLessons: WardLesson[] = [
  {
    id: 'lesson-001',
    subject: 'Mathematics',
    tutor_id: 'tutor-001',
    tutor_name: 'Kwame Mensah',
    tutor_avatar: undefined,
    status: 'scheduled',
    scheduled_time: hoursFromNow(6),
    end_time: hoursFromNow(7),
    duration_hours: 1,
    total_amount: 45,
    meet_link: 'https://meet.google.com/abc-defg-hij',
    location_sharing_consent: false,
    is_in_person: false,
    created_at: daysFromNow(-2),
  },
  {
    id: 'lesson-002',
    subject: 'Physics',
    tutor_id: 'tutor-002',
    tutor_name: 'Ama Boateng',
    tutor_avatar: undefined,
    status: 'in_progress',
    scheduled_time: hoursFromNow(-1),
    end_time: hoursFromNow(0),
    duration_hours: 1,
    total_amount: 50,
    meet_link: undefined,
    location_sharing_consent: false,
    is_in_person: true,
    created_at: daysFromNow(-3),
  },
  {
    id: 'lesson-003',
    subject: 'Mathematics',
    tutor_id: 'tutor-001',
    tutor_name: 'Kwame Mensah',
    tutor_avatar: undefined,
    status: 'completed',
    scheduled_time: daysFromNow(-5),
    end_time: daysFromNow(-5),
    duration_hours: 1,
    total_amount: 45,
    meet_link: 'https://meet.google.com/xyz-uvwx-rst',
    location_sharing_consent: false,
    is_in_person: false,
    created_at: daysFromNow(-7),
  },
  {
    id: 'lesson-004',
    subject: 'English Language',
    tutor_id: 'tutor-003',
    tutor_name: 'Yaw Owusu',
    tutor_avatar: undefined,
    status: 'cancelled',
    scheduled_time: daysFromNow(-3),
    end_time: daysFromNow(-3),
    duration_hours: 1,
    total_amount: 40,
    meet_link: undefined,
    location_sharing_consent: false,
    is_in_person: true,
    created_at: daysFromNow(-6),
  },
  {
    id: 'lesson-005',
    subject: 'Physics',
    tutor_id: 'tutor-002',
    tutor_name: 'Ama Boateng',
    tutor_avatar: undefined,
    status: 'rescheduled',
    scheduled_time: daysFromNow(2),
    end_time: daysFromNow(2),
    duration_hours: 1.5,
    total_amount: 75,
    meet_link: 'https://meet.google.com/rescheduled-link',
    location_sharing_consent: false,
    is_in_person: false,
    created_at: daysFromNow(-1),
  },
];

// ─── Ward Attendance ─────────────────────────────────────────

export const mockWardAttendance: WardAttendance[] = [
  { id: 'att-001', subject: 'Mathematics', date: daysFromNow(-1), status: 'present', tutor_name: 'Kwame Mensah' },
  { id: 'att-002', subject: 'Physics', date: daysFromNow(-3), status: 'present', tutor_name: 'Ama Boateng' },
  { id: 'att-003', subject: 'Mathematics', date: daysFromNow(-5), status: 'present', tutor_name: 'Kwame Mensah' },
  { id: 'att-004', subject: 'English Language', date: daysFromNow(-7), status: 'absent', tutor_name: 'Yaw Owusu' },
  { id: 'att-005', subject: 'Physics', date: daysFromNow(-8), status: 'late', tutor_name: 'Ama Boateng' },
  { id: 'att-006', subject: 'Mathematics', date: daysFromNow(-10), status: 'present', tutor_name: 'Kwame Mensah' },
  { id: 'att-007', subject: 'English Language', date: daysFromNow(-12), status: 'excused', tutor_name: 'Yaw Owusu' },
  { id: 'att-008', subject: 'Physics', date: daysFromNow(-14), status: 'present', tutor_name: 'Ama Boateng' },
];

// ─── Ward Homework ────────────────────────────────────────────

export const mockWardHomework: WardHomework[] = [
  {
    id: 'hw-001',
    subject: 'Mathematics',
    title: 'Algebra Worksheet 5',
    description: 'Complete problems 1-20 on quadratic equations',
    due_date: daysFromNow(2),
    status: 'pending',
    tutor_name: 'Kwame Mensah',
  },
  {
    id: 'hw-002',
    subject: 'Physics',
    title: 'Motion and Forces Lab Report',
    description: 'Write a 2-page lab report on Newton\'s Second Law experiment',
    due_date: daysFromNow(5),
    status: 'pending',
    tutor_name: 'Ama Boateng',
  },
  {
    id: 'hw-003',
    subject: 'Mathematics',
    title: 'Calculus Problem Set 3',
    due_date: daysFromNow(-2),
    status: 'graded',
    grade: 'A-',
    feedback: 'Excellent work on differentiation techniques. Watch your notation on chain rule problems.',
    tutor_name: 'Kwame Mensah',
  },
  {
    id: 'hw-004',
    subject: 'English Language',
    title: 'Essay: My Favorite Book',
    due_date: daysFromNow(-1),
    status: 'overdue',
    tutor_name: 'Yaw Owusu',
  },
];

// ─── Ward Assignments ─────────────────────────────────────────

export const mockWardAssignments: WardAssignment[] = [
  {
    id: 'asgn-001',
    subject: 'Mathematics',
    title: 'Midterm Exam',
    description: 'Covers chapters 1-5: Algebra, Functions, and Trigonometry',
    due_date: daysFromNow(10),
    status: 'in_progress',
    max_score: 100,
    tutor_name: 'Kwame Mensah',
  },
  {
    id: 'asgn-002',
    subject: 'Physics',
    title: 'Lab Practical: Electric Circuits',
    description: 'Hands-on lab assessment on series and parallel circuits',
    due_date: daysFromNow(7),
    status: 'not_started',
    max_score: 50,
    tutor_name: 'Ama Boateng',
  },
  {
    id: 'asgn-003',
    subject: 'English Language',
    title: 'Comprehension Test 2',
    due_date: daysFromNow(-5),
    status: 'graded',
    max_score: 30,
    score: 26,
    tutor_name: 'Yaw Owusu',
  },
];

// ─── Ward Progress Reports ────────────────────────────────────

export const mockWardProgressReports: WardProgressReport[] = [
  {
    id: 'pr-001',
    subject: 'Mathematics',
    period: 'Term 2, 2026',
    overall_grade: 'B+',
    attendance_rate: 92,
    assignments_completed: 8,
    assignments_total: 10,
    average_score: 78,
    strengths: ['Strong algebraic reasoning', 'Excellent problem-solving speed'],
    areas_for_improvement: ['Show working steps more clearly', 'Practice word problems'],
    tutor_name: 'Kwame Mensah',
    created_at: daysFromNow(-7),
  },
  {
    id: 'pr-002',
    subject: 'Physics',
    period: 'Term 2, 2026',
    overall_grade: 'B',
    attendance_rate: 85,
    assignments_completed: 6,
    assignments_total: 8,
    average_score: 72,
    strengths: ['Good understanding of mechanics', 'Active lab participation'],
    areas_for_improvement: ['Review electromagnetic concepts', 'Practice numerical problems'],
    tutor_name: 'Ama Boateng',
    created_at: daysFromNow(-10),
  },
];

// ─── Ward Learning Goals ──────────────────────────────────────

export const mockWardLearningGoals: WardLearningGoal[] = [
  {
    id: 'goal-001',
    title: 'Master quadratic equations',
    description: 'Complete all practice problems and score 80%+ on the chapter test',
    subject: 'Mathematics',
    target_date: daysFromNow(14),
    progress_percent: 65,
    status: 'on_track',
  },
  {
    id: 'goal-002',
    title: 'Improve physics lab reports',
    description: 'Write detailed lab reports with proper data analysis for all remaining labs',
    subject: 'Physics',
    target_date: daysFromNow(21),
    progress_percent: 30,
    status: 'at_risk',
  },
  {
    id: 'goal-003',
    title: 'Read 5 classic novels',
    subject: 'English Language',
    target_date: daysFromNow(60),
    progress_percent: 40,
    status: 'on_track',
  },
  {
    id: 'goal-004',
    title: 'Complete calculus problem set',
    subject: 'Mathematics',
    target_date: daysFromNow(-3),
    progress_percent: 100,
    status: 'achieved',
  },
];

// ─── Ward Payments ────────────────────────────────────────────

export const mockWardPayments: WardPayment[] = [
  {
    payment: {
      id: 'pay-001',
      booking_id: 'lesson-003',
      amount: 45,
      payment_status: 'successful',
      transaction_reference: 'TXN-001',
      paid_at: daysFromNow(-5),
      created_at: daysFromNow(-5),
      updated_at: daysFromNow(-5),
    } as Payment,
    booking: {
      id: 'lesson-003',
      tutor_id: 'tutor-001',
      student_id: 'student-001',
      subject: 'Mathematics',
      status: 'completed',
      total_amount: 45,
      created_at: daysFromNow(-7),
      updated_at: daysFromNow(-5),
    } as Booking,
    tutor_name: 'Kwame Mensah',
    subject: 'Mathematics',
  },
  {
    payment: {
      id: 'pay-002',
      booking_id: 'lesson-001',
      amount: 45,
      payment_status: 'pending',
      created_at: daysFromNow(-2),
      updated_at: daysFromNow(-2),
    } as Payment,
    booking: {
      id: 'lesson-001',
      tutor_id: 'tutor-001',
      student_id: 'student-001',
      subject: 'Mathematics',
      status: 'pending_payment',
      total_amount: 45,
      created_at: daysFromNow(-2),
      updated_at: daysFromNow(-2),
    } as Booking,
    tutor_name: 'Kwame Mensah',
    subject: 'Mathematics',
  },
];

// ─── Parent Notifications ─────────────────────────────────────

export const mockParentNotifications: ParentNotification[] = [
  {
    id: 'notif-001',
    parent_id: 'parent-001',
    ward_id: 'student-001',
    ward_name: 'Kofi Dankwa',
    type: 'lesson_booking',
    title: 'New lesson booked',
    body: 'Mathematics lesson with Kwame Mensah scheduled for tomorrow at 2:00 PM.',
    data: { booking_id: 'lesson-001' },
    is_read: false,
    created_at: hoursFromNow(-2),
  },
  {
    id: 'notif-002',
    parent_id: 'parent-001',
    ward_id: 'student-001',
    ward_name: 'Kofi Dankwa',
    type: 'homework',
    title: 'New homework assigned',
    body: 'Kwame Mensah assigned "Algebra Worksheet 5" due in 2 days.',
    data: { homework_id: 'hw-001' },
    is_read: false,
    created_at: hoursFromNow(-5),
  },
  {
    id: 'notif-003',
    parent_id: 'parent-001',
    ward_id: 'student-001',
    ward_name: 'Kofi Dankwa',
    type: 'attendance',
    title: 'Attendance recorded',
    body: 'Kofi was marked present for Mathematics on ' + new Date(daysFromNow(-1)).toLocaleDateString(),
    is_read: true,
    created_at: hoursFromNow(-26),
  },
  {
    id: 'notif-004',
    parent_id: 'parent-001',
    ward_id: 'student-001',
    ward_name: 'Kofi Dankwa',
    type: 'progress_report',
    title: 'Progress report available',
    body: 'New progress report for Mathematics (Term 2, 2026) is now available.',
    data: { report_id: 'pr-001' },
    is_read: true,
    created_at: daysFromNow(-7),
  },
  {
    id: 'notif-005',
    parent_id: 'parent-001',
    ward_id: 'student-002',
    ward_name: 'Afia Dankwa',
    type: 'linking_approved',
    title: 'Linking approved',
    body: 'Afia Dankwa has approved your linking request. You can now view their progress.',
    is_read: false,
    created_at: daysFromNow(-15),
  },
  {
    id: 'notif-006',
    parent_id: 'parent-001',
    ward_id: 'student-001',
    ward_name: 'Kofi Dankwa',
    type: 'lesson_cancellation',
    title: 'Lesson cancelled',
    body: 'English Language lesson with Yaw Owusu was cancelled.',
    is_read: true,
    created_at: daysFromNow(-3),
  },
  {
    id: 'notif-007',
    parent_id: 'parent-001',
    ward_id: 'student-001',
    ward_name: 'Kofi Dankwa',
    type: 'payment',
    title: 'Payment successful',
    body: 'Payment of GHS 45.00 for Mathematics lesson was successful.',
    is_read: true,
    created_at: daysFromNow(-5),
  },
];

// ─── Linking Requests ─────────────────────────────────────────

export const mockLinkingRequests: LinkingRequest[] = [
  {
    id: 'link-req-001',
    parent_id: 'parent-002',
    parent_name: 'Abena Osei',
    parent_avatar: undefined,
    relation: 'Aunt',
    status: 'pending',
    requested_at: hoursFromNow(-3),
  },
];

// ─── Ward Summary (composite) ─────────────────────────────────

export const mockWardSummary: WardSummary = {
  ward: mockWards[0],
  upcoming_lessons: mockWardLessons.filter((l) => l.status === 'scheduled' || l.status === 'in_progress'),
  active_subjects: mockWardSubjects,
  attendance_rate: 88,
  pending_homework: 2,
  active_goals: 3,
  unread_notifications: 2,
};

export const mockWardSummary2: WardSummary = {
  ward: mockWards[1],
  upcoming_lessons: [],
  active_subjects: [],
  attendance_rate: 100,
  pending_homework: 0,
  active_goals: 0,
  unread_notifications: 1,
};

// ─── Ward Tutors ──────────────────────────────────────────────

export const mockWardTutors: WardTutor[] = [
  {
    id: 'tutor-001',
    full_name: 'Kwame Mensah',
    profile_photo: undefined,
    bio: 'Experienced mathematics teacher with 8+ years helping students master algebra, calculus, and geometry.',
    subjects: ['Mathematics', 'Additional Mathematics', 'Statistics'],
    verification_status: 'approved',
    rating_avg: 4.8,
    rating_count: 42,
    total_sessions: 156,
    hourly_rate: 45,
    qualifications: 'B.Ed Mathematics, University of Cape Coast. Certified Teacher, GTC.',
    location: 'Accra, Ghana',
    availability_notes: 'Available Mon-Fri, 4PM-8PM',
  },
  {
    id: 'tutor-002',
    full_name: 'Ama Boateng',
    profile_photo: undefined,
    bio: 'Science enthusiast and certified teacher. I make physics and chemistry fun and accessible.',
    subjects: ['Physics', 'Chemistry', 'Integrated Science'],
    verification_status: 'approved',
    rating_avg: 4.9,
    rating_count: 31,
    total_sessions: 98,
    hourly_rate: 50,
    qualifications: 'M.Sc Physics, KNUST. Licensed by NTC.',
    location: 'Kumasi, Ghana',
    availability_notes: 'Available Tue-Sat, 10AM-6PM',
  },
  {
    id: 'tutor-003',
    full_name: 'Yaw Owusu',
    profile_photo: undefined,
    bio: 'English language and literature specialist. I help students excel in writing, comprehension, and grammar.',
    subjects: ['English Language', 'Literature in English'],
    verification_status: 'pending',
    rating_avg: 4.5,
    rating_count: 8,
    total_sessions: 24,
    hourly_rate: 40,
    qualifications: 'B.A English, University of Ghana. Diploma in Education.',
    location: 'Accra, Ghana',
    availability_notes: 'Available Mon-Thu, 2PM-7PM',
  },
];

// ─── Tutor Reviews ────────────────────────────────────────────

export const mockReviews: Review[] = [
  {
    id: 'review-001',
    booking_id: 'booking-001',
    student_id: 'student-001',
    tutor_id: 'tutor-001',
    rating: 5,
    review_text: 'Excellent teacher! Very patient and explains complex topics clearly. My grades improved significantly.',
    created_at: daysFromNow(-5),
    student: { id: 'student-001', full_name: 'Kofi Dankwa', profile_photo: undefined },
  },
  {
    id: 'review-002',
    booking_id: 'booking-002',
    student_id: 'student-003',
    tutor_id: 'tutor-001',
    rating: 4,
    review_text: 'Great lessons, very thorough. Would recommend to any student struggling with math.',
    created_at: daysFromNow(-12),
    student: { id: 'student-003', full_name: 'Mensah Junior', profile_photo: undefined },
  },
  {
    id: 'review-003',
    booking_id: 'booking-003',
    student_id: 'student-005',
    tutor_id: 'tutor-001',
    rating: 5,
    review_text: 'Best math tutor I\'ve had. Always prepared and on time.',
    created_at: daysFromNow(-20),
    student: { id: 'student-005', full_name: 'Grace Appiah', profile_photo: undefined },
  },
];

// ─── Tutor Documents ──────────────────────────────────────────

export const mockTutorDocuments: TutorDocument[] = [
  {
    id: 'doc-001',
    tutor_id: 'tutor-001',
    document_type: 'degree_certificate',
    file_name: 'BEd_Mathematics.pdf',
    mime_type: 'application/pdf',
    file_size: 245678,
    status: 'verified',
    uploaded_at: daysFromNow(-30),
    created_at: daysFromNow(-30),
    updated_at: daysFromNow(-28),
  },
  {
    id: 'doc-002',
    tutor_id: 'tutor-001',
    document_type: 'id_card',
    file_name: 'Ghana_Card.pdf',
    mime_type: 'application/pdf',
    file_size: 189456,
    status: 'verified',
    uploaded_at: daysFromNow(-30),
    created_at: daysFromNow(-30),
    updated_at: daysFromNow(-28),
  },
  {
    id: 'doc-003',
    tutor_id: 'tutor-001',
    document_type: 'teaching_license',
    file_name: 'GTC_License.pdf',
    mime_type: 'application/pdf',
    file_size: 134567,
    status: 'pending',
    uploaded_at: daysFromNow(-2),
    created_at: daysFromNow(-2),
    updated_at: daysFromNow(-2),
  },
];

// ─── Tutor Earnings ───────────────────────────────────────────

export const mockTutorEarnings = {
  total_earned: 12450,
  available: 3200,
  pending: 850,
  withdrawn: 8400,
};

export const mockTutorEarningsTransactions = [
  { id: 'txn-001', student_name: 'Kofi Dankwa', subject: 'Mathematics', amount: 45, date: daysFromNow(-1), status: 'available' },
  { id: 'txn-002', student_name: 'Mensah Junior', subject: 'Mathematics', amount: 90, date: daysFromNow(-3), status: 'available' },
  { id: 'txn-003', student_name: 'Grace Appiah', subject: 'Statistics', amount: 55, date: daysFromNow(-5), status: 'pending' },
  { id: 'txn-004', student_name: 'Kofi Dankwa', subject: 'Mathematics', amount: 45, date: daysFromNow(-7), status: 'withdrawn' },
  { id: 'txn-005', student_name: 'John Boadu', subject: 'Additional Math', amount: 50, date: daysFromNow(-10), status: 'withdrawn' },
];

// ─── Tutor Requests (Bookings pending acceptance) ────────────

export const mockTutorRequests = [
  {
    id: 'req-001',
    tutor_id: 'tutor-001',
    student_id: 'student-001',
    subject: 'Mathematics',
    level: 'SHS 2',
    scheduled_time: hoursFromNow(48),
    status: 'pending_tutor_acceptance',
    message: 'I need help with quadratic equations before my exam next week.',
    created_at: hoursFromNow(-2),
    student: {
      id: 'student-001',
      full_name: 'Kofi Dankwa',
      profile_photo: undefined,
      phone_number: '+233551112233',
    } as UserProfile,
  },
  {
    id: 'req-002',
    tutor_id: 'tutor-001',
    student_id: 'student-003',
    subject: 'Statistics',
    level: 'University 100',
    scheduled_time: daysFromNow(3),
    status: 'pending_tutor_acceptance',
    message: 'Could you help me with probability distributions?',
    created_at: hoursFromNow(-5),
    student: {
      id: 'student-003',
      full_name: 'Mensah Junior',
      profile_photo: undefined,
      phone_number: '+233553334455',
    } as UserProfile,
  },
  {
    id: 'req-003',
    tutor_id: 'tutor-001',
    student_id: 'student-005',
    subject: 'Additional Mathematics',
    level: 'SHS 3',
    scheduled_time: daysFromNow(5),
    status: 'pending_tutor_acceptance',
    created_at: hoursFromNow(-8),
    student: {
      id: 'student-005',
      full_name: 'Grace Appiah',
      profile_photo: undefined,
      phone_number: '+233555556677',
    } as UserProfile,
  },
];

// ─── Student Bookings ─────────────────────────────────────────

export const mockStudentBookings: Booking[] = [
  {
    id: 'booking-001',
    tutor_id: 'tutor-001',
    student_id: 'student-001',
    subject: 'Mathematics',
    status: 'confirmed',
    scheduled_time: hoursFromNow(24),
    start_time: hoursFromNow(24),
    end_time: hoursFromNow(25),
    total_amount: 45,
    meet_link: 'https://meet.google.com/abc-defg-hij',
    created_at: daysFromNow(-2),
    updated_at: daysFromNow(-1),
    tutor: mockTutors[0],
  } as Booking,
  {
    id: 'booking-002',
    tutor_id: 'tutor-002',
    student_id: 'student-001',
    subject: 'Physics',
    status: 'pending_payment',
    scheduled_time: daysFromNow(3),
    start_time: daysFromNow(3),
    end_time: daysFromNow(3),
    total_amount: 50,
    created_at: daysFromNow(-1),
    updated_at: daysFromNow(-1),
    tutor: mockTutors[1],
  } as Booking,
  {
    id: 'booking-003',
    tutor_id: 'tutor-001',
    student_id: 'student-001',
    subject: 'Mathematics',
    status: 'completed',
    scheduled_time: daysFromNow(-5),
    start_time: daysFromNow(-5),
    end_time: daysFromNow(-5),
    total_amount: 45,
    created_at: daysFromNow(-7),
    updated_at: daysFromNow(-5),
    tutor: mockTutors[0],
  } as Booking,
];

// ─── Ward Links ───────────────────────────────────────────────

export const mockWardLinks: WardLink[] = [
  {
    id: 'link-001',
    parent_id: 'parent-001',
    ward_id: 'student-001',
    status: 'approved',
    relation: 'Son',
    parent_code: '+233551112233',
    requested_at: daysFromNow(-30),
    responded_at: daysFromNow(-29),
    created_at: daysFromNow(-30),
    updated_at: daysFromNow(-29),
  },
  {
    id: 'link-002',
    parent_id: 'parent-001',
    ward_id: 'student-002',
    status: 'approved',
    relation: 'Daughter',
    parent_code: '+233552223344',
    requested_at: daysFromNow(-15),
    responded_at: daysFromNow(-14),
    created_at: daysFromNow(-15),
    updated_at: daysFromNow(-14),
  },
];
