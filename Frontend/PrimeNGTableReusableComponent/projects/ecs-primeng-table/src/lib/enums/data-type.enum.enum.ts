/**
 * Enum representing the different types of data a table column can hold.
 * 
 * @remarks
 * This is used to determine how values should be rendered, formatted, and 
 * filtered in the table component.
 */
export enum DataType {
    /** Plain text string values. */
    Text,

    /** Numeric values, e.g., integers or decimals. */
    Numeric,

    /** Boolean values (true/false). */
    Boolean,

    /** Date or datetime values. */
    Date,

    /** List of values, stored as a string separated by a delimiter (";"). */
    List
}