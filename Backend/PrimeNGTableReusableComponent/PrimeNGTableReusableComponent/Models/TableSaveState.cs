using System;
using System.Collections.Generic;

namespace Models.PrimengTableReusableComponent;

public partial class TableSaveState
{
    public Guid Id { get; set; }

    public DateTime DateCreated { get; set; }

    public DateTime DateUpdated { get; set; }

    public string Username { get; set; } = null!;

    public string TableKey { get; set; } = null!;

    public string StateName { get; set; } = null!;

    public string StateData { get; set; } = null!;
}
