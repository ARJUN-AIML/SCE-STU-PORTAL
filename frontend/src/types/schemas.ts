import { z } from "zod";

export const NoticeSchema = z.object({
  id: z.string().catch(""),
  title: z.string().catch("Untitled Notice"),
  date: z.string().catch(new Date().toISOString()),
  category: z.string().catch("general"),
  summary: z.string().catch(""),
  fileUrl: z.string().optional().catch(""),
  isUrgent: z.boolean().catch(false),
});
export type Notice = z.infer<typeof NoticeSchema>;

export const EventSchema = z.object({
  id: z.string().catch(""),
  title: z.string().catch("Untitled Event"),
  meta: z.string().catch("No details available"),
  flag: z.string().optional().catch(""),
  thumbnail: z.string().catch(""),
  status: z.enum(["open", "closed", "full", "past"]).catch("open"),
  seatsLeft: z.number().catch(0),
  registered: z.boolean().catch(false),
  isRecommended: z.boolean().catch(false),
  time: z.string().optional().catch(""),
  venue: z.string().optional().catch(""),
  coordinator: z.string().optional().catch(""),
  imageUrl: z.string().optional().nullable().catch(null),
  imageGenerationStatus: z.string().optional().catch("Pending"),
});
export type EventItem = z.infer<typeof EventSchema>;

export const ClubSchema = z.object({
  id: z.string().catch(""),
  title: z.string().catch("Untitled Club"),
  meta: z.string().catch("No details available"),
  thumbnail: z.string().catch(""),
  status: z.enum(["open", "closed"]).catch("open"),
  registered: z.boolean().catch(false),
  isRecommended: z.boolean().catch(false),
  category: z.string().optional().catch(""),
  coordinator: z.string().optional().catch(""),
});
export type ClubItem = z.infer<typeof ClubSchema>;

export const FacultySchema = z.object({
  id: z.string().catch(""),
  name: z.string().catch("Unknown Faculty"),
  role: z.string().catch("Faculty"),
  administrativeRole: z.string().optional().catch(""),
  department: z.string().catch("General"),
  avatar: z.string().catch(""),
  status: z.enum(["available", "busy", "offline"]).catch("offline"),
  email: z.string().catch(""),
  office: z.string().catch(""),
  qualification: z.string().optional().catch(""),
  specialization: z.string().optional().catch(""),
  officeHours: z.string().catch(""),
  expertise: z.array(z.string()).catch([]),
});
export type Faculty = z.infer<typeof FacultySchema>;

export const DepartmentSchema = z.object({
  id: z.string().catch(""),
  code: z.string().optional().catch(""),
  name: z.string().catch("Unknown Department"),
  description: z.string().optional().catch(""),
  facultyCount: z.number().catch(0),
  hod: z.object({
    name: z.string(),
    email: z.string()
  }).nullable().catch(null)
});
export type Department = z.infer<typeof DepartmentSchema>;

export const ScheduleEntrySchema = z.object({
  id: z.string().catch(""),
  department: z.string().catch("General"),
  regulation: z.string().optional().catch("2021"),
  academicYear: z.string().optional().catch("2026-2027"),
  version: z.string().optional().catch("1.0"),
  lastUpdated: z.string().optional().catch(new Date().toISOString()),
  year: z.string().catch("1"),
  semester: z.string().catch("1"),
  section: z.string().catch("A"),
  day: z.string().catch("Monday"),
  period: z.string().optional().catch("1"),
  startTime: z.string().optional().catch(""),
  endTime: z.string().optional().catch(""),
  subjectName: z.string().catch("Unknown Session"),
  subjectCode: z.string().optional().catch(""),
  faculty: z.string().catch(""),
  room: z.string().catch(""),
  building: z.string().optional().catch(""),
  credits: z.string().optional().catch("0"),
  classType: z.string().optional().catch("Lecture"),
  laboratory: z.string().optional().catch(""),
  elective: z.string().optional().catch(""),
  batch: z.string().optional().catch(""),
  remarks: z.string().optional().catch(""),

  // Legacy fields for backward compatibility
  row: z.string().optional().catch(""),
  time: z.string().optional().catch(""),
  title: z.string().optional().catch(""),
  color: z.string().optional().catch("blue"),
  subject: z.string().optional().catch(""),
});
export type ScheduleEntry = z.infer<typeof ScheduleEntrySchema>;

export const StudentSchema = z.object({
  id: z.string().catch(""),
  displayName: z.string().catch("Student"),
  email: z.string().catch(""),
  photoURL: z.string().catch(""),
});
export type Student = z.infer<typeof StudentSchema>;

export const TransportStopSchema = z.object({
  name: z.string().catch("Unknown Stop"),
  time: z.string().catch("00:00 AM"),
});
export type TransportStop = z.infer<typeof TransportStopSchema>;

export const TransportSchema = z.object({
  id: z.string().catch(""),
  routeName: z.string().catch("Unknown Route"),
  busNumber: z.string().catch(""),
  driverName: z.string().catch("Driver"),
  driverPhone: z.string().catch(""),
  status: z.enum(["on-time", "delayed", "arrived"]).catch("on-time"),
  stops: z.array(TransportStopSchema).catch([]),
});
export type TransportRoute = z.infer<typeof TransportSchema>;

export const ResourceSchema = z.object({
  id: z.string().catch(""),
  title: z.string().catch("Untitled Document"),
  type: z.string().catch("Document"),
  category: z.string().catch("General"),
  link: z.string().catch("#"),
  author: z.string().optional().catch(""),
});
export type ResourceItem = z.infer<typeof ResourceSchema>;

