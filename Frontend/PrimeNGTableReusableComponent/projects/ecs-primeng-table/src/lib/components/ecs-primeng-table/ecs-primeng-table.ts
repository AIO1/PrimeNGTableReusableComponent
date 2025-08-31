import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

// PrimeNG imports
import { Table, TableLazyLoadEvent, TableModule, TablePageEvent, TableRowSelectEvent, TableRowUnSelectEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { FilterMetadata, MenuItem } from 'primeng/api';
import { ButtonGroupModule } from 'primeng/buttongroup';

import { ECSPrimengTableService } from './ecs-primeng-table.service';
import { CellOverflowBehaviour, DataAlignHorizontal, DataAlignVertical, DataType, FrozenColumnAlign, TableViewSaveMode } from '../../enums';
import { ITableButton, IColumnMetadata, IPredifinedFilter, ITableConfiguration, ITablePagedResponse, ITableQueryRequest, IExcelExportRequest, ITableView, ITableViewData } from '../../interfaces';
import { dataAlignHorizontalAsText, dataAlignVerticalAsText, dataTypeAsText, frozenColumnAlignAsText } from '../../utils';
import { ECSPrimengTableNotificationService } from '../../services';
import { TableCell } from '../table-cell/table-cell';
import { TablePredifinedFilters } from '../table-predifined-filters/table-predifined-filters';
import { TableButton } from '../table-button/table-button';
import { ColumnSelector } from "../column-selector/column-selector";
import { ExportExcel } from '../export-excel/export-excel';
import { Observable } from 'rxjs';
import { ViewsManagement } from "../views-management/views-management";

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
    InputIconModule,
    MultiSelectModule,
    CheckboxModule,
    PaginatorModule,
    TableCell,
    TablePredifinedFilters,
    TableButton,
    ColumnSelector,
    ExportExcel,
    ButtonGroupModule,
    ViewsManagement
],
  standalone: true,
  templateUrl: './ecs-primeng-table.html',
  styleUrl: './ecs-primeng-table.scss',
  encapsulation: ViewEncapsulation.None
})
export class ECSPrimengTable implements OnInit, AfterViewInit, OnDestroy {
  private resizeObserver!: ResizeObserver;
  constructor(
    private tableService: ECSPrimengTableService,
    private notification: ECSPrimengTableNotificationService
  ) {}
  @Input() isActive: boolean = true;
  @Input() data: any[] = []; // The array of data to be displayed
  @Input() columnsToShow: IColumnMetadata[] = []; // The combination of the non-selectable columns + selected columns that must be shown
  @Input() computeScrollHeight: boolean = true; // If true, the table will try not to grow more than the total height of the window vertically
  @Input() globalSearchEnabled: boolean = true; // Used to enable or disable the global search (by default enabled)
  @Input() globalSearchMaxLength: number = 50; // The maximun number of characters that can be input in the global filter
  @Input() globalSearchPlaceholder: string = "Search keyword"; // The placeholder text to show if global search is enabled
  @Input() columnEditorEnabled: boolean = true; // If the user can modify the columns thorugh the column editor
  @Input() urlColumnsSource!: string; // The source URL to get data from columns
  @Input() urlDataSource!:string; // The URL to fetch data from
  @Input() urlExcelReport: string | null = null;
  @Input() predifinedFiltersCollection: { [key: string]: IPredifinedFilter[] } = {}; // Contains a collection of the values that need to be shown for predifined column filters
  @Input() predifinedFiltersNoSelectionPlaceholder: string = "Any value"; // A text to be displayed in the dropdown if no value has been selected in a column that uses predifined filters
  @Input() predifinedFiltersCollectionSelectedValuesText: string = "items selected"; // A text to display in the predifined filters dropdown footer indicating the number of items that have been selected
  @Input() rowActionButtons: ITableButton[] = []; // A list that contains all buttons that will appear in the actions column
  @Input() headerActionButtons: ITableButton[] = []; // A list that contains all buttons that will appear in the right side of the header of the table
  @Input() copyCellDataToClipboardTimeSecs: number = 0.5; // The amount of time since mouse down in a cell for its content to be copied to the clipboard. If you want to disable this functionality, put it to a value less than or equal to 0.
  @Input() actionsColumnAligmentRight: boolean = true; // If actions column is put at the right end of the table (or false if its at the left)
  @Input() actionsColumnWidth: number = 150; // The amount in pixels for the size of the actions column
  @Input() actionsColumnFrozen: boolean = true; // If the actions column should be frozen
  @Input() rowSelectorColumnActive: boolean = false; // By default false. If true, a column will be shown to the user that includes a checkbox per row. This selection and filtering that the user can do is all managed by the table component. You can fetch the selected rows through the output selectedRowsCheckbox.
  @Input() rowSelectorColumName: string = "Selected"; // The title of the row selection column. By default is "Selected"
  @Input() rowSelectorColumnAligmentRight: boolean = true; // By default true. If true, the row selector column is put at the right end of the table (or false if its at the left).
  @Input() rowSelectorColumnWidth: number = 150; // The amount in pixels for the size of the selector column
  @Input() rowSelectorColumnFrozen: boolean = true; // By default true. If true, the row selector column will be frozen.
  @Input() actionsColumnResizable: boolean = false; // If the action column can be resized by the user
  @Input() actionColumnName: string = "Actions" // The column name were the action buttons will appear
  @Input() rowselectorColumnResizable: boolean = false;
  @Input() noDataFoundText: string = "No data found for the current filter criteria."; // The text to be shown when no data has been returned
  @Input() showClearSortAndFilters: boolean = true;
  @Input() excelReportTitleDefault: string = "Report";
  @Input() excelReportTitleAllowUserEdit: boolean = false;
  @Input() tableViewSaveAs: TableViewSaveMode = TableViewSaveMode.noone; // How the table view will be saved
  @Input() tableViewSaveKey: string = ""; // The key used to save the table views
  @Input() viewsGetSourceURL: string = "";
  @Input() viewsSaveSourceURL: string = "";
  @Input() maxTableViews: number = 10; // The maximun number of views that can be saved
  @Output() onRowCheckboxChange = new EventEmitter<{
    rowID: any,
    selected: boolean
  }>(); // Emitter that returns the column selected and if it was selected or unselected
  @Output() onRowSelect = new EventEmitter<{
    rowID: any,
    rowData: any
  }>
  @Output() onRowUnselect = new EventEmitter<{
    rowID: any,
    rowData: any
  }>
  viewsModalShow:boolean = false;
  tableViewCurrentSelectedAlias: string | null = null;
  tableViewsFirstFetchDone: boolean = false;
  excelReportTitle: string = "";
  showExportModal: boolean = false;
  showColumnSelector: boolean = false;
  selectedRowsCheckbox: any[] = []; // An array to keep all the selected rows
  @ViewChild('dt') dt!: Table; // Get the reference to the object table
  showRefreshData=true;
  scrollHeight: string = "0px"; // Used to get the table height
  globalSearchText: string | null = null; // The text used by the global search
  tableViewsList: ITableView[] = [];
  tableViews_menuItems: MenuItem[] = [];

  DataType = DataType;
  CellOverflowBehaviour = CellOverflowBehaviour;
  DataAlignHorizontal = DataAlignHorizontal;
  DataAlignVertical = DataAlignVertical;
  FrozenColumnAlign = FrozenColumnAlign;
  TableViewSaveMode = TableViewSaveMode;

  rowSelection: any;
  currentPage: number = 0; // The current page we are at
  currentRowsPerPage: number = 0; // The current rows per page selected
  allowedRowsPerPage: number[] = []; // The different values of rows per page allowed
  totalRecords: number = 0; // The number of total records that are available (taking into account the filters)
  totalRecordsNotFiltered: number = 0; // The total number of records available if no filters were applied

  dateFormat: string = "dd-MMM-yyyy HH:mm:ss zzzz";
  dateTimezone: string = "+00:00";
  dateCulture: string = "en-US";

  columns: IColumnMetadata[] = [];
  columnsCantBeHidden: IColumnMetadata[] = [];
  columnsSelected: IColumnMetadata[] = [];
  columnModalData: any[] = []; 
  filteredColumnData: any[] = []; 
  predifinedFiltersSelectedValuesCollection: { [key: string]: any[] } = {}; // Contains a collection of the predifined column filters selection (possible values come from 'predifinedFiltersCollection')
  private copyCellDataTimer: any; // A timer that handles the amount of time left to copy the cell data to the clipboard
  tableLazyLoadEventInformation: TableLazyLoadEvent = {}; // Data of the last lazy load event of the table
  private initialConfigurationFetched: boolean = false;
  ngOnInit(): void {
    this.fetchTableConfiguration();
  }
  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;
  @ViewChild('headerContainer', { static: false }) headerContainer!: ElementRef;
  @ViewChild('paginatorContainer', { static: false }) paginatorContainer!: ElementRef;
  ngAfterViewInit() {
    if (this.computeScrollHeight) {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateScrollHeight();
      });
      this.resizeObserver.observe(this.tableContainer.nativeElement);
      window.addEventListener('resize', this.onWindowResize);
      this.calculateScrollHeight();
    }
  }
onWindowResize = () => {
  clearTimeout((this as any)._resizeTimeout);
  (this as any)._resizeTimeout = setTimeout(() => {
    this.calculateScrollHeight();
  }, 100);
};
  calculateScrollHeight(){
    if (this.tableContainer && this.paginatorContainer && this.headerContainer) {
      const containerRect = this.tableContainer.nativeElement.getBoundingClientRect();
      const paginatorHeight = this.paginatorContainer.nativeElement.offsetHeight;
      const headerHeight = this.headerContainer.nativeElement.offsetHeight;
      const viewportHeight = window.innerHeight;
      const topOffset = containerRect.top + window.scrollY;
      this.scrollHeight = `${(viewportHeight - topOffset - paginatorHeight - headerHeight) - 45}px`;
      //const containerHeight = this.tableContainer.nativeElement.offsetHeight;
      //const headerHeight = this.headerContainer.nativeElement.offsetHeight;
      //const paginatorHeight = this.paginatorContainer.nativeElement.offsetHeight || 50; // fallback

      //this.scrollHeight = `${containerHeight - headerHeight - paginatorHeight}px`;
      console.log(this.scrollHeight)
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.onWindowResize);
  }

  /**
   * Used to update the data of a table externally outside the component. Use this method instead of 'updateData' to force the data updata of a table
   *
   * @param {(optionalData?: any) => void} [continueAction] - Optional action to execute after data retrieval if it succeeded.
   * @param {boolean} [uponContinueActionEndModalHttp=false] - Optional flag to set the loading indicator to inactive after data retrieval.
   */
  updateData(continueAction?: (optionalData?: any) => void, uponContinueActionEndModalHttp: boolean = false): void {
    this.isActive = true; // Indicate that the table is now enabled to perform actions
    if (!this.initialConfigurationFetched) {
      this.fetchTableConfiguration();
    } else {
      this.fetchTableData(this.tableLazyLoadEventInformation);
    }
  }

  fetchTableConfiguration(): void {
    if(!this.isActive){
      return;
    }
    this.tableService.fetchTableConfiguration(this.urlColumnsSource).subscribe({
      next: (response: HttpResponse<ITableConfiguration>) => {
        this.handleTableConfigurationResponse(response.body!);
        this.fetchTableViews();
      },
      error: (err) => this.tableService.handleTableError(err, 'Columns Error')
    });
  }

  private handleTableConfigurationResponse(body: ITableConfiguration): void {
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
    this.initialConfigurationFetched = true;
  }

  refreshData(event: any){
    this.fetchTableData(this.tableLazyLoadEventInformation);
  }

  tableViewsEnabled(): boolean {
    return (
      this.tableViewSaveAs !== TableViewSaveMode.noone &&
      this.tableViewSaveKey !== ''
    );
  }
  
  fetchTableViews(): void {
    if(!this.tableViewsEnabled()){
      this.fetchTableData(this.tableLazyLoadEventInformation);
      return;
    }
    const tableViews = this.tableService.fetchTableViews(this.tableViewSaveAs, this.viewsGetSourceURL, this.tableViewSaveKey);
    if (tableViews instanceof Observable) {
      tableViews.subscribe({
        next: (response: HttpResponse<ITableView[]>) => {
           let parsedResult = response.body!.map((item: any) => ({
            viewAlias: item.viewAlias,
            viewData: JSON.parse(item.viewData),
            lastActive: item.lastActive
          }));
          this.tableViewListProcess(parsedResult);
        },
        error: (err) => this.tableService.handleTableError(err, 'Views get error')
      });
    } else {
        this.tableViewListProcess(tableViews);
    }
  }

  private tableViewListProcess(tableViews: ITableView[]){
    this.tableViewsList = [...tableViews];
    if(this.tableViewsList.length > 0){
      this.tableService.sortViews(this.tableViewsList);
    }
    this.tableViews_menuItems=[...this.tableService.updateViewsMenuItems(this.tableViewsList)];
    const viewToStartup: ITableView | undefined = this.tableViewsList.find(v => v.lastActive);
    if (viewToStartup) { // If there is a view that needs to be loaded on startup
      this.viewLoad(viewToStartup.viewAlias);
    } else {
      this.fetchTableData(this.tableLazyLoadEventInformation);
    }
  }

  viewLoad(tableViewAlias: string): void {
    const viewToLoad: ITableView | undefined = this.tableViewsList.find(v => v.viewAlias === tableViewAlias);
    if(!viewToLoad){
      this.notification.showToast("error","VIEW TO LOAD DOESN'T EXIST","The view to load doesn't exist");
      return;
    }
    let viewData: ITableViewData = viewToLoad.viewData;
    this.columnsSelected = viewData.columnsShown
        .map(data => this.columns.find((col: any) => col.field === data.field))
        .filter((col): col is IColumnMetadata => col !== undefined)
        .filter(col => !this.columnsCantBeHidden.includes(col));
    this.columnsToShow = this.tableService.orderColumnsWithFrozens(this.columnsCantBeHidden.concat(this.columnsSelected));
    this.currentPage = viewData.currentPage;
    this.currentRowsPerPage = viewData.currentRowsPerPage;
    this.globalSearchText = viewData.globalSearchText;
    this.tableLazyLoadEventInformation.multiSortMeta = [...(viewData.multiSortMeta ?? [])];
    this.dt.multiSortMeta = [...(viewData.multiSortMeta ?? [])];
    this.isActive = false;
    this.dt.sortMultiple();
    this.isActive = true;
    this.tableLazyLoadEventInformation.filters = {...viewData.filters};
    this.dt.filters = {...viewData.filters};
    this.dt.tableWidthState = viewData.tableWidth;
    this.dt.columnWidthsState = viewData.columnsWidth;
    this.tableViewCurrentSelectedAlias = tableViewAlias;
    this.notification.showToast("info","TABLE VIEW RESTORED",`The table view '${this.tableViewCurrentSelectedAlias}' has been restored.`);
    this.viewsModalShow = false;
    this.fetchTableData(this.tableLazyLoadEventInformation);
  }

  viewCreate(viewAlias: string){
    let viewData: ITableViewData = this.tableService.viewGenerateData(this.dt, this.globalSearchText, this.currentPage, this.currentRowsPerPage, this.modifyFiltersWithoutGlobalAndSelectedRows.bind(this))
    let newView: ITableView = {
      lastActive: false,
      viewAlias: viewAlias,
      viewData: viewData
    }
    this.tableViewsList.push(newView);
    this.tableService.sortViews(this.tableViewsList);
    this.tableViews_menuItems=[...this.tableService.updateViewsMenuItems(this.tableViewsList)];
    this.viewsSave(0);
  }

  viewDelete(viewAlias: string){
    const index = this.tableViewsList.findIndex(v => v.viewAlias === viewAlias);
    if (index === -1) {
      this.notification.showToast("error","Table view delete failed", `The table view could not be deleted since it was not found.`);
    }
    this.tableViewsList.splice(index, 1);
    this.tableViews_menuItems=[...this.tableService.updateViewsMenuItems(this.tableViewsList)];
    this.viewsSave(3);
  }

  viewEditAlias(event: { viewAliasOld: string; viewAliasNew: string }){
    const index = this.tableViewsList.findIndex(v => v.viewAlias === event.viewAliasOld);
    if (index === -1) {
      this.notification.showToast("error","Table view alias change failed", `The table view alias could not be changed since it was not found.`);
    }
    this.tableViewsList[index].viewAlias = event.viewAliasNew;
    this.tableService.sortViews(this.tableViewsList);
    this.tableViews_menuItems=[...this.tableService.updateViewsMenuItems(this.tableViewsList)];
    this.viewsSave(2);
  }

  viewUpdateData(viewAlias: string){
    const index = this.tableViewsList.findIndex(v => v.viewAlias === viewAlias);
    if (index === -1) {
      this.notification.showToast("error","Table view not found", `The table view to update data from was not found.`);
    }
    let viewData: ITableViewData = this.tableService.viewGenerateData(this.dt, this.globalSearchText, this.currentPage, this.currentRowsPerPage, this.modifyFiltersWithoutGlobalAndSelectedRows.bind(this))
    this.tableViewsList[index].viewData = viewData;
    this.viewsSave(1);
  }

  viewsSave(endMessage: number): void{
    let tableView: string = JSON.stringify(this.tableViewsList);
    switch(this.tableViewSaveAs){
      case TableViewSaveMode.sessionStorage:
        sessionStorage.setItem(this.tableViewSaveKey, tableView);
      break;
      case TableViewSaveMode.localStorage:
        localStorage.setItem(this.tableViewSaveKey, tableView);
      break;
      case TableViewSaveMode.databaseStorage:
        const saveObsv = this.tableService.viewsSaveToDatabase(this.tableViewsList, this.viewsSaveSourceURL, this.tableViewSaveKey);
        saveObsv.subscribe({
          next: (response: HttpResponse<any>) => {
            this.viewsSaveEnd(endMessage);
          },
          error: (err) => this.tableService.handleTableError(err, 'Views save error')
        });
      return;
      default:
        this.notification.showToast("error","NOT IMPLEMENTED", "This type os save view has not been implemented yet.");
        return;
    }
    this.viewsSaveEnd(endMessage);
  }
  viewsSaveEnd(endMessage: number){
    switch(endMessage){
      case 0: // NEW VIEW
        this.notification.showToast("info","Table view created", `New table view has been created.`);
        this.viewsModalShow = false;
        break;
      case 1: // UPDATE VIEW
        this.notification.showToast("info","Table view data updated", `The table view data was updated.`);
        break;
      case 2: // UPDATE ALIAS
        this.notification.showToast("info","Table view name updated", `The table view alias was updated.`);
        break;
      case 3: // DELETE VIEW
        this.notification.showToast("info","Table view delete", `The table view was deleted.`);
        break;
    }
  }

  fetchTableData(event: TableLazyLoadEvent): void {
    if(!this.isActive){
      return;
    }
    if (!this.initialConfigurationFetched) {
      return;
    }
    this.tableLazyLoadEventInformation = event; // Store the event information for later use
    if (event.rows != null && event.rows !== undefined) {
      this.currentRowsPerPage = event.rows;
    }
    if (event.first != null && event.first !== undefined && event.rows != null && event.rows !== undefined) {
      this.currentPage = event.first / event.rows;
    }
    let filtersWithoutGlobalAndSelectedRows = this.modifyFiltersWithoutGlobalAndSelectedRows(this.tableLazyLoadEventInformation.filters); // Create filters excluding the global filter
    filtersWithoutGlobalAndSelectedRows=this.revertDateTimeZoneFilters(filtersWithoutGlobalAndSelectedRows);
    const requestData: ITableQueryRequest = {
      page: this.currentPage, // Set the current page number
      pageSize: this.currentRowsPerPage, // Set the number of rows per page
      sort: this.tableLazyLoadEventInformation.multiSortMeta, // Set the sorting information
      filter: filtersWithoutGlobalAndSelectedRows, // Set the filters excluding the global filter
      globalFilter: this.globalSearchText, // Set the global filter text
      columns: this.columnsToShow.map(col => col.field), // Set the columns to show
      dateFormat: this.dateFormat,
      dateTimezone: this.dateTimezone,
      dateCulture: this.dateCulture
    };
    this.tableService.fetchTableData(this.urlDataSource, requestData).subscribe({
      next: (response: HttpResponse<ITablePagedResponse>) => this.handleTableDataResponse(response.body!),
      error: (err) => this.tableService.handleTableError(err, 'Columns Error')
    });
  }

  private modifyFiltersWithoutGlobalAndSelectedRows(filters: any, overrideOption: number = -1): any {
    if (this.globalSearchText === "") { // If the global search text is an empty string
      this.globalSearchText = null; // Set it to null
    }
    let filtersWithoutGlobalAndSelectedRows = { ...filters }; // Create a copy of filters to delete the global.
    if (filtersWithoutGlobalAndSelectedRows.hasOwnProperty('global')) { // If there is an entry with the global filter
      delete filtersWithoutGlobalAndSelectedRows['global']; // Remove the global filter
    }
    this.selectorRowFilterBuilder(filtersWithoutGlobalAndSelectedRows, overrideOption);
    return filtersWithoutGlobalAndSelectedRows; // Return the filters without global array
  }

  private selectorRowFilterBuilder(filtersWithoutGlobalAndSelectedRows: any, overrideOption: number = -1){
    if (filtersWithoutGlobalAndSelectedRows.hasOwnProperty('selector')) {
      const selectorFilter = filtersWithoutGlobalAndSelectedRows['selector'][0];
      let filterType: boolean | null = null;
      if(overrideOption<0 || overrideOption>2){
        filterType = selectorFilter.value;
      } else {
        switch (overrideOption){
          case 0: // All
            filterType = null;
            break;
          case 1: // Only selected rows
            filterType = true;
            break;
          case 2: // Only NOT selected
            filterType = false;
            break;
        }
      }
      if (!filtersWithoutGlobalAndSelectedRows.hasOwnProperty('rowID')) {
          filtersWithoutGlobalAndSelectedRows['rowID'] = [
              {
                  "value": null,
                  "matchMode": "in",
                  "operator": "or"
              }
          ];
      }
      const idFilter = filtersWithoutGlobalAndSelectedRows['rowID'][0];
      if (filterType === true) {
          idFilter.matchMode = "in";
          idFilter.value = this.selectedRowsCheckbox;
      } else if (filterType === false) {
          idFilter.operator = "and"
          idFilter.matchMode = "notIn";
          idFilter.value = this.selectedRowsCheckbox;
      } else if (filterType === null) {
          idFilter.value = null;
          idFilter.matchMode = "in";
      }
    }
  }

  revertDateTimeZoneFilters(inputFilter: any){
    this.columnsToShow.forEach((column) => {
      if (column.dataType === DataType.Date) { // If its date type
        if (inputFilter.hasOwnProperty(column.field)) {
          const originalDate = inputFilter[column.field][0].value;
          if(originalDate !== null && originalDate instanceof Date){
            const utcDate = new Date(Date.UTC(originalDate.getFullYear(), originalDate.getMonth(), originalDate.getDate()))
            inputFilter[column.field][0].value=utcDate;
          }
        }
      }
    });
    return inputFilter;
  }

  handleTableDataResponse(body: ITablePagedResponse): void{
    this.data = body.data; // Update the table data
    this.totalRecords = body.totalRecords; // Update the total number of records
    this.totalRecordsNotFiltered = body.totalRecordsNotFiltered; // Update the total records not filtered
    this.currentPage = body.page; // Update the current page
  }

  clearFilters(dt: Table, force: boolean = false, onlyGlobalFilter: boolean = false): void{
    let hasToClear = this.hasToClearFilters(dt, this.globalSearchText, force);
    if(hasToClear){
      if(!onlyGlobalFilter){
        this.predifinedFiltersSelectedValuesCollection = {};
        for (const key in dt.filters) {
          if (dt.filters.hasOwnProperty(key)) {
            const filters = dt.filters[key];
            if (Array.isArray(filters)) {
              filters.forEach(filter => {
                filter.value = null;  // Establecer el valor a null
              });
            } else {
              filters.value = null; // Establecer el valor a null
            }
          }
        }
        let filters = {...this.dt.filters};
        dt.columns?.forEach(
          element => {
            dt.filter(null, element.field, element.matchMode)
          }
        );
        this.dt.filters = filters;
      }
      this.globalSearchText = null;
      dt.filterGlobal('','');
    }
  }

  clearSorts(dt: Table, force: boolean = false): void{
    let hasToClear = this.hasToClearSorts(dt, force);
    if(hasToClear){
      dt.multiSortMeta = [];
      dt.sortMultiple();
    }
  }
  hasToClearSorts(dt: Table, force: boolean = false): boolean{
    let hasToClear: boolean = false;
    const hasSorts = (dt.multiSortMeta && dt.multiSortMeta.length > 0);
    if(force || hasSorts){
      hasToClear = true;
    }
    return hasToClear;
  }
  hasToClearFilters(dt: Table, globalSearchText: string|null, force:boolean = false): boolean{
    let hasToClear: boolean = false;
    const filtersWithoutGlobalAndSelectedRows = this.modifyFiltersWithoutGlobalAndSelectedRows(dt.filters)
    const hasFilters = this.hasFilters(filtersWithoutGlobalAndSelectedRows);
    const hasGlobalFilter = (globalSearchText && globalSearchText.trim() !== "");
    if(force || hasFilters || hasGlobalFilter){
      hasToClear = true;
    }
    return hasToClear;
  }

  /**
   * Determines whether there are active filters based on the provided filter rules.
   *
   * @param {any} filterRules An object representing filter rules for each column.
   *   The keys are column names, and the values are arrays of filter rules.
   *   Each filter rule has the following properties:
   *     - `field`: The field or property name of the column.
   *     - `value`: The filter value entered by the user.
   *     - Other properties depending on the type of filter (e.g., `matchMode` for string filters).
   * @returns {boolean} `true` if at least one active filter is found, otherwise `false`.
   */
  private hasFilters(filterRules: any): boolean {
    for (const columnName of Object.keys(filterRules)) { // Iterate over each column name in the filter rules
        const columnFilters = filterRules[columnName]; // Get the filter rules for the current column
        for (const filterRule of columnFilters) { // Iterate over each filter rule for the current column
            if (filterRule.value !== null && filterRule.value !== "") { // Check if the filter value is not null or an empty string
                return true; // At least one active filter found
            }
        }
    }
    return false; // No active filters found
  }

  getColumnStyle(col: any, headerCols: boolean = false): Record<string, string> {
    return this.tableService.getColumnStyle(col, headerCols);
  }

  getPredifinedFilterValues(columnKeyName: string): IPredifinedFilter[] {
    return this.predifinedFiltersCollection[columnKeyName] || []; // Return the predefined filter values or an empty array if the option name does not exist
  }

  getFrozenColumnAlignAsText(frozenColumnAlign: FrozenColumnAlign): string {
    return frozenColumnAlignAsText(frozenColumnAlign);
  }

  getDataTypeAsText(dataType: DataType): string {
    return dataTypeAsText(dataType);
  }

  /**
   * Updates the filters of a PrimeNG data table based on predefined filter changes.
   *
   * @param {string} filterName - The name of the filter to be updated.
   * @param {IPrimengPredifinedFilter[]} selectedValues - An array of selected predefined filter values.
   */
  onPredifinedFilterChange(filterName: string, selectedValues: IPredifinedFilter[]): void {
    const filters = { ...this.dt.filters }; // Create a shallow copy of the current filters to avoid mutating the original filters directly
    if (Array.isArray(filters[filterName])) { // Check if the filter for the given filterName is an array
        (filters[filterName] as FilterMetadata[]).forEach(criteria => { // If it is an array, iterate over each filter criteria
            criteria.value = selectedValues.map(value => value.value); // Update the value of each criteria with the values from selectedValues
        });
    } else if (filters[filterName]) { // Check if the filter for the given filterName exists and is not an array
        const criteria = filters[filterName] as FilterMetadata; // Cast the filter criteria to FilterMetadata
        criteria.value = selectedValues.map(value => value.value); // Update the value of the criteria with the values from selectedValues
    }
    this.dt.filters = filters; // Update the data table's filters with the modified filters object
    this.dt._filter(); // Trigger the filtering operation on the data table to apply the new filters
  }

  /**
   * Retrieves the number of values selected for a predefined filter.
   *
   * This function checks the collection of selected values for a specified column key name and returns a string
   * indicating the number of selected items along with a predefined text.
   *
   * @param {string} columnKeyName - The key name of the column for which to retrieve the number of selected values.
   * @returns {string} A string indicating the number of selected values for the specified column.
   */
  predifinedFiltersSelectedValuesText(columnKeyName: string): string {
    let numbItemsSelected = 0; // Initialize the count of selected items to zero
    if (this.predifinedFiltersSelectedValuesCollection[columnKeyName]) { // Check if there are selected values for the specified column key
        numbItemsSelected = this.predifinedFiltersSelectedValuesCollection[columnKeyName].length; // Get the number of selected items
    }
    return `${numbItemsSelected} ${this.predifinedFiltersCollectionSelectedValuesText}`; // Return the number of selected items concatenated with the predefined text
  }

  handleButtonsClick(action: (rowData: any) => void, rowData: any = null): void {
    this.tableService.handleButtonsClick(action, rowData);
  }

  /**
   * Checks if the provided column metadata matches a specific style of the predefined filters 
   * that need to be applied to an item on a row.
   *
   * @param {IprimengColumnsMetadata} colMetadata - The metadata of the column being checked.
   * @param {any} value - The value to be matched against the predefined filter values.
   * @returns {any} The matching predefined filter value if found, otherwise null.
   */
  getPredfinedFilterMatch(colMetadata: IColumnMetadata, value: any): any {
    if (colMetadata.filterPredifinedValuesName && colMetadata.filterPredifinedValuesName.length > 0) { // Check if the column uses predefined filter values
        const options = this.getPredifinedFilterValues(colMetadata.filterPredifinedValuesName); // Get the predefined filter values based on the name
        return options.find(option => option.value === value); // Return the matching option if found
    }
    return null; // Return null if the column does not use predefined filter values
  }

  copyToClipboardStart(event: MouseEvent) {
    if(this.copyCellDataToClipboardTimeSecs>0) {
      const cellContent = (event.target as HTMLElement).innerText;
      this.copyCellDataTimer = setTimeout(() => {
        navigator.clipboard.writeText(cellContent).then(() => {
          this.notification.clearToasts();
          this.notification.showToast("info", "CELL CONTENT COPIED", "The cell content has been copied to your clipboard.");
        }).catch(err => {
          this.notification.clearToasts();
          this.notification.showToast("error", "CELL CONTENT COPIED", `The cell content failed to copy to your clipboard with error: ${err}`);
        });
      }, this.copyCellDataToClipboardTimeSecs*1000 );
    }
  }

  copyToClipboardCancel(){
    if(this.copyCellDataToClipboardTimeSecs>0) {
      clearTimeout(this.copyCellDataTimer);
    }
  }

  getDataAlignHorizontalAsText(dataAlignHorizontal: DataAlignHorizontal){
    return dataAlignHorizontalAsText(dataAlignHorizontal);
  }
  getDataAlignVerticalAsText(dataAlignVertical: DataAlignVertical){
    return dataAlignVerticalAsText(dataAlignVertical);
  }

  isRowCheckboxSelected(rowID: any): boolean {
    return this.selectedRowsCheckbox.includes(rowID);
  }

  onRowChekboxChange(event: any, rowID: any): void {
    if (event.checked) { // Add the selected item
        this.selectedRowsCheckbox.push(rowID);
    } else { // Remove the selected item
        this.selectedRowsCheckbox = this.selectedRowsCheckbox.filter(selectedId => selectedId !== rowID);
    }
    this.onRowCheckboxChange.emit({
      rowID: rowID,
      selected: event.checked
    });
  }
  rowSelect(event: TableRowSelectEvent<any>): void{
    this.onRowSelect.emit({
      rowID: event.data.rowID,
      rowData: event.data
    });
  }
  rowUnselect(event: TableRowUnSelectEvent<any>): void{
    this.onRowUnselect.emit({
      rowID: event.data.rowID,
      rowData: event.data
    });
  }
  pageChange(event: TablePageEvent): void {
    this.currentPage = event.rows ? event.first / event.rows : 0;
    this.currentRowsPerPage = event.rows ? event.rows : 0;
  }

  columnSelectorShow(){
    let tempData = this.columns.map(column => {
      const isSelected = this.columnsSelected.some(selectedColumn => selectedColumn.field === column.field) || this.columnsCantBeHidden.some(selectedColumn => selectedColumn.field === column.field);
      const isSelectDisabled =  this.columnsCantBeHidden.some(selectedColumn => selectedColumn.field === column.field);
      return {
        field: column.field,
        header: column.header,
        selected: isSelected,
        selectDisabled: isSelectDisabled,
        cellOverflowBehaviour: column.cellOverflowBehaviour,
        cellOverflowBehaviourDisabled: !column.cellOverflowBehaviourAllowUserEdit,
        dataAlignHorizontal: column.dataAlignHorizontal,
        dataAlignHorizontalDisabled: !column.dataAlignHorizontalAllowUserEdit,
        dataAlignVertical: column.dataAlignVertical,
        dataAlignVerticalDisabled: !column.dataAlignVerticalAllowUserEdit
      };
    });
    tempData.slice().sort((a: any, b: any) => { // Sort selectable columns by header
      const fieldA = a.header.toUpperCase();
      const fieldB = b.header.toUpperCase();
      return fieldA.localeCompare(fieldB);
    });
    this.columnModalData = [...tempData];
    this.filteredColumnData = this.columnModalData;
    this.showColumnSelector=true;
  }

  applyColumnModalChanges(selectedColumns: IColumnMetadata[]) {
    const existingColumns = this.dt.columns!;
    const columnsToKeep = new Set<string>();

    this.columnsCantBeHidden.forEach(col => columnsToKeep.add(col.field));
    selectedColumns.forEach(col => columnsToKeep.add(col.field));

    const finalColumns: IColumnMetadata[] = [];
    existingColumns.forEach(col => {
      if (columnsToKeep.has(col.field)) {
        finalColumns.push(col);
      }
    });

    selectedColumns.forEach(col => {
      const matchingColumn = this.columns.find(c => c.field === col.field);
      if (matchingColumn && !finalColumns.find(c => c.field === matchingColumn.field)) {
        finalColumns.push(matchingColumn);
      }
    });

    let prevColsToShow = this.columnsToShow;
    this.columnsToShow = this.tableService.orderColumnsWithFrozens(finalColumns);

    let sameColumnsAsBefore =
      prevColsToShow.length === this.columnsToShow.length &&
      prevColsToShow.every((prevCol, index) => prevCol.field === this.columnsToShow[index].field);

    this.columnsSelected = this.columnsToShow.filter(
      column => !this.columnsCantBeHidden.some(nonSelectable => nonSelectable.field === column.field)
    );

    this.updateColumnsSpecialProperties(this.columnModalData);

    if (!sameColumnsAsBefore) {
      this.isActive = false;
      this.clearSorts(this.dt, true);
      setTimeout(() => {
        this.isActive = true;
        this.clearSorts(this.dt, true);
      }, 1);
    }
  }

  private updateColumnsSpecialProperties(columnsSource: any[]){
    const allColumns = [this.columns, this.columnsToShow, this.columnsSelected, this.columnsCantBeHidden];
    const columnModalDataMap = new Map(columnsSource.map((item: any) => [item.field, { 
        cellOverflowBehaviour: item.cellOverflowBehaviour, 
        dataAlignHorizontal: item.dataAlignHorizontal,
        dataAlignVertical: item.dataAlignVertical,
        width: item.width
    }]));
    const updatedFields = new Set(); // To track updated fields
    allColumns.forEach((columnList) => {
        columnList.forEach((col: any) => {
            if (columnModalDataMap.has(col.field) && !updatedFields.has(col.field)) {
                const columnData = columnModalDataMap.get(col.field);
                if (columnData) {
                    col.cellOverflowBehaviour = columnData.cellOverflowBehaviour;
                    col.dataAlignHorizontal = columnData.dataAlignHorizontal;
                    col.dataAlignVertical = columnData.dataAlignVertical;
                    col.width = columnData.width;
                    updatedFields.add(col.field);
                }
            }
        });
    });
  }

  openExcelExport(){
    this.excelReportTitle = 
      (!this.excelReportTitleDefault || this.excelReportTitleDefault.trim().length === 0) && !this.excelReportTitleAllowUserEdit 
        ? 'Report' 
        : this.excelReportTitleDefault!;
    this.showExportModal=true;
  }
  generateExcelReport(event: any){
    let filtersWithoutGlobalAndSelectedRows = this.modifyFiltersWithoutGlobalAndSelectedRows(this.tableLazyLoadEventInformation.filters, event.selectedRows); // Create filters excluding the global filter
    filtersWithoutGlobalAndSelectedRows=this.revertDateTimeZoneFilters(filtersWithoutGlobalAndSelectedRows);
    const filtersMustBeApplied: boolean = (event.selectedRows === 1 || event.selectedRows === 2) 
    ? true 
    : event.applyFilters;
    const requestData: IExcelExportRequest = {
      page: this.currentPage, // Set the current page number
      pageSize: this.currentRowsPerPage, // Set the number of rows per page
      sort: this.tableLazyLoadEventInformation.multiSortMeta, // Set the sorting information
      filter: filtersWithoutGlobalAndSelectedRows, // Set the filters excluding the global filter
      globalFilter: this.globalSearchText, // Set the global filter text
      columns: this.columnsToShow.map(col => col.field), // Set the columns to show
      dateFormat: this.dateFormat,
      dateTimezone: this.dateTimezone,
      dateCulture: this.dateCulture,
      allColumns: event.allColumns,
      applyFilters: filtersMustBeApplied,
      applySorts: event.applySorts,
      filename: event.filename
    };
    this.tableService.fetchExcelReport(this.urlExcelReport!, requestData).subscribe({
      next: (response: HttpResponse<Blob>) => {
        this.tableService.downloadFile(response.body!, event.filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.showExportModal=false;
      },
      error: (err) => this.tableService.handleTableError(err, 'Excel export error')
    });
  }
}