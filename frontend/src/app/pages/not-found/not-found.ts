import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private readonly authService = inject(AuthService);
  user = this.authService.getUserFromToken();
  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }
  get backRoute(): string {
    return this.isAdmin ? '/admin' : '/dashboard';
  }
  get backText(): string {
    return this.isAdmin ? 'Go Back to Admin Dashboard' : 'Go Back to Dashboard';
  }
}
