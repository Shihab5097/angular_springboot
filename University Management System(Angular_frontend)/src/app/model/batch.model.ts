import { Department } from './department.model';
import { AcademicProgram } from './academicProgram.model';

export interface Batch {
  batchId?: number;
  name: string;
  startYear: string;
  endYear: string;
  department: Department;
  academicProgram: AcademicProgram;
}