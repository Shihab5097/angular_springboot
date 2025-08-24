
import { Component, OnInit } from '@angular/core';
import { Department } from '../model/department.model';
import { Faculty } from '../model/faculty.model';
import { DepartmentService } from '../service/department.service';
import { FacultyService } from '../service/faculty.service';


@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css']
})
export class DepartmentManagementComponent implements OnInit {
  departments: Department[] = [];
  faculties: Faculty[] = [];

  // Form ডেটা
  departmentForm: Department = this.createEmptyDepartment();

  constructor(
    private departmentService: DepartmentService,
    private facultyService: FacultyService
  ) {}

  ngOnInit(): void {
    this.loadFaculties();
    this.loadDepartments();
  }

  // সমস্ত Faculty লোড করবে (dropdown এর জন্য)
  loadFaculties(): void {
    this.facultyService.getAll().subscribe(
      (data: Faculty[]) => {
        this.faculties = data;
      },
      (error) => {
        console.error('Error loading faculties:', error);
        alert('Error loading faculties: ' + (error.error?.message || error.message));
      }
    );
  }

  // সমস্ত Department লোড করবে (table এর জন্য)
  loadDepartments(): void {
    this.departmentService.getAll().subscribe(
      (data: Department[]) => {
        this.departments = data;
      },
      (error) => {
        console.error('Error loading departments:', error);
        alert('Error loading departments: ' + (error.error?.message || error.message));
      }
    );
  }

  // খালি Department অবজেক্ট তৈরি করে রিটার্ন করবে
  createEmptyDepartment(): Department {
    return {
      departmentCode: '',
      departmentName: '',
      chairmanName: '',
      establishedYear: new Date().getFullYear(),
      description: '',
      status: 'Active',
      faculty: {
        facultyId: 0,
        facultyCode: '',
        facultyName: '',
        deanName: '',
        deanEmail: '',
        deanContact: '',
        establishedYear: new Date().getFullYear(),
        description: '',
        facultyWebsite: '',
        location: '',
        status: 'Active',
        totalDepartments: 0
      }
    };
  }

  // Save অথবা Update
  saveDepartment(): void {
    // Basic Validation
    if (!this.departmentForm.departmentCode || this.departmentForm.departmentCode.trim() === '') {
      alert('Department Code is required.');
      return;
    }
    if (!this.departmentForm.departmentName || this.departmentForm.departmentName.trim() === '') {
      alert('Department Name is required.');
      return;
    }
    if (!this.departmentForm.faculty || !this.departmentForm.faculty.facultyId) {
      alert('Please select a Faculty.');
      return;
    }

    if (this.departmentForm.departmentId) {
      // Update existing Department
      this.departmentService.update(this.departmentForm.departmentId, this.departmentForm).subscribe(
        (res) => {
          alert('Department updated successfully.');
          this.loadDepartments();
          this.resetForm();
        },
        (error) => {
          console.error('Error updating department:', error);
          alert('Error updating department: ' + (error.error?.message || error.message));
        }
      );
    } else {
      // Create new Department
      this.departmentService.create(this.departmentForm).subscribe(
        (res) => {
          alert('Department created successfully.');
          this.loadDepartments();
          this.resetForm();
        },
        (error) => {
          console.error('Error creating department:', error);
          alert('Error creating department: ' + (error.error?.message || error.message));
        }
      );
    }
  }

  // Edit বাটন ক্লিকে Form-এ ভ্যালু লোড
  editDepartment(dept: Department): void {
    // Deep copy করা হচ্ছে যাতে সরাসরি প্রভাব না পড়ে
    this.departmentForm = { 
      ...dept, 
      faculty: { ...dept.faculty } 
    };
  }

  // Delete Department
  deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.delete(id).subscribe(
        () => {
          alert('Department deleted successfully.');
          this.loadDepartments();
        },
        (error) => {
          console.error('Error deleting department:', error);
          alert('Error deleting department: ' + (error.error?.message || error.message));
        }
      );
    }
  }

  // Form Reset করে খালি অবজেক্ট দিয়ে পূরণ করবে
  resetForm(): void {
    this.departmentForm = this.createEmptyDepartment();
  }
}
