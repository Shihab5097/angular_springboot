import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FacultyManagementComponent } from './faculty-management/faculty-management.component';
import { CourseManagementComponent } from './course-management/course-management.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { GradeComponent } from './grade/grade.component';
import { ExaminationComponent } from './examination/examination.component';
import { FinanceComponent } from './finance/finance.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { DepartmentManagementComponent } from './department-management/department-management.component';
import { AcademicProgramComponent } from './academic-program/academic-program.component';
import { BatchComponent } from './batch/batch.component';
import { SemesterComponent } from './semester/semester.component';
import { TeacherComponent } from './teacher/teacher.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AssignCourseStudentComponent } from './assign-course-student/assign-course-student.component';
import { AssignCourseTeacherComponent } from './assign-course-teacher/assign-course-teacher.component';
import { ResultComponent } from './result/result.component';





@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,

    FacultyManagementComponent,
    CourseManagementComponent,
    AttendanceComponent,
    GradeComponent,
    ExaminationComponent,
    FinanceComponent,
    StudentManagementComponent,
    DepartmentManagementComponent,
    AcademicProgramComponent,
    BatchComponent,
    SemesterComponent,
    TeacherComponent,
    LoginComponent,
    HomeComponent,
    AssignCourseStudentComponent,
    AssignCourseTeacherComponent,
    ResultComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
