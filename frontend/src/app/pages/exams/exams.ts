import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamsService } from '../../core/services/exam.service';
import { Exam } from '../../core/interfaces/exam.interface';

@Component({
  selector: 'app-exams',
  imports: [CommonModule],
  templateUrl: './exams.html',
  styleUrl: './exams.css',
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [];
  loading = false;
  constructor(
    private router: Router,
    private examsService: ExamsService,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    this.loadExams();
  }
  loadExams(): void {
    this.loading = true;
    this.examsService.getExams().subscribe({
      next: (data: Exam[]) => {
        this.exams = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading exams:', error);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
  startExam(examId: string): void {
    this.router.navigate(['/exam-details', examId]);
  }
  trackById(index: number, exam: Exam): string {
    return exam._id;
  }
}
