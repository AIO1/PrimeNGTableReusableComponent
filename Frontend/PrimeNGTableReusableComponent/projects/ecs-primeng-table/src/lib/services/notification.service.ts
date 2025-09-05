import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class ECSPrimengTableNotificationService {
  abstract showToast(
    severity: string,
    title: string,
    message: string
  ): void;
  
  abstract clearToasts(): void;
}