TRUNCATE TABLE dbo.TestTable;
DECLARE @FirstNames TABLE (Name NVARCHAR(50))
DECLARE @LastNames TABLE (Name NVARCHAR(50))

INSERT INTO @FirstNames VALUES
('Adrian'),('Alejandro'),('Alex'),('Alberto'),('Amelia'),('Ana'),('Andrew'),('Angel'),('Antonio'),
('Avery'),('Beatriz'),('Benjamin'),('Blanca'),('Caleb'),('Carlos'),('Carmen'),('Charlotte'),
('Chloe'),('Christopher'),('Clara'),('Cristian'),('Cristina'),('Daniel'),('David'),('Diego'),
('Elena'),('Ella'),('Emily'),('Emma'),('Esther'),('Ethan'),('Evelyn'),('Fernando'),('Francisco'),
('Gabriel'),('Gonzalo'),('Grace'),('Guillermo'),('Hannah'),('Harper'),('Hector'),('Henry'),
('Hugo'),('Ignacio'),('Ines'),('Irene'),('Isabella'),('Jack'),('Jackson'),('James'),('Javier'),
('Jayden'),('Joseph'),('Juan'),('Julia'),('Laura'),('Leo'),('Leonor'),('Leonardo'),('Levi'),
('Liam'),('Logan'),('Lorena'),('Lucia'),('Luis'),('Lucas'),('Manuel'),('Maria'),('Marcos'),
('Marta'),('Martin'),('Mason'),('Matthew'),('Michael'),('Mia'),('Monica'),('Natalia'),('Nathan'),
('Nicolas'),('Noelia'),('Nuria'),('Olivia'),('Oscar'),('Owen'),('Patricia'),('Paula'),('Pedro'),
('Pilar'),('Raul'),('Ricardo'),('Robert'),('Rocio'),('Rosa'),('Ruben'),('Samuel'),('Sandra'),
('Santiago'),('Sara'),('Scarlett'),('Sebastian'),('Sergio'),('Silvia'),('Sophia'),('Sofia'),
('Teresa'),('Tomas'),('Valeria'),('Valentina'),('Victor'),('Victoria'),('William'),('Xavier'),
('Yaiza'),('Zoe')

INSERT INTO @LastNames VALUES
('Acosta'),('Adams'),('Alonso'),('Alvarez'),('Anderson'),('Arias'),('Bailey'),('Baker'),
('Barnes'),('Bravo'),('Brown'),('Cabrera'),('Campos'),('Campbell'),('Carter'),('Castillo'),
('Castro'),('Chavez'),('Clark'),('Collins'),('Cook'),('Cooper'),('Cordero'),('Cruz'),
('Davis'),('Delgado'),('Diaz'),('Domenech'),('Dominguez'),('Edwards'),('Esteban'),('Evans'),
('Fernandez'),('Flores'),('Foster'),('Fuentes'),('Gallego'),('Garcia'),('Gil'),('Gomez'),
('Gonzalez'),('Green'),('Guerrero'),('Hall'),('Harris'),('Herrera'),('Herrero'),('Hill'),
('Iglesias'),('Jackson'),('Jimenez'),('Johnson'),('Jones'),('Kelly'),('King'),('Lopez'),
('Lozano'),('Martin'),('Martinez'),('Marquez'),('Medina'),('Mendez'),('Miller'),('Mitchell'),
('Molina'),('Montero'),('Moore'),('Mora'),('Moreno'),('Morgan'),('Murphy'),('Navarro'),
('Nelson'),('Nieto'),('Ortega'),('Parker'),('Pastor'),('Peña'),('Peterson'),('Phillips'),
('Price'),('Prieto'),('Ramirez'),('Ramos'),('Reed'),('Reyes'),('Rivas'),('Roberts'),
('Rodriguez'),('Rogers'),('Romero'),('Ruiz'),('Sanchez'),('Santos'),('Scott'),('Serrano'),
('Silva'),('Smith'),('Soler'),('Stewart'),('Suarez'),('Taylor'),('Thomas'),('Thompson'),
('Torres'),('Trujillo'),('Turner'),('Valdez'),('Vargas'),('Vazquez'),('Vega'),('Velasco'),
('Vicente'),('Vidal'),('White'),('Williams'),('Wilson'),('Young')

DECLARE @i INT = 0
DECLARE @maxRows INT = 1000

WHILE @i < @maxRows
BEGIN
	INSERT INTO dbo.TestTable 
		(username, age, birthdate, payedTaxes, employmentStatusID, canBeDeleted, employmentStatusList)
	VALUES (
		(SELECT TOP 1 Name FROM @FirstNames ORDER BY NEWID())
		+ ' ' +
		(SELECT TOP 1 Name FROM @LastNames ORDER BY NEWID())
		+ ' ' +
		(SELECT TOP 1 Name FROM @LastNames ORDER BY NEWID()),
		CASE
			WHEN RAND() < 0.25 THEN NULL
			ELSE CAST(RAND() * 100 AS TINYINT)
		END,
		CASE 
			WHEN RAND() < 0.25 THEN NULL
			ELSE (DATEADD(DAY, -ABS(CHECKSUM(NEWID()) % (CAST(RAND()*40000 AS INT))), GETDATE()))
		END,
		CAST(ROUND(RAND(), 0) AS BIT),
		CASE 
			WHEN RAND() < 0.25 THEN NULL
			ELSE (SELECT TOP 1 ID FROM dbo.EmploymentStatusCategories ORDER BY NEWID())
		END,
		CAST(ROUND(RAND(), 0) AS BIT),
		CASE
            WHEN RAND() < 0.25 THEN NULL
            ELSE (
                SELECT STRING_AGG(statusName, '; ') 
                FROM (
                    SELECT TOP (CAST((RAND()*4+1) AS INT)) statusName
                    FROM dbo.EmploymentStatusCategories
                    ORDER BY NEWID()
                ) AS t
            )
        END
	)
	SET @i = @i + 1
END