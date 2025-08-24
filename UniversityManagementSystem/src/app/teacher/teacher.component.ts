import { Component, OnInit } from '@angular/core';
import { Teacher } from '../model/teacher.model';
import { Department } from '../model/department.model';
import { TeacherService } from '../service/teacher.service';
import { DepartmentService } from '../service/department.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  teachers: Teacher[] = [];
  departments: Department[] = [];
  teacherForm: Teacher = this.emptyTeacher();

  constructor(
    private teacherSvc: TeacherService,
    private deptSvc: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadTeachers();
  }

  emptyTeacher(): Teacher {
    return {
      teacherName: '',
      teacherEmail: '',
      teacherContact: '',
      designation: '',
      status: 'Active',
      department: { departmentId: 0 }
    };
  }

  loadTeachers(): void {
    this.teacherSvc.getAll().subscribe(data => this.teachers = data);
  }

  loadDepartments(): void {
    this.deptSvc.getAll().subscribe(data => this.departments = data);
  }

  saveTeacher(): void {
    if (this.teacherForm.teacherId) {
      this.teacherSvc.update(this.teacherForm.teacherId, this.teacherForm)
        .subscribe(() => this.reload());
    } else {
      this.teacherSvc.create(this.teacherForm)
        .subscribe(() => this.reload());
    }
  }

  editTeacher(t: Teacher): void {
    this.teacherForm = { ...t };
  }

  deleteTeacher(id: number): void {
    if (confirm('Are you sure?')) {
      this.teacherSvc.delete(id).subscribe(() => this.loadTeachers());
    }
  }

  reload(): void {
    this.loadTeachers();
    this.resetForm();
  }

  resetForm(): void {
    this.teacherForm = this.emptyTeacher();
  }
}
