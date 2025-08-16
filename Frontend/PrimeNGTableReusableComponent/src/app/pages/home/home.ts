import { Component, ViewChild } from '@angular/core';
import { ActionButton, ECSPrimengTable } from 'ecs-primeng-table';
import { SharedService } from '../../core/services/shared.service';

@Component({
  selector: 'ecs-home',
  imports: [
    ECSPrimengTable
  ],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  constructor(private sharedService: SharedService){}
  @ViewChild('dt') dt!: ECSPrimengTable; // Get the reference to the object table
  headerActionButtons: ActionButton[] = [
    {
      icon: 'pi pi-file',
      color: 'p-button-success',
      action: () => {
        this.sharedService.clearToasts();
        this.sharedService.showToast("info","Clicked on create a new record","Here you will for example show a modal to create a new record. Upon creating the record, you can do 'this.dt.updateDataExternal()' to refresh the table data and show the newly created record.");
      },
      label: "CREATE",
      tooltip: "Create new record"
    }
  ];
  rowActionButtons: ActionButton[] = [
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
}