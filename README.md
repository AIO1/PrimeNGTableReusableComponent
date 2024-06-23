# PrimeNG Table reusable component
A solution that shows how to use a PrimeNG table with advace filters delegating all logic to the database engine. This solution is designed to use Angular for the frontend and a .NET API (ASP.NET) for the backend. As database engine Microsoft SQL Server has been used, but other database engines should work with small modifications in the code.
Currently it uses in the backend .NET 8, and in the frontend Angular 18 with PrimeNG 17.18.X components.


## Table of contents
- [1 Required software](#1-required-software)
- [2 Setup the environment](#2-setup-the-environment)
  - [2.1 Database (MSSQL)](#21-database-mssql)
  - [2.2 Backend (API in ASP.NET)](#22-backend-api-in-aspnet)
  - [2.3 Frontend (Angular project that uses PrimeNG components)](#23-frontend-angular-project-that-uses-primeng-components)


## 1 Required software
To run this example, the following software is needed and needs to be setup:
- [Visual Studio Code](https://code.visualstudio.com/Download): Used for development in the frontend.
- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/): Used for development in the backend API of ASP.NET Core. Make sure to select and install the ASP.NET component and the .NET 8 framework (should be already selected) during the installation process, since both things are needed for the API to run.
- [Node.js](https://nodejs.org/en/download/package-manager): For being able to run in development the Angular application. It is strongly recomended that you manage your Node.js with [NVM](https://github.com/nvm-sh/nvm).
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads): The database engine that will store all the data and perform all the query operations. This actually is optional since with a few modifications in the code, it should with other database engines, but if this is your first time, it is strongly recomended that you use Microsoft SQL Server.
- (Optional) [DBeaver](https://dbeaver.io/download/): Used for being able to manage the databases with a virtual interface. Works with a wide variety of database engines. Other database management softwares should work, but this is the one I normally use.


## 2 Setup the environment
### 2.1 Database (MSSQL)
This example has been setup using MSSQL. Any other database engine should work with some modifications, but this example only covers the use of MSSQL.
The first step is to create a new database and name it "primengtablereusablecomponent". The newly created database should have been created with an schema named "dbo". You can use other database and schema name, but you will have to adapt the backend and database scripts afterwards for everything to work as expected.
Once you have created the database and its schema, you must download all the database scripts located under [this path](Database%20scripts). These scripts must be executed in order (starting at 00).
- 00 Create EmploymentStatusCategories.txt: Script to create the table "EmploymentStatusCategories". This table contains a list of all the possible employment categories.
- 01 Populate EmploymentStatusCategories.txt: Script that generates some intial records for the table "EmploymentStatusCategories".
- 02 Create TestTable: Script that generates the table used for the test. Contains the general data that will be displayed in the frontend.
- 03 Populate TestTable: A script that can be slightly altered and generates random data in the "TestTable".

Once all scripts have been executed OK, you should end up with 2 tables that are populated with data. The following image shows the ER diagram of the 2 tables:
![primengtablereusablecomponent - dbo - ER diagram](https://github.com/AIO1/PrimeNGTableReusableComponent/assets/17305493/2c6f1b8c-d57c-4d23-ba21-5d1024764168)


### 2.2 Backend (API in ASP.NET)
Using Visual Studio 2022, open the backend solution located in [this path](Backend/PrimeNGTableReusableComponent).


### 2.3 Frontend (Angular project that uses PrimeNG components)
