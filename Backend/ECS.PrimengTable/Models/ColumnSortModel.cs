namespace ECS.PrimengTable.Models {
    /// <summary>
    /// Represents the base sorting configuration for a column table.
    /// </summary>
    public class ColumnSortModel {
        /// <summary>
        /// The field associated with the column.
        /// </summary>
        public string Field { get; set; } = null!;

        /// <summary>
        /// The order of the sorting (ascending or descending).
        /// </summary>
        public int Order { get; set; }
    }
}