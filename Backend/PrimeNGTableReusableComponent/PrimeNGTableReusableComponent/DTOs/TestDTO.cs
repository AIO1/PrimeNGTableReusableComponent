using PrimeNG.Attributes;

namespace PrimeNGTableReusableComponent.DTOs {
    public class TestDTO {
        [PrimeNGAttribute(sendColumn: false)]
        public Guid id { get; set; }

        [PrimeNGAttribute("Username", dataAlign: "left", canBeHidden: false)]
        public string username { get; set; } = null!;

        [PrimeNGAttribute("Age", dataType: "numeric")]
        public byte? age { get; set; }

        [PrimeNGAttribute("Birthdate", dataType: "date", dataAlign: "left")]
        public DateTime? birthdate { get; set; }

        [PrimeNGAttribute("Payed taxes?", dataType: "boolean")]
        public bool payedTaxes { get; set; }

        [PrimeNGAttribute("Created date", dataType: "date", dataAlign: "left", startHidden: true)]
        public DateTime dateCreated { get; set; }

        [PrimeNGAttribute("Created date", dataType: "date", dataAlign: "left", startHidden: true)]
        public DateTime dateUpdated { get; set; }
    }
}
