import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ECSPrimengTableNotificationService } from '../../services';
@Component({
  selector: 'ecs-views-management',
  imports: [
    DialogModule,
    TableModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    TooltipModule,
    InputTextModule
  ],
  standalone: true,
  templateUrl: './views-management.html'
})
export class ViewsManagement {
  constructor(
    private notification: ECSPrimengTableNotificationService
  ) {}
  @Input() visible: boolean = false;
  @Input() tableViews_menuItems: MenuItem[] = [];
  @Output() onViewSelect = new EventEmitter<string>();
  @Output() onViewDelete = new EventEmitter<string>();
  @Output() onViewUpdateData = new EventEmitter<string>();
  @Output() onViewEditAlias = new EventEmitter<{ viewAliasOld: string; viewAliasNew: string }>();
  @Output() onViewCreate = new EventEmitter<string>();
  @Output() visibleChange = new EventEmitter<boolean>();
  viewEditorShow: boolean = false;
  editingViewAlias: string = '';
  newViewAlias: string = '';
  loadView(viewAlias: string) {
    this.onViewSelect.emit(viewAlias);
  }
  deleteView(viewAlias: string){
    this.onViewDelete.emit(viewAlias);
  }
  updateView(viewAlias: string){
    this.onViewUpdateData.emit(viewAlias);
  }
  createView(viewAlias: string){
    const exists = this.tableViews_menuItems.some(item => item.label === viewAlias);
    if (exists) {
      this.notification.showToast("error","DUPLICATE VIEW NAME",`A view with alias "${viewAlias}" already exists`);
      return;
    }
    this.onViewCreate.emit(viewAlias);
  }
  editViewAlias(viewAliasOld: string, viewAliasNew: string) {
  this.onViewEditAlias.emit({
      viewAliasOld: viewAliasOld,
      viewAliasNew: viewAliasNew
    });
  }
  
  showViewEditor(editingViewAlias: string = ''){
    this.editingViewAlias = editingViewAlias;
    this.newViewAlias = this.editingViewAlias;
    this.viewEditorShow=true;
  }

  closeModal(){
    this.visibleChange.emit(false);
  }

  createOrUpdateTableView(){
    this.viewEditorShow=false;
    if(this.editingViewAlias !== ''){
      this.editViewAlias(this.editingViewAlias, this.newViewAlias);
    } else {
      this.createView(this.newViewAlias);
    }
  }
}