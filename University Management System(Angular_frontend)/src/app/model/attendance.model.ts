export interface Attendance {
  attendanceId?: number;
  courseId:      number;
  studentId:     number;
  date:          string;   // YYYY-MM-DD
  present:       boolean;
}
