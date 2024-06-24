import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../constants';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {
  ngOnInit(): void {
    Constants.waitingHTTP=false; // Indicate that we are not waiting any http call
  }
}