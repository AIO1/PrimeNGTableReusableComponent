import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimengTableComponent } from '../primeng-table/primeng-table.component';

import { SharedService } from '../../services/shared/shared.service';

import { IPrimengPredifinedFilter } from '../../interfaces/primeng/iprimeng-predifined-filter';
import { IEmploymentStatus } from '../../interfaces/iemployment-status';
import { IprimengActionButtons } from '../../interfaces/primeng/iprimeng-action-buttons';
import { Constants } from '../../../constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  constructor(private sharedService: SharedService){}
  @ViewChild('dt') dt!: PrimengTableComponent; // Get the reference to the object table

  employmentStatusPredifinedFilter: IPrimengPredifinedFilter[] = []; // Contains the data for the possible employment statuses
  predifinedFiltersCollection: { [key: string]: IPrimengPredifinedFilter[] } = {
    employmentStatusPredifinedFilter: this.employmentStatusPredifinedFilter
  };

  headerActionButtons: IprimengActionButtons[] = [
    {
      icon: 'pi pi-calculator',
      action: () => {
        this.sharedService.clearToasts();
        this.sharedService.showToast("success","Clicked on the calculator","Cool! It wokrs :)");
      }
    },
    {
      icon: 'pi pi-file',
      color: 'p-button-success',
      action: () => {
        this.sharedService.clearToasts();
        this.sharedService.showToast("info","Clicked on create a new record","Here you will for example show a modal to create a new record. Upon creating the record, you can do 'this.dt.updateDataExternal()' to refresh the table data and show the newly created record.");
      }
    }
  ];
  rowActionButtons: IprimengActionButtons[] = [
    {
      icon: 'pi pi-trash',
      color: 'p-button-danger',
      action: (rowData) => {
        this.sharedService.showToast("warn","Clicked on delete row",`The record ID is\n\n${rowData.id}\n\nThis button only appears if a condition is met. Remember that a backend validation should be done anyways because users can tamper with the exposed variables in the frontend.`);
      },
      condition: (rowData) => (rowData.canBeDeleted === true)
    }, {
      icon: 'pi pi-file-edit',
      color: 'p-button-primary',
      action: (rowData) => {
        this.sharedService.showToast("success","Clicked on edit row",`The record ID is\n\n${rowData.id}\n\nHere you could open a modal for the user to edit this record (you can retrieve data through the ID) and then call 'this.dt.updateDataExternal()' to refresh the table data.`);
      }
    }
  ];

  ngOnInit(): void {
    this.getEmploymentStatus(); // Retrieve the possible employment status
  }
  private getEmploymentStatus(){
    setTimeout(() => {
      Constants.waitingHTTP = true; // To indicate that we are waiting an HTTP call. Perform it after one frame so we don't get the warning of ExpressionChangedAfterItHasBeenCheckedError
    }, 1);
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
        this.dt.updateDataExternal(); // Get data for the table (columns + data)
      },
      error: err => {
        this.sharedService.dataFecthError("ERROR IN GET EMPLOYMENT STATUS", err);
      }
    });
  }
}
