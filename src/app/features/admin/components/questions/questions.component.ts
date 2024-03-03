import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, filter, startWith, switchMap, tap } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import { Question } from '@core/models/question.model';
import { QuestionType } from '@core/enums/question-type.enum';
import { QuestionService } from '@core/services/question.service';
import { ToastrService } from '@core/services/toastr.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'nyk-questions',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    RouterModule,
    SpinnerComponent,
    InputTextModule,
    TooltipModule
  ],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsComponent implements OnInit {
  @HostBinding('class') hostClass = 'nyk-questions';

  questions$: Observable<Question[]>;

  isLoading = false;

  readonly QuestionType = QuestionType;
  private questionDeleteSubject = new Subject<void>();

  constructor(
    private questionService: QuestionService,
    private changeDetectorRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.questions$ = this.questionDeleteSubject.pipe(
      startWith(null),
      switchMap(() => this.questionService.getQuestions$())
    );
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
        tap(() => {
          this.isLoading = true;
          this.changeDetectorRef.detectChanges();
        }),
        switchMap(() => this.questionService.deleteQuestion$(question.id)),
        tap(() => {
          this.isLoading = false;
          this.questionDeleteSubject.next();
          this.toastr.success(`${question.name} kérdés sikeresen törölve`);
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  applyTableGlobalFilter($event: any, stringVal: string, table: Table): void {
    const filter = ($event.target as HTMLInputElement).value;
    table.filterGlobal(filter, stringVal);
  }
}
