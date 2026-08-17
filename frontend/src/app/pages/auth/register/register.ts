import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  private readonly passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
  registerForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(this.passwordPattern),
      ]),
      rePassword: new FormControl('', [
        Validators.required,
        Validators.pattern(this.passwordPattern),
      ]),
    },
    {
      validators: this.confirmPassword,
    },
  );
  private confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    if (!password || !rePassword) {
      return null;
    }
    return password === rePassword ? null : { missMatch: true };
  }
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { name, email, password } = this.registerForm.value;
    const data = {
      name: name?.trim() || '',
      email: email?.trim().toLowerCase() || '',
      password: password || '',
    };
    this.authService.signUp(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.message === 'success') {
          this.toast.show('Account created successfully 🎉', 'success');
          this.registerForm.reset();
          this.showPassword = false;
          this.showConfirmPassword = false;
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 1500);
        }
      },
      error: (err) => {
        this.isLoading = false;
        const message = err?.error?.message;
        if (err?.status === 409 || message === 'User already exists') {
          this.toast.show('This email is already registered', 'error');
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
