﻿using PrimeNG.Attributes;

namespace PrimeNGTableReusableComponent.DTOs {
    public class TestDto {
        [PrimeNGAttribute(sendColumnAttributes: false)]
        public Guid RowID { get; set; }

        [PrimeNGAttribute(sendColumnAttributes: false)]
        public bool CanBeDeleted { get; set; }

        [PrimeNGAttribute("Username", dataAlignHorizontal: EnumDataAlignHorizontal.Left, canBeHidden: false, columnDescription: "A random username", frozenColumnAlign: EnumFrozenColumnAlign.Left, initialWidth: 400)]
        public string Username { get; set; } = null!;

        [PrimeNGAttribute("Age", dataType: EnumDataType.Numeric, columnDescription: "The age of the user")]
        public byte? Age { get; set; }

        [PrimeNGAttribute("Employment status", filterPredifinedValuesName: "employmentStatusPredifinedFilter", columnDescription: "A predifined filter that shows the employment status of the user")]
        public string? EmploymentStatusName { get; set; }

        [PrimeNGAttribute("Birthdate", dataType: EnumDataType.Date, dataAlignHorizontal: EnumDataAlignHorizontal.Left, startHidden: true, columnDescription: "When was the user born")]
        public DateTime? Birthdate { get; set; }

        [PrimeNGAttribute("Payed taxes?", dataType: EnumDataType.Boolean, startHidden: true, columnDescription: "If the user has payed his taxes or not. You've got to pay your taxes :)")]
        public bool PayedTaxes { get; set; }
    }
    public class EmploymentStatusDto {
        public Guid ID { get; set; }
        public string StatusName { get; set; } = null!;
        public byte ColorR { get; set; }
        public byte ColorG { get; set; }
        public byte ColorB { get; set; }
    }
}
