import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  showPassword = false;
  isLoading = false;
  private readonly passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,20}$/;
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
  });
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    const data = {
      email: email?.trim().toLowerCase() || '',
      password: password || '',
    };
    this.authService.signIn(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.message === 'success' && res.token) {
          this.authService.setToken(res.token);
          this.toast.show('Login successful 🎉', 'success');
          this.loginForm.reset();
          this.showPassword = false;
          setTimeout(() => {
            const user = this.authService.getUserFromToken();
            if (user?.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }, 1000);
          return;
        }
        this.toast.show('Unable to login. Please try again', 'error');
      },
      error: (err) => {
        this.isLoading = false;
        const message = err?.error?.message;
        if (err?.status === 401) {
          this.toast.show('Invalid email or password', 'error');
          return;
        }
        if (err?.status === 400) {
          this.toast.show(message || 'Please check your information', 'error');
          return;
        }
        this.toast.show('Something went wrong. Please try again', 'error');
      },
    });
  }
}
