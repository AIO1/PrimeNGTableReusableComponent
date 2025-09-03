using System;
using System.Collections.Generic;

namespace Models.PrimengTableReusableComponent;

public partial class TableView
{
    public Guid Id { get; set; }

    public DateTime DateCreated { get; set; }

    public DateTime DateUpdated { get; set; }

    public string Username { get; set; } = null!;

    public string TableKey { get; set; } = null!;

    public string ViewAlias { get; set; } = null!;

    public string ViewData { get; set; } = null!;

    public bool LastActive { get; set; }
}
