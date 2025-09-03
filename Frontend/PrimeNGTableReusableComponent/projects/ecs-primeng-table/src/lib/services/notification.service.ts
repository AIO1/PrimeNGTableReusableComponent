import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class ECSPrimengTableNotificationService {
  abstract showToast(
    severity: string,
    title: string,
    message: string,
    duration?: number,
    keepToast?: boolean,
    closable?: boolean,
    clearPrevious?: boolean
  ): void;
  
  abstract clearToasts(): void;
}