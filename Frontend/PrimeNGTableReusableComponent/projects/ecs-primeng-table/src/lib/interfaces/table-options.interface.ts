import { TableViewSaveMode } from "../enums";
import { IColumnMetadata, IPredifinedFilter, ITableButton } from "../interfaces";

/** Configuration options for ECS Primeng table */
export interface ITableOptions {

    /**
     * Controls whether the table is active.
     * 
     * - When `true`, the table will fetch configuration, columns, and data on init.
     * - When `false`, the table will **not** automatically fetch or update data, even after initialization.
     *   Use this if you want to apply filters, column changes, or other manipulations 
     *   without triggering automatic updates.
     * 
     * @default true
     */
    isActive: boolean;

    /**
     * Endpoint URL to fetch the table configuration.
     * 
     * The configuration is fetched **once** when the table is initialized and is expected to return
     * an `ITableConfiguration` object from the API. This includes data such as column definitions, 
     * the timezone to use, and other settings.
     * 
     * If set to `null` or if `isActive` is `false`, the table will **not** fetch configuration automatically.
     * 
     * @default null
     */
    urlTableConfiguration: string | null;

    /**
     * Endpoint URL to fetch the table data.
     * 
     * This endpoint is called **whenever the user filters, changes pages, or sorts** the table.
     * It is expected to return an `ITablePagedResponse` object containing the paginated data.
     * 
     * If set to `null` or if `isActive` is `false`, the table will **not** fetch or update data automatically.
     * 
     * @default null
     */
    urlTableData: string | null;

    /**
     * The array of data to be displayed in the table.
     * 
     * Each item should represent a row and match the table's column structure.
     * 
     * @default []
     */
    data: any[];

    header: {
        buttons: ITableButton[];
        clearSortsEnabled: boolean;
        clearFiltersEnabled: boolean;
    };

    /**
     * Configurations related to the columns of the table.
     */
    columns: {
        /**
         * Enables or disables the column selector feature.
         * 
         * When `true`, a button is displayed in the top-left corner of the table.
         * Clicking this button opens a modal that allows users to:
         * - Show or hide columns.
         * - Adjust the cell overflow behavior for each column.
         * - Change the horizontal and vertical alignment of cells per column.
         * 
         * When `false`, the button to open the column's selector modal will not be available.
         * 
         * @default true
         */
        selectorEnabled: boolean;

        /**
         * The combination of non-selectable columns and user-selected columns 
         * that must be displayed in the table.
         * 
         * @default []
         */
        shown: IColumnMetadata[];
    };

    /**
     * Configurations related to the rows of the table.
     */
    rows: {
        action: {
            buttons: ITableButton[];
            header: string;
            alignmentRight: boolean;
            width: number;
            frozen: boolean;
            resizable: boolean;
        };
        checkboxSelector: {
            enabled: boolean;
            header: string;
            alignmentRight: boolean;
            width: number;
            frozen: boolean;
            resizable: boolean;
        };
        singleSelector: {
            enabled: boolean;
            metakey: boolean;
        };
    };

    /** Configurations related to the vertical scroll of the table. */
    verticalScroll: {
        /**
         * Automatically adjust the table's height to fit its container.
         * 
         * When set to `true`, the table will calculate the maximum height dynamically 
         * so that it exactly fits its container. This takes precedence over the `height` property.
         * 
         * @default true
         */
        fitToContainer: boolean;

        /**
         * Fixed vertical height for the table when `fitToContainer` is `false`.
         * 
         * - If `fitToContainer` from `verticalScroll` is `true`, this property is ignored.  
         * - If set to a value `<= 0`, this is ignored and there will be only verticall scroll enabled if `fitToContainer` from `verticalScroll` is `true`.
         * 
         * Use this property to enable vertical scrolling with a fixed height when you do not want 
         * the table to dynamically fit its container.
         * 
         * @default 0
         */
        height: number;
    };

    /** Configurations related to the global search functionality of the table. */
    globalSearch: {
        /**
         * Enables or disables the global search input.
         * 
         * When set to `true`, users can search across all table columns using the global search bar.
         * When `false`, the global search input will not be rendered.
         * 
         * @default true
         */
        enabled: boolean;

        /**
         * Maximum number of characters allowed in the global search input.
         * 
         * Use this to limit the length of search queries and prevent excessively long input.
         * 
         * @default 20
         */
        maxLength: number;
    };

    predefinedFilters: { [key: string]: IPredifinedFilter[] }

    /**
     * Configurations related to saved table views.
     */
    views: {
        /**
         * Determines how the table views are saved.
         * 
         * - `TableViewSaveMode.noone`: Do not save any views.
         * - `TableViewSaveMode.sessionStorage`: Save views in the browser session storage (cleared when the tab/window closes).
         * - `TableViewSaveMode.localStorage`: Save views in the browser local storage (persistent across sessions).
         * - `TableViewSaveMode.databaseStorage`: Save views directly in the database via the backend API. If you are using this method you will need to specify also the `urlGet`and `urlSave`
         * 
         * This allows users to keep their custom column orders, filters, sorting, and other table settings
         * according to the selected storage option.
         * 
         * @default TableViewSaveMode.noone
         */
        saveMode: TableViewSaveMode;
        
        /**
         * Key used to identify the table when saving and retrieving its views.
         * 
         * Each table should have a unique `saveKey` so that its saved views (filters, column order, sorting, etc.)
         * do not conflict with other tables.
         * 
         * If set to `null`, the table will not save or load any views.
         * 
         * @default null
         */
        saveKey: string | null;

        /**
         * Endpoint URL to fetch saved views from the database.
         * 
         * Only used if `saveMode` is `TableViewSaveMode.databaseStorage`.
         * The `saveKey` is sent to identify the correct table views.
         * 
         * @default null
         */
        urlGet: string | null;

        /**
         * Endpoint URL to save table views to the database.
         * 
         * Only used if `saveMode` is `TableViewSaveMode.databaseStorage`.
         * The `saveKey` is sent to identify the correct table views.
         * 
         * @default null
         */
        urlSave: string | null;

        /**
         * Maximum number of views allowed for the table.
         * 
         * Attempts to save more views are blocked to the user.
         * 
         * @default 10
         */
        maxViews: number;
    };

    /**
     * Configurations for exporting the table data to Excel.
     */
    excelReport: {
         /**
         * Endpoint URL of the API to perform the Excel export.
         * 
         * When set, the table will send a request to this endpoint including the properties
         * specified by the user, such as selected columns, filters, and sort order, to generate
         * the export.
         * 
         * If set to `null`, Excel export functionality will be disabled.
         * 
         * @default null
         */
        url: string | null;

        /**
         * Default title shown in the Excel export modal when preparing the export.
         * 
         * If the string is empty (after trimming) **and** `titleAllowUserEdit` is `false`, 
         * the export button will be disabled.
         * 
         * @default "Report"
         */
        defaultTitle: string;

        /**
         * Determines whether the user can edit the title of the Excel file in the export modal.
         * 
         * - If `true`, the user can modify the title before exporting.
         * - If `false`, the title is fixed to `defaultTitle`.
         * 
         * @default true
         */
        titleAllowUserEdit: boolean;
    }

    copyToClipboardTime: number;
}
/*
  copyCellDataToClipboardTimeSecs: number = 0.5; // The amount of time since mouse down in a cell for its content to be copied to the clipboard. If you want to disable this functionality, put it to a value less than or equal to 0.
*/

export const DEFAULT_TABLE_OPTIONS: ITableOptions = {
    isActive: true,
    data: [],
    urlTableConfiguration: null,
    urlTableData: null,
    header: {
        buttons: [],
        clearSortsEnabled: true,
        clearFiltersEnabled: true
    },
    columns: {
        selectorEnabled: true,
        shown: []
    },
    rows: {
        action: {
            buttons: [],
            header: "Actions",
            alignmentRight: true,
            width: 150,
            frozen: true,
            resizable: false
        },
        checkboxSelector: {
            enabled: false,
            header: "Selected",
            alignmentRight: false,
            width: 150,
            frozen: true,
            resizable: false
        },
        singleSelector: {
            enabled: false,
            metakey: true
        }
    },
    verticalScroll: {
        fitToContainer: true,
        height: 0
    },
    globalSearch: {
        enabled: true,
        maxLength: 20
    },
    predefinedFilters: {},
    views: {
        saveMode: TableViewSaveMode.noone,
        saveKey: null,
        urlGet: null,
        urlSave: null,
        maxViews: 10
    },
    excelReport: {
        url: null,
        defaultTitle: "Report",
        titleAllowUserEdit: true
    },
    copyToClipboardTime: 0.5
};