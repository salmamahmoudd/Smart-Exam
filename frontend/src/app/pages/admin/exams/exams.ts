import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExamsService } from '../../../core/services/exam.service';
import { CreateExamData, Exam } from '../../../core/interfaces/exam.interface';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-exams',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class AdminExamsComponent implements OnInit {
  private readonly examsService = inject(ExamsService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  exams: Exam[] = [];
  loading = false;
  editingId = '';
  newExam: CreateExamData = {
    title: '',
    description: '',
    time: 30,
    status: 'available',
  };
  ngOnInit(): void {
    this.loadExams();
  }
  loadExams(): void {
    this.loading = true;
    this.examsService.getExams().subscribe({
      next: (data: Exam[]) => {
        this.exams = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load exams:', error);
        this.exams = [];
        this.loading = false;
        this.cdr.detectChanges();
        this.toast.show('Failed to load exams', 'error');
      },
    });
  }
  saveExam(): void {
    if (!this.newExam.title.trim()) {
      this.toast.show('Please enter exam title', 'error');
      return;
    }
    if (!this.newExam.time || this.newExam.time <= 0) {
      this.toast.show('Please enter a valid exam duration', 'error');
      return;
    }
    this.loading = true;
    if (this.editingId) {
      this.examsService.updateExam(this.editingId, this.newExam).subscribe({
        next: () => {
          this.toast.show('Exam updated successfully 🎉', 'success');
          this.resetForm();
          this.loadExams();
        },
        error: (error) => {
          console.error('Update exam error:', error);
          this.loading = false;
          this.toast.show('Failed to update exam', 'error');
        },
      });
      return;
    }
    this.examsService.createExam(this.newExam).subscribe({
      next: () => {
        this.toast.show('Exam created successfully 🎉', 'success');
        this.resetForm();
        this.loadExams();
      },
      error: (error) => {
        console.error('Create exam error:', error);
        this.loading = false;
        this.toast.show('Failed to create exam', 'error');
      },
    });
  }
  editExam(exam: Exam): void {
    this.editingId = exam._id;
    this.newExam = {
      title: exam.title,
      description: exam.description || '',
      time: exam.time,
      status: exam.status,
    };
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  deleteExam(id: string): void {
    if (!id) {
      return;
    }
    const confirmed = confirm('Are you sure you want to delete this exam?');
    if (!confirmed) {
      return;
    }
    this.loading = true;
    this.examsService.deleteExam(id).subscribe({
      next: () => {
        this.toast.show('Exam deleted successfully 🗑️', 'success');
        this.loadExams();
      },
      error: (error) => {
        console.error('Delete exam error:', error);
        this.loading = false;
        this.toast.show(error.error?.message || 'Failed to delete exam', 'error');
      },
    });
  }
  resetForm(): void {
    this.newExam = {
      title: '',
      description: '',
      time: 30,
      status: 'available',
    };
    this.editingId = '';
    this.loading = false;
  }
  trackById(index: number, exam: Exam): string {
    return exam._id;
  }
}
