import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../core/services/question.service';
import { ResultService } from '../../core/services/result.service';
import { AuthService } from '../../core/services/auth.service';
import { ExamsService } from '../../core/services/exam.service';
import { Question } from '../../core/interfaces/question.interface';
import { Exam } from '../../core/interfaces/exam.interface';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-question',
  imports: [CommonModule, LoadingSpinner],
  templateUrl: './question.html',
  styleUrl: './question.css',
})
export class QuestionComponent implements OnInit, OnDestroy {
  private readonly questionService = inject(QuestionService);
  private readonly resultService = inject(ResultService);
  private readonly authService = inject(AuthService);
  private readonly examsService = inject(ExamsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  exam!: Exam;
  examId = '';
  questions: Question[] = [];
  currentQuestionIndex = 0;
  selectedAnswer = '';
  loading = false;
  submitting = false;
  timeLeft = 0;
  minutes = 0;
  seconds = 0;
  private timer: ReturnType<typeof setInterval> | undefined;
  answers: {
    questionId: string;
    answer: string;
  }[] = [];
  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.examId) {
      this.router.navigate(['/exams']);
      return;
    }
    this.loadExam();
  }
  loadExam(): void {
    this.loading = true;
    this.examsService.getExams().subscribe({
      next: (exams) => {
        const foundExam = exams.find((exam) => exam._id === this.examId);
        if (!foundExam) {
          this.loading = false;
          this.router.navigate(['/exams']);
          return;
        }
        this.exam = foundExam;
        this.timeLeft = this.exam.time * 60;
        this.updateClock();
        this.loadQuestions();
      },
      error: (error) => {
        console.error('Exam Error:', error);
        this.loading = false;
      },
    });
  }
  loadQuestions(): void {
    this.questionService.getQuestionsByExamId(this.examId).subscribe({
      next: (data) => {
        this.questions = data;
        this.loading = false;
        if (this.questions.length === 0) {
          this.router.navigate(['/exams']);
          return;
        }
        this.startTimer();
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
  startTimer(): void {
    this.clearTimer();
    this.updateClock();
    this.cdr.detectChanges();
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateClock();
      this.cdr.detectChanges();
      if (this.timeLeft <= 0) {
        this.clearTimer();
        this.saveCurrentAnswer();
        this.finishExam();
      }
    }, 1000);
  }
  updateClock(): void {
    this.minutes = Math.floor(this.timeLeft / 60);
    this.seconds = this.timeLeft % 60;
  }
  clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
  selectAnswer(option: string): void {
    this.selectedAnswer = option;
  }
  saveCurrentAnswer(): void {
    if (!this.selectedAnswer) {
      return;
    }
    const current = this.questions[this.currentQuestionIndex];
    if (!current) {
      return;
    }
    const oldAnswer = this.answers.find((x) => x.questionId === current._id);
    if (oldAnswer) {
      oldAnswer.answer = this.selectedAnswer;
    } else {
      this.answers.push({
        questionId: current._id,
        answer: this.selectedAnswer,
      });
    }
  }
  nextQuestion(): void {
    if (!this.selectedAnswer) {
      return;
    }
    this.saveCurrentAnswer();
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      const next = this.answers.find(
        (x) => x.questionId === this.questions[this.currentQuestionIndex]._id,
      );
      this.selectedAnswer = next?.answer || '';
    } else {
      this.finishExam();
    }
  }
  previousQuestion(): void {
    if (this.currentQuestionIndex === 0) {
      return;
    }
    this.saveCurrentAnswer();
    this.currentQuestionIndex--;
    const answer = this.answers.find(
      (x) => x.questionId === this.questions[this.currentQuestionIndex]._id,
    );
    this.selectedAnswer = answer?.answer || '';
  }
  finishExam(): void {
    this.clearTimer();
    if (this.submitting) {
      return;
    }
    this.saveCurrentAnswer();
    this.submitting = true;
    const user = this.authService.getUserFromToken();
    const userId = user?.id;
    if (!userId) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      return;
    }
    this.resultService
      .submitExam({
        userId,
        examId: this.examId,
        answers: this.answers,
      })
      .subscribe({
        next: (res) => {
          this.router.navigate(['/result', res.result._id]);
        },
        error: (err) => {
          console.error('Submit Exam Error:', err);
          this.submitting = false;
        },
      });
  }
  ngOnDestroy(): void {
    this.clearTimer();
  }
}
