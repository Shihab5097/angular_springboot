export interface Faculty {
  facultyId?: number;
  facultyCode: string;
  facultyName: string;
  deanName: string;
  deanEmail: string;
  deanContact: string;
  establishedYear: number;
  description: string;
  facultyWebsite: string;
  location: string;
  status: string; // "Active" / "Inactive"
  totalDepartments: number;
}
