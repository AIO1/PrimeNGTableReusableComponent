namespace ECS.PrimengTable.Models {
    /// <summary>
    /// Represents the structure of the response returned by a PrimeNG table POST request.
    /// </summary>
    public class TablePagedResponseModel {
        /// <summary>
        /// Gets or sets the current page number.
        /// </summary>
        public int Page { get; set; }

        /// <summary>
        /// Gets or sets the total number of records available from filter.
        /// </summary>
        public long TotalRecords { get; set; }

        /// <summary>
        /// Gets or sets the total number of records available (without filters).
        /// </summary>
        public long TotalRecordsNotFiltered { get; set; }

        /// <summary>
        /// Gets or sets dynamic data representing the response content.
        /// </summary>
        public dynamic Data { get; set; } = null!;
    }
}