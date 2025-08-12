import { Component, Input, OnInit, ViewChild } from '@angular/core';

// PrimeNG imports
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { ECSPrimengTableViewSaveMode } from '../../enums/table-view-save-mode.enum';

import { ECSPrimengTableColumnMetadata } from '../../interfaces/columns-metadata.interface';

import { ECSPrimengTableService } from './ecs-primeng-table.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ecs-primeng-table',
  imports: [
    TableModule,
    ButtonModule,
    TooltipModule,
    CommonModule
  ],
  standalone: true,
  templateUrl: './ecs-primeng-table.html',
  styles: ''
})
export class ECSPrimengTable implements OnInit {
  constructor(private tableService: ECSPrimengTableService) {}
  @Input() data: any[] = []; // The array of data to be displayed
  @Input() columnsToShow: ECSPrimengTableColumnMetadata[] = []; // The combination of the non-selectable columns + selected columns that must be shown
  @Input() computeScrollHeight: boolean = true; // If true, the table will try not to grow more than the total height of the window vertically

  @Input() urlColumnsSource!: string; // The source URL to get data from columns

  showRefreshData=true;
  @ViewChild('dt') dt!: Table; // Get the reference to the object table
  scrollHeight: string = "0px"; // Used to get the table height
  
  ngOnInit(): void {
    this.fetchTableColumns();
  }
  
  fetchTableColumns(): void {
    this.tableService.fetchTableColumns(this.urlColumnsSource).subscribe({
      next: (response) => this.handleTableColumnsResponse(response.body),
      error: (err) => this.tableService.handleTableError(err, 'Columns Error')
    });
  }

  private handleTableColumnsResponse(body: any): void {
    console.log(body)
  }

  updateData(event: any){

  }
}