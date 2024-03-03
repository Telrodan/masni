import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

import { Observable, filter, map, startWith } from 'rxjs';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

import { UrlTranslation } from './url-translation';

@Component({
  selector: 'nyk-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule],
  templateUrl: './breadcrump.component.html',
  styleUrls: ['./breadcrump.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumpComponent implements OnInit {
  @HostBinding() class = 'nyk-breadcrumb';

  home: MenuItem;
  items$: Observable<MenuItem[]>;

  constructor(private router: Router) {
    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.initBreadcrumbs(router.url);
  }

  ngOnInit() {
    this.items$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        const urlArray = event.url
          .split(/\/+/)
          .filter((segment) => segment !== '');

        const breadcrumbs = urlArray.map((url, index) => ({
          label: this.findEnumValue(url),
          routerLink: '/' + urlArray.slice(0, index + 1).join('/')
        }));
        console.log('breadcrumbs', breadcrumbs);

        return breadcrumbs;
      }),
      startWith(this.initBreadcrumbs(this.router.url))
    );
  }

  private initBreadcrumbs(url: string): MenuItem[] {
    const urlArray = url.split(/\/+/).filter((segment) => segment !== '');

    return urlArray.map((url, index) => ({
      label: this.findEnumValue(url),
      routerLink: '/' + urlArray.slice(0, index + 1).join('/')
    }));
  }

  private findEnumValue(inputString: string): string {
    const enumKeys = Object.keys(UrlTranslation);

    for (const key of enumKeys) {
      if (key === inputString) {
        return UrlTranslation[key];
      }
    }

    return inputString;
  }
}
