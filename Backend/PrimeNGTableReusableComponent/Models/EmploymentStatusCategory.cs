using System;
using System.Collections.Generic;

namespace Models.PrimengTableReusableComponent;

/// <summary>
/// Contains a list of employment categories.
/// </summary>
public partial class EmploymentStatusCategory
{
    /// <summary>
    /// The PK of the table.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// The date the record was created.
    /// </summary>
    public DateTime DateCreated { get; set; }

    /// <summary>
    /// The date the record was last updated.
    /// </summary>
    public DateTime DateUpdated { get; set; }

    /// <summary>
    /// The name of the employment status.
    /// </summary>
    public string StatusName { get; set; } = null!;

    /// <summary>
    /// The red component of the color used to draw the tag.
    /// </summary>
    public byte ColorR { get; set; }

    /// <summary>
    /// The green component of the color used to draw the tag.
    /// </summary>
    public byte ColorG { get; set; }

    /// <summary>
    /// The blue component of the color used to draw the tag.
    /// </summary>
    public byte ColorB { get; set; }

    public virtual ICollection<TestTable> TestTables { get; set; } = new List<TestTable>();
}
