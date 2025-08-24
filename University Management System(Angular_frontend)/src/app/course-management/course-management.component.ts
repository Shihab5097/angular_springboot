import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Department } from '../model/department.model';
import { AcademicProgram } from '../model/academicProgram.model';
import { Course } from '../model/course.model';
import { CourseService } from '../service/course.service';
import { DepartmentService } from '../service/department.service';
import { AcademicProgramService } from '../service/academicProgram.service';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css']
})
export class CourseManagementComponent implements OnInit {
  courses: Course[] = [];
  departments: Department[] = [];
  programs: AcademicProgram[] = [];
  filteredPrograms: AcademicProgram[] = [];

  newCourse: Course = this.createEmptyCourse();

  constructor(
    private courseService: CourseService,
    private deptService: DepartmentService,
    private programService: AcademicProgramService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.deptService.getAll().subscribe(depts => this.departments = depts);
    this.programService.getAll().subscribe(progs => this.programs = progs);
  }

  onDepartmentChange(): void {
    const deptId = this.newCourse.department?.departmentId;
    if (deptId) {
      this.filteredPrograms = this.programs.filter(
        p => p.department.departmentId === deptId
      );
    } else {
      this.filteredPrograms = [];
    }
    this.newCourse.program = null;
  }

  loadCourses(): void {
    this.courseService.getAllCourses()
      .subscribe(data => this.courses = data);
  }

  saveCourse(form: NgForm): void {
    if (this.newCourse.department && this.newCourse.program) {
      const op = this.newCourse.courseId
        ? this.courseService.updateCourse(this.newCourse)
        : this.courseService.addCourse(this.newCourse);

      op.subscribe(() => {
        this.loadCourses();
        this.resetForm(form);
      });
    }
  }

  editCourse(course: Course): void {
    // deep copy to avoid two-way binding overwrites
    this.newCourse = { ...course };
    this.onDepartmentChange();
  }

  deleteCourse(id: number): void {
    this.courseService.deleteCourse(id)
      .subscribe(() => this.loadCourses());
  }

  resetForm(form?: NgForm): void {
    if (form) {
      form.resetForm(this.createEmptyCourse());
    }
    this.newCourse = this.createEmptyCourse();
    this.filteredPrograms = [];
  }

  private createEmptyCourse(): Course {
    return {
      courseId:       undefined,
      courseCode:     '',
      courseTitle:    '',
      credit:         0,
      type:           'Theory',
      isOptional:     false,
      department:     null,
      program:        null
    };
  }
}
