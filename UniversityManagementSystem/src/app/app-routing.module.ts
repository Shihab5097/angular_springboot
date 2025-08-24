import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent }                  from './login/login.component';
import { HomeComponent }                   from './home/home.component';
import { DashboardComponent }              from './dashboard/dashboard.component';
import { FacultyManagementComponent }      from './faculty-management/faculty-management.component';
import { DepartmentManagementComponent }   from './department-management/department-management.component';
import { AcademicProgramComponent }        from './academic-program/academic-program.component';
import { BatchComponent }                  from './batch/batch.component';
import { CourseManagementComponent }       from './course-management/course-management.component';
import { AttendanceComponent }             from './attendance/attendance.component';
import { GradeComponent }                  from './grade/grade.component';
import { ExaminationComponent }            from './examination/examination.component';
import { FinanceComponent }                from './finance/finance.component';
import { StudentManagementComponent }      from './student-management/student-management.component';
import { SemesterComponent }               from './semester/semester.component';
import { TeacherComponent }                from './teacher/teacher.component';
import { AssignCourseStudentComponent } from './assign-course-student/assign-course-student.component';
import { AssignCourseTeacherComponent } from './assign-course-teacher/assign-course-teacher.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',          component: DashboardComponent },
      { path: 'studentManagement',  component: StudentManagementComponent },
      { path: 'facultyManagement',  component: FacultyManagementComponent },
      { path: 'departmentManagement', component: DepartmentManagementComponent },
      { path: 'academicProgram',    component: AcademicProgramComponent },
      { path: 'batch',              component: BatchComponent },
      { path: 'courseManagement',   component: CourseManagementComponent },
      { path: 'assigncoursestudent',   component: AssignCourseStudentComponent },
      { path: 'assigncourseteacher',   component: AssignCourseTeacherComponent },
      { path: 'attendance',         component: AttendanceComponent },
      { path: 'result',         component: ResultComponent },
      { path: 'grade',              component: GradeComponent },
      { path: 'exam',               component: ExaminationComponent },
      { path: 'finance',            component: FinanceComponent },
      { path: 'semester',           component: SemesterComponent },
      { path: 'teacher',            component: TeacherComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
