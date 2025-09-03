namespace ECS.PrimengTable.Interfaces {
    public interface ITableViewEntity {
        Guid Id { get; set; }
        DateTime DateCreated { get; set; }
        DateTime DateUpdated { get; set; }
        string Username { get; set; }
        string TableKey { get; set; }
        string ViewAlias { get; set; }
        string ViewData { get; set; }
        public bool LastActive { get; set; }
    }
}