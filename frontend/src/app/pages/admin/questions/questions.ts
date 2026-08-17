import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../core/services/question.service';
import { ToastService } from '../../../core/services/toast.service';
import {
  CreateQuestionData,
  Question,
  QuestionFormData,
} from '../../../core/interfaces/question.interface';

@Component({
  selector: 'app-admin-questions',
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.html',
  styleUrl: './questions.css',
})
export class AdminQuestionsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly questionService = inject(QuestionService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  questions: Question[] = [];
  examId = '';
  loading = false;
  editingId = '';
  newQuestion: QuestionFormData = {
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  };
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.examId = params.get('id') || '';
      if (this.examId) {
        this.loadQuestions();
      }
    });
  }
  loadQuestions(): void {
    this.loading = true;
    this.questionService.getAdminQuestionsByExamId(this.examId).subscribe({
      next: (data: Question[]) => {
        this.questions = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load questions:', error);
        this.questions = [];
        this.loading = false;
        this.cdr.detectChanges();
        this.toast.show('Failed to load questions', 'error');
      },
    });
  }
  saveQuestion(): void {
    if (!this.newQuestion.question.trim()) {
      this.toast.show('Please enter the question', 'error');
      return;
    }
    if (this.newQuestion.options.some((option) => !option.trim())) {
      this.toast.show('Please complete all options', 'error');
      return;
    }
    if (!this.newQuestion.correctAnswer.trim()) {
      this.toast.show('Please enter the correct answer', 'error');
      return;
    }
    const correctAnswer = this.newQuestion.correctAnswer.trim();
    const isCorrectAnswerValid = this.newQuestion.options.some(
      (option) => option.trim() === correctAnswer,
    );
    if (!isCorrectAnswerValid) {
      this.toast.show('Correct answer must match one of the options', 'error');
      return;
    }
    const normalizedOptions = this.newQuestion.options.map((option) => option.trim().toLowerCase());
    if (new Set(normalizedOptions).size !== normalizedOptions.length) {
      this.toast.show('Options must be different', 'error');
      return;
    }
    this.loading = true;
    if (this.editingId) {
      this.questionService.updateQuestion(this.editingId, this.newQuestion).subscribe({
        next: () => {
          this.toast.show('Question updated successfully 🎉', 'success');
          this.resetForm();
          this.loadQuestions();
        },
        error: (error) => {
          console.error('Update question error:', error);
          this.loading = false;
          this.toast.show('Failed to update question', 'error');
        },
      });
      return;
    }
    const data: CreateQuestionData = {
      examId: this.examId,
      question: this.newQuestion.question,
      options: this.newQuestion.options,
      correctAnswer: this.newQuestion.correctAnswer,
    };
    this.questionService.createQuestion(data).subscribe({
      next: () => {
        this.toast.show('Question added successfully 🎉', 'success');
        this.resetForm();
        this.loadQuestions();
      },
      error: (error) => {
        console.error('Create question error:', error);
        this.loading = false;
        this.toast.show('Failed to add question', 'error');
      },
    });
  }
  editQuestion(q: Question): void {
    this.editingId = q._id;
    this.newQuestion = {
      question: q.question,
      options: [...q.options],
      correctAnswer: q.correctAnswer || '',
    };
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  deleteQuestion(id: string): void {
    if (!id) {
      return;
    }
    const confirmed = confirm('Are you sure you want to delete this question?');
    if (!confirmed) {
      return;
    }
    this.loading = true;
    this.questionService.deleteQuestion(id).subscribe({
      next: () => {
        this.toast.show('Question deleted successfully 🗑️', 'success');
        this.loadQuestions();
      },
      error: (error) => {
        console.error('Delete question error:', error);
        this.loading = false;
        this.toast.show(error.error?.message || 'Failed to delete question', 'error');
      },
    });
  }
  resetForm(): void {
    this.newQuestion = {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    };
    this.editingId = '';
    this.loading = false;
  }
}
