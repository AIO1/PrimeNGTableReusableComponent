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

    public virtual DbSet<Test1Table> Test1Tables { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("SQL_Latin1_General_CP1_CI_AS");

        modelBuilder.Entity<Test1Table>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Test1Table_PK");

            entity.ToTable("Test1Table", tb =>
                {
                    tb.HasComment("The table used for the 1st test.");
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
            entity.Property(e => e.PayedTaxes)
                .HasComment("Indicates if the user payed its taxes or not.")
                .HasColumnName("payedTaxes");
            entity.Property(e => e.Username)
                .HasMaxLength(255)
                .HasComment("The username.")
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
