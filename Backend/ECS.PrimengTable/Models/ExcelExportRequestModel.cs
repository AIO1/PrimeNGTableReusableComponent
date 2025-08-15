namespace ECS.PrimengTable.Models {
    public class ExcelExportRequestModel: TableQueryRequestModel {
        public bool AllColumns { get; set; }
        public bool ApplyFilters { get; set; }
        public bool ApplySorts { get; set; }
        public string Filename { get; set; } = null!;
    }
}