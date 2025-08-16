import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpinnerService } from './core/services/spinner.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastModule,
    DialogModule,
    ProgressSpinnerModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  isSpinnerVisible: boolean = false;
  isUserAdmin = false;
  constructor(private spinnerService: SpinnerService) {
    this.spinnerService.spinner$.subscribe(visible => {
      setTimeout(() => {
        this.isSpinnerVisible = visible;
      }, 1);
    });
  }
}