export interface Student {
  studentId?: number;
  studentName: string;
  studentEmail: string;
  studentContact: string;
  status: string;             // "Active" / "Inactive"
  department: { departmentId: number; departmentName?: string };
  academicProgram: { programId: number; programName?: string };
  batch: { batchId: number; name?: string };
  semester: { semesterId: number; semesterName?: string };
}
