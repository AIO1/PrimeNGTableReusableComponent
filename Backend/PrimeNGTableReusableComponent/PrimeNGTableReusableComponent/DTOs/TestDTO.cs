using PrimeNG.Attributes;

namespace PrimeNGTableReusableComponent.DTOs {
    public class TestDto {
        [PrimeNGAttribute(sendColumnAttributes: false)]
        public Guid id { get; set; }

        [PrimeNGAttribute(sendColumnAttributes: false)]
        public bool canBeDeleted { get; set; }

        [PrimeNGAttribute("Username", dataAlign: EnumDataAlign.Left, canBeHidden: false, columnDescription: "A random username")]
        public string username { get; set; } = null!;

        [PrimeNGAttribute("Age", dataType: EnumDataType.Numeric, columnDescription: "The age of the user")]
        public byte? age { get; set; }

        [PrimeNGAttribute("Employment status", filterPredifinedValuesName: "employmentStatusPredifinedFilter", columnDescription: "A predifined filter that shows the employment status of the user")]
        public string? employmentStatusName { get; set; }

        [PrimeNGAttribute("Birthdate", dataType: EnumDataType.Date, dataAlign: EnumDataAlign.Left, startHidden: true, columnDescription: "When was the user born")]
        public DateTime? birthdate { get; set; }

        [PrimeNGAttribute("Payed taxes?", dataType: EnumDataType.Boolean, startHidden: true, columnDescription: "If the user has payed his taxes or not. You've got to pay your taxes :)")]
        public bool payedTaxes { get; set; }
    }
    public class EmploymentStatusDto {
        public string StatusName { get; set; } = null!;
        public byte ColorR { get; set; }
        public byte ColorG { get; set; }
        public byte ColorB { get; set; }
    }
}
