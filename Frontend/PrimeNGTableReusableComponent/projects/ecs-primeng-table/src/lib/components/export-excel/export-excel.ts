import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectButton } from 'primeng/selectbutton';
import { ECSPrimengTableNotificationService } from '../../services';
import { ExportExcelService } from './export-excel.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'ecs-export-excel',
  imports: [
    DialogModule,
    FormsModule,
    ButtonModule,
    SelectButton,
    InputTextModule
  ],
  standalone: true,
  templateUrl: './export-excel.html'
})
export class ExportExcel implements OnChanges {
  @Input() visible: boolean = false;
  @Input() rowCheckboxSelectorActive: boolean = false;
  @Input() excelReportTitle: string = "";
  @Input() includeTimeInTitle: boolean = true;
  @Input() allowTitleUserEdit: boolean = false;
  @Output() exportToExcel = new EventEmitter<{
    allColumns: boolean,
    applyFilters: boolean,
    applySorts: boolean,
    selectedRows: number,
    filename: string
  }>();
  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(
    private notificationSerivce: ECSPrimengTableNotificationService,
    private exportExcelService: ExportExcelService
  ) {}

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
    let excelReportFinalTitle: string = "";
    this.excelReportTitle=this.excelReportTitle?.trim();
    if (!this.excelReportTitle || this.excelReportTitle.length <= 0) {
      this.notificationSerivce.clearToasts();
      this.notificationSerivce.showToast("error", "REPORT NAME NOT VALID", "The report name is not valid");
      return; 
    }
    const allowedPattern = /^[A-Za-z0-9 _-]*$/;
    if (!allowedPattern.test(this.excelReportTitle)) {
      this.notificationSerivce.clearToasts();
      this.notificationSerivce.showToast("error", "INVALID CHARACTERS IN REPORT NAME", "The report name contains invalid characters.");
      return;
    }
    if(this.includeTimeInTitle){
      excelReportFinalTitle = this.excelReportTitle + this.exportExcelService.getCurrentTimeString() + ".xlsx";
    } else {
      excelReportFinalTitle = this.excelReportTitle + ".xlsx";
    }
    this.exportToExcel.emit({
      allColumns: this.option_exportColumns_selected,
      applyFilters: this.option_applyCurrentFilters_selected,
      applySorts: this.option_applyCurrentSorts_selected,
      selectedRows: this.option_selectedRowsExport_selected,
      filename: excelReportFinalTitle
    });
  }

  closeModal(){
    this.visibleChange.emit(false);
  }
}