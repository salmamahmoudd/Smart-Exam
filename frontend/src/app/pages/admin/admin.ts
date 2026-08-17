import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';
import { Exam, CreateExamData } from '../../core/interfaces/exam.interface';
import {
  AdminStats,
  RecentUser,
  RecentResult,
  PopularExam,
} from '../../core/interfaces/admin.interface';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  imageBaseUrl = `${environment.baseURL}/uploads/`;
  getProfileImage(profileImage: string | undefined): string {
    if (!profileImage) {
      return '';
    }
    return `${this.imageBaseUrl}${profileImage}`;
  }
  stats: AdminStats = {
    totalUsers: 0,
    totalAdmins: 0,
    totalExams: 0,
    availableExams: 0,
    lockedExams: 0,
    totalQuestions: 0,
    totalResults: 0,
    averageScore: 0,
  };
  recentUsers: RecentUser[] = [];
  recentResults: RecentResult[] = [];
  popularExams: PopularExam[] = [];
  exams: Exam[] = [];
  loading = false;
  dashboardLoading = false;
  editingId = '';
  showDeleteToast = false;
  examToDelete: Exam | null = null;
  examForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    time: [10, [Validators.required, Validators.min(1)]],
    status: ['available' as 'available' | 'locked', Validators.required],
  });
  ngOnInit(): void {
    this.loadDashboard();
    this.loadExams();
  }
  loadDashboard(): void {
    this.dashboardLoading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.recentUsers = data.recentUsers || [];
        this.recentResults = data.recentResults || [];
        this.popularExams = data.popularExams || [];
        this.dashboardLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.dashboardLoading = false;
        this.toast.show('Failed to load dashboard', 'error');
      },
    });
  }
  loadExams(): void {
    this.loading = true;
    this.adminService.getExams().subscribe({
      next: (data) => {
        this.exams = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.exams = [];
        this.loading = false;
        this.toast.show('Failed to load exams', 'error');
      },
    });
  }
  createExam(): void {
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const formValue = this.examForm.getRawValue();
    const examData: CreateExamData = {
      title: formValue.title ?? '',
      description: formValue.description ?? '',
      time: formValue.time ?? 10,
      status: formValue.status ?? 'available',
    };
    if (this.editingId) {
      this.adminService.updateExam(this.editingId, examData).subscribe({
        next: () => {
          this.toast.show('Exam updated successfully 🎉', 'success');
          this.resetForm();
          this.loadExams();
          this.loadDashboard();
        },
        error: (error) => {
          this.loading = false;
          this.toast.show('Update failed', 'error');
        },
      });
      return;
    }
    this.adminService.createExam(examData).subscribe({
      next: () => {
        this.toast.show('Exam created successfully 🎉', 'success');
        this.resetForm();
        this.loadExams();
        this.loadDashboard();
      },
      error: (error) => {
        this.loading = false;
        this.toast.show('Failed to create exam', 'error');
      },
    });
  }
  editExam(exam: Exam): void {
    this.editingId = exam._id;
    this.examForm.patchValue({
      title: exam.title,
      description: exam.description ?? '',
      time: exam.time,
      status: exam.status,
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  addQuestion(exam: Exam): void {
    this.router.navigate(['/admin/questions', exam._id]);
  }
  confirmDelete(exam: Exam): void {
    this.examToDelete = exam;
    this.showDeleteToast = true;
  }
  cancelDelete(): void {
    this.examToDelete = null;
    this.showDeleteToast = false;
  }
  deleteExam(id: string): void {
    if (!id) {
      return;
    }
    this.adminService.deleteExam(id).subscribe({
      next: () => {
        this.exams = this.exams.filter((exam) => exam._id !== id);
        this.examToDelete = null;
        this.showDeleteToast = false;
        this.toast.show('Exam deleted successfully 🗑️', 'success');
        this.loadDashboard();
      },
      error: (error) => {
        this.toast.show('Failed to delete exam', 'error');
      },
    });
  }
  resetForm(): void {
    this.examForm.reset({
      title: '',
      description: '',
      time: 10,
      status: 'available',
    });
    this.editingId = '';
    this.loading = false;
  }
}
