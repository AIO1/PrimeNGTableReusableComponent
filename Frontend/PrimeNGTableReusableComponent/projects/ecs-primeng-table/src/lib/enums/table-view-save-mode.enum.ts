/**
 * Enum representing the mode used to save the state or configuration of a table view.
 * 
 * @remarks
 * Determines where and how the table's view settings (e.g., column order, filters, 
 * sorting) are persisted.
 */
export enum TableViewSaveMode {
    /** Do not save the table view state. */
    None,

    /** Save the table view state in the browser's sessionStorage (cleared on tab close). */
    SessionStorage,

    /** Save the table view state in the browser's localStorage (persists across sessions). */
    LocalStorage,

    /** Save the table view state in a backend database (requires server support). */
    DatabaseStorage
}