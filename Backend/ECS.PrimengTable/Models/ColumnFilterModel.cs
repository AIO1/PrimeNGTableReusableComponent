/// <summary>
/// Represents the base filter configuration for a table column.
/// </summary>
namespace ECS.PrimengTable.Models {
    public class ColumnFilterModel {
        /// <summary>
        /// Gets or sets the value of the filter.
        /// </summary>
        public dynamic? Value { get; set; }

        /// <summary>
        /// Gets or sets the match mode for the filter.
        /// </summary>
        public string MatchMode { get; set; } = null!;

        /// <summary>
        /// Gets or sets the operator for the filter.
        /// </summary>
        public string Operator { get; set; } = null!;
    }
}