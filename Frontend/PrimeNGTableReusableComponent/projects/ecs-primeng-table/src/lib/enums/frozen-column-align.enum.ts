/**
 * Enum representing the alignment of frozen columns in a table.
 * 
 * @remarks
 * Used to determine if a column should be frozen, and if so, on which side
 * of the table it should appear.
 */
export enum FrozenColumnAlign {
    /** The column is not frozen. */
    Noone,

    /** The column is frozen on the left side of the table. */
    Left,

    /** The column is frozen on the right side of the table. */
    Right
}