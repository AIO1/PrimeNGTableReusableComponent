using ECS.PrimengTable.Enums;
namespace ECS.PrimengTable.Models {
    /// <summary>
    /// Represents the metadata of a column
    /// </summary>
    public class ColumnMetadataModel {
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
        public DataType DataType { get; set; }

        /// <summary>
        /// Gets or sets the alignment of the data in the column ("left", "center", or "right").
        /// </summary>
        public DataAlignHorizontal DataAlignHorizontal { get; set; }

        public bool DataAlignHorizontalAllowUserEdit { get; set; }

        public DataAlignVertical DataAlignVertical { get; set; }

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

        public FrozenColumnAlign FrozenColumnAlign { get; set; }

        public CellOverflowBehaviour CellOverflowBehaviour { get; set; }

        public bool CellOverflowBehaviourAllowUserEdit { get; set; }

        public double InitialWidth { get; set; }
    }
}