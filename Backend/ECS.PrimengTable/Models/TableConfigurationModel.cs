namespace ECS.PrimengTable.Models {
    public class TableConfigurationModel {
        /// <summary>
        /// A list of columns metadata for the PrimeNG table.
        /// </summary>
        public List<ColumnMetadataModel> ColumnsInfo { get; set; } = null!;

        /// <summary>
        /// An array of allowed items per page.
        /// </summary>
        public int[] AllowedItemsPerPage { get; set; } = null!;

        public string DateFormat { get; set; } = null!;

        public string DateTimezone { get; set; } = null!;

        public string DateCulture { get; set; } = null!;
    }
}