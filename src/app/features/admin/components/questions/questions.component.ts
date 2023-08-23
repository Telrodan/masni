import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { Question } from '@core/models/question.model';
import { Store } from '@ngrx/store';
import { selectAllQuestion } from '@core/store';
import { Table } from 'primeng/table';
import { ConfirmDialogComponent } from '@shared/UI/confirm-dialog/confirm-dialog.component';
import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';
import { EditQuestionComponent } from './components/edit-question/edit-question.component';

@Component({
  selector: 'mhd-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
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
          message: `Biztos törölni szeretnéd "${question.questionName}" kérdést?`,
          confirmButtonText: 'Igen',
          cancelButtonText: 'Nem'
        }
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        switchMap(() => this.questionService.deleteQuestion$(question.id)),
        tap(() => {
          this.toastr.success(
            `${question.questionName} kérdés sikeresen törölve`
          );
        })
      )
      .subscribe();
  }

  applyTableGlobalFilter($event: any, stringVal: string, table: Table): void {
    const filter = ($event.target as HTMLInputElement).value;
    table.filterGlobal(filter, stringVal);
  }
}
