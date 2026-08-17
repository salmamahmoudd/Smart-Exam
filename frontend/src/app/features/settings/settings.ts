import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser } from '../../core/interfaces/auth.interface';
import { Toast } from '../../core/interfaces/toast.interface';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class SettingsComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  user: AuthUser | null = this.authService.getUserFromToken();
  toast: Toast | null = null;
  profileImageUrl = '';
  private toastSubscription?: Subscription;
  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }
  get isUser(): boolean {
    return this.user?.role === 'user';
  }
  get accountTitle(): string {
    return this.isAdmin ? 'Administrator Settings' : 'Account Settings';
  }
  get accountDescription(): string {
    return this.isAdmin
      ? 'Manage your administrator account and platform access.'
      : 'Manage your account information and profile settings.';
  }
  get defaultImageUrl(): string {
    return `${environment.baseURL}/uploads/default.png`;
  }
  ngOnInit(): void {
    this.loadUser();
    this.toastSubscription = this.toastService.toast$.subscribe((toast) => {
      this.toast = toast;
      this.cdr.detectChanges();
    });
  }
  loadUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.profileImageUrl = user.profileImage
          ? `${environment.baseURL}/uploads/${user.profileImage}`
          : this.defaultImageUrl;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.user = this.authService.getUserFromToken();
        if (this.user?.profileImage) {
          this.profileImageUrl = `${environment.baseURL}/uploads/${this.user.profileImage}`;
        } else {
          this.profileImageUrl = this.defaultImageUrl;
        }
        this.cdr.detectChanges();
      },
    });
  }
  imageLoaded(): void {}
  imageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (image.src !== this.defaultImageUrl) {
      image.src = this.defaultImageUrl;
    }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.showToast('Please select an image file', 'error');
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('Image size must be less than 5MB', 'error');
      input.value = '';
      return;
    }
    this.authService.uploadProfileImage(file).subscribe({
      next: (res) => {
        this.profileImageUrl = `${environment.baseURL}/uploads/${res.image}`;
        this.loadUser();
        this.showToast('Profile image updated successfully', 'success');
        input.value = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Upload failed', 'error');
        input.value = '';
        this.cdr.detectChanges();
      },
    });
  }
  showToast(message: string, type: 'success' | 'error'): void {
    this.toastService.show(message, type);
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login'], {
      replaceUrl: true,
    });
  }
  goToDashboard(): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
  ngOnDestroy(): void {
    this.toastSubscription?.unsubscribe();
  }
}
