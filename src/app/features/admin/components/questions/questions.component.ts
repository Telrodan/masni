import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { Table } from 'primeng/table';

import { Question } from '@core/models/question.model';
import { QuestionType } from '@core/enums/question-type.enum';
import { selectAllQuestion } from '@core/store';
import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { EditQuestionComponent } from './components/edit-question/edit-question.component';

@Component({
  selector: 'mhd-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  readonly QuestionType = QuestionType;
  questions$: Observable<Question[]>;

  constructor(
    private dialog: MatDialog,
    private store$: Store,
    private questionService: QuestionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.questions$ = this.store$
      .select(selectAllQuestion)
      .pipe(filter((questions) => !!questions));
  }

  onAddQuestion(): void {
    this.dialog.open(AddQuestionComponent, {
      minWidth: '40vw'
    });
  }

  onEditQuestion(question: Question): void {
    this.dialog.open(EditQuestionComponent, {
      minWidth: '40vw',
      data: question
    });
  }

  onDeleteQuestion(question: Question): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        minWidth: '40vw',
        data: {
          message: `Biztos törölni szeretnéd "${question.name}" kérdést?`
        }
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this.questionService.deleteQuestion$(question.id)),
        tap(() => {
          this.toastr.success(`${question.name} kérdés sikeresen törölve`);
        })
      )
      .subscribe();
  }

  applyTableGlobalFilter($event: any, stringVal: string, table: Table): void {
    const filter = ($event.target as HTMLInputElement).value;
    table.filterGlobal(filter, stringVal);
  }
}
