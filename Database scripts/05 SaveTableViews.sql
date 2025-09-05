CREATE TABLE dbo.TableViews (
	ID uniqueidentifier DEFAULT newid() NOT NULL,
	dateCreated datetime2(0) DEFAULT getutcdate() NOT NULL,
	dateUpdated datetime2(0) DEFAULT getutcdate() NOT NULL,
	username nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	tableKey nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	viewAlias nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	viewData nvarchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT TableSaveStates_PK PRIMARY KEY (ID),
	CONSTRAINT TableSaveStates_data_UNIQUE UNIQUE (username,tableKey,viewAlias)
);

CREATE TRIGGER [TableViews_tg_dateUpdated]
    ON [TableViews]
    AFTER UPDATE 
    AS BEGIN
       UPDATE [TableViews]
       SET dateUpdated = getutcdate()
       FROM INSERTED i
       WHERE i.ID = [TableViews].ID
    END;