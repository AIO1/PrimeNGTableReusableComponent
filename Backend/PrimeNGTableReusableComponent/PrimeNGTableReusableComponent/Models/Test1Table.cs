using System;
using System.Collections.Generic;

namespace Models.PrimengTableReusableComponent;

/// <summary>
/// The table used for the 1st test.
/// </summary>
public partial class Test1Table
{
    /// <summary>
    /// The PK of the table.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// The username.
    /// </summary>
    public string Username { get; set; } = null!;

    /// <summary>
    /// The age of the user.
    /// </summary>
    public byte? Age { get; set; }

    /// <summary>
    /// The date the record was created.
    /// </summary>
    public DateTime DateCreated { get; set; }

    /// <summary>
    /// The date the record was last updated.
    /// </summary>
    public DateTime DateUpdated { get; set; }

    /// <summary>
    /// The birthdate of the user.
    /// </summary>
    public DateTime? Birthdate { get; set; }

    /// <summary>
    /// Indicates if the user payed its taxes or not.
    /// </summary>
    public bool PayedTaxes { get; set; }
}
