import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ekle
import { FormsModule } from '@angular/forms'; // ngModel için
import { HttpClientModule, HttpClient } from '@angular/common/http'; // http için

@Component({
  selector: 'app-root',
  standalone: true, // standalone true yap
  imports: [CommonModule, FormsModule, HttpClientModule], // modülleri buraya ekle
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  topics = [
      {"key": "simplePresentTense", "value": "Present Simple Tense"},
      {"key": "futureSimple", "value": "Future Simple Tense"},
      {"key": "pastSimple", "value": "Past Simple Tense"},
      {"key": "presentContinuousTense", "value": "Present Continuous Tense"},
      {"key": "prepositions", "value": "Prepositions - In, On, At"},
    ]; // konular

  selectedTopic = this.topics[0].key; // varsayılan konu
  questions: any[] = [];
  currentSet: number = 0;
  questionsPerSet: number = 5;
  correctCount: number = 0;
  wrongCount: number = 0;
  isChecked: boolean = false;

  constructor(private http: HttpClient) {
    this.loadQuestions();
  }

  loadQuestions() {
    this.http.get<any[]>(`./${this.selectedTopic}.json`).subscribe(data => {
      data = this.shuffle(data);
      this.questions = data.map(q => ({
        ...q,
        shuffledOptions: this.shuffle(q.options.map((option: string, index: number) => ({ option, index }))),
        selected: null
      }));
    });
  }

  shuffle<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }

  checkAnswers() {
    this.correctCount = 0;
    this.questions.slice(this.currentSet * this.questionsPerSet, (this.currentSet + 1) * this.questionsPerSet).forEach(q => {
      if (q.selected === q.correct) this.correctCount++;
    });
    this.wrongCount = this.questionsPerSet - this.correctCount;
    this.isChecked = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetQuiz() {
    this.loadQuestions();
    this.correctCount = 0;
    this.wrongCount = 0;
    this.isChecked = false;
    this.currentSet = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onTopicChange() {
    this.resetQuiz();
  }

  nextSet() {
    this.isChecked = false;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.currentSet++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get currentQuestions() {
    return this.questions.slice(this.currentSet * this.questionsPerSet, (this.currentSet + 1) * this.questionsPerSet);
  }

  get isLastSet() {
    return (this.currentSet + 1) * this.questionsPerSet >= this.questions.length;
  }
}