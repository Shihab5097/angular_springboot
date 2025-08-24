import { Component, OnInit } from '@angular/core';
import { Faculty } from '../model/faculty.model';
import { FacultyService } from '../service/faculty.service';


@Component({
  selector: 'app-faculty-management',
  templateUrl: './faculty-management.component.html',
  styleUrls: ['./faculty-management.component.css']
})
export class FacultyManagementComponent implements OnInit {
  faculties: Faculty[] = [];
  
  
  facultyForm: Faculty = this.createEmptyFaculty();

  constructor(private facultyService: FacultyService) { }

  ngOnInit(): void {
    this.loadFaculties();
  }

  
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

  
  createEmptyFaculty(): Faculty {
    return {
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
    };
  }

  
  saveFaculty(): void {
    // ??????????
    if (!this.facultyForm.facultyCode || this.facultyForm.facultyCode.trim() === '') {
      alert('Faculty Code is required.');
      return;
    }
    if (!this.facultyForm.facultyName || this.facultyForm.facultyName.trim() === '') {
      alert('Faculty Name is required.');
      return;
    }

    if (this.facultyForm.facultyId) {
      
      this.facultyService.update(this.facultyForm.facultyId, this.facultyForm).subscribe(
        (res) => {
          alert('Faculty updated successfully.');
          this.loadFaculties();
          this.resetForm();
        },
        (error) => {
          console.error('Error updating faculty:', error);
          alert('Error updating faculty: ' + (error.error?.message || error.message));
        }
      );
    } else {
      
      this.facultyService.create(this.facultyForm).subscribe(
        (res) => {
          alert('Faculty created successfully.');
          this.loadFaculties();
          this.resetForm();
        },
        (error) => {
          console.error('Error creating faculty:', error);
          alert('Error creating faculty: ' + (error.error?.message || error.message));
        }
      );
    }
  }

  
  editFaculty(faculty: Faculty): void {
    this.facultyForm = { ...faculty }; 
  }

  
  deleteFaculty(id: number): void {
    if (confirm('Are you sure you want to delete this faculty?')) {
      this.facultyService.delete(id).subscribe(
        () => {
          alert('Faculty deleted successfully.');
          this.loadFaculties();
        },
        (error) => {
          console.error('Error deleting faculty:', error);
          alert('Error deleting faculty: ' + (error.error?.message || error.message));
        }
      );
    }
  }

  
  resetForm(): void {
    this.facultyForm = this.createEmptyFaculty();
  }
}
