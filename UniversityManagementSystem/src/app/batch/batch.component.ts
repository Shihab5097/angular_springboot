import { Component, OnInit } from '@angular/core';
import { Batch } from '../model/batch.model';
import { Department } from '../model/department.model';
import { AcademicProgram } from '../model/academicProgram.model';
import { BatchService } from '../service/batch.service';
import { DepartmentService } from '../service/department.service';
import { AcademicProgramService } from '../service/academicProgram.service';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {
  batches: Batch[] = [];
  departments: Department[] = [];
  programs: AcademicProgram[] = [];

  newBatch: Batch = this.createEmptyBatch();

  constructor(
    private batchService: BatchService,
    private deptService: DepartmentService,
    private programService: AcademicProgramService
  ) {}

  ngOnInit(): void {
    this.loadBatches();
    this.deptService.getAll().subscribe(data => this.departments = data);
    this.programService.getAll().subscribe(data => this.programs = data);
  }

  loadBatches(): void {
    this.batchService.getAllBatches().subscribe(data => this.batches = data);
  }

  saveBatch(form: any): void {
    if (this.newBatch.department && this.newBatch.academicProgram) {
      if (this.newBatch.batchId) {
        this.batchService.updateBatch(this.newBatch).subscribe(() => {
          this.loadBatches();
          this.resetForm(form);
        });
      } else {
        this.batchService.addBatch(this.newBatch).subscribe(() => {
          this.loadBatches();
          this.resetForm(form);
        });
      }
    }
  }

  editBatch(batch: Batch): void {
    this.newBatch = JSON.parse(JSON.stringify(batch));
  }

  deleteBatch(id: number): void {
    this.batchService.deleteBatch(id).subscribe(() => this.loadBatches());
  }

  resetForm(form?: any): void {
    if (form) {
      form.resetForm();
    }
    this.newBatch = this.createEmptyBatch();
  }

  private createEmptyBatch(): Batch {
    return {
      name: '',
      startYear: '',
      endYear: '',
      department: null as any,
      academicProgram: null as any
    };
  }
}
