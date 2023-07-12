import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'mhd-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {
  orderId$: Observable<string>;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orderId$ = this.route.params.pipe(map((params) => params['id']));
  }
}
