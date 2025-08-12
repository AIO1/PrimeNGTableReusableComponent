import { Component, Input, ViewChild } from '@angular/core';

// PrimeNG imports
import { Table, TableModule } from 'primeng/table';

import { ECSPrimengTableViewSaveMode } from '../../enums/table-view-save-mode.enum';

import { ECSPrimengTableColumnMetadata } from '../../interfaces/columns-metadata.interface';

@Component({
  selector: 'ecs-primeng-table',
  imports: [
    TableModule
  ],
  standalone: true,
  templateUrl: './ecs-primeng-table.html',
  styles: ''
})
export class ECSPrimengTable {
  @Input() data: any[] = []; // The array of data to be displayed
  @Input() columnsToShow: ECSPrimengTableColumnMetadata[] = []; // The combination of the non-selectable columns + selected columns that must be shown
  @Input() computeScrollHeight: boolean = true; // If true, the table will try not to grow more than the total height of the window vertically

  @ViewChild('dt') dt!: Table; // Get the reference to the object table
  scrollHeight: string = "0px"; // Used to get the table height

  updateData(event: any){

  }
}