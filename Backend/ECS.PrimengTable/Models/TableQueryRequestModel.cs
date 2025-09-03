namespace ECS.PrimengTable.Models {
    /// <summary>
    /// Represents the structure of a POST request sent to a PrimeNG table.
    /// </summary>
    public class TableQueryRequestModel {
        /// <summary>
        /// Gets or sets the current page number.
        /// </summary>
        public required int Page { get; set; }

        /// <summary>
        /// Gets or sets the number of items to display per page.
        /// </summary>
        public required byte PageSize { get; set; }

        /// <summary>
        /// Gets or sets a list of sorting configurations for the table.
        /// </summary>
        public List<ColumnSortModel>? Sort { get; set; }

        /// <summary>
        /// Gets or sets a dictionary containing filter configurations for each column.
        /// </summary>
        public Dictionary<string, List<ColumnFilterModel>> Filter { get; set; } = null!;

        /// <summary>
        /// Gets or sets a global filter string applied to all columns.
        /// </summary>
        public string? GlobalFilter { get; set; }

        /// <summary>
        /// Gets or sets a list of column to be included in the response.
        /// </summary>
        public List<string>? Columns { get; set; }

        public string DateFormat { get; set; } = null!;

        public string DateTimezone { get; set; } = null!;

        public string DateCulture { get; set; } = null!;
    }
}