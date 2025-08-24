import { Component, OnInit } from '@angular/core';
import { CourseService }               from '../service/course.service';
import { AssignCourseStudentService }  from '../service/assign-course-student.service';
import { AttendanceService }           from '../service/attendance.service';
import { Course }                      from '../model/course.model';
import { StudentCourseAssignment }     from '../model/student-course-assignment';
import { Attendance }                  from '../model/attendance.model';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  courses: Course[] = [];
  selectedCourseId: number|null = null;
  showDate: string = new Date().toISOString().substring(0,10);

  assignments: StudentCourseAssignment[] = [];
  attendanceRecords = new Map<number, Attendance>();
  allAttendance: Attendance[] = [];

  constructor(
    private courseSvc: CourseService,
    private assignSvc: AssignCourseStudentService,
    private attSvc:    AttendanceService
  ) {}

  ngOnInit(): void {
    this.courseSvc.getAllCourses()
      .subscribe(c => this.courses = c);
  }

  onCourseChange(): void {
    if (!this.selectedCourseId) return;

    // load assigned students
    this.assignSvc.getByCourse(this.selectedCourseId)
      .subscribe(list => {
        this.assignments = list;
        this.attendanceRecords.clear();
        list.forEach(a => {
          const sid = a.student.studentId!;
          this.attendanceRecords.set(sid, {
            courseId: this.selectedCourseId!,
            studentId: sid,
            date: this.showDate,
            present: false
          });
        });
      });

    // load past attendance for %
    this.attSvc.getByCourse(this.selectedCourseId)
      .subscribe(all => this.allAttendance = all);
  }

  toggle(studentId: number): void {
    const rec = this.attendanceRecords.get(studentId);
    if (rec) rec.present = !rec.present;
  }

  saveAttendance(): void {
    const payload = Array.from(this.attendanceRecords.values());
    this.attSvc.saveAll(payload).subscribe(() => {
      alert('Attendance saved');
      // refresh allAttendance to include today
      this.attSvc.getByCourse(this.selectedCourseId!)
        .subscribe(all => this.allAttendance = all);
    });
  }

  getPercentage(studentId: number): string {
    const recs = this.allAttendance.filter(a => a.studentId === studentId);
    if (!recs.length) return '0%';
    const pres  = recs.filter(a => a.present).length;
    return Math.round((pres / recs.length) * 100) + '%';
  }
}
