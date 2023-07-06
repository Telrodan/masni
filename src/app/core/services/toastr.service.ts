import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  constructor(private messageService: MessageService) {}

  success(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Siker',
      detail: message
    });
  }

  info(message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: message
    });
  }

  warn(message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Figyelem',
      detail: message
    });
  }

  error(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Hiba',
      detail: message
    });
  }
}
