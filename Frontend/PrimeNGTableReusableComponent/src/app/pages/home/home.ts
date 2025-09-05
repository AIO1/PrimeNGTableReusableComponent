import { Component, OnInit, ViewChild } from '@angular/core';
import { ITableButton, ECSPrimengTable, IPredifinedFilter, TableViewSaveMode, ITableOptions, DEFAULT_TABLE_OPTIONS, createTableOptions } from 'ecs-primeng-table';
import { SharedService } from '../../core/services/shared.service';
import { IEmploymentStatus } from './employment-status.interface';

@Component({
  selector: 'ecs-home',
  imports: [
    ECSPrimengTable
  ],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  constructor(private sharedService: SharedService){}
  @ViewChild('dt') dt!: ECSPrimengTable; // Get the reference to the object table

  headerActionButtons: ITableButton[] = [
    {
      icon: 'pi pi-plus',
      color: 'p-button-success',
      action: () => {
        this.sharedService.clearToasts();
        this.sharedService.showToast("info","Clicked on create a new record","Here you will for example show a modal to create a new record. Upon creating the record, you can do 'this.dt.updateDataExternal()' to refresh the table data and show the newly created record.");
      },
      label: "CREATE",
      tooltip: "Create new record"
    }
  ];
  rowActionButtons: ITableButton[] = [
    {
      icon: 'pi pi-trash',
      tooltip: 'Delete record',
      color: 'p-button-danger',
      action: (rowData) => {
        this.sharedService.showToast("warn","Clicked on delete row",`The record ID is\n\n${rowData.rowID}\n\nThis button only appears if a condition is met. Remember that a backend validation should be done anyways because users can tamper with the exposed variables in the frontend.`);
      },
      condition: (rowData) => (rowData.canBeDeleted === true)
    }, {
      icon: 'pi pi-file-edit',
      tooltip: 'Edit record',
      color: 'p-button-primary',
      action: (rowData) => {
        this.sharedService.showToast("success","Clicked on edit row",`The record ID is\n\n${rowData.rowID}\n\nHere you could open a modal for the user to edit this record (you can retrieve data through the ID) and then call 'this.dt.updateDataExternal()' to refresh the table data.`);
      }
    }
  ];

  employmentStatusPredifinedFilter: IPredifinedFilter[] = []; // Contains the data for the possible employment statuses
  predefinedFiltersCollection: { [key: string]: IPredifinedFilter[] } = {
    'employmentStatusPredifinedFilter': this.employmentStatusPredifinedFilter
  };
  tableOptions: ITableOptions = createTableOptions({
    isActive: false,
    urlTableConfiguration: "Main/TestGetCols",
    urlTableData: "Main/TestGetData",
    excelReport: {
      ...DEFAULT_TABLE_OPTIONS.excelReport,
      url: "Main/GenerateExcel"
    },
    predefinedFilters: this.predefinedFiltersCollection,
    header: {
      ...DEFAULT_TABLE_OPTIONS.header,
      buttons: this.headerActionButtons
    },
    rows: {
      ...DEFAULT_TABLE_OPTIONS.rows,
      action: {
        ...DEFAULT_TABLE_OPTIONS.rows.action,
        buttons: this.rowActionButtons,
        width: 110
      },
      checkboxSelector: {
        ...DEFAULT_TABLE_OPTIONS.rows.checkboxSelector,
        enabled: true,
        width: 125
      },
      singleSelector: {
        enabled: true,
        metakey: false
      }
    },
    views: {
      ...DEFAULT_TABLE_OPTIONS.views,
      saveMode: TableViewSaveMode.DatabaseStorage,
      saveKey: "TEST",
      urlGet: "Main/GetViews",
      urlSave: "Main/SaveViews"
    }
  });

  /*[computeScrollHeight]="true"*/
  ngOnInit(): void {
    this.getEmploymentStatus(); // Retrieve the possible employment status
  }
  private getEmploymentStatus(){
    this.sharedService.handleHttpResponse(this.sharedService.handleHttpGetRequest<IEmploymentStatus[]>(`Main/GetEmploymentStatus`)).subscribe({
      next: (responseData: IEmploymentStatus[]) => {
        responseData.forEach((data) => {
          this.employmentStatusPredifinedFilter.push({
            value: data.statusName,
            name: data.statusName,
            displayTag: true,
            tagStyle: {
              background: `rgb(${data.colorR}, ${data.colorG}, ${data.colorB})`
            }
          })
        });
        this.dt.updateData();
      },
      error: err => {
        this.sharedService.dataFecthError("ERROR IN GET EMPLOYMENT STATUS", err);
      }
    });
  }
  onRowSelect(event: any){
    this.sharedService.clearToasts();
    this.sharedService.showToast("info","SELECTED A ROW",`Selected row with ID ${event.rowID}`);
  }
  onRowUnselect(event: any){
    this.sharedService.clearToasts();
    this.sharedService.showToast("info","UNSELECTED A ROW",`Unselected row with ID ${event.rowID}`);
  }
}