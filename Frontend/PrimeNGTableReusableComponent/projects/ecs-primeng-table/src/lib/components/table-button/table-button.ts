import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ECSPrimengTableService } from '../ecs-primeng-table/ecs-primeng-table.service';

@Component({
  selector: 'ecs-table-button',
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule
  ],
  standalone: true,
  templateUrl: './table-button.html'
})
export class TableButton {
  constructor(
    private tableService: ECSPrimengTableService
  ) {}
  @Input() button: any;
  @Input() rowData: any;

  @Output() clicked = new EventEmitter<any>();

  isDisabled(): boolean {
    return this.button.condition ? !this.button.condition(this.rowData) : false;
  }

  handleClick() {
    if (this.button.action) {
      this.tableService.handleButtonsClick(this.button.action, this.rowData);
    }
  }
}
