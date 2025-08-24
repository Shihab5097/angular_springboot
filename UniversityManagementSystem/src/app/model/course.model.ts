import { Department } from './department.model';
import { AcademicProgram } from './academicProgram.model';
import { Semester } from './semester.model';

export interface Course {
  courseId?:    number;
  courseCode:   string;
  courseTitle:  string;
  credit:       number;
  type:         'Theory' | 'Lab';
  isOptional:   boolean;
  department:  Department | null;
  program:     AcademicProgram | null;
  semester?:    Semester | null;

}
