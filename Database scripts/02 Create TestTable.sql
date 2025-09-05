CREATE TABLE dbo.TestTable (
	ID uniqueidentifier DEFAULT newid() NOT NULL,
	username nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	age tinyint NULL,
	dateCreated datetime2(0) DEFAULT getutcdate() NOT NULL,
	dateUpdated datetime2(0) DEFAULT getutcdate() NOT NULL,
	birthdate datetime2(0) NULL,
	payedTaxes bit DEFAULT 0 NOT NULL,
	employmentStatusID uniqueidentifier NULL,
	canBeDeleted bit DEFAULT 0 NOT NULL,
	employmentStatusList nvarchar(500) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT Test1Table_PK PRIMARY KEY (ID),
	CONSTRAINT Test1Table_username_UNIQUE UNIQUE (username),
	CONSTRAINT TestTable_EmploymentStatusCategories_FK FOREIGN KEY (employmentStatusID) REFERENCES dbo.EmploymentStatusCategories(ID) ON DELETE SET NULL
);

-- Extended properties
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The table used for the test.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'TestTable';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The PK of the table.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'TestTable', @level2type=N'Column', @level2name=N'ID';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The username.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'TestTable', @level2type=N'Column', @level2name=N'username';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The age of the user.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'TestTable', @level2type=N'Column', @level2name=N'age';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date the record was created.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'TestTable', @level2type=N'Column', @level2name=N'dateCreated';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The date the record was last updated.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'TestTable', @level2type=N'Column', @level2name=N'dateUpdated';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The birthdate of the user.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'TestTable', @level2type=N'Column', @level2name=N'birthdate';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Indicates if the user payed its taxes or not.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'TestTable', @level2type=N'Column', @level2name=N'payedTaxes';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The current employment status of the user.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'TestTable', @level2type=N'Column', @level2name=N'employmentStatusID';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'Used for the frontend to show a delete button.', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'TestTable', @level2type=N'Column', @level2name=N'canBeDeleted';
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'A list of values separated by ;', @level0type=N'Schema', @level0name=N'dbo', @level1type=N'Table', @level1name=N'TestTable', @level2type=N'Column', @level2name=N'employmentStatusList';