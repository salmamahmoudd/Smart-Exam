import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() open = false;
  @Output() closeMenu = new EventEmitter<void>();
  private auth = inject(AuthService);
  private router = inject(Router);
  user = this.auth.getUserFromToken();
  isAdmin(): boolean {
    return String(this.user?.role).toLowerCase().trim() === 'admin';
  }
  isUser(): boolean {
    return this.user?.role === 'user';
  }
  toggleMenu(): void {
    this.closeMenu.emit();
  }
  closeMobileMenu(): void {
    this.closeMenu.emit();
  }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login'], {
      replaceUrl: true,
    });
  }
}
