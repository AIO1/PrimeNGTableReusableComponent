namespace EcsPrimengTable.DTOs {
    public class EmploymentStatusDto {
        public Guid ID { get; set; }
        public string StatusName { get; set; } = null!;
        public byte ColorR { get; set; }
        public byte ColorG { get; set; }
        public byte ColorB { get; set; }
    }
}