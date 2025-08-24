import { Course } from './course.model';
import { Student } from './student.model';

export interface StudentCourseAssignment {
  assignmentId?: number;
  course: Course;
  student: Student;
}
