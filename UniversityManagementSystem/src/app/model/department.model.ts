import { Faculty } from './faculty.model';

export interface Department {
  departmentId?: number;
  departmentCode: string;
  departmentName: string;
  chairmanName: string;
  establishedYear: number;
  description: string;
  status: string;   
  faculty: Faculty; 
}
