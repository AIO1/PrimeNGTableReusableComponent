import { Component } from '@angular/core';
import { ECSPrimengTable } from 'ecs-primeng-table';

@Component({
  selector: 'ecs-home',
  imports: [
    ECSPrimengTable
  ],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}