using PrimeNG.Attributes;

namespace PrimeNGTableReusableComponent.DTOs {
    public class TestDto {
        [PrimeNGAttribute(sendColumn: false)]
        public Guid id { get; set; }

        [PrimeNGAttribute("Username", dataAlign: "left", canBeHidden: false)]
        public string username { get; set; } = null!;

        [PrimeNGAttribute("Age", dataType: "numeric")]
        public byte? age { get; set; }

        [PrimeNGAttribute("Employment status", filterUsesPredifinedValues: true, filterPredifinedValuesName: "employmentStatusPredifinedFilter")]
        public string? employmentStatusName { get; set; }

        [PrimeNGAttribute("Birthdate", dataType: "date", dataAlign: "left", startHidden: true)]
        public DateTime? birthdate { get; set; }

        [PrimeNGAttribute("Payed taxes?", dataType: "boolean", startHidden: true)]
        public bool payedTaxes { get; set; }
    }
    public class EmploymentStatusDto {
        public string StatusName { get; set; } = null!;
        public byte ColorR { get; set; }
        public byte ColorG { get; set; }
        public byte ColorB { get; set; }
    }
}
