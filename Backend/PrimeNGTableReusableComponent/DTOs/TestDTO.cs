using ECS.PrimengTable.Attributes;
using ECS.PrimengTable.Enums;

namespace EcsPrimengTable.DTOs {
    public class TestDto {
        [ColumnAttributes(sendColumnAttributes: false)]
        public Guid RowID { get; set; }

        [ColumnAttributes(sendColumnAttributes: false)]
        public bool CanBeDeleted { get; set; }

        [ColumnAttributes("Username", dataAlignHorizontal: DataAlignHorizontal.Left, canBeHidden: false, columnDescription: "A random username", frozenColumnAlign: FrozenColumnAlign.Left, initialWidth: 400)]
        public string Username { get; set; } = null!;

        [ColumnAttributes("Age", dataType: DataType.Numeric, columnDescription: "The age of the user")]
        public byte? Age { get; set; }

        [ColumnAttributes("Employment status", filterPredifinedValuesName: "employmentStatusPredifinedFilter", columnDescription: "A predifined filter that shows the employment status of the user")]
        public string? EmploymentStatusName { get; set; }

        [ColumnAttributes("Employment status list", dataType: DataType.List, dataAlignHorizontal: DataAlignHorizontal.Left, filterPredifinedValuesName: "employmentStatusPredifinedFilter", columnDescription: "A list of employment statuses separated by ; in the database")]
        public string? EmploymentStatusNameList { get; set; }

        [ColumnAttributes("Birthdate", dataType: DataType.Date, dataAlignHorizontal: DataAlignHorizontal.Left, startHidden: true, columnDescription: "When was the user born")]
        public DateTime? Birthdate { get; set; }

        [ColumnAttributes("Payed taxes?", dataType: DataType.Boolean, startHidden: true, columnDescription: "If the user has payed his taxes or not. You've got to pay your taxes :)")]
        public bool PayedTaxes { get; set; }
    }
}