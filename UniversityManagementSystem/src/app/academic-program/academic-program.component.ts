import { Component, OnInit } from '@angular/core';
import { Department } from '../model/department.model';
import { DepartmentService } from '../service/department.service';
import { AcademicProgram } from '../model/academicProgram.model';
import { AcademicProgramService } from '../service/academicProgram.service';

@Component({
  selector: 'app-academic-program',
  templateUrl: './academic-program.component.html',
  styleUrls: ['./academic-program.component.css']
})
export class AcademicProgramComponent implements OnInit {
  departments: Department[] = [];
  programs: AcademicProgram[] = [];
  programForm: AcademicProgram = this.createEmptyProgram();
  selectedDepartmentId: number | null = null;

  constructor(
    private academicProgramService: AcademicProgramService,
    private departmentService: DepartmentService
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  
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

  
  onDepartmentChange(): void {
    if (this.selectedDepartmentId) {
      this.academicProgramService.getByDepartment(this.selectedDepartmentId).subscribe(
        (data: AcademicProgram[]) => {
          this.programs = data;
          this.resetForm(); 
        },
        (error) => {
          console.error('Error loading programs for department:', error);
          alert('Error loading programs: ' + (error.error?.message || error.message));
        }
      );
    } else {
      
      this.programs = [];
      this.resetForm();
    }
  }

 
  private createEmptyProgram(): AcademicProgram {
    return {
      programCode: '',
      programName: '',
      durationYears: 1,
      description: '',
      status: 'Active',
      department: {
        departmentId: 0,
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
      }
    };
  }

 
  saveProgram(): void {
    
    if (!this.selectedDepartmentId) {
      alert('Please select a department first.');
      return;
    }
    if (!this.programForm.programCode.trim()) {
      alert('Program Code is required.');
      return;
    }
    if (!this.programForm.programName.trim()) {
      alert('Program Name is required.');
      return;
    }

    
    this.programForm.department.departmentId = this.selectedDepartmentId;

    if (this.programForm.programId) {
      
      this.academicProgramService.update(this.programForm.programId, this.programForm).subscribe(
        () => {
          alert('Academic Program updated successfully.');
          this.onDepartmentChange(); 
        },
        (error) => {
          console.error('Error updating program:', error);
          alert('Error updating program: ' + (error.error?.message || error.message));
        }
      );
    } else {
      
      this.academicProgramService.create(this.programForm).subscribe(
        () => {
          alert('Academic Program created successfully.');
          this.onDepartmentChange(); 
        },
        (error) => {
          console.error('Error creating program:', error);
          alert('Error creating program: ' + (error.error?.message || error.message));
        }
      );
    }
  }

  
  editProgram(prog: AcademicProgram): void {
    
    this.programForm = {
      ...prog,
      department: { ...prog.department }
    };
  }

  
  deleteProgram(id: number): void {
    if (confirm('Are you sure you want to delete this Academic Program?')) {
      this.academicProgramService.delete(id).subscribe(
        () => {
          alert('Academic Program deleted successfully.');
          this.onDepartmentChange(); 
        },
        (error) => {
          console.error('Error deleting program:', error);
          alert('Error deleting program: ' + (error.error?.message || error.message));
        }
      );
    }
  }

  
  resetForm(): void {
    this.programForm = this.createEmptyProgram();
  }
}
