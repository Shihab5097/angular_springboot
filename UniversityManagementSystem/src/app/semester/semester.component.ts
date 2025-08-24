import { Component, OnInit } from '@angular/core';
import { Semester } from '../model/semester.model';
import { Department } from '../model/department.model';
import { AcademicProgram } from '../model/academicProgram.model';
import { SemesterService } from '../service/semester.service';
import { DepartmentService } from '../service/department.service';
import { AcademicProgramService } from '../service/academicProgram.service';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.css']
})
export class SemesterComponent implements OnInit {
  semesters: Semester[] = [];
  departments: Department[] = [];
  programs: AcademicProgram[] = [];
  filteredPrograms: AcademicProgram[] = [];

  newSemester: Semester = this.createEmptySemester();

  constructor(
    private semesterService: SemesterService,
    private departmentService: DepartmentService,
    private programService: AcademicProgramService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadPrograms();
    this.loadSemesters();
  }

  createEmptySemester(): Semester {
    return {
      semesterName: '',
      semesterCode: '',
      startDate: '',
      endDate: '',
      description: '',
      status: 'Upcoming',
      department: {} as Department,
      academicProgram: {} as AcademicProgram
    };
  }

  onDepartmentChange(): void {
    if (this.newSemester.department?.departmentId) {
      this.filteredPrograms = this.programs.filter(
        p => p.department.departmentId === this.newSemester.department.departmentId
      );
    } else {
      this.filteredPrograms = [];
    }
  }

  saveSemester(): void {
    if (this.newSemester.semesterId) {
      this.semesterService.update(this.newSemester.semesterId, this.newSemester).subscribe(() => {
        this.loadSemesters();
        this.resetForm();
      });
    } else {
      this.semesterService.create(this.newSemester).subscribe(() => {
        this.loadSemesters();
        this.resetForm();
      });
    }
  }

  editSemester(sem: Semester): void {
    this.newSemester = JSON.parse(JSON.stringify(sem));
    this.onDepartmentChange();
  }

  deleteSemester(id: number): void {
    if (confirm('Are you sure to delete?')) {
      this.semesterService.delete(id).subscribe(() => {
        this.loadSemesters();
      });
    }
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe(data => this.departments = data);
  }

  loadPrograms(): void {
    this.programService.getAll().subscribe(data => this.programs = data);
  }

  loadSemesters(): void {
    this.semesterService.getAll().subscribe(data => this.semesters = data);
  }

  resetForm(): void {
    this.newSemester = this.createEmptySemester();
  }
}