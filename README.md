# PrimeNG Table reusable component
A solution that shows how to use a PrimeNG table with advance filters delegating all logic to the database engine. This solution is designed to use Angular for the frontend and a .NET API (ASP.NET) for the backend. As database engine Microsoft SQL Server has been used, but other database engines should work with small modifications in the code.
Currently it uses in the backend .NET 8, and in the frontend Angular 18 with PrimeNG 17.18.X components.

## Table of Contents

- [Introduction](#introduction)
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
  - [4.1 Date formating](#41-date-formating)
  - [4.2 Preparing what is going to be shown in the frontend](#42-preparing-what-is-going-to-be-shown-in-the-frontend)
  - [4.3 Fetching table columns endpoint](#43-fetching-table-columns-endpoint)
  - [4.4 Retrieving table data endpoint](#44-retrieving-table-data-endpoint)
  - [4.5 Implementing a new table in the frontend](#45-implementing-a-new-table-in-the-frontend)
  - [4.6 Predifined filters](#46-predifined-filters)
  - [4.7 Declaring header and row action buttons](#47-declaring-header-and-row-action-buttons)
  - [4.8 Showing a column description](#48-showing-a-column-description)
  - [4.9 Saving table state (database solution)](#49-saving-table-state-database-solution)


## Introduction
Hello! My name is Alex Ibrahim Ojea.

This project started because I needed an efficient and reusable way to handle tables on my Angular web applications. On my own webpage of [Eternal Code Studio (ECS)](https://eternalcodestudio.com/) I wanted to create multiple projects that required the used of tables with advance filter options. PrimeNG offers a simple solution in the frontend (which is not optimal since it forces you to bring all the data to the frontend) and this is what started my motivation to find a solution.

This project show how to do a full implementation of the PrimeNG table delegating all the filter logic to the database engine and how the table can be easily reused throughout your application.

I hope this helps you to create very efficient and good looking tables in your web applications :)

Take into account that I'm not an expert programmer, so there will be possibly some things that could be done better of how I made them. Also, I'm not an expert in CSS, so basically this solution uses a simple design given by PrimeNG and you will have to make it prettier yourself.

This table component offers you all these features from the [PrimeNG table](https://primeng.org/table) with some modifications to delegate all the query building to the backend and the query execution to the database engine:
- Pagination with lazy load requested directly to the database engine
- Multiple sort
- Advance filter (with a list of values per column that can be given)
- Global filter
- Column resize
- Column reorder
- Column toggle
- Column descriptions
- Show data in a tooltip

An example of this demo viewed by a user:
![image](https://github.com/user-attachments/assets/c3a2483f-9a87-46d4-b3c2-1b77a438e90c)



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
**NOTE:** You can use other .NET version with its corresponding packages and the solution should still work with no issues.

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
**NOTE:** You can use other Angular and primeNG versions with its corresponding updates in the package.json and the solution should still work with no issues.

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
    - LinqKit or LinqKit.Core (it has been tested with LinqKit, but LinqKit.Core should also work).
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
      import { TooltipModule } from 'primeng/tooltip';
	  import { InputGroupModule } from 'primeng/inputgroup';
	  import { CheckboxModule } from 'primeng/checkbox';
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
        RippleModule,
        TooltipModule,
		InputGroupModule,
		CheckboxModule
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
The aim of this chapter is to explain all the things that have to be taken into account and what different functionalities are included (and how to implement them).


### 4.1 Date formating
Something that a first glance might sound simple but I've seen lots of developers struggle with this. Its important to know how you should handle your date storage and how you should display it to the end user.

My personal reccomendation, always store in your databases dates in UTC and (if using MSSQL) as a datetime2 type, even if you are not interested in saving the time part. Its a way to guarantee consistency when working with dates. This solution assumes that all your dates are stored in the database as datetime2 in UTC timezone.

The database function [04 FormatDateWithCulture.txt](Database%20scripts/04%20FormatDateWithCulture.txt) that must be created in your database is used when trying to search with the global filter. The global filter tries to search things as a string, so this function makes a conversion of your date to a format that matches the date as you are showing it to the user in the frontend, taking into account the date format, timezone offset and culture that you wish to use (you should obviously use the same in here and in the frontend). The database function needs to be exposed in the backend (as explained in previous sections) so that when the global filter is done, this function can be called with no issues.

If you would like to implement a customization to fetch an specific date format, timezone and culture that the user has for example in its own configuration, it could be easily implemented when fetching the column data that must be sent to the frontend by providing the additional optional arguments to the function "PrimeNGHelper.GetColumnsInfo". In the example project, in the [Main controller](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Controllers/MainController.cs) on the "TestGetCols" function, you could implement a way to retrieve the data formating values for the user that made the request, and then pass the values to the "PrimeNGHelper.GetColumnsInfo".

With this, everything related to date formating should be already be customized and working with no issues with the global filter.


### 4.2 Preparing what is going to be shown in the frontend
For anything that needs to be sent to the frontend (including columns that will be not shown to the user like the ID columns) you must create a DTO. Each element of the DTO that is going to be used must have an attribute declared using "PrimeNGAttribute". The "PrimeNGAttribute" allows you to define certain aspects on how the data of any of the entreis of the DTO should be treated and shown in the frontend.

From the file [PrimeNGAttribute.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Services/PrimeNGAttribute.cs), you will see that you can specify multiple things to each element of the DTO, the things that can be specified per columns are:

- **header:** Used to specify the name that the column will have in the frontend.
- **dateType:** An ENUM used to indicate the type of data that is being managed. This will affect the global filter and the filter per column. The filter by column will display different options to the user in the frontend depending on the data type specified. The are four data types and they must be declared as they appear exactly here:
  - **"Text":** Used mainly for strings and nullable strings. This is the default option if nothing has been specified.
  - **"Numeric":** Used for any type of data in C# that handles numeric values like int, long, ...
  - **"Booelan":** Used for bool and nullable bool types.
  - **"Date":** Used for valid date data, for example, datetime.
- **dataAlignHorizontal:** An ENUM being the default value "Center", the value provided will be used to determine the horizontal aligment of the data in the frontend. The possible values that must be declared as they appear exactly here are:
  - "Left"
  - "Center"
  - "Right"
- **dataAlignHorizontalAllowUserEdit:** By default true. If true, the user can edit the horizontal aligment in the front-end.
- **dataAlignVertical:** An ENUM being the default value "Middle", the value provided will be used to determine the vertical aligment of the data in the frontend. The possible values that must be declared as they appear exactly here are:
  - "Top"
  - "Middle"
  - "Bottom"
- **dataAlignVerticalAllowUserEdit:** By default true. If true, the user can edit the vertical aligment in the front-end.
- **canBeHidden:** Being the default value true, this parameter will indicate if the user in the frontend can hider or not this column. When a column is hidden, it means it won't be recovered in the SELECT statement to the database, saving up on resources. If a columns is hidden, it won't be shown in the frontend until the user selects it again.
- **startHidden:** Default value is false. If the value is true and if "canBeHidden" is true, the column will be first shown to the user as hidden, and if he want to view it, the user must request it in the column selector.
- **canBeResized:** Default true. If true, it means that the user will have the ability to resize the column.
- **canBeReordered:** Default true. If true, the user can drag a column and place it in a different order.
- **canBeSorted:** Default true. If true, the user can press the header of a column to sort the column. If pressed again, the sort order will be inverted. The user has te ability to perform a multisort holding down "CTRL" key and the clicking in all the columns that he wants to sort by.
- **canBeFiltered:** Default true. If true, in the frontend, the user will see a filter icon in the column. When the filter icon is pressed, a menu with different options to filter by will be shown to the user. The menu that is displayed and the available rules will depend in the "dataType" and in "filterPredifinedValuesName".
- **filterPredifinedValuesName:** If "canBeFiltered" is true, it will be used by the frontend to look for the data in an entity with the name provided here. In further sections there is an in depth explanation on how to use this.
- **canBeGlobalFiltered:** Indicates if the column is affected by the glboal filter. The "boolean" data type can't be globally filtered. By default, all the other types of columns are affected by the global filter.
- **sendColumnAttributes:** By default true. This value should be set to false for columns that you wish to send to the frontend, but you do not wish the user to be able to see them. These columns are not affected by the filters or ordering. It is normally used for fields like the ID.
- **columnDescription:** A string that if informed, it will show a "i" icon on the table header and when the user hovers over it, it will show a tooltip that shows the value given here. Useful to describe what the column is about.
- **dataTooltipShow:** By default true. When the user hovers an item in the grid, after a brief delay, the data will be shown inside a tooltip. Useful for a cell that contains a long data that can't be shown easily inside the column width.
- **dataTooltipCustomColumnSource:** By default empty string. If a name of a column of the DTO is provided (case sensitive), and DataTooltipShow is true, the tooltip message will read from the DataTooltipCustomColumnSource column that is referenced.
- **frozenColumnAlign:** An enum and by default noone. If noone the column will not be frozen when scrolled horizontally. If value is different from noone, the column will be frozen to the left or right.
- **wrapIsActive:** By default false. If true, the text in the column will be wraped in the frontend.
- **wrapAllowUserEdit:** By default true. If true, the user can enable or disable word wrap in the frontend.

From the example, we can see the following DTO in [TestDTO.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/DTOs/TestDTO.cs) that is used to send the data to the frontend.
```c#
public class TestDto {
	[PrimeNGAttribute(sendColumnAttributes: false)]
	public Guid id { get; set; }

	[PrimeNGAttribute(sendColumnAttributes: false)]
	public bool canBeDeleted { get; set; }

	[PrimeNGAttribute("Username", dataAlignHorizontal: EnumDataAlignHorizontal.Left, canBeHidden: false, columnDescription: "A random username", frozenColumnAlign: EnumFrozenColumnAlign.Left)]
	public string username { get; set; } = null!;

	[PrimeNGAttribute("Age", dataType: EnumDataType.Numeric, columnDescription: "The age of the user")]
	public byte? age { get; set; }

	[PrimeNGAttribute("Employment status", filterPredifinedValuesName: "employmentStatusPredifinedFilter", columnDescription: "A predifined filter that shows the employment status of the user")]
	public string? employmentStatusName { get; set; }

	[PrimeNGAttribute("Birthdate", dataType: EnumDataType.Date, dataAlignHorizontal: EnumDataAlignHorizontal.Left, startHidden: true, columnDescription: "When was the user born")]
	public DateTime? birthdate { get; set; }

	[PrimeNGAttribute("Payed taxes?", dataType: EnumDataType.Boolean, startHidden: true, columnDescription: "If the user has payed his taxes or not. You've got to pay your taxes :)")]
	public bool payedTaxes { get; set; }
}
```

As you can see fron the above DTO, the columns "id" and "canBeDeleted" are marked as a "SendColumnAttributes" to false. This is due to the fact that we want to obtain these columns and use them in Typescript, but we don't want to show them to the user. The "id" column is used to identify the record and the "canBeDeleted" is used to show a delete button in those rows where this value is true.


### 4.3 Fetching table columns endpoint
When you wish to create a new table, one of your first steps should be to create the DTO and then create an endpoint in a controller that will be used to fetch all the columns information that is used by the table. To do so, you just need to create and endpoint that calls "GetColumnsInfo" and provide it the DTO (that uses the PrimeNGAttribute in every entry) and the function will do everything for you. From the [MainController.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Controllers/MainController.cs) in the example project, and endpoint to fetch all the column data needed would look like this:
```c#
[HttpGet("[action]")]
public IActionResult TestGetCols() {
    try {
        return Ok(PrimeNGHelper.GetColumnsInfo<TestDto>()); // Get all the columns information to be returned
    } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
        return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
    }
}
```
As you can see, you just need to call "GetColumnsInfo" and pass the DTO that you will be using for the table, in this example being "TestDto".

**NOTE:** Please, make sure that every element in the DTO has a PrimeNGAttribute, or the column fetching endpoint won't work properly!


### 4.4 Retrieving table data endpoint
Another endpoint that must be created in the API is the one responsible of building the query dynamically and then retrieving just the needed data from the database. An example on how to do this can be found in [MainController.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Controllers/MainController.cs) in the example project under the endpoint "TestGetData". This is how it looks:
```c#
public IActionResult TestGetData([FromBody] PrimeNGPostRequest inputData) {
    try {
        if(!PrimeNGHelper.ValidateItemsPerPageSizeAndCols(inputData.pageSize, inputData.columns)) { // Validate the items per page size and columns
            return BadRequest("Invalid page size or no columns for selection have been specified.");
        }
        IQueryable<TestDto> baseQuery = _context.TestTables
            .Select(
                u => new TestDto {
                    id = u.Id,
                    canBeDeleted = u.CanBeDeleted,
                    username = u.Username,
                    age = u.Age,
                    employmentStatusName =
                        u.EmploymentStatusId != null ?
                            _context.EmploymentStatusCategories
                                .Where(d => d.Id == u.EmploymentStatusId)
                                .Select(d => d.StatusName).FirstOrDefault() 
                            : null,
                    birthdate = u.Birthdate,
                    payedTaxes = u.PayedTaxes
                }
            ).AsNoTracking();
        return Ok(PrimeNGHelper.PerformDynamicQuery(inputData, baseQuery, stringDateFormatMethod, "username", 1));
    } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
        return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
    }
}
```

The strategy is to first check by calling the function "ValidateItemsPerPageSizeAndCols" that we have been requested and allowed items per page number (the allowed values are defined in the variable "allowedItemsPerPage" under [PrimeNGHelper.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Services/PrimeNGHelper.cs)) and that at least a column to be retrieved has been requested.

The second part is to build and IQueryable that uses the same type as the DTO that we used to provide the columns. It is very important that the IQueryable has the "AsNoTracking" declaration since we don't want to track the entity for any modified data and this gives a slight performance boost. Also, it is strongly recomended that you keep your base IQueryable as plain as possible, try to avoid delegating joins or any other type of complex operations to Entity Framework. As you can see from the example, the base IQueryable is very plain being the only "complex" operation fetching the string of the "employmentStatusName" from the  "EmploymentStatusCategories" table. If your IQueryable can't be very plain, it might be a good strategy to consider generating a view in the database and map the entity to the view instead of trying to delegate the relation builder to Entity Framework, since sometimes it can generate not very optimal queries if they are too complex.

Once you have your base IQueryable ready, the last part is to simply call the "PerformDynamicQuery" passing your base query. The "PerformDynamicQuery" accepts the following arguments:
- **inputData:** This is the PrimeNGPostRequest object that should have arrrived from the frontend as part of the BODY when calling the endpoint. It contains multiple data related to the filter rules requested, the columns that should be shown...
- **baseQuery:** The IQueryable that you have prepared before.
- **stringDateFormatMethod:** The exposed database function "FormatDateWithCulture" that is used if a global filter has been specified and if the columns is of type "date".
- **defaultSortColumnName:** If no sort order operations have been specified by the user, the specified column will be used to perform the sort (if it has been specified). The column must have the same name as in the DTO.
- **defaultSortOrder:** The sorting order to be done to the "defaultSortColumnName" if it needs to be applied. If value is 1 it will be ascending, if not it will be descending.

The "PerformDynamicQuery" function will do all this operations in order:

1. Perform the sorting. The sorting will apply all the sorting rules specified by the user that are located in the PrimeNGPostRequest object. If no sorting rules have been given, and if a "defaultSortColumnName" has been given, a default sorting will be applied. Otherwise, no sotring will be performed.
2. Count the total elements that are available before applying the filtering rules by delegating a COUNT operation of all the records to the database engine.
3. Apply the global filter, if any have been specified in the PrimeNGPostRequest object, to each column that can have the global filter applied. Take into account that the global filter is one of the most costly operations launched to the database engine, since basically it performs a LIKE = '%VALUE_PROVIDED_BY_USER%' to each column. The more columns and data that you have, the slower the query will be. There is an option in the frontend to disable the global filter, which is recommendend when the dataset is very large or there is a large number of columns that could be affected by the global filter.
4. Apply the filter rules per column. From the PrimeNGPostRequest it will get all the filter rules per column that must be applied (it included the pedifined filter rules). In this step the IQueryable will be added all the additional rules that need to be done to reflect all the filtering operations that the user has requested.
5. Count the total elements that are available after applying the filtering rules by delegating a COUNT operation of all the records to the database engine with the current built query.
6. Calculate the number of pages that are available (taking into account the items per page selected and the filtering rules) and determine if the user need to be moved from his current page. For example, if user was in page 100 and suddenly, due to the filters that are applied, only 7 pages are available, the returned current page will be changed to page 7. The frontend will handle this situation and move the user to said page accordingly.
7. Perform the dynamic select and get the needed elements. In this step, the IQueryable will be added a SELECT statement to just get the columns that we are interested in, and the the IQueryable will be converted to a ToDynamicList, which will basically launch all the query that we have been building in the previous steps to the database. In this step, we would have delegated all operations to the database, and in the backend we will be given a dynamic list with the size of the number of items that must be shown in the current page and with only the selected columns that the user has requested (and the columns which have sendColumnAttributes set to false).
8. The function will end by returning us a PrimeNGPostReturn, which must be returned to the frontend.

The PrimeNGPostReturn object contains:
- The current page the user should be at.
- The number of total records that are available before performing the filtering rules.
- The number of total records that are available after performing the filtering rules.
- The data that will be sent to the frontend.

When the PrimeNGPostReturn is retrieved by the table component in the frontend, it will do all the necesarry operations to update what is shown to the user in the table.


### 4.5 Implementing a new table in the frontend
Once you have at least created an endpoint to fetch the columns and the data in you API (we are ye assuming an scenario where you don't need predifined filters), you can generate a new component on your frontend through Visual Studio Code terminal (using CMD, not the default powershell terminal that opens up) by first doing "cd" to you frontend root folder and then executing the command:
```sh
ng generate c OPTIONAL_PATH_FROM_ROOT_FOLDER_TO_GENERATE_COMPONENT YOUR_COMPONENT_NAME
```

This will generate you component inside a folder with four files. Assuming that to start, you only want to show some data the moment the component is loaded, in the file that has been generated with an ".html" extension you must add:
```html
<ecs-primeng-table #dt
    columnsSourceURL="YOUR_API_ENDPOINT_TO_FETCH_COLUMNS"
    dataSoureURL="YOUR_API_ENDPOINT_TO_FETCH_DATA/>
```

With only this, when starting the backend and the the frontend and navigating to the component, a table will be shown and it will automatically get the columns and data the moment the new component is entered. With this you would have completed a simple table that can be used to show data on the frontend with lots of personalization options to the user.

In the above example, the "ecs-primeng-table" has been given the template reference variable "dt", which is optional to do. This is needed when you want to access from the component exposed functions of "ecs-primeng-table". From the demo project, you should be aware that the endpoints of your API shouldn't be the complete URL, but rather the combination of what is already given in the variable "APIbaseURL" in the file [constants.ts](Frontend/primengtablereusablecomponent/src/constants.ts) and the endpoint part that you specify in the "ecs-primeng-table" component.

This project offers some additional things that you can do with the tables and are explained in further chapters. To end this chapter, here is a list of all the parameters that can be given to a table in the HTML declaration:

- **canPerformActions** (boolean): By default true. If is set to false, when entering the component, the table won't try to fetch the columns and data until explicitly told to do so calling "updateDataExternal". In later chapters it is shown how to use it.
- **globalSearchEnabled** (boolean): By default true. Used to enable or disable the global search.
- **globalSearchPlaceholder** (string): A placeholder to be shown in the global filter if no data has been entered. By default is "Search keyword".
- **rowActionButtons** (IprimengActionButtons[]): A list that contains all buttons that will appear in the actions column for each record. Explained how to declare them in later chapters.
- **headerActionButtons** (IprimengActionButtons[]): A list that contains all buttons that will appear in the right side of the header of the table. Explained how to declare them in later chapters.
- **columnsSourceURL** (string): The URL (without the base API URL) that will be used to fetch all the information related to the columns.
- **dataSoureURL** (string): The URL (without the base API URL) that will be used to fetch all the information related to the data.
- **predifinedFiltersCollection** ({ [key: string]: IPrimengPredifinedFilter[] }): Contains a collection of the values that need to be shown for predifined column filters. Explained in later chapters how to use it.
- **predifinedFiltersNoSelectionPlaceholder** (string): A text to be displayed in the dropdown if no value has been selected in a column that uses predifined filters. Default value is: "Any value".
- **predifinedFiltersCollectionSelectedValuesText** (string): A text to display in the predifined filters dropdown footer indicating the number of items that have been selected. Default value is: "items selected".
- **noDataFoundText** (string): The text to be shown when no data has been returned. Default value is: "No data found for the current filter criteria.".
- **showingRecordsText** (string): The text that must be displayed as part of "Showing records". The default value is: "Showing records".
- **applyingFiltersText** (string): The text that is shown next to the number of records after applying filter rules. The default value is: "Available records after applying filters".
- **notApplyingFiltersText** (string): The text to be shown next to the number of total records available (not applying filters). The default value is: "Number of available records".
- **actionColumnName** (string): The column name were the action buttons will appear. Default value is: "Actions".
- **actionsColumnAligmentRight** (boolean): By default true, it can be changed to false to make the actions column appear in the left part of the table, instead that on the right.
- **actionsColumnFrozen** (boolean): By default true. If true, it will freeze the actions column so that if the table is scrolled horizontally, it will remain visible.
- **actionsColumnResizable** (boolean): By default false. If true, it will allow the user to resize the actions column.
- **rowSelectorColumnActive** (boolean): By default false. If true, a column will be shown to the user that includes a checkbox per row. This selection and filtering that the user can do is all managed by the table component. You can fetch the selected rows through the output selectedRows.
- **rowSelectorColumName** (string): The title of the row selection column. By default is "Selected".
- **rowSelectorColumnAligmentRight** (boolean): By default true. If true, the row selector column is put at the right end of the table (or false if its at the left).
- **rowSelectorColumnFrozen** (boolean): By default true. If true, the row selector column will be frozen.
- **computeScrollHeight** (boolean): By default true. If true, the table will try to keep the footer within the view's height.

There is an output which you can access from other components:

- **selectedRows:** (any): A list of all the "id" selected by the user in a row. By default is empty but the user can add elements through the front-end if rowSelectorColumnActive is true.


### 4.6 Predifined filters
You might have some scenarios were you would like to limit the filter options that the user has available to a list of the only possible values that the column could have. This reusable component offers you a way to do so. To achieve this, we will start off in the backend with your DTO.

From the example project, the "TestDto" has an entry named "employmentStatusName". In the "TestDTO" it was given in the PrimeNGAttribute of "filterPredifinedValuesName" the value "employmentStatusPredifinedFilter", which is important to remember because it will need to be exactly the same in the frontend.

The next step is to create an endpoint that will return you all the data that you want from each of the columns that will use the predifined filter. In the example project, the [MainController.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Controllers/MainController.cs) has an endpoint named "GetEmploymentStatus" that is the one that will be called in the frontend to retrieve all the possible values for the employment status. Since the idea is to use a PrimeNG tag to render the status with a color, this endpoint sends the employment status and the RGB color that we want to use in the tag.

If we now go to the frontend, in the component that calls the table we will need to apply some modifications to the Typescript code. First of all we have to define a number of IPrimengPredifinedFilter that matches the amount of different predifined columns that we could have in total. From the example project, in the [home.component.ts](Frontend/primengtablereusablecomponent/src/app/components/home/home.component.ts) we can see that we should start off with this code if we wanted to store the data from the "employmentStatusPredifinedFilter".
```ts
import { Component } from '@angular/core';
import { IPrimengPredifinedFilter } from '../../interfaces/primeng/iprimeng-predifined-filter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  employmentStatusPredifinedFilter: IPrimengPredifinedFilter[] = []; // Contains the data for the possible employment statuses
  predifinedFiltersCollection: { [key: string]: IPrimengPredifinedFilter[] } = {
    employmentStatusPredifinedFilter: this.employmentStatusPredifinedFilter
  };
...
```

An important thing to note is that all predifined filters must be stored in a key + IPrimengPredifinedFilter[] structure, in this case being "predifinedFiltersCollection". The "key" is the value that must match the value declared in "filterPredifinedValuesName" in the DTO in the backend for the table component to be able to map it to the column properly. All your predifined filters that are stored in "predifinedFiltersCollection" (variable name can be different) must be passed to table. To do so, your ".html" of the component will have an additional line:
```html
<ecs-primeng-table #dt
    columnsSourceURL="YOUR_API_ENDPOINT_TO_FETCH_COLUMNS"
    dataSoureURL="YOUR_API_ENDPOINT_TO_FETCH_DATA
    [predifinedFiltersCollection]="predifinedFiltersCollection"/>
```

But we are not done yet, since the only thing we've done is map the "predifinedFiltersCollection" to the table component, so that the table component has access to it, but we should now populate the data. To do so, the strategy is to first force the table to not fetch columns and data on start, since we will need first to fecth all the different predifined filters. For making the table not tyring to load the columns and data when entering the component, we need to add the following line to the ".html":
```html
<ecs-primeng-table #dt
    [canPerformActions]="false"
    columnsSourceURL="YOUR_API_ENDPOINT_TO_FETCH_COLUMNS"
    dataSoureURL="YOUR_API_ENDPOINT_TO_FETCH_DATA
    [predifinedFiltersCollection]="predifinedFiltersCollection"/>
```

The "canPerformActions" variable will tell the table not to fetch the data upon loading the component, and we will have to later on explictly tell it to do so. Here is the part of Typescript that OnInit of the component, it will fetch the predifined filter information and then tell the table to load the data:
```ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimengTableComponent } from '../primeng-table/primeng-table.component';
import { SharedService } from '../../services/shared/shared.service';
import { IPrimengPredifinedFilter } from '../../interfaces/primeng/iprimeng-predifined-filter';
import { IEmploymentStatus } from '../../interfaces/iemployment-status';
import { Constants } from '../../../constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  constructor(private sharedService: SharedService){}
  @ViewChild('dt') dt!: PrimengTableComponent; // Get the reference to the object table

  employmentStatusPredifinedFilter: IPrimengPredifinedFilter[] = []; // Contains the data for the possible employment statuses
  predifinedFiltersCollection: { [key: string]: IPrimengPredifinedFilter[] } = {
    employmentStatusPredifinedFilter: this.employmentStatusPredifinedFilter
  };

  ngOnInit(): void {
    this.getEmploymentStatus(); // Retrieve the possible employment status
  }
  private getEmploymentStatus(){
    setTimeout(() => {
      Constants.waitingHTTP = true; // To indicate that we are waiting an HTTP call. Perform it after one frame so we don't get the warning of ExpressionChangedAfterItHasBeenCheckedError
    }, 1);
    this.sharedService.handleHttpResponse(this.sharedService.handleHttpGetRequest<IEmploymentStatus[]>(`Main/GetEmploymentStatus`)).subscribe({
      next: (responseData: IEmploymentStatus[]) => {
        responseData.forEach((data) => {
          this.employmentStatusPredifinedFilter.push({
            value: data.statusName,
            name: data.statusName,
            displayTag: true,
            tagStyle: {
              background: `rgb(${data.colorR}, ${data.colorG}, ${data.colorB})`
            }
          })
        });
        this.dt.updateDataExternal(); // Get data for the table (columns + data)
      },
      error: err => {
        this.sharedService.dataFecthError("ERROR IN GET EMPLOYMENT STATUS", err);
      }
    });
  }
}
```

As you can see fromthe above example, a variable that views the table "dt" was setup so that later on we could access the public function of the table. OnInit of the component, the "getEmploymentStatus" is called which from a previously created endpoint in the backend, it will fetch all possible employment status. Once the data is obtained, it will push each entry retrieved to the previously empty "employmentStatusPredifinedFilter" array. Finally, once all the data has been pushed, "this.dt.updateDataExternal();" is called to force the table to start the process of fetching the columns and the data of the table.

In this example the predifined filter has been used to display a tag with a color and the name of the employment status, but there are more possibilities. The renderization is both done to the filter list, and to each row for the column that this predifined filter belongs to.

The different options that are available through the IPrimengPredifinedFilter object are:
- **icon:** If specified, it will show a PrimeNG icon. The different icons avialable are [here](https://primeng.org/icons). If you wish to show the "pi-address-book" for example, you should put: "pi pi-address-book".
- **iconURL:** If specified, it will show an image that will be loaded from the provided URL.
- **iconBlob:** If specified, it will render an icon based on the passed data blob.
- **name:** If specified and if "displayName" is undefined or true, it will show the provided string.
- **displayName:** Can be set to false so that the "name" is not displayed. If "displayName" is undefined or true, the "name" will be displayed.
- **value:** The underlying value of the option. The value can be of any type and represents the data managed behind the scenes. It could be an ID or for example the same value as the name (so that the global filter works OK).
- **displayTag:** If set to true, a tag will be displayed with the "name" inside.
- **tagStyle:** Can be passed a set of styles that will be applied to the tag, for example:
  ```ts
  tagStyle: {
    background: `rgb(${data.colorR}, ${data.colorG}, ${data.colorB})`
  }
  ```


### 4.7 Declaring header and row action buttons
Included in this code, you have the option to easily define buttons which can be place on the top right header of the table or in each row. In your component you should define all the buttons that you want to have as an array of IprimengActionButtons (you need different arrays for the header buttons and another one for the row buttons). The IprimengActionButtons values that can be passed are:
- **icon:** If specified, it will show a PrimeNG icon. The different icons avialable are [here](https://primeng.org/icons). If you wish to show the "pi-address-book" for example, you should put: "pi pi-address-book".
- **label:** If specified, it will show a label inside the button.
- **color:** The color property to be applied. The "color" references to the "severity" property of PrimeNG for the [button](https://primeng.org/button#severity).
- **condition:** A condition that must be met in order to show the button. It can be passed a function and the expected return is a boolean. If no condition is specified, the button will always show. If the button is in a row, the data of the row can be accessed (like for example the "ID").
- **action:** The action that the button will perform when pressed. It can be passed a function and no return value is expected. If no action is specified, the button won't do anything on pressed. If the button is in a row, the data of the row can be accessed (like for example the "ID").
- **tooltip:** If given, it will show a tooltip when the user hovers the mouse over the button.

IMPORTANT: Do NOT ever trust that if a user can press a button that should only be shown under some condition, the action should be done. Always perform the verification in the backend, since the exposed data in the frontend can be tampered with.

Buttons that are added into the IprimengActionButtons array that are passed to the table, will be always drawn from left to right, meaning that the first button provided will be always in the most left part, while the last button will be the last button in the row from the right.

From the example project here is an example on how you can specify buttons that are shown in the table. From the Typescript file [home.component.ts](Frontend/primengtablereusablecomponent/src/app/components/home/home.component.ts) we can see the following code fragment:
```ts
headerActionButtons: IprimengActionButtons[] = [
  {
    icon: 'pi pi-calculator',
    action: () => {
      this.sharedService.clearToasts();
      this.sharedService.showToast("success","Clicked on the calculator","Cool! It wokrs :)");
    }
  },
  {
    icon: 'pi pi-file',
    color: 'p-button-success',
    action: () => {
      this.sharedService.clearToasts();
      this.sharedService.showToast("info","Clicked on create a new record","Here you will for example show a modal to create a new record. Upon creating the record, you can do 'this.dt.updateDataExternal()' to refresh the table data and show the newly created record.");
    }
  }
];
rowActionButtons: IprimengActionButtons[] = [
  {
    icon: 'pi pi-trash',
    color: 'p-button-danger',
    action: (rowData) => {
      this.sharedService.showToast("warn","Clicked on delete row",`The record ID is\n\n${rowData.id}\n\nThis button only appears if a condition is met. Remember that a backend validation should be done anyways because users can tamper with the exposed variables in the frontend.`);
    },
    condition: (rowData) => (rowData.canBeDeleted === true)
  }, {
    icon: 'pi pi-file-edit',
    color: 'p-button-primary',
    action: (rowData) => {
      this.sharedService.showToast("success","Clicked on edit row",`The record ID is\n\n${rowData.id}\n\nHere you could open a modal for the user to edit this record (you can retrieve data through the ID) and then call 'this.dt.updateDataExternal()' to refresh the table data.`);
    }
  }
];
```

From the above code it can be seen that two different arrays have been created, one being headerActionButtons and the other one rowActionButtons. In the header buttons we have two buttons that are always shown and both of them will execute the action of showing a toast message. In the row action buttons we have two buttons, were both will show a toast message including the "rowData.id" value. The delete button will be only shown under a specific condition, being "rowData.canBeDeleted === true".

Once the buttons have been defined in your component, you must pass them to the table like so:
```html
<ecs-primeng-table #dt
    [canPerformActions]="false"
    columnsSourceURL="Main/TestGetCols"
    dataSoureURL="Main/TestGetData"
    [predifinedFiltersCollection]="predifinedFiltersCollection"
    [headerActionButtons]="headerActionButtons"
    [rowActionButtons]="rowActionButtons"/>
```

With all this, your table should show the specified buttons and the table component will handle the rest for you.


### 4.8 Showing a column description
To do this, it's very simple. In the backend you just have to give the attribute "columnDescription" a value, and this value will be shown in the frontend. Thats it :D

This script will manage the rest for you. An example would be, in your DTO if you have this (declared "columnDescription"):
```c#
[PrimeNGAttribute("Employment status", filterPredifinedValuesName: "employmentStatusPredifinedFilter", columnDescription: "A predifined filter that shows the employment status of the user")]
public string? employmentStatusName { get; set; }
```

It will be shown in the frontend like this:
![image](https://github.com/user-attachments/assets/488e8fe5-2fcb-42e3-80df-73717bf11cf5)



### 4.9 Saving table state (database solution)
PENDING...

