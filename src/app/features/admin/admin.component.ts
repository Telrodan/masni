import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { BreadcrumpComponent } from '@shared/breadcrump/breadcrump.component';
import { UserService } from '@core/services/user.service';
import { User } from '@core/models/user.model';
import { Observable, filter, startWith, tap } from 'rxjs';

@Component({
  selector: 'nyk-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, StyleClassModule, BreadcrumpComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {
  @HostBinding('class.nyk-admin') hostClass = true;

  @ViewChild('sidebar') sidebar: ElementRef;

  user$: Observable<User>;

  activeTab = 'reports';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.user$ = this.userService.getUser$();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith({ url: this.router.url }),
        tap((event: NavigationEnd) => {
          this.activeTab = event.url.split('/')[2]
            ? event.url.split('/')[2]
            : 'reports';
        })
      )
      .subscribe();
  }

  onCloseSidebar() {
    this.sidebar.nativeElement.classList.add('fadeoutleft');
    setTimeout(() => {
      this.sidebar.nativeElement.classList.add('hidden');
      this.sidebar.nativeElement.classList.remove('fadeoutleft');
    }, 100);
  }
}
