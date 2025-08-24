import { Department } from './department.model';

export interface AcademicProgram {
  programId?: number;
  programCode: string;
  programName: string;
  durationYears: number;
  description: string;
  status: string;    // "Active" / "Inactive"
  department: Department;
}
