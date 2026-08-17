import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ResultService } from '../../core/services/result.service';
import { Result as ResultModel } from '../../core/interfaces/result.interface';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-results',
  imports: [CommonModule, RouterLink, LoadingSpinner],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class ResultsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly resultService = inject(ResultService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  user: any = null;
  results: ResultModel[] = [];
  loading = false;
  ngOnInit(): void {
    this.user = this.authService.getUserFromToken();
    if (!this.user) {
      this.authService.logout();
      this.router.navigate(['/auth/login'], {
        replaceUrl: true,
      });
      return;
    }
    this.loadResults();
  }
  loadResults(): void {
    this.loading = true;
    this.resultService.getMyResults().subscribe({
      next: (response) => {
        this.results = response?.results ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.results = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
  viewResult(resultId: string): void {
    this.router.navigate(['/result', resultId]);
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login'], {
      replaceUrl: true,
    });
  }
}
