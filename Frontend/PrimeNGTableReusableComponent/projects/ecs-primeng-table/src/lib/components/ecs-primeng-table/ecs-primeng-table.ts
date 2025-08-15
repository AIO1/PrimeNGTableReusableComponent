import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG imports
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { ECSPrimengTableViewSaveMode } from '../../enums/table-view-save-mode.enum';

import { ECSPrimengTableColumnMetadata } from '../../interfaces/columns-metadata.interface';

import { ECSPrimengTableService } from './ecs-primeng-table.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'ecs-primeng-table',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
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
  @Input() globalSearchEnabled: boolean = true; // Used to enable or disable the global search (by default enabled)
  @Input() globalSearchMaxLength: number = 50; // The maximun number of characters that can be input in the global filter
  @Input() globalSearchPlaceholder: string = "Search keyword"; // The placeholder text to show if global search is enabled
  @Input() columnEditorEnabled: boolean = true; // If the user can modify the columns thorugh the column editor
  @Input() urlColumnsSource!: string; // The source URL to get data from columns
  @Input() reportSourceURL: string | null = null;

  showRefreshData=true;
  @ViewChild('dt') dt!: Table; // Get the reference to the object table
  scrollHeight: string = "0px"; // Used to get the table height
  globalSearchText: string | null = null; // The text used by the global search
  
  ngOnInit(): void {
    this.fetchTableColumns();
  }
  
  fetchTableConfiguration(): void {

  }

  fetchTableColumns(): void {
    this.tableService.fetchTableColumns(this.urlColumnsSource).subscribe({
      next: (response) => this.handleTableColumnsResponse(response.body),
      error: (err) => this.tableService.handleTableError(err, 'Columns Error')
    });
  }

  fetchTableData(): void {
    
  }

  private handleTableColumnsResponse(body: any): void {
    console.log(body)
  }

  updateData(event: any): void {

  }

  clearFilters(a: any, b?: any, c?: any): void {

  }

  showColumnModal(): void {

  }

  clearSorts(dt: any): void {

  }
  hasToClearSorts(dt: any): boolean {
    return false;
  }
  hasToClearFilters(dt: any, globalSearchText: any): boolean {
    return false;
  }
  openExcelReport(): void {

  }
}