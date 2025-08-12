import { Injectable } from '@angular/core';
import { ECSPrimengTableNotificationService } from 'ecs-primeng-table';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class NotificationService extends ECSPrimengTableNotificationService {
  constructor(private sharedService: SharedService) {  // Inyecta tu SharedService
    super();
  }
  showToast(
    severity: string,
    title: string,
    message: string,
    duration: number = 5000,
    keepToast: boolean = false,
    closable: boolean = true,
    clearPrevious: boolean = true
  ): void {
    this.sharedService.showToast(severity, title, message, duration, keepToast, closable, clearPrevious);
  }
  clearToasts(): void {
    this.sharedService.clearToasts();
  }
}