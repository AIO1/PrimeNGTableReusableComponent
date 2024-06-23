# WIP - I'm still updating this readme file :) Please, be patient :P
# PrimeNG Table reusable component
A solution that shows how to use a PrimeNG table with advace filters delegating all logic to the database engine. This solution is designed to use Angular for the frontend and a .NET API (ASP.NET) for the backend. As database engine Microsoft SQL Server has been used, but other database engines should work with small modifications in the code.
Currently it uses in the backend .NET 8, and in the frontend Angular 18 with PrimeNG 17.18.X components.


## Table of contents
- [1 Required software](#1-required-software)
- [2 Setup the environment](#2-setup-the-environment)
  - [2.1 Database (MSSQL)](#21-database-mssql)
  - [2.2 Backend (API in ASP.NET)](#22-backend-api-in-aspnet)
    - [2.2.1 Open the project](#221-open-the-project)
    - [2.2.2 Verify packages](#222-verify-packages)
    - [2.2.3 Update the database connection string](#223-update-the-database-connection-string)
    - [2.2.4 Scafolding the database](#224-scafolding-the-database)
    - [2.2.5 API first run](#225-api-first-run)
  - [2.3 Frontend (Angular project that uses PrimeNG components)](#23-frontend-angular-project-that-uses-primeng-components)


## 1 Required software
To run this example, the following software is needed and needs to be setup:
- [Visual Studio Code](https://code.visualstudio.com/Download): Used for development in the frontend.
- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/): Used for development in the backend API of ASP.NET Core. Make sure to select and install the ASP.NET component and the .NET 8 framework (should be already selected) during the installation process, since both things are needed for the API to run.
- [Node.js](https://nodejs.org/en/download/package-manager): For being able to run in development the Angular application. It is strongly recomended that you manage your Node.js with [NVM](https://github.com/nvm-sh/nvm).
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads): The database engine that will store all the data and perform all the query operations. This actually is optional since with a few modifications in the code, it should with other database engines, but if this is your first time, it is strongly recomended that you use Microsoft SQL Server.
- (Optional) [DBeaver](https://dbeaver.io/download/): Used for being able to manage the databases with a user interface. Works with a wide variety of database engines. Other database management softwares should work, but this is the one I normally use.


## 2 Setup the environment
### 2.1 Database (MSSQL)
This example has been setup using MSSQL. Any other database engine should work with some modifications, but this example only covers the use of MSSQL.

The first step is to create a new database and name it "primengtablereusablecomponent". The newly created database should have been created with an schema named "dbo". You can use other database and schema name, but you will have to adapt the backend and database scripts afterwards for everything to work as expected.

Once you have created the database and its schema, you must download all the database scripts located under [this path](Database%20scripts). These scripts must be executed in order (starting at 00).
- <ins>**00 Create EmploymentStatusCategories.txt**</ins>: Script to create the table "EmploymentStatusCategories". This table contains a list of all the possible employment categories.
- <ins>**01 Populate EmploymentStatusCategories.txt**</ins>: Script that generates some intial records for the table "EmploymentStatusCategories".
- <ins>**02 Create TestTable**</ins>: Script that generates the table used for the test. Contains the general data that will be displayed in the frontend.
- <ins>**03 Populate TestTable**</ins>: A script that can be slightly altered and generates random data in the "TestTable".
- <ins>**04 FormatDateWithCulture**</ins>: A script that will generate a function in the database. This function is used by the backend for being able to perform the global search in columns of type date treating them as text, an passing the same mask, timezone and localte that they would have in the frontend.

Once all scripts have been executed OK, you should end up with 2 tables that are populated with data and a function named "FormatDateWithCulture" in your database. The following image shows the ER diagram of the 2 tables:
![primengtablereusablecomponent - dbo - ER diagram](https://github.com/AIO1/PrimeNGTableReusableComponent/assets/17305493/2c6f1b8c-d57c-4d23-ba21-5d1024764168)


### 2.2 Backend (API in ASP.NET)
#### 2.2.1 Open the project
Using Visual Studio 2022, open the backend solution located in [this path](Backend/PrimeNGTableReusableComponent). Make sure that you have the ASP.NET component and the .NET 8 framework. If you don't have both, you will have to use Visual Studio Installer to include whatever is missing.


#### 2.2.2 Verify packages
Once the project has opened, you must make sure that under "Dependencies > Packages" you have the following, since they are needed for this example to work:
- <ins>**LinqKit**</ins>: Used to build the dynamic queries that are delegated to the database engine.
- <ins>**Microsoft.EntityFrameworkCore.SqlServer**</ins>: This is needed in this example since we are using MSSQL as our database engine. If you want to use a different database engine, you will need to replace this package with the corresponding one to use your desired database engine.
- <ins>**Microsoft.EntityFrameworkCore.Tools**</ins>: Optional but strongly recommended, since this package will allow you to easily perform scafolding of any changes that you have performed in your database tables generating (or updating) the models and context in your backend.
- <ins>**Swashbuckle.AspNetCore**</ins>: Swagger tooling for APIs built with ASP.NET Core.
- <ins>**Swashbuckle.AspNetCore.Annotations**</ins>: Optional but strongly recommended, since it provides custom attributes that can be applied to controllers, actions and models to enrich the generated Swagger. If you don't want to use it, you will have to uninstall the package and in the [MainController](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Controllers/MainController.cs) you will have to delete the "using" and all lines that use "SwaggerOperation" or "SwaggerResponse".
- <ins>**System.Linq.Dynamic.Core**</ins>: As well as with LinqKit, this package is needed to build part of the dynamic queries that are delegated to the database engine.


#### 2.2.3 Update the database connection string
If you have done the default MSSQL installation, and if you have configured the database as "primengtablereusablecomponent" with an schema named "dbo" and with no security, you can skip this step. Otherwise, please read all the changes that you must be taken into account.
The next thing that you must modifiy for your backend API to work, is the database configuration. To do so, head over to the [appsettings.Development.json](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/appsettings.Development.json) file and make sure that the connection string under "DB_primengtablereusablecomponent" has the correct configuration.
If in the "appsettings.json" you want to modify the identifier name of the connection string, remember to update it under [Program.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Program.cs).


#### 2.2.4 Scafolding the database
This is an optional step and only needs to be done if you modify the database structure, if you want to generate in another location of the backend the DBContext or the models, or if you want to use a different database engine that is not MSSQL. To perform a scafolding, from the "Package manager console" in Visual Studio, perform a "cd" command to the root folder of the project (were the .sln file is located).

Once located in the folder, execute the following command (asumming your database is named primengtablereusablecomponent, you are using SQL server engine and you want to locate the DBContext and Model in the same location as in the example code):
```sh
dotnet ef dbcontext scaffold name=DB_primengtablereusablecomponent Microsoft.EntityFrameworkCore.SqlServer --output-dir Models --context-dir DBContext --namespace Models.PrimengTableReusableComponent --context-namespace Data.PrimengTableReusableComponent --context primengTableReusableComponentContext -f --no-onconfiguring
```
These can be the normal possible changes that you should do in the above command:
- The "name=DB_primengtablereusablecomponent" should only be modified if in your appsettings.Development.json, the connection string name has been modified.
- If you would like to use a different database engine, you should change from the above command the part of "Microsoft.EntityFrameworkCore.SqlServer" with the appropiate package name for your database engine.
- "--output-dir" indicates where the "Models" of your database will be generated. In the above command they will be generated under the "Models" folder (the folder will be created automatically if it doesn't exist).
- "--context-dir" indicates where the "DBContext" will be generated. In the above it will be generated in a folder named "DBContext" (the folder will be created automatically if it doesn't exist).
- "--namespace" and "--context-namespace" allow you to indicate the namespace of the models and the DBContext respectively.
- "--context" will be used to put set the name of the DBContext, in this case, it will be named "primengTableReusableComponentContext".
- "-f" will force the overwrite of the files.
- "--no-onconfiguring" will indicate the scafolding process that we don't want to manage the connection from the DBContext. The connection is managed in this example from the "appsettings.Development.json" file through the connection strings.


#### 2.2.5 API first run


### 2.3 Frontend (Angular project that uses PrimeNG components)
