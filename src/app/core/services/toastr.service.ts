import { Injectable } from '@angular/core';

import { ToastrService as T } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ToastrService {
    constructor(private toastr: T) {}

    success(message: string): void {
        this.toastr.success(message);
    }

    info(message: string): void {
        this.toastr.info(message);
    }

    warn(message: string): void {
        this.toastr.warning(message);
    }

    error(message: string): void {
        this.toastr.error(message);
    }
}
