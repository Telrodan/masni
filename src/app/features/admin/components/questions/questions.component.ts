import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable, filter, map, tap } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import { Question, QuestionType } from '@core/store/question';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { QuestionAction, QuestionSelector } from '@core/store/question';

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
    isBusy$: Observable<boolean>;

    readonly QuestionType = QuestionType;

    private readonly store = inject(Store);
    private readonly dialog = inject(MatDialog);

    ngOnInit(): void {
        this.isBusy$ = this.store.select(QuestionSelector.isBusy());
        this.questions$ = this.store
            .select(QuestionSelector.selectQuestions())
            .pipe(map((question) => [...question]));
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
                tap(() =>
                    this.store.dispatch(
                        QuestionAction.deleteQuestion({ id: question.id, name: question.name })
                    )
                )
            )
            .subscribe();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applyTableGlobalFilter($event: any, stringVal: string, table: Table): void {
        const filter = ($event.target as HTMLInputElement).value;
        table.filterGlobal(filter, stringVal);
    }
}
