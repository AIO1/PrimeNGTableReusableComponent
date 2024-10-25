using Microsoft.EntityFrameworkCore;

namespace Data.PrimengTableReusableComponent {
    public partial class primengTableReusableComponentContext {
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder) {
            modelBuilder.HasDbFunction(() => MyDBFunctions.FormatDateWithCulture(default, default!, default!, default!))
                        .HasName("FormatDateWithCulture")
                        .HasSchema("dbo");
        }
    }
    public static class MyDBFunctions {
        [DbFunction("FormatDateWithCulture", "dbo")]
        public static string FormatDateWithCulture(DateTime inputDate, string format, string timezone, string culture) {
            throw new NotImplementedException("This method is a placeholder for calling a database function.");
        }
    }
}
