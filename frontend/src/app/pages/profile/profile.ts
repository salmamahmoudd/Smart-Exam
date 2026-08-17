import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Result } from '../../core/interfaces/result.interface';
import { AuthService } from '../../core/services/auth.service';
import { ResultService } from '../../core/services/result.service';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink, LoadingSpinner],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly resultService = inject(ResultService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  user: any = null;
  results: Result[] = [];
  loading = false;
  averageScore = 0;
  highestScore = 0;
  examsTaken = 0;
  imageBaseUrl = `${environment.baseURL}/uploads/`;
  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }
  get isUser(): boolean {
    return this.user?.role === 'user';
  }
  get profileImage(): string {
    if (!this.user?.profileImage) {
      return `${this.imageBaseUrl}default.png`;
    }
    return `${this.imageBaseUrl}${this.user.profileImage}`;
  }
  ngOnInit(): void {
    this.loadUser();
  }
  loadUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        if (!this.user) {
          this.logout();
          return;
        }
        if (this.isUser) {
          this.loadResults();
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading current user:', error);
        this.user = this.authService.getUserFromToken();
        if (!this.user) {
          this.logout();
          return;
        }
        if (this.isUser) {
          this.loadResults();
        }
        this.cdr.detectChanges();
      },
    });
  }
  loadResults(): void {
    this.loading = true;
    this.resultService.getMyResults().subscribe({
      next: (response) => {
        this.results = response.results ?? [];
        this.examsTaken = this.results.length;
        if (this.results.length > 0) {
          const total = this.results.reduce((sum, item) => sum + (item.percentage || 0), 0);
          this.averageScore = Math.round(total / this.results.length);
          this.highestScore = Math.max(...this.results.map((item) => item.percentage || 0));
        } else {
          this.averageScore = 0;
          this.highestScore = 0;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading profile results:', error);
        this.results = [];
        this.examsTaken = 0;
        this.averageScore = 0;
        this.highestScore = 0;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login'], {
      replaceUrl: true,
    });
  }
}
