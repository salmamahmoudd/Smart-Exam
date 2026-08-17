import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ResultService } from '../../core/services/result.service';
import { AuthService } from '../../core/services/auth.service';
import { Result } from '../../core/interfaces/result.interface';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-result-details',
  imports: [CommonModule, RouterLink, LoadingSpinner],
  templateUrl: './result-details.html',
  styleUrl: './result-details.css',
})
export class ResultDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly resultService = inject(ResultService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  result: Result | null = null;
  loading = false;
  ngOnInit(): void {
    const resultId = this.route.snapshot.paramMap.get('id');
    if (!resultId) {
      this.router.navigate(['/result']);
      return;
    }
    this.loadResult(resultId);
  }
  loadResult(resultId: string): void {
    this.loading = true;
    this.resultService.getResultById(resultId).subscribe({
      next: (response) => {
        this.result = response.result;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.result = null;
        this.cdr.detectChanges();
      },
    });
  }
  get passed(): boolean {
    return (this.result?.percentage ?? 0) >= 50;
  }
  get formattedPercentage(): string {
    return (this.result?.percentage ?? 0).toFixed(2);
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login'], {
      replaceUrl: true,
    });
  }
}
