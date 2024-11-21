using PrimeNG.Attributes;

namespace PrimeNG.DTOs {
    /// <summary>
    /// Represents the structure of a POST request sent to a PrimeNG table.
    /// </summary>
    public class PrimeNGPostRequest {
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
        public List<PrimeNGTableSortModel>? Sort { get; set; }

        /// <summary>
        /// Gets or sets a dictionary containing filter configurations for each column.
        /// </summary>
        public Dictionary<string, List<PrimeNGTableFilterModel>> Filter { get; set; } = null!;

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

    public class PrimeNGPostRequestWithExport: PrimeNGPostRequest {
        public bool AllColumns { get; set; }
        public bool ApplyFilters { get; set; }
        public bool ApplySorts { get; set; }
        public string Filename { get; set; } = null!;
    }

    /// <summary>
    /// Represents the structure of the response returned by a PrimeNG table POST request.
    /// </summary>
    public class PrimeNGPostReturn {
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

    /// <summary>
    /// Represents metadata about columns and allowed pagination options for a PrimeNG table + the way to represent dates.
    /// </summary>
    public class PrimeNGTableColsAndAllowedPagination {
        /// <summary>
        /// A list of columns metadata for the PrimeNG table.
        /// </summary>
        public List<PrimeNGTableReturnColumnMetadata> ColumnsInfo { get; set; } = null!;

        /// <summary>
        /// An array of allowed items per page.
        /// </summary>
        public int[] AllowedItemsPerPage { get; set; } = null!;

        /// <summary>
        /// The format to be used in dates representation.
        /// </summary>
        public string DateFormat { get; set; } = null!;

        /// <summary>
        /// The timezone to be used in dates representation.
        /// </summary>
        public string DateTimezone { get; set; } = null!;

        /// <summary>
        /// The culture to be used in dates representation.
        /// </summary>
        public string DateCulture { get; set; } = null!;
    }

    /// <summary>
    /// Represents the base sorting configuration for a PrimeNG table.
    /// </summary>
    public class PrimeNGTableSortModel {
        /// <summary>
        /// The field associated with the column.
        /// </summary>
        public string Field { get; set; } = null!;

        /// <summary>
        /// The order of the sorting (ascending or descending).
        /// </summary>
        public int Order { get; set; }
    }

    /// <summary>
    /// Represents the base filter configuration for a PrimeNG table column.
    /// </summary>
    public class PrimeNGTableFilterModel {
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

    /// <summary>
    /// Represents metadata for a column returned by a PrimeNG table.
    /// </summary>
    public class PrimeNGTableReturnColumnMetadata {
        /// <summary>
        /// Gets or sets the field associated with the column.
        /// </summary>
        public string Field { get; set; } = null!;

        /// <summary>
        /// Gets or sets the header that will be displayed for the column in the table.
        /// </summary>
        public string Header { get; set; } = null!;

        /// <summary>
        /// Gets or sets the data type of the column.
        /// </summary>
        public EnumDataType DataType { get; set; }

        /// <summary>
        /// Gets or sets the alignment of the data in the column ("left", "center", or "right").
        /// </summary>
        public EnumDataAlignHorizontal DataAlignHorizontal { get; set; }

        public bool DataAlignHorizontalAllowUserEdit { get; set; }

        public EnumDataAlignVertical DataAlignVertical { get; set; }

        public bool DataAlignVerticalAllowUserEdit { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the column can be hidden.
        /// </summary>
        public bool CanBeHidden { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the column starts hidden (if it can be hidden).
        /// </summary>
        public bool StartHidden { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the column can be resized.
        /// </summary>
        public bool CanBeResized { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the column can be reordered.
        /// </summary>
        public bool CanBeReordered { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the column can be sorted.
        /// </summary>
        public bool CanBeSorted { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the column can be filtered.
        /// </summary>
        public bool CanBeFiltered { get; set; }

        public string FilterPredifinedValuesName { get; set; } = null!;

        /// <summary>
        /// Gets or sets a value indicating whether the column can be globally filtered.
        /// </summary>
        public bool CanBeGlobalFiltered { get; set; }

        public string ColumnDescription { get; set; } = null!;

        public bool DataTooltipShow { get; set; }

        public string DataTooltipCustomColumnSource { get; set; } = null!;

        public EnumFrozenColumnAlign FrozenColumnAlign { get; set; }

        public EnumCellOverflowBehaviour CellOverflowBehaviour { get; set; }

        public bool CellOverflowBehaviourAllowUserEdit { get; set; }

        public double InitialWidth { get; set; }
    }

    public class PrimeNgGetViewsRequest {
        public string TableViewSaveKey { get; set; } = null!;
    }

    public class PrimeNgSaveViewsRequest {
        public string TableViewSaveKey { get; set; } = null!;
        public PrimeNgViewData[] Views { get; set; } = null!;
    }

    public class PrimeNgViewData {
        public string ViewAlias { get; set; } = null!;
        public string ViewData { get; set; } = null!;
    }
}
