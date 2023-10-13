import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'mhd-order-success-page',
  templateUrl: './order-success-page.component.html',
  styleUrls: ['./order-success-page.component.scss']
})
export class OrderSuccessPageComponent implements OnInit {
  orderId$: Observable<string>;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orderId$ = this.route.params.pipe(map((params) => params['id']));
  }
}
