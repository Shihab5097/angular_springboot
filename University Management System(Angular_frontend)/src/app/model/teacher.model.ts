export interface Teacher {
  teacherId?: number;
  teacherName: string;
  teacherEmail: string;
  teacherContact: string;
  designation: string;
  status: string;  // "Active" / "Inactive"
  department: {
    departmentId: number;
    departmentName?: string;
  };
}
