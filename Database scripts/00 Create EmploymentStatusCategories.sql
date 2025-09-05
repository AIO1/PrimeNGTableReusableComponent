-- Create table EmploymentStatusCategories
CREATE TABLE dbo.EmploymentStatusCategories (
	ID uniqueidentifier DEFAULT newid() NOT NULL,
	dateCreated datetime2(0) DEFAULT getutcdate() NOT NULL,
	dateUpdated datetime2(0) DEFAULT getutcdate() NOT NULL,
	statusName nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	colorR tinyint DEFAULT 0 NOT NULL,
	colorG tinyint DEFAULT 0 NOT NULL,
	colorB tinyint DEFAULT 0 NOT NULL,
	CONSTRAINT EmploymentStatusCategories_PK PRIMARY KEY (ID),
	CONSTRAINT EmploymentStatusCategories_statusName_UNIQUE UNIQUE (statusName)
);
CREATE TRIGGER [EmploymentStatusCategories_tg_dateUpdated]
    ON [EmploymentStatusCategories]
    AFTER UPDATE 
    AS BEGIN
       UPDATE [EmploymentStatusCategories]
       SET dateUpdated = getutcdate()
       FROM INSERTED i
       WHERE i.ID = [EmploymentStatusCategories].ID
    END;


-- Extended properties
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Contains a list of employment categories.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'EmploymentStatusCategories';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The PK of the table.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'EmploymentStatusCategories', @level2type=N'Column', @level2name=N'ID';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date the record was created.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'EmploymentStatusCategories', @level2type=N'Column', @level2name=N'dateCreated';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date the record was last updated.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'EmploymentStatusCategories', @level2type=N'Column', @level2name=N'dateUpdated';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The name of the employment status.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'EmploymentStatusCategories', @level2type=N'Column', @level2name=N'statusName';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The red component of the color used to draw the tag.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'EmploymentStatusCategories', @level2type=N'Column', @level2name=N'colorR';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The green component of the color used to draw the tag.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'EmploymentStatusCategories', @level2type=N'Column', @level2name=N'colorG';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The blue component of the color used to draw the tag.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'EmploymentStatusCategories', @level2type=N'Column', @level2name=N'colorB';