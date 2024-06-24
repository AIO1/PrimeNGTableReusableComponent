# WIP - I'm still updating this readme file :smile: Please, be patient :stuck_out_tongue_winking_eye:
# PrimeNG Table reusable component
A solution that shows how to use a PrimeNG table with advance filters delegating all logic to the database engine. This solution is designed to use Angular for the frontend and a .NET API (ASP.NET) for the backend. As database engine Microsoft SQL Server has been used, but other database engines should work with small modifications in the code.
Currently it uses in the backend .NET 8, and in the frontend Angular 18 with PrimeNG 17.18.X components.


## Table of contents
- [1 Required software](#1-required-software)
- [2 Setup the environment to try the demo](#2-setup-the-environment-to-try-the-demo)
  - [2.1 Database (MSSQL)](#21-database-mssql)
  - [2.2 Backend (API in ASP.NET)](#22-backend-api-in-aspnet)
    - [2.2.1 Open the project](#221-open-the-project)
    - [2.2.2 Verify packages](#222-verify-packages)
    - [2.2.3 Update the database connection string](#223-update-the-database-connection-string)
    - [2.2.4 Scafolding the database](#224-scafolding-the-database)
    - [2.2.5 API first run](#225-api-first-run)
  - [2.3 Frontend (Angular project that uses PrimeNG components)](#23-frontend-angular-project-that-uses-primeng-components)
- [3 How to implement in existing projects](#3-how-to-implement-in-existing-projects)
- [4 How to use the "PrimeNG Table reusable component" and what is included](#4-how-to-use-the-primeng-table-reusable-component-and-what-is-included)


## 1 Required software
To run this example, the following software is needed and needs to be setup:
- [Visual Studio Code](https://code.visualstudio.com/Download): Used for development in the frontend.
- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/): Used for development in the backend API of ASP.NET Core. Make sure to select and install the ASP.NET component and the .NET 8 framework (should be already selected) during the installation process, since both things are needed for the API to run.
- [Node.js](https://nodejs.org/en/download/package-manager): For being able to run in development the Angular application. It is strongly recomended that you manage your Node.js with [NVM](https://github.com/nvm-sh/nvm).
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads): The database engine that will store all the data and perform all the query operations. This actually is optional since with a few modifications in the code, it should with other database engines, but if this is your first time, it is strongly recomended that you use Microsoft SQL Server.
- (Optional) [DBeaver](https://dbeaver.io/download/): Used for being able to manage the databases with a user interface. Works with a wide variety of database engines. Other database management softwares should work, but this is the one I normally use.


## 2 Setup the environment to try the demo
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
Once you have gone through all the previous steps under this chapter, you should now be able to execute the API and test that everything is working OK before going to the frontend. To do so, on the top bar in Visual Studio 2022 you should see a green play button with a text next to it that says "https". Once clicked the API should start and a webpage should show up after some brief moments.

If everything went OK, you should now see a webpage that shows all the API documentation generated by Swagger and 3 endpoints that you can test (two GET methods and one POST). Below you should also see a section named "Schemas" that shows all the schemas that have been detected by Swagger during the documentation generation.

Up to this point we know that the API boots up OK, but now we must test that the endpoints and the communication with the database are working. To perform a simple quick test, you can click on the "Main/GetEmploymentStatus" GET method (since it is very easy to test and doesn't require any parameters) and click on the button "Try out" that appears under the method. Once clicked two new buttons will appear and you must click on "Execute". Upon execution, you should get a 200 response and the response body should look something similar to this:
<details>
<summary>Expected body response for "Main/GetEmploymentStatus"</summary>
  
```json
[
  {
    "statusName": "Contract",
    "colorR": 100,
    "colorG": 200,
    "colorB": 0
  },
  {
    "statusName": "Freelance",
    "colorR": 0,
    "colorG": 150,
    "colorB": 0
  },
  {
    "statusName": "Full-time",
    "colorR": 0,
    "colorG": 200,
    "colorB": 0
  },
  {
    "statusName": "Intern",
    "colorR": 0,
    "colorG": 150,
    "colorB": 0
  },
  {
    "statusName": "Military",
    "colorR": 0,
    "colorG": 200,
    "colorB": 100
  },
  {
    "statusName": "On leave",
    "colorR": 200,
    "colorG": 200,
    "colorB": 0
  },
  {
    "statusName": "Other",
    "colorR": 200,
    "colorG": 125,
    "colorB": 0
  },
  {
    "statusName": "Part-time",
    "colorR": 50,
    "colorG": 200,
    "colorB": 0
  },
  {
    "statusName": "Retired",
    "colorR": 0,
    "colorG": 50,
    "colorB": 0
  },
  {
    "statusName": "Self-employed",
    "colorR": 0,
    "colorG": 200,
    "colorB": 50
  },
  {
    "statusName": "Student",
    "colorR": 0,
    "colorG": 100,
    "colorB": 0
  },
  {
    "statusName": "Temporary",
    "colorR": 150,
    "colorG": 200,
    "colorB": 0
  },
  {
    "statusName": "Unemployed",
    "colorR": 200,
    "colorG": 0,
    "colorB": 0
  },
  {
    "statusName": "Volunteer",
    "colorR": 0,
    "colorG": 200,
    "colorB": 50
  }
]
```
</details>

If you got these results, it means that your API is running OK and that your communication with the database is working, since these GET endpoints retrieves data directly from the database.

In the URL of your API, please, take notes of the port that appears, since we will need that port later on to configure the frontend.


### 2.3 Frontend (Angular project that uses PrimeNG components)
This section assumes that you have completed the two previous sections to setup your database and API. 

Before proceding, please, make sure that you have installed Node.js (trough and .msi package or .exe or using NVM), since this will be needed to execute the frontend application from your PC.

To execute the frontend part of this demo, you will need to open the [frontend folder](Frontend/primengtablereusablecomponent) from Visual Studio Code. Once it has opened, we need to first make sure that you API is running on the expected port. To do so, in previous steps you should have taken note of which port you API is running on.

To make sure you are pointing to the API from the frontend when you execute the project, go to [constants.ts](Frontend/primengtablereusablecomponent/src/constants.ts) and you will see in the function "getApiBaseUrl" if we are in development, you will see it returns "https://localhost:7020/". Make sure that port is the one your API is being served on, and if its not, update it and save the file.

From within Visual Studio Code, you can open a new terminal (making sure it is using CMD and not Powershell or other) and execute a "cd" command to go to the [root folder of the frontend project](Frontend/primengtablereusablecomponent). Once you are in the right folder,
execute the command:
```sh
npm install
```

This command will download all required dependencies for the frontend project to be able to run. Once it has finished executing, make sure your API is up and running OK and then excecute the following command in the terminal:
```sh
ng serve -o
```

After some seconds, a new tab in your web explorer should show up and it should show you the table already working.

If you have reached these step, congratulations, you have setup and started OK the demo project! :smile:


## 3 How to implement in existing projects
This section describes step by step what you need to implement the PrimeNG Table reusable component. 
- Database
  - You just need to execute the script to create the [FormatDateWithCulture function](Database%20scripts/04%20FormatDateWithCulture.txt). Remember to modify the initial part were it indicates the database and schema names in the script.
- Backend
  - Open NuGet package manager and make sure you have all these packages:
    - LinqKit
    - Microsoft.EntityFrameworkCore.SqlServer (If you are using MSSQL as database engine, if not, use the appropiate one depending on your target database engine)
    - Microsoft.EntityFrameworkCore.Tools (Optional, you only need it if you want to do scafolding)
    - Swashbuckle.AspNetCore
    - Swashbuckle.AspNetCore.Annotations (Optional, you only need it if you want a better Swagger documentation)
    - System.Linq.Dynamic.Core
  - Import the [PrimeNGDTO.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/DTOs/PrimeNGDTO.cs) file to your solution (it is recommended that you place it inside a folder named "DTOs" or "DTO").
  - Import the [PrimeNGAttribute.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Services/PrimeNGAttribute.cs) and [PrimeNGHelper.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Services/PrimeNGHelper.cs) files to your solution (it is recommended that you place them inside a folder named "Services").
  - You need to create a file (it is recommended to place it next to your DBContext) that looks like the file [primengTableReusableComponentContextExtension.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/DBContext/primengTableReusableComponentContextExtension.cs). This exposes the database function FormatDateWithCulture to make it available in your solution. The name should be something like YourDBContextExtension (basically the same name as your DB context file and just addind an "Extension" at the end). This is done to avoid EF during the scafold process to delete the file, since it is not a modification done over the original DB context file. Please note that this action has to be done for each database context that you have in your application and care should be taken in thsi case with the namespaces and class names.
  - From the contoller (or service) that you would like to use call the function to perform the query, you need to include a line similar to the one shown below for being able to pass the database function FormatDateWithCulture (as a MehtodInfo).
    ```C#
    private static readonly MethodInfo stringDateFormatMethod = typeof(MyDBFunctions).GetMethod(nameof(MyDBFunctions.FormatDateWithCulture), new[] { typeof(DateTime), typeof(string), typeof(string), typeof(string) })!; // Needed import for being able to perform global search on dates
    ```
    Also you will need to include the appropiate "Usings" at the begingin of your file.
- Frontend
  - You packages.json needs to have these two packages (the version can be whatever you need to work with for your Angular version):
    - primeng
    - primeicons
  - Follow the setup guide of PrimeNG (you will need to make some changes to the "styles.css" and maybe to the "app.module.ts" and "angular.json").
  - In the "app.module.ts":
    - You need all these other additional imports:
      ```ts
      // PrimeNG modules (and some of angular/common) that are needed by the reusable table component
      import { MessageService } from 'primeng/api';
      import { ToastModule } from 'primeng/toast';
      import { TableModule } from 'primeng/table';
      import { InputTextModule } from 'primeng/inputtext';
      import { ButtonModule } from 'primeng/button';
      import { MultiSelectModule } from 'primeng/multiselect';
      import { PaginatorModule } from 'primeng/paginator';
      import { TagModule } from 'primeng/tag';
      import { RippleModule } from 'primeng/ripple';
      import { DatePipe, registerLocaleData } from '@angular/common';
      
      import es from '@angular/common/locales/es'; // Needed for scenarios were you would like to manage different locales from "en", like "es-ES"
      registerLocaleData(es);
      ```
      The "registerLocaleData", "import es from '@angular/common/locales/es'" and "registerLocaleData(es)" are optional. Its an example to show you how to import locales different from the default en-US used by datepipe.
    - You will need to modify the "@NgModule" imports to add all the PrimeNG components that are needed by the "PrimeNG Table reusable component":
      ```ts
      imports: [
        BrowserModule, // You should already have this one
        ...
        ToastModule,
        TableModule,
        InputTextModule,
        ButtonModule,
        MultiSelectModule,
        PaginatorModule,
        TagModule,
        RippleModule
      ]
      ```
    - In the "@NgModule" providers, you will need to add the following:
      ```ts
      providers: [
        MessageService,
        DatePipe
      ]
      ```
  - Import the [constants.ts](Frontend/primengtablereusablecomponent/src/constants.ts) to your solution (later on you can modify the code to include its content somewhere else you prefer).
  - Import to your solution all interface files located in the example project under [Frontend/primengtablereusablecomponent/src/app/interfaces/primeng](Frontend/primengtablereusablecomponent/src/app/interfaces/primeng). You might need to fix the imports depending on were you import them in your solution.
  - Import to your solution both files that are located in the example project under [Frontend/primengtablereusablecomponent/src/app/services/shared](Frontend/primengtablereusablecomponent/src/app/services/shared). You might need to fix the imports depending on were you import them in your solution. The "shared.service.ts" could be later on modified in your project so that all references that are currently being used from it, use your own service solutions (maybe you are managing in a different way your HTTP requests or your toast messsages).
  - Import to your solution both files that are located in the example project under [Frontend/primengtablereusablecomponent/src/app/components/primeng-table](Frontend/primengtablereusablecomponent/src/app/components/primeng-table) You might need to fix the imports depending on were you import them in your solution.
  - In the "app.module.ts", you will need to add the import of the [PrimengTableComponent](Frontend/primengtablereusablecomponent/src/app/components/primeng-table/primeng-table.component.ts) as well as adding it in the "app.module.ts" > "@NgModule" > "declarations".

With all these steps done, you should have succesfully imported all required files and perform all the changes in an existing project that are required for being able to use the "PrimeNG Table reusable component".


## 4 How to use the "PrimeNG Table reusable component" and what is included
