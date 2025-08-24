// src/app/model/result.model.ts
export interface Result {
  resultId?: number;
  departmentId: number;
  semesterId: number;
  courseId: number;
  studentId: number;
  classTestMark: number;
  labMark: number;
  attendancePct: number;  // fetched from AttendanceService
  attendanceMark: number;  // optional override or input
  finalExamMark: number;
  totalMark?: number;  // calculated on backend
}
