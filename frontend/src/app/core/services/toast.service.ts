import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../interfaces/toast.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<Toast | null>(null);
  readonly toast$ = this.toastSubject.asObservable();
  private timer: ReturnType<typeof setTimeout> | null = null;
  show(message: string, type: Toast['type'] = 'info', duration = 2500): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.toastSubject.next({
      message,
      type,
    });
    this.timer = setTimeout(() => {
      this.hide();
    }, duration);
  }
  hide(): void {
    this.toastSubject.next(null);
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
