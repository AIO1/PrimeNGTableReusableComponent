import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FrozenColumnAlign } from '../../enums';
import { frozenColumnAlignAsText } from '../../utils';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TableButton } from '../table-button/table-button';
import { ECSPrimengTableService } from '../ecs-primeng-table/ecs-primeng-table.service';

@Component({
  selector: 'ecs-table-action-column',
  imports: [
    CommonModule,
    TableModule,
    TableButton
  ],
  standalone: true,
  templateUrl: './table-action-column.html'
})
export class TableActionColumn {
  constructor(
      private tableService: ECSPrimengTableService
    ) {}
  @Input() rowActionButtons: any[] = [];
  @Input() actionsColumnWidth: number = 120;
  @Input() actionsColumnResizable: boolean = true;
  @Input() actionsColumnFrozen: boolean = false;
  @Input() actionsColumnAligmentRight: boolean = false;
  @Input() actionColumnName: string = 'Acciones';

  @ViewChild('actionColumnHeaderTemplate', { static: true }) headerTemplate!: TemplateRef<any>;
  @ViewChild('actionColumnTemplate', { static: true }) rowTemplate!: TemplateRef<any>;

  get headerTpl(): TemplateRef<any> {
    return this.headerTemplate;
  }
  get rowTpl(): TemplateRef<any> {
    return this.rowTemplate;
  }

  getFrozenColumnAlignAsText(frozenColumnAlignRight: boolean): string {
    if(frozenColumnAlignRight){
      return frozenColumnAlignAsText(FrozenColumnAlign.Right);
    }
    return frozenColumnAlignAsText(FrozenColumnAlign.Left);
  }

  handleButtonsClick(action: (rowData: any) => void, rowData: any = null): void {
    this.tableService.handleButtonsClick(action, rowData);
  }
}