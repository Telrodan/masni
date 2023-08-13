import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionComponent } from './components/add-question/add-question.component';

@Component({
  selector: 'mhd-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent {
  constructor(private dialog: MatDialog) {}

  onAddQuestion(): void {
    this.dialog.open(AddQuestionComponent, {
      minWidth: '40vw'
    });
  }
}
