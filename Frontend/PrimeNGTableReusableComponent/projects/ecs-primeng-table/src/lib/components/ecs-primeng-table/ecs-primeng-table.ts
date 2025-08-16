import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG imports
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { CellOverflowBehaviour, DataAlignHorizontal, DataAlignVertical, DataType, FrozenColumnAlign, TableViewSaveMode } from '../../enums';

import { ColumnMetadata, TableConfiguration } from '../../interfaces';

import { ECSPrimengTableService } from './ecs-primeng-table.service';
import { FormsModule } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';


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
  @Input() columnsToShow: ColumnMetadata[] = []; // The combination of the non-selectable columns + selected columns that must be shown
  @Input() computeScrollHeight: boolean = true; // If true, the table will try not to grow more than the total height of the window vertically
  @Input() globalSearchEnabled: boolean = true; // Used to enable or disable the global search (by default enabled)
  @Input() globalSearchMaxLength: number = 50; // The maximun number of characters that can be input in the global filter
  @Input() globalSearchPlaceholder: string = "Search keyword"; // The placeholder text to show if global search is enabled
  @Input() columnEditorEnabled: boolean = true; // If the user can modify the columns thorugh the column editor
  @Input() urlColumnsSource!: string; // The source URL to get data from columns
  @Input() reportSourceURL: string | null = null;

  @ViewChild('dt') dt!: Table; // Get the reference to the object table
  showRefreshData=true;
  scrollHeight: string = "0px"; // Used to get the table height
  globalSearchText: string | null = null; // The text used by the global search

  DataType = DataType;
  CellOverflowBehaviour = CellOverflowBehaviour;
  DataAlignHorizontal = DataAlignHorizontal;
  DataAlignVertical = DataAlignVertical;
  FrozenColumnAlign = FrozenColumnAlign;
  TableViewSaveMode = TableViewSaveMode;

  currentPage: number = 0; // The current page we are at
  currentRowsPerPage: number = 0; // The current rows per page selected
  allowedRowsPerPage: number[] = []; // The different values of rows per page allowed
  totalRecords: number = 0; // The number of total records that are available (taking into account the filters)
  totalRecordsNotFiltered: number = 0; // The total number of records available if no filters were applied

  dateFormat: string = "dd-MMM-yyyy HH:mm:ss zzzz";
  dateTimezone: string = "+00:00";
  dateCulture: string = "en-US";

  columns: ColumnMetadata[] = [];
  columnsCantBeHidden: ColumnMetadata[] = [];
  columnsSelected: ColumnMetadata[] = [];
  
  ngOnInit(): void {
    this.fetchTableConfiguration();
  }

  fetchTableConfiguration(): void {
    this.tableService.fetchTableConfiguration(this.urlColumnsSource).subscribe({
      next: (response: HttpResponse<TableConfiguration>) => this.handleTableColumnsResponse(response.body!),
      error: (err) => this.tableService.handleTableError(err, 'Columns Error')
    });
  }

  fetchTableData(): void {
    
  }

  private handleTableColumnsResponse(body: TableConfiguration): void {
    this.allowedRowsPerPage = body.allowedItemsPerPage; // Update the number of rows allowed per page
    this.currentRowsPerPage = Math.min(...this.allowedRowsPerPage); // Update the current rows per page to use the minimum value of allowed rows per page by default
    this.columns = body.columnsInfo; // Update columns with fetched data
    this.columnsCantBeHidden = this.columns.filter((col: any) => !col.canBeHidden); // Filter columns that cannot be hidden
    this.columnsSelected = this.columns.filter((col: any) => !col.startHidden && col.canBeHidden); // Selected columns that are not hidden by default
    this.columnsToShow = this.tableService.orderColumnsWithFrozens(this.columnsCantBeHidden.concat(this.columnsSelected));
    this.dateFormat = body.dateFormat;
    this.dateTimezone = body.dateTimezone;
    this.dateCulture = body.dateCulture;
    this.currentPage = 0;
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

  getColumnStyle(col: any, headerCols: boolean = false): Record<string, string> {
    let styles: Record<string, string> = {};
    if(!headerCols){
      styles = {
          'white-space': col.cellOverflowBehaviour === CellOverflowBehaviour.Wrap ? 'normal' : 'nowrap',
          'word-wrap': col.cellOverflowBehaviour === CellOverflowBehaviour.Wrap ? 'break-word' : 'normal',
          'word-break': col.cellOverflowBehaviour === CellOverflowBehaviour.Wrap ? 'break-all' : 'normal'
      };
    }
    if (col.initialWidth > 0) {
        styles['max-width'] = col.initialWidth + 'px';
        styles['min-width'] = col.initialWidth + 'px';
        styles['width'] = col.initialWidth + 'px';
    }
    return styles;
  }

  getFrozenColumnAlignAsText(frozenColumnAlign: FrozenColumnAlign): string {
    switch (frozenColumnAlign) {
      case FrozenColumnAlign.Left:
        return 'left';
      case FrozenColumnAlign.Right:
        return 'right';
      default:
        return 'left';
    }
  }
}