/**
 * Enum representing how content that overflows a table cell should be handled.
 * 
 * @remarks
 * Determines the visual behavior of cell content when it exceeds the cell's width.
 */
export enum CellOverflowBehaviour {
    /** Content that exceeds the cell's width is clipped and not visible. */
    Hidden,

    /** Content wraps onto multiple lines to fit within the cell. */
    Wrap,

    /** Content is truncated and an ellipsis (...) is shown at the end. */
    Ellipsis
}