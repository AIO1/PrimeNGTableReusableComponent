namespace ECS.PrimengTable.Models {
    public class ViewSaveRequestModel: ViewLoadRequestModel {
        public List<ViewDataModel> Views { get; set; } = null!;
    }
}