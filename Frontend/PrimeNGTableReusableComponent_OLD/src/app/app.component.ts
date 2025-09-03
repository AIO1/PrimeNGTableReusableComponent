import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api'; // To enable the ripple effect (optional)
import { SpinnerService } from './services/shared/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isSpinnerVisible: boolean = false;
  constructor(private primengConfig: PrimeNGConfig, public spinnerService: SpinnerService) {
    this.spinnerService.spinner$.subscribe(visible => {
      setTimeout(() => {
        this.isSpinnerVisible = visible;
      }, 1);
    });
  }
  ngOnInit() {
    this.primengConfig.ripple = true; // Enable ripple effect (optional)
  }
}