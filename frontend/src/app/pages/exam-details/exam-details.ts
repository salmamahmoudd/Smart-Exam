import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamsService } from '../../core/services/exam.service';
import { Exam } from '../../core/interfaces/exam.interface';

@Component({
  selector: 'app-exam-details',
  imports: [],
  templateUrl: './exam-details.html',
  styleUrl: './exam-details.css',
})
export class ExamDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly examsService = inject(ExamsService);
  exam: Exam | null = null;
  loading = true;
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }
    this.examsService.getExams().subscribe({
      next: (exams: Exam[]) => {
        const foundExam = exams.find((exam) => exam._id === id);
        this.exam = foundExam ?? null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading exam:', error);
        this.exam = null;
        this.loading = false;
      },
    });
  }
  startExam(): void {
    if (!this.exam?._id) {
      return;
    }
    this.router.navigate(['/question', this.exam._id]);
  }
}
