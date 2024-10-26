DECLARE @i INT = 0
DECLARE @maxRows INT = 1000 -- Number of records to generate. This can be modified to larger number to perform stress tests.
WHILE @i < @maxRows
BEGIN
	INSERT INTO primengtablereusablecomponent.dbo.TestTable (username, age, birthdate, payedTaxes, employmentStatusID, canBeDeleted)
	VALUES (
		NEWID(),
		CASE
			WHEN RAND() < 0.25 THEN NULL -- 25% chance of being null
			ELSE CAST(RAND() * 100 AS TINYINT)
		END,
		CASE 
			WHEN RAND() < 0.25 THEN NULL -- 25% chance of being null
			ELSE (DATEADD(DAY, -ABS(CHECKSUM(NEWID()) % (CAST(RAND()*40000 AS INT))), GETDATE()))
		END,
		CAST(ROUND(RAND(), 0) AS BIT),
		CASE 
			WHEN RAND() < 0.25 THEN NULL -- 25% chance of being null
			ELSE (SELECT TOP 1 ID FROM primengtablereusablecomponent.dbo.EmploymentStatusCategories ORDER BY NEWID())
		END,
        	CAST(ROUND(RAND(), 0) AS BIT)
	)
	SET @i = @i + 1
END