import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ToastService } from './core/services/toast.service';
import { Sidebar } from './shared/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  isDark = true;
  menuOpen = false;
  showSidebar = true;
  constructor(
    private toastService: ToastService,
    private router: Router,
  ) {}
  get toast$() {
    return this.toastService.toast$;
  }
  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      this.isDark = false;
      document.body.classList.add('light-mode');
    }
    this.checkSidebar();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.checkSidebar();
      this.menuOpen = false;
    });
  }
  checkSidebar(): void {
    const url = this.router.url;
    this.showSidebar = !url.includes('/auth/login') && !url.includes('/auth/register');
  }
  toggleTheme(): void {
    this.isDark = !this.isDark;
    document.body.classList.toggle('light-mode', !this.isDark);
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
