import { supabase } from '@/services/supabase.client';
import { apiFetch } from '@/services/api';
import { getAuthToken } from '@/features/auth/services/auth-storage';
import type { UserProfile, Booking } from '@/types';
import type {
  ParentProfile,
  WardLink,
  Ward,
  WardLinkStatus,
  ParentNotification,
  ParentNotificationType,
  WardTutor,
  WardLesson,
  LessonTrackingStatus,
  WardAttendance,
  WardHomework,
  WardAssignment,
  WardProgressReport,
  WardLearningGoal,
  WardPayment,
  WardSummary,
  WardSubject,
  LinkingRequest,
} from '../types';

// ─── Parent Profile ──────────────────────────────────────────

export async function getOrCreateParentProfile(user: UserProfile): Promise<ParentProfile> {
  const { data, error } = await supabase
    .from('parent_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (data) return data as ParentProfile;

  const newProfile: Omit<ParentProfile, 'created_at' | 'updated_at'> = {
    id: user.id,
    full_name: user.full_name || '',
    phone_number: user.phone_number || '',
    avatar_url: user.profile_photo,
    notification_prefs: {},
  };

  const { data: created, error: insertError } = await supabase
    .from('parent_profiles')
    .insert(newProfile)
    .select()
    .single();

  if (insertError) throw new Error(insertError.message);
  return created as ParentProfile;
}

export async function updateParentProfile(updates: Partial<ParentProfile>): Promise<ParentProfile> {
  const { data, error } = await supabase
    .from('parent_profiles')
    .update(updates)
    .eq('id', updates.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ParentProfile;
}

// ─── Ward Linking ─────────────────────────────────────────────

export async function getWardLinks(parentId: string): Promise<WardLink[]> {
  const { data, error } = await supabase
    .from('parent_ward_links')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as WardLink[];
}

export async function getApprovedWards(parentId: string): Promise<Ward[]> {
  const { data: links, error } = await supabase
    .from('parent_ward_links')
    .select('*')
    .eq('parent_id', parentId)
    .eq('status', 'approved')
    .order('responded_at', { ascending: false });

  if (error) throw new Error(error.message);
  if (!links || links.length === 0) return [];

  const wardIds = links.map((l) => l.ward_id);

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', wardIds);

  if (profileError) throw new Error(profileError.message);

  const profileMap = new Map<string, UserProfile>();
  for (const p of profiles ?? []) {
    profileMap.set(p.id, p as UserProfile);
  }

  return links
    .map((link) => {
      const profile = profileMap.get(link.ward_id);
      if (!profile) return null;
      return {
        ...profile,
        link_id: link.id,
        relation: link.relation,
        link_status: link.status as WardLinkStatus,
        linked_at: link.responded_at || link.created_at,
      } as Ward;
    })
    .filter((w): w is Ward => w !== null);
}

export async function searchStudentByCode(code: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('phone_number', code)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as UserProfile) ?? null;
}

export async function searchStudentByPhone(phone: string): Promise<UserProfile | null> {
  const normalized = phone.replace(/\s+/g, '');
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('phone_number', normalized)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as UserProfile) ?? null;
}

export async function searchStudentById(studentId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', studentId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as UserProfile) ?? null;
}

export async function requestWardLink(
  parentId: string,
  wardId: string,
  relation?: string,
  parentCode?: string,
): Promise<WardLink> {
  const { data, error } = await supabase
    .from('parent_ward_links')
    .insert({
      parent_id: parentId,
      ward_id: wardId,
      status: 'pending',
      relation,
      parent_code: parentCode,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await createParentNotification(parentId, {
    type: 'linking_request',
    title: 'Linking request sent',
    body: 'Your request to link with this student has been sent. You will be notified when they respond.',
    ward_id: wardId,
  });

  return data as WardLink;
}

export async function revokeWardLink(linkId: string): Promise<void> {
  const { error } = await supabase
    .from('parent_ward_links')
    .update({ status: 'revoked' })
    .eq('id', linkId);

  if (error) throw new Error(error.message);
}

export async function getPendingLinkingRequests(wardId: string): Promise<LinkingRequest[]> {
  const { data: links, error } = await supabase
    .from('parent_ward_links')
    .select('*')
    .eq('ward_id', wardId)
    .eq('status', 'pending')
    .order('requested_at', { ascending: false });

  if (error) throw new Error(error.message);
  if (!links || links.length === 0) return [];

  const parentIds = links.map((l) => l.parent_id);
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', parentIds);

  if (profileError) throw new Error(profileError.message);

  const profileMap = new Map<string, UserProfile>();
  for (const p of profiles ?? []) {
    profileMap.set(p.id, p as UserProfile);
  }

  return links.map((link) => {
    const profile = profileMap.get(link.parent_id);
    return {
      id: link.id,
      parent_id: link.parent_id,
      parent_name: profile?.full_name || 'Unknown',
      parent_avatar: profile?.profile_photo,
      relation: link.relation,
      status: link.status as WardLinkStatus,
      requested_at: link.requested_at,
    } as LinkingRequest;
  });
}

// ─── Ward Data ────────────────────────────────────────────────

export async function getWardSummary(wardId: string, linkId: string): Promise<WardSummary | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', wardId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile) return null;

  const ward: Ward = {
    ...(profile as UserProfile),
    link_id: linkId,
    link_status: 'approved',
    linked_at: '',
  };

  const [upcomingLessons, subjects, attendance, homework, goals, notifications] = await Promise.all([
    getWardLessons(wardId),
    getWardSubjects(wardId),
    getWardAttendance(wardId),
    getWardHomework(wardId),
    getWardLearningGoals(wardId),
    getUnreadNotificationCount(wardId),
  ]);

  const upcoming = upcomingLessons.filter(
    (l) => l.status === 'scheduled' || l.status === 'in_progress',
  );

  const attendanceRate =
    attendance.length > 0
      ? Math.round(
          (attendance.filter((a) => a.status === 'present').length / attendance.length) * 100,
        )
      : 100;

  return {
    ward,
    upcoming_lessons: upcoming,
    active_subjects: subjects,
    attendance_rate: attendanceRate,
    pending_homework: homework.filter((h) => h.status === 'pending' || h.status === 'overdue').length,
    active_goals: goals.filter((g) => g.status !== 'achieved').length,
    unread_notifications: notifications,
  };
}

export async function getWardSubjects(wardId: string): Promise<WardSubject[]> {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, tutor:tutor_id(id, full_name, profile_photo, verification_status)')
    .eq('student_id', wardId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const subjectMap = new Map<string, WardSubject>();
  for (const b of (bookings ?? []) as (Booking & { tutor?: UserProfile })[]) {
    const key = `${b.subject}-${b.tutor_id}`;
    if (!subjectMap.has(key)) {
      const completed = (bookings ?? []).filter(
        (x) => x.subject === b.subject && x.tutor_id === b.tutor_id && x.status === 'completed',
      ).length;
      const total = (bookings ?? []).filter(
        (x) => x.subject === b.subject && x.tutor_id === b.tutor_id,
      ).length;
      subjectMap.set(key, {
        id: key,
        name: b.subject,
        tutor_id: b.tutor_id,
        tutor_name: b.tutor?.full_name || 'Tutor',
        tutor_avatar: b.tutor?.profile_photo,
        tutor_verified: b.tutor?.verification_status === 'approved',
        progress_percent: total > 0 ? Math.round((completed / total) * 100) : 0,
        lessons_completed: completed,
        lessons_total: total,
      });
    }
  }

  return Array.from(subjectMap.values());
}

export async function getWardTutors(wardId: string): Promise<WardTutor[]> {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('tutor_id')
    .eq('student_id', wardId);

  if (error) throw new Error(error.message);

  const tutorIds = Array.from(new Set((bookings ?? []).map((b: { tutor_id: string }) => b.tutor_id)));
  if (tutorIds.length === 0) return [];

  const { data: tutorProfiles, error: tpError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', tutorIds);

  if (tpError) throw new Error(tpError.message);

  const { data: tutorDetails, error: tdError } = await supabase
    .from('tutor_profiles')
    .select('*')
    .in('user_id', tutorIds);

  if (tdError) throw new Error(tdError.message);

  const detailMap = new Map<string, Record<string, unknown>>();
  for (const d of tutorDetails ?? []) {
    detailMap.set(d.user_id, d);
  }

  return (tutorProfiles ?? []).map((p) => {
    const details = detailMap.get(p.id);
    return {
      id: p.id,
      full_name: p.full_name || 'Tutor',
      profile_photo: p.profile_photo,
      bio: details?.bio,
      subjects: details?.subjects ?? [],
      verification_status: details?.verification_status ?? 'pending',
      rating_avg: details?.rating_avg ?? 0,
      rating_count: details?.rating_count ?? 0,
      total_sessions: details?.total_sessions ?? 0,
      hourly_rate: details?.hourly_rate ?? 0,
      qualifications: details?.qualifications,
      location: p.location,
      availability_notes: details?.availability_notes,
    } as WardTutor;
  });
}

export async function getWardTutor(tutorId: string): Promise<WardTutor | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', tutorId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile) return null;

  const { data: details, error: detailsError } = await supabase
    .from('tutor_profiles')
    .select('*')
    .eq('user_id', tutorId)
    .maybeSingle();

  if (detailsError) throw new Error(detailsError.message);

  return {
    id: profile.id,
    full_name: profile.full_name || 'Tutor',
    profile_photo: profile.profile_photo,
    bio: details?.bio,
    subjects: details?.subjects ?? [],
    verification_status: details?.verification_status ?? 'pending',
    rating_avg: details?.rating_avg ?? 0,
    rating_count: details?.rating_count ?? 0,
    total_sessions: details?.total_sessions ?? 0,
    hourly_rate: details?.hourly_rate ?? 0,
    qualifications: details?.qualifications,
    location: profile.location,
    availability_notes: details?.availability_notes,
  } as WardTutor;
}

export async function getWardLessons(wardId: string): Promise<WardLesson[]> {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, tutor:tutor_id(id, full_name, profile_photo)')
    .eq('student_id', wardId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (bookings ?? []).map((b: Booking & { tutor?: UserProfile }) => {
    const rawStatus = String(b.status);
    let trackingStatus: LessonTrackingStatus = 'scheduled';
    if (rawStatus === 'completed') trackingStatus = 'completed';
    else if (rawStatus === 'cancelled') trackingStatus = 'cancelled';
    else if (rawStatus === 'accepted' || rawStatus === 'confirmed') trackingStatus = 'scheduled';

    return {
      id: b.id,
      subject: b.subject,
      tutor_id: b.tutor_id,
      tutor_name: b.tutor?.full_name || 'Tutor',
      tutor_avatar: b.tutor?.profile_photo,
      status: trackingStatus,
      scheduled_time: b.scheduled_time || b.start_time || b.created_at,
      end_time: b.end_time,
      duration_hours: b.total_amount ? undefined : undefined,
      total_amount: b.total_amount,
      meet_link: (b as any).meet_link,
      location_sharing_consent: false,
      is_in_person: !(b as any).meet_link,
      created_at: b.created_at,
    } as WardLesson;
  });
}

export async function getWardAttendance(wardId: string): Promise<WardAttendance[]> {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('subject, scheduled_time, start_time, status, tutor:tutor_id(full_name)')
    .eq('student_id', wardId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  return (bookings ?? []).map((b: any) => ({
    id: `${b.subject}-${b.scheduled_time || b.start_time}`,
    subject: b.subject,
    date: b.scheduled_time || b.start_time,
    status: 'present' as const,
    tutor_name: b.tutor?.full_name || 'Tutor',
  })) as WardAttendance[];
}

export async function getWardHomework(wardId: string): Promise<WardHomework[]> {
  // Homework is not yet in the backend schema — return empty for now.
  // When the backend adds a homework table, this function will query it.
  void wardId;
  return [];
}

export async function getWardAssignments(wardId: string): Promise<WardAssignment[]> {
  void wardId;
  return [];
}

export async function getWardProgressReports(wardId: string): Promise<WardProgressReport[]> {
  void wardId;
  return [];
}

export async function getWardLearningGoals(wardId: string): Promise<WardLearningGoal[]> {
  void wardId;
  return [];
}

export async function getWardPayments(wardId: string): Promise<WardPayment[]> {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, payments(*), tutor:tutor_id(full_name)')
    .eq('student_id', wardId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const results: WardPayment[] = [];
  for (const b of (bookings ?? []) as any[]) {
    if (b.payments && b.payments.length > 0) {
      for (const payment of b.payments) {
        results.push({
          payment,
          booking: b as Booking,
          tutor_name: b.tutor?.full_name || 'Tutor',
          subject: b.subject,
        });
      }
    }
  }

  return results;
}

// ─── Notifications ────────────────────────────────────────────

export async function getParentNotifications(parentId: string): Promise<ParentNotification[]> {
  const { data, error } = await supabase
    .from('parent_notifications')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const notifications = (data ?? []) as ParentNotification[];

  const wardIds = Array.from(new Set(notifications.map((n) => n.ward_id).filter(Boolean) as string[]));
  if (wardIds.length > 0) {
    const { data: wardProfiles, error: wardError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', wardIds);

    if (!wardError && wardProfiles) {
      const nameMap = new Map<string, string>();
      for (const p of wardProfiles) {
        nameMap.set(p.id, p.full_name || 'Student');
      }
      for (const n of notifications) {
        if (n.ward_id) {
          n.ward_name = nameMap.get(n.ward_id);
        }
      }
    }
  }

  return notifications;
}

export async function getUnreadNotificationCount(parentId: string): Promise<number> {
  const { count, error } = await supabase
    .from('parent_notifications')
    .select('*', { count: 'exact', head: true })
    .eq('parent_id', parentId)
    .eq('is_read', false);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('parent_notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw new Error(error.message);
}

export async function markAllNotificationsRead(parentId: string): Promise<void> {
  const { error } = await supabase
    .from('parent_notifications')
    .update({ is_read: true })
    .eq('parent_id', parentId)
    .eq('is_read', false);

  if (error) throw new Error(error.message);
}

export async function createParentNotification(
  parentId: string,
  payload: {
    type: ParentNotificationType;
    title: string;
    body: string;
    ward_id?: string;
    data?: Record<string, unknown>;
  },
): Promise<void> {
  const { error } = await supabase.from('parent_notifications').insert({
    parent_id: parentId,
    ...payload,
  });

  if (error) throw new Error(error.message);
}

export async function deleteParentNotification(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('parent_notifications')
    .delete()
    .eq('id', notificationId);

  if (error) throw new Error(error.message);
}

// ─── Tutor Reviews (for tutor detail) ─────────────────────────

export async function getTutorReviews(tutorId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, student:student_id(id, full_name, profile_photo), booking:booking_id(subject, scheduled_time)')
    .eq('tutor_id', tutorId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getTutorLessonHistoryForWard(tutorId: string, wardId: string): Promise<WardLesson[]> {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, tutor:tutor_id(id, full_name, profile_photo)')
    .eq('student_id', wardId)
    .eq('tutor_id', tutorId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (bookings ?? []).map((b: Booking & { tutor?: UserProfile }) => {
    const rawStatus = String(b.status);
    let trackingStatus: LessonTrackingStatus = 'scheduled';
    if (rawStatus === 'completed') trackingStatus = 'completed';
    else if (rawStatus === 'cancelled') trackingStatus = 'cancelled';

    return {
      id: b.id,
      subject: b.subject,
      tutor_id: b.tutor_id,
      tutor_name: b.tutor?.full_name || 'Tutor',
      tutor_avatar: b.tutor?.profile_photo,
      status: trackingStatus,
      scheduled_time: b.scheduled_time || b.start_time || b.created_at,
      end_time: b.end_time,
      total_amount: b.total_amount,
      meet_link: (b as any).meet_link,
      location_sharing_consent: false,
      is_in_person: !(b as any).meet_link,
      created_at: b.created_at,
    } as WardLesson;
  });
}

// ─── Location Sharing Consent ─────────────────────────────────

export async function updateLocationConsent(
  lessonId: string,
  consent: boolean,
): Promise<void> {
  // This would update a location_sharing_consent field on the booking.
  // Backend recommendation: ALTER TABLE bookings ADD COLUMN location_sharing_consent boolean DEFAULT false;
  // For now, we store this in the parent_notifications data or a separate consent table.
  // Using a no-op until the backend adds the column.
  void lessonId;
  void consent;
}
