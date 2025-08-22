import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'ecs-export-excel',
  imports: [
    DialogModule,
    FormsModule,
    ButtonModule,
    SelectButton
  ],
  standalone: true,
  templateUrl: './export-excel.html'
})
export class ExportExcel implements OnChanges {
  @Input() visible: boolean = false;
  @Input() rowCheckboxSelectorActive: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  option_exportColumns_selected: boolean = false;
  option_exportColumns: any[] = [
    { label: 'Only visible', value: false },
    { label: 'All columns', value: true }
  ];

  option_applyCurrentFilters_selected: boolean = false;
  option_applyCurrentFilters: any[] = [
    { label: 'No filters', value: false },
    { label: 'Apply current filters', value: true }
  ];

  option_applyCurrentSorts_selected: boolean = false;
  option_applyCurrentSorts: any[] = [
    { label: 'No sorts', value: false },
    { label: 'Apply current sorts', value: true }
  ];

  option_selectedRowsExport_selected: number = 0;
  option_selectedRowsExport: any[] = [
    { label: 'All rows', value: 0 },
    { label: 'Selected rows', value: 1 },
    { label: 'Not selected rows', value: 2 }
  ];
  
  ngOnChanges(changes: SimpleChanges) {
    // If visible changes from false to true, reset values
    if (changes['visible'] && changes['visible'].currentValue === true && changes['visible'].previousValue === false) {
      this.resetValues();
    }
  }

  private resetValues() {
    this.option_exportColumns_selected = false;
    this.option_applyCurrentFilters_selected = false;
    this.option_applyCurrentSorts_selected = false;
    this.option_selectedRowsExport_selected = 0;
  }
  
  getExcelReport(){
    this.closeModal();
  }
  closeModal(){
    this.visibleChange.emit(false);
  }
}