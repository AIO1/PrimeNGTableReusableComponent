import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ECSPrimengTableService } from '../ecs-primeng-table/ecs-primeng-table.service';

@Component({
  selector: 'ecs-table-action-button',
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule
  ],
  standalone: true,
  templateUrl: './table-action-button.html'
})
export class TableActionButton {
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
