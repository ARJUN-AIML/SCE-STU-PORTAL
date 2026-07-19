import { z } from "zod";
import { 
  NoticeSchema, Notice, 
  EventSchema, EventItem, 
  ClubSchema, ClubItem, 
  FacultySchema, Faculty, 
  DepartmentSchema, Department,
  ScheduleEntrySchema, ScheduleEntry,
  TransportSchema, TransportRoute,
  ResourceSchema, ResourceItem
} from "@/types";

function safeParse<T>(schema: z.ZodType<T>, data: any, fallback: Partial<T> = {}): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  console.warn("[Normalizer] Validation failed, applying safe defaults:", result.error);
  return schema.parse(fallback);
}

export function normalizeNotice(raw: any): Notice {
  return safeParse(NoticeSchema, {
    id: raw?.id || raw?.notice_id || crypto.randomUUID(),
    title: raw?.title || raw?.notice_title || "Untitled",
    date: raw?.date || raw?.created_at || new Date().toISOString(),
    category: raw?.category || raw?.type || "general",
    summary: raw?.summary || raw?.description || "",
    fileUrl: raw?.fileUrl || raw?.url || "",
    isUrgent: Boolean(raw?.isUrgent || raw?.urgent),
  });
}

export function normalizeEvent(raw: any): EventItem {
  return safeParse(EventSchema, {
    id: raw?.id || raw?.event_id || raw?.event_name || crypto.randomUUID(),
    title: raw?.title || raw?.event_name || "Untitled Event",
    meta: raw?.meta || raw?.description || raw?.focus_area || "No details available",
    flag: raw?.flag || raw?.type || "",
    thumbnail: raw?.thumbnail || raw?.image || "📅",
    status: raw?.status || "open",
    seatsLeft: Number(raw?.seatsLeft ?? raw?.seats_left ?? 0),
    registered: Boolean(raw?.registered || raw?.is_registered),
    isRecommended: Boolean(raw?.isRecommended || raw?.recommended),
    coordinator: raw?.coordinator || raw?.incharge || "",
    time: raw?.time || raw?.timing || "",
    venue: raw?.venue || raw?.location || "",
    imageUrl: raw?.image_url || null,
    imageGenerationStatus: raw?.image_generation_status || "Pending",
  });
}

export function normalizeClub(raw: any): ClubItem {
  return safeParse(ClubSchema, {
    id: raw?.id || raw?.club_id || raw?.club_name || crypto.randomUUID(),
    title: raw?.title || raw?.club_name || "Untitled Club",
    meta: raw?.meta || raw?.description || raw?.focus_area || "No details available",
    thumbnail: raw?.thumbnail || raw?.image || "👥",
    status: raw?.status || "open",
    registered: Boolean(raw?.registered || raw?.is_registered),
    isRecommended: Boolean(raw?.isRecommended || raw?.recommended),
  });
}

export function normalizeDepartment(raw: any): Department {
  return safeParse(DepartmentSchema, {
    id: String(raw?.id || ""),
    code: raw?.code || "",
    name: raw?.name || "Unknown Department",
    description: raw?.description || "",
    facultyCount: Number(raw?.facultyCount || 0),
    hod: raw?.hod ? { name: raw.hod.name, email: raw.hod.email } : null
  });
}

export function normalizeFaculty(raw: any): Faculty {
  return safeParse(FacultySchema, {
    id: String(raw?.id || raw?.faculty_id || crypto.randomUUID()),
    name: raw?.full_name || raw?.name || raw?.faculty_name || "Unknown Faculty",
    role: raw?.designation || raw?.role || "Faculty",
    administrativeRole: raw?.administrative_role || "",
    department: raw?.department || raw?.dept || "General",
    avatar: raw?.image_url || raw?.avatar || "",
    status: raw?.status || "available",
    email: raw?.email || raw?.contact_email || "",
    office: raw?.office_room || raw?.office || raw?.room || "",
    qualification: raw?.qualification || "",
    specialization: raw?.specialization || "",
    officeHours: raw?.officeHours || raw?.office_hours || "",
    expertise: Array.isArray(raw?.expertise) ? raw.expertise : (raw?.specialization ? [raw.specialization] : []),
  });
}

export function normalizeSchedule(raw: any): ScheduleEntry {
  const isLegacy = !raw?.subjectCode && !raw?.classType;
  
  return safeParse(ScheduleEntrySchema, {
    id: raw?.id || raw?.schedule_id || crypto.randomUUID(),
    department: raw?.department || "General",
    regulation: raw?.regulation || "2021",
    academicYear: raw?.academicYear || raw?.academic_year || "2026-2027",
    version: raw?.version || "1.0",
    lastUpdated: raw?.lastUpdated || raw?.last_updated || new Date().toISOString(),
    year: String(raw?.year || "1"),
    semester: String(raw?.semester || "1"),
    section: raw?.section || "A",
    day: raw?.day || "Monday",
    period: String(raw?.period || raw?.row || "1"),
    startTime: raw?.startTime || raw?.start_time || raw?.time?.split('-')[0]?.trim() || "00:00",
    endTime: raw?.endTime || raw?.end_time || raw?.time?.split('-')[1]?.trim() || "00:00",
    subjectName: raw?.subjectName || raw?.subject_name || raw?.title || raw?.course_name || "Unknown Session",
    subjectCode: raw?.subjectCode || raw?.subject_code || (isLegacy ? "" : raw?.subject || ""),
    faculty: raw?.faculty || raw?.teacher || "",
    room: raw?.room || raw?.venue || "",
    building: raw?.building || "",
    credits: String(raw?.credits || "0"),
    classType: raw?.classType || raw?.class_type || "Lecture",
    laboratory: raw?.laboratory || "",
    elective: raw?.elective || "",
    batch: raw?.batch || "",
    remarks: raw?.remarks || "",

    // Legacy fallback mappings
    row: raw?.row || raw?.period || "06",
    time: raw?.time || (raw?.startTime ? `${raw.startTime}-${raw.endTime}` : "00:00"),
    title: raw?.title || raw?.subjectName || raw?.course_name || "Session",
    color: raw?.color || "blue",
    subject: raw?.subject || raw?.subjectName || raw?.course || "",
  });
}

export function normalizeResource(raw: any): ResourceItem {
  return safeParse(ResourceSchema, {
    id: raw?.id || crypto.randomUUID(),
    title: raw?.title || raw?.name || "Resource",
    type: raw?.type || raw?.category || "document",
    category: raw?.category || raw?.department || "General",
    link: raw?.url || raw?.link || "#",
    author: raw?.author || raw?.creator || "",
  });
}

export function normalizeTransport(raw: any): TransportRoute {
  return safeParse(TransportSchema, {
    id: raw?.id || raw?.route_id || crypto.randomUUID(),
    routeName: raw?.routeName || raw?.route_name || "Unknown Route",
    busNumber: raw?.busNumber || raw?.bus_no || "",
    driverName: raw?.driverName || raw?.driver || "Driver",
    driverPhone: raw?.driverPhone || raw?.phone || "",
    status: raw?.status || "on-time",
    stops: Array.isArray(raw?.stops) ? raw.stops : [],
  });
}
