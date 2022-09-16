import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  public name: string = '';
  questions: any[] = [];
  currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = '0';
  isResponseFalse : boolean = false;
  isQuizCompleted: boolean = false;

  constructor(private questionService: QuestionService) {}

  ngOnInit() {
    this.name = localStorage.getItem('name')!;
    this.getQuestions();
    this.startCounter();
  }

  getQuestions() {
    this.questionService.getQuestionData().subscribe((res) => {
      this.questions = res.questions;
    });
  }

  nextQuestion() {
    this.currentQuestion++;
  }

  prevQuestion() {
    this.currentQuestion--;
  }
  answer(currentQuestion: number, option: any) {
    if (currentQuestion == this.questions.length) {
      this.isQuizCompleted = true;
      this.stopCounter();
    }
    if (option.correct) {
      this.points += 10;
      this.correctAnswer++;
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
    } else {
      this.isResponseFalse = true;
      setTimeout(() => {
        this.currentQuestion++;
        this.inCorrectAnswer++;
        this.resetCounter();
        this.getProgressPercent();
        this.isResponseFalse = false;
      }, 2000);

      this.points -= 10;
    }
  }

  startCounter() {
    this.interval$ = interval(1000).subscribe((val) => {
      this.counter--;
      if (this.counter == 0) {
        this.currentQuestion++;
        this.counter = 60;
        this.points -= 10;
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }
  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }
  resetCounter() {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }
  resetPointAndAnswers() {
    this.points = 0;
    this.inCorrectAnswer = 0;
    this.correctAnswer = 0;
  }
  resetQuiz() {
    this.resetPointAndAnswers();
    this.resetCounter();
    this.getQuestions();
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = '0';
  }
  getProgressPercent() {
    this.progress = (
      (this.currentQuestion / this.questions.length) *
      100
    ).toString();
    return this.progress;
  }
}
