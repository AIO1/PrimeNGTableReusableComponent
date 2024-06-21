import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api'; // To enable the ripple effect (optional)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private primengConfig: PrimeNGConfig) {}
  ngOnInit() {
    this.primengConfig.ripple = true; // Enable ripple effect (optional)
  }
}