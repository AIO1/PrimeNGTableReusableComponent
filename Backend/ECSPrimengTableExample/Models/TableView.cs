using System;
using System.Collections.Generic;

namespace Models.PrimengTableReusableComponent;

/// <summary>
/// Contains the table vies associated to different users.
/// </summary>
public partial class TableView
{
    public Guid Id { get; set; }

    public DateTime DateCreated { get; set; }

    public DateTime DateUpdated { get; set; }

    /// <summary>
    /// The username.
    /// </summary>
    public string Username { get; set; } = null!;

    /// <summary>
    /// The table key.
    /// </summary>
    public string TableKey { get; set; } = null!;

    /// <summary>
    /// The alias of the view.
    /// </summary>
    public string ViewAlias { get; set; } = null!;

    /// <summary>
    /// The data stored about the view.
    /// </summary>
    public string ViewData { get; set; } = null!;

    /// <summary>
    /// If true, the view will be loaded on table startup.
    /// </summary>
    public bool LastActive { get; set; }
}
