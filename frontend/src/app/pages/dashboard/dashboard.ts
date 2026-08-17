import { Component, OnDestroy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser } from '../../core/interfaces/auth.interface';
import { ExamsService } from '../../core/services/exam.service';
import { ResultService } from '../../core/services/result.service';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { environment } from '../../../environments/environment.development';
import { Exam } from '../../core/interfaces/exam.interface';
import { Result } from '../../core/interfaces/result.interface';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly examsService = inject(ExamsService);
  private readonly resultService = inject(ResultService);
  private readonly cdr = inject(ChangeDetectorRef);
  user: AuthUser | null = null;
  exams: Exam[] = [];
  filteredExams: Exam[] = [];
  results: Result[] = [];
  searchText = '';
  loading = false;
  resultsLoading = false;
  imageBaseUrl = `${environment.baseURL}/uploads/`;
  private readonly destroy$ = new Subject<void>();
  ngOnInit(): void {
    this.user = this.auth.getUserFromToken();
    if (!this.user) {
      this.logout();
      return;
    }
    if (this.user.role === 'admin') {
      this.router.navigate(['/admin'], {
        replaceUrl: true,
      });
      return;
    }
    this.loadCurrentUser();
    this.loadExams();
    this.loadUserResults();
    this.auth.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (!user) {
        return;
      }
      this.user = user;
      if (user.role === 'admin') {
        this.router.navigate(['/admin'], {
          replaceUrl: true,
        });
        return;
      }
      this.cdr.detectChanges();
    });
  }
  loadCurrentUser(): void {
    this.auth
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading current user:', error);
        },
      });
  }
  get profileImage(): string {
    if (!this.user?.profileImage) {
      return '';
    }
    return `${this.imageBaseUrl}${this.user.profileImage}`;
  }
  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.style.display = 'none';
  }
  loadExams(): void {
    this.loading = true;
    this.examsService
      .getExams()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.exams = data || [];
          this.filteredExams = [...this.exams];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading exams:', error);
          this.exams = [];
          this.filteredExams = [];
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }
  loadUserResults(): void {
    this.resultsLoading = true;
    this.resultService
      .getMyResults()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.results = response?.results || [];
          this.resultsLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading user results:', error);
          this.results = [];
          this.resultsLoading = false;
          this.cdr.detectChanges();
        },
      });
  }
  onSearch(): void {
    const text = this.searchText.toLowerCase().trim();
    if (!text) {
      this.filteredExams = [...this.exams];
      return;
    }
    this.filteredExams = this.exams.filter((exam) => exam.title?.toLowerCase().includes(text));
  }
  get availableExamsCount(): number {
    return this.exams.filter((exam) => exam.status === 'available').length;
  }
  get completedExams(): number {
    return this.results.length;
  }
  get progress(): number {
    if (!this.results.length) {
      return 0;
    }
    const total = this.results.reduce((sum, result) => sum + Number(result.percentage || 0), 0);
    return Math.round(total / this.results.length);
  }
  get highestScore(): number {
    if (!this.results.length) {
      return 0;
    }
    return Math.max(...this.results.map((result) => Number(result.percentage || 0)));
  }
  get latestResult(): Result | null {
    return this.results.length ? this.results[0] : null;
  }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login'], {
      replaceUrl: true,
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
