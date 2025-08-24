export interface GradeCourse {
  courseId: number;
  courseName: string;
  totalMarks: number;
}

export interface GradeModel {
  gradeId?: number;
  departmentId: number;
  semesterId: number;
  studentId: number;
  studentName: string;
  courseId?: number;
  assignedCourses: GradeCourse[];
  totalMarks: number;
  cgpa: number;
  grade: string;
  remarks?: string;
}

export interface ResultModel {
  resultId?: number;
  departmentId: number;
  semesterId: number;
  courseId: number;
  studentId: number;
  studentName?: string;
  classTestMark: number;
  labMark: number;
  attendanceMark: number;
  finalExamMark: number;
  totalMark?: number;
}
