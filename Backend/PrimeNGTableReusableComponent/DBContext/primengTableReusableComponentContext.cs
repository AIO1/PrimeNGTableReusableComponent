using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Models.PrimengTableReusableComponent;

namespace Data.PrimengTableReusableComponent;

public partial class primengTableReusableComponentContext : DbContext
{
    public primengTableReusableComponentContext(DbContextOptions<primengTableReusableComponentContext> options)
        : base(options)
    {
    }

    public virtual DbSet<EmploymentStatusCategory> EmploymentStatusCategories { get; set; }

    public virtual DbSet<TableView> TableViews { get; set; }

    public virtual DbSet<TestTable> TestTables { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("SQL_Latin1_General_CP1_CI_AS");

        modelBuilder.Entity<EmploymentStatusCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("EmploymentStatusCategories_PK");

            entity.ToTable(tb =>
                {
                    tb.HasComment("Contains a list of employment categories.");
                    tb.HasTrigger("EmploymentStatusCategories_tg_dateUpdated");
                });

            entity.HasIndex(e => e.StatusName, "EmploymentStatusCategories_statusName_UNIQUE").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasComment("The PK of the table.")
                .HasColumnName("ID");
            entity.Property(e => e.ColorB)
                .HasComment("The blue component of the color used to draw the tag.")
                .HasColumnName("colorB");
            entity.Property(e => e.ColorG)
                .HasComment("The green component of the color used to draw the tag.")
                .HasColumnName("colorG");
            entity.Property(e => e.ColorR)
                .HasComment("The red component of the color used to draw the tag.")
                .HasColumnName("colorR");
            entity.Property(e => e.DateCreated)
                .HasPrecision(0)
                .HasDefaultValueSql("(getutcdate())")
                .HasComment("The date the record was created.")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasPrecision(0)
                .HasDefaultValueSql("(getutcdate())")
                .HasComment("The date the record was last updated.")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.StatusName)
                .HasMaxLength(255)
                .HasComment("The name of the employment status.")
                .HasColumnName("statusName");
        });

        modelBuilder.Entity<TableView>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("TableSaveStates_PK");

            entity.ToTable(tb =>
                {
                    tb.HasComment("Contains the table vies associated to different users.");
                    tb.HasTrigger("TableViews_tg_dateUpdated");
                });

            entity.HasIndex(e => new { e.Username, e.TableKey, e.ViewAlias }, "TableSaveStates_data_UNIQUE").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ID");
            entity.Property(e => e.DateCreated)
                .HasPrecision(0)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasPrecision(0)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.LastActive)
                .HasComment("If true, the view will be loaded on table startup.")
                .HasColumnName("lastActive");
            entity.Property(e => e.TableKey)
                .HasMaxLength(255)
                .HasComment("The table key.")
                .HasColumnName("tableKey");
            entity.Property(e => e.Username)
                .HasMaxLength(255)
                .HasComment("The username.")
                .HasColumnName("username");
            entity.Property(e => e.ViewAlias)
                .HasMaxLength(50)
                .HasComment("The alias of the view.")
                .HasColumnName("viewAlias");
            entity.Property(e => e.ViewData)
                .HasComment("The data stored about the view.")
                .HasColumnName("viewData");
        });

        modelBuilder.Entity<TestTable>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Test1Table_PK");

            entity.ToTable("TestTable", tb =>
                {
                    tb.HasComment("The table used for the test.");
                    tb.HasTrigger("Test1Table_tg_dateUpdated");
                });

            entity.HasIndex(e => e.Username, "Test1Table_username_UNIQUE").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasComment("The PK of the table.")
                .HasColumnName("ID");
            entity.Property(e => e.Age)
                .HasComment("The age of the user.")
                .HasColumnName("age");
            entity.Property(e => e.Birthdate)
                .HasPrecision(0)
                .HasComment("The birthdate of the user.")
                .HasColumnName("birthdate");
            entity.Property(e => e.CanBeDeleted)
                .HasComment("Used for the frontend to show a delete button.")
                .HasColumnName("canBeDeleted");
            entity.Property(e => e.DateCreated)
                .HasPrecision(0)
                .HasDefaultValueSql("(getutcdate())")
                .HasComment("The date the record was created.")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasPrecision(0)
                .HasDefaultValueSql("(getutcdate())")
                .HasComment("The date the record was last updated.")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.EmploymentStatusId)
                .HasComment("The current employment status of the user.")
                .HasColumnName("employmentStatusID");
            entity.Property(e => e.EmploymentStatusList)
                .HasMaxLength(500)
                .HasComment("A list of values separated by ;")
                .HasColumnName("employmentStatusList");
            entity.Property(e => e.PayedTaxes)
                .HasComment("Indicates if the user payed its taxes or not.")
                .HasColumnName("payedTaxes");
            entity.Property(e => e.Username)
                .HasMaxLength(255)
                .HasComment("The username.")
                .HasColumnName("username");

            entity.HasOne(d => d.EmploymentStatus).WithMany(p => p.TestTables)
                .HasForeignKey(d => d.EmploymentStatusId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("TestTable_EmploymentStatusCategories_FK");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
