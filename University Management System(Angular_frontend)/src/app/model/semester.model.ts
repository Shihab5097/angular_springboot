import { Department } from "./department.model";
import { AcademicProgram } from "./academicProgram.model";

export interface Semester {
  semesterId?: number;
  semesterName: string;
  semesterCode: string;
  startDate: string;
  endDate: string;
  description?: string;
  status: string;
  department: Department;
  academicProgram: AcademicProgram;
}
