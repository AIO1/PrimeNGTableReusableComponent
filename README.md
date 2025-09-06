[![NuGet Version](https://img.shields.io/nuget/v/ECS.PrimeNGTable.svg)](https://www.nuget.org/packages/ECS.PrimeNGTable/)
[![NuGet Downloads](https://img.shields.io/nuget/dt/ECS.PrimeNGTable.svg)](https://www.nuget.org/packages/ECS.PrimeNGTable/)

[![npm version](https://img.shields.io/npm/v/@eternalcodestudio/primeng-table.svg)](https://www.npmjs.com/package/@eternalcodestudio/primeng-table)
[![npm downloads](https://img.shields.io/npm/dm/@eternalcodestudio/primeng-table.svg)](https://www.npmjs.com/package/@eternalcodestudio/primeng-table)
# ECS PrimeNG Table
A solution created by Alex Ibrahim Ojea that enhances the PrimeNG table with advanced filters and extended functionality, delegating all query and filtering logic to the database engine. The frontend is built with Angular 20 and PrimeNG 20 components, while the backend is a .NET 8 (ASP.NET) API connected to Microsoft SQL Server, easily adaptable to other databases. This approach prevents server and frontend overload by handling filtering and paging dynamically in the database, and includes features such as column visibility, column filters, custom views, and more.



## Introduction
Hello! My name is Alex Ibrahim Ojea.

This project was created to provide an efficient and reusable PrimeNG table solution for Angular applications. Unlike the default PrimeNG approach, which requires loading all data into the frontend, this implementation delegates filtering, sorting, and pagination logic directly to the database engine, making it highly performant on large datasets.

The goal is to make it simple to integrate a powerful, flexible, and good-looking table into your applications without overloading either the frontend or the server.

Some of the key features included are:
- Dynamic pagination with lazy loading
- Multi-column sorting
- Advanced and predefined filters
- Global search
- Column resizing, reordering, toggling, and descriptions
- Customizable cells (alignment, overflow, tooltips, copy on hover, …)
- Conditional row styling
- Table views for saving configurations
- And much more!

This is an example of the final solution:
<img width="1899" height="978" alt="image" src="https://github.com/user-attachments/assets/d7bc4183-6895-4166-afa7-a2cd64d2abdd" />



## 1 Required software
To run this project, you will need:
- [Visual Studio Code](https://code.visualstudio.com/Download) – for frontend development.
- [Visual Studio 2022](https://visualstudio.microsoft.com/downloads/) – for backend API development with ASP.NET Core. Make sure to install the **ASP.NET workload** and **.NET 8 framework**.
- [Node.js](https://nodejs.org/en/download/package-manager) – to run the Angular application. Managing Node versions with [NVM](https://github.com/nvm-sh/nvm) is recommended.
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) – the database engine used for queries. Optional, can be replaced with other engines with minor code adjustments.
- (Optional) [DBeaver](https://dbeaver.io/download/) – A GUI for database management that works with multiple engines. You can use other tools, but this is the one I normally use.



---
## 2 Setup the environment to try the demo



### 2.1 Database (MSSQL)
This example has been set up using **MSSQL**. Other database engines should work with some modifications, but this guide only covers MSSQL.
First, create a new database named `primengtablereusablecomponent`. The database should have a schema named `dbo`. You can use a different database or schema name, but you will need to adapt the backend and database scripts accordingly.
Once the database and schema are ready, download all the database scripts located under [this path](Database%20scripts). Execute the scripts in order (starting with `00`):
- <ins>**00 Create EmploymentStatusCategories.sql**</ins>: Creates the table `EmploymentStatusCategories`, which contains all possible employment categories used in the predefined filter example.
- <ins>**01 Populate EmploymentStatusCategories.sql**</ins>: Inserts initial records into the `EmploymentStatusCategories` table.
- <ins>**02 Create TestTable.sql**</ins>: Creates the table used for testing, containing the main data displayed in the frontend.
- <ins>**03 Populate TestTable.sql**</ins>: Inserts sample data into `TestTable`. This script can be slightly modified to generate different random data.
- <ins>**04 FormatDateWithCulture.sql**</ins> (optional): Creates a database function used by the backend to allow global search on date columns, formatting them as text with the same mask, timezone, and locale as in the frontend.
- <ins>**05 SaveTableViews.sql**</ins>: Creates an example table to store user-defined table views. This is only needed if you are using the database to save views instead of browser or session storage.

After executing all scripts successfully, you should have:  
- Two populated tables (`EmploymentStatusCategories` and `TestTable`).
- One empty table (`TableViews`).
- One function (`FormatDateWithCulture`).

The following image shows the ER diagram of all the tables:
<img width="1132" height="526" alt="image" src="https://github.com/user-attachments/assets/63762420-6204-4b10-8486-987ec8ca95eb" />



### 2.2 Backend (API in ASP.NET)
> [!NOTE]  
> You can use other .NET versions with the corresponding packages. The solution should still work without issues.



#### 2.2.1 Open the project
Using **Visual Studio 2022**, open the backend solution located in [this path](Backend). Make sure the **ASP.NET workload** and **.NET 8 framework** are installed. If any component is missing, use the **Visual Studio Installer** to add it.



#### 2.2.2 Update the database connection string
> [!NOTE]  
> If you followed the default MSSQL installation and configured the database as `primengtablereusablecomponent` with a schema named `dbo` and no authentication, you can skip this step. Otherwise, follow these instructions carefully to avoid connection issues.

Next, update the database configuration for your backend API. Open the [appsettings.Development.json](Backend/ECSPrimengTableExample/appsettings.Development.json) file and ensure that the connection string under `"DB_primengtablereusablecomponent"` matches your setup.
If you change the identifier name of the connection string in `appsettings.json`, remember to update it accordingly in [Program.cs](Backend/ECSPrimengTableExample/Program.cs).



#### 2.2.3 Scaffolding the database
> [!NOTE]  
> This step is optional and only needed if you modify the database structure, want to generate the `DbContext` or models in a different location, or plan to use a database engine other than MSSQL.

To perform scaffolding, open the **Package Manager Console** in Visual Studio and navigate (`cd`) to the root folder of the project (where the `.sln` file is located).
Once in the project folder, run the following command (assuming your database is named `primengtablereusablecomponent`, you are using SQL Server, and you want to place the `DbContext` and models in the same locations as in the example code):
```sh
dotnet ef dbcontext scaffold name=DB_primengtablereusablecomponent Microsoft.EntityFrameworkCore.SqlServer --output-dir Models --context-dir DBContext --namespace Models.PrimengTableReusableComponent --context-namespace Data.PrimengTableReusableComponent --context primengTableReusableComponentContext -f --no-onconfiguring
```

These are the common changes you may need to make in the command:
- `name=DB_primengtablereusablecomponent`: Change only if you modified the connection string name in `appsettings.Development.json`.
- `Microsoft.EntityFrameworkCore.SqlServer`: Change this to the appropriate provider package if you are using a different database engine.
- `--output-dir`: Specifies where the models will be generated. In this example, they will be generated in the `Models` folder (created automatically if it does not exist).
- `--context-dir`: Specifies where the `DbContext` will be generated. Here it will be created in a folder named `DBContext` (created automatically if it does not exist).
- `--namespace` and `--context-namespace`: Set the namespaces for the models and the `DbContext`, respectively.
- `--context`: Sets the name of the `DbContext`. In this example, it will be `primengTableReusableComponentContext`.
- `-f`: Forces overwriting existing files.
- `--no-onconfiguring`: Tells the scaffolding process not to configure the connection in the `DbContext`. In this example, the connection is managed through the `appsettings.Development.json` file.



#### 2.2.4 API first run
After completing the previous steps, you should now be able to run the API and verify that everything works before moving to the frontend. In Visual Studio 2022, click the green **Play** button on the top bar. The API will start, and after a few moments, a webpage should appear.
If everything is working correctly, you should see the **Swagger-generated API documentation** with some test endpoints. Below, there is a **Schemas** section showing all schemas detected by Swagger during documentation generation.
To test that the API endpoints and database communication are working, perform a quick test with the `Main/GetEmploymentStatus` GET method (it is easy to test and requires no parameters):
1. Click **Try out** under the method.
2. Click **Execute**.
Upon execution, you should receive a **200 response** with a body similar to the following:
```json
[
  { "statusName": "Contract", "colorR": 100, "colorG": 200, "colorB": 0 },
  { "statusName": "Freelance", "colorR": 0, "colorG": 150, "colorB": 0 },
  { "statusName": "Full-time", "colorR": 0, "colorG": 200, "colorB": 0 },
  { "statusName": "Intern", "colorR": 0, "colorG": 150, "colorB": 0 },
  { "statusName": "Military", "colorR": 0, "colorG": 200, "colorB": 100 },
  { "statusName": "On leave", "colorR": 200, "colorG": 200, "colorB": 0 },
  { "statusName": "Other", "colorR": 200, "colorG": 125, "colorB": 0 },
  { "statusName": "Part-time", "colorR": 50, "colorG": 200, "colorB": 0 },
  { "statusName": "Retired", "colorR": 0, "colorG": 50, "colorB": 0 },
  { "statusName": "Self-employed", "colorR": 0, "colorG": 200, "colorB": 50 },
  { "statusName": "Student", "colorR": 0, "colorG": 100, "colorB": 0 },
  { "statusName": "Temporary", "colorR": 150, "colorG": 200, "colorB": 0 },
  { "statusName": "Unemployed", "colorR": 200, "colorG": 0, "colorB": 0 },
  { "statusName": "Volunteer", "colorR": 0, "colorG": 200, "colorB": 50 }
]
```
If you see these results, it means your API is running correctly and communicating with the database, as these GET endpoints retrieve data directly from it.
Take note of the **port number** in the API URL, as it will be needed later to configure the frontend.



### 2.3 Frontend (Angular project using PrimeNG components)
> [!NOTE]  
> You can use other Angular and PrimeNG versions by updating the corresponding `package.json` dependencies. The solution should still work, but be aware that PrimeNG could introduce breaking style changes that may affect the component's appearance or behavior.

This section assumes you have completed the previous steps to set up the database and API.
Before proceeding, ensure that **Node.js** is installed (via the `.msi` or `.exe` installer, or using **NVM**), as it is required to run the frontend application locally.

To run the frontend demo, open the [frontend folder](Frontend/ECSPrimengTable) in **Visual Studio Code**. Make sure your API is running on the expected port (as noted in the previous steps).

To confirm that the frontend points to the correct API endpoint, open [constants.ts](Frontend/ECSPrimengTable/src/constants.ts) and check the function `getApiBaseUrl`. In development mode, it should return something like:
```ts
"https://localhost:7020/"
```
Ensure that the port matches your API. If it differs, update the value and save the file.

> [!IMPORTANT]  
> Always verify that `getApiBaseUrl` points to the correct API port before continuing with this section.

From within **Visual Studio Code**, open a new terminal (make sure it is using **CMD** and not PowerShell or another shell) and navigate to the [root folder of the frontend project](Frontend/ECSPrimengTable) using the `cd` command. Once in the correct folder, run the following command:
```sh
npm install
```
> [!TIP]  
> You can add the `--verbose` flag at the end (`npm install --verbose`) to get more detailed output during the installation process.

This command will download all required dependencies for the frontend project. Once it has finished executing and if everything went OK, ensure your API is running correctly, then execute the following command in the terminal:
```sh
ng build ecs-primeng-table
```
This command will use **ng-packagr** to build a local package in the `dist` folder, based on the contents of `projects\ecs-primeng-table` (the reusable table component).  

Once the package has been successfully built, you can start the web application by running the following command in the terminal:

```sh
ng serve -o
```
> [!TIP]  
> `ng serve` without the `-o` flag also works, but it won't open a browser tab automatically. You will need to navigate manually to the URL where the webpage is served.

After a few seconds, a new tab in your web browser should open, displaying the table fully functional.

If you have reached this step, congratulations! You have successfully set up and started the demo project! :smile:



---
## 3 Integrating into existing projects
This section provides a step-by-step guide on how to integrate the **ECS PrimeNG Table** into your existing projects.



### 3.1 Backend requirements
> [!NOTE]  
> The **ECS PrimeNG Table** package is built for .NET 8, but it should also work seamlessly with newer .NET versions.

If you are already working on a **.NET 8 project (or higher)**, you will need to install the backend compiled package from NuGet (we recommend downloading the latest version):  
[ECS.PrimeNGTable on NuGet](https://www.nuget.org/packages/ECS.PrimeNGTable)

In addition, make sure the following required dependencies are installed:
- **ClosedXML** (>= 0.104.0)
- **LinqKit** (>= 1.3.0)
- **Microsoft.EntityFrameworkCore** (>= 8.0.0)
- **System.Linq.Dynamic.Core** (>= 1.6.0)

> [!TIP]
> You can always check the latest dependency versions by visiting:  
`https://www.nuget.org/packages/ECS.PrimeNGTable/<version>#dependencies-body-tab`  
(Replace `<version>` with the specific package version you are downloading, e.g., `8.0.1`).

With these dependencies in place and the package installed, your backend is ready to use the **ECS PrimeNG Table**.



### 3.2 Frontend requirements



### 3.2.1 Installing the package and peer dependencies
> [!NOTE]  
> The **ECS PrimeNG Table** package is built for Angular 20 with PrimeNG 20 components. While it may work with newer versions, compatibility is not guaranteed, as PrimeNG frequently introduces breaking changes to its components.

If you are already working on an **Angular 20** project, you can check the frontend compiled package on NPM here:  
[@eternalcodestudio/primeng-table on NPM](https://www.npmjs.com/package/@eternalcodestudio/primeng-table)

To install the package, open a terminal in the root folder of your project and run the following command (we recommend installing the latest version):

```sh
npm install @eternalcodestudio/primeng-table
```

In addition, make sure the following required dependencies are installed in your project:
- **@angular/common** (>=20.0.0)
- **@angular/core** (>=20.0.0)
- **primeng** (>=20.0.0)
- **primeicons** (>=7.0.0)

> [!CAUTION]  
> These are **peer dependencies** and are **not installed automatically**. If your project doesn't already include them, you must install them separately using NPM.



### 3.2.2 Configure Angular locales
The **ECS PrimeNG Table** component relies on Angular's **DatePipe** to render date cells.  
To ensure correct formatting, you must import and register the locale(s) you plan to use in your application.

Example for English locale (`en`):
```ts
import { DatePipe, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);
```
Remeber to include also `DatePipe` in your `providers`.

This step is required before using the table. If the locale is not correctly registered, rendering date cells may fail and prevent the table from displaying properly.  

You can include this configuration at the global level (e.g., `app.module.ts` or `app.config.ts`) or at a more local level, depending on your application structure.



### 3.2.3 Required services for ECS PrimeNG Table
The **ECS PrimeNG Table** package defines two abstract services that you need to implement in your project:
- **ECSPrimengTableHttpService**: handles HTTP requests for the table (GET and POST).
- **ECSPrimengTableNotificationService**: handles notifications (toasts) for the table.

These services are abstract, meaning the package does not know how you want to handle HTTP requests or notifications in your project. You need to create your own implementations.



#### Example: HTTP service
In your project, create a class that extends `ECSPrimengTableHttpService` and implements its abstract methods.  

In this example, the implementation uses the main services provided by `SharedService`.
```ts
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ECSPrimengTableHttpService } from '@eternalcodestudio/primeng-table';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class HttpService extends ECSPrimengTableHttpService {
  constructor(private sharedService: SharedService) {
    super();
  }

  handleHttpGetRequest<T>(
    servicePoint: string,
    responseType: 'json' | 'blob' = 'json'
  ): Observable<HttpResponse<T>> {
    return this.sharedService.handleHttpGetRequest(servicePoint, null, true, null, false, responseType);
  }

  handleHttpPostRequest<T>(
    servicePoint: string,
    data: any,
    httpOptions: HttpHeaders | null = null,
    responseType: 'json' | 'blob' = 'json'
  ): Observable<HttpResponse<T>> {
    return this.sharedService.handleHttpPostRequest(servicePoint, data, httpOptions, true, null, false, responseType);
  }
}
```



#### Example: Notification service
Similarly, you need to create a class that extends `ECSPrimengTableNotificationService` and implements its abstract methods.

In this example, the implementation relies on the main services provided by `SharedService`.
```ts
import { Injectable } from '@angular/core';
import { ECSPrimengTableNotificationService } from '@eternalcodestudio/primeng-table';
import { SharedService } from './shared.service';

@Injectable({ providedIn: 'root' })
export class NotificationService extends ECSPrimengTableNotificationService {
  constructor(private sharedService: SharedService) {
    super();
  }

  showToast(severity: string, title: string, message: string): void {
    this.sharedService.showToast(severity, title, message, 5000, false, false, false);
  }

  clearToasts(): void {
    this.sharedService.clearToasts();
  }
}
```



#### Registering the services
Finally, register your implementations in your dependency injection system (for example, in `app.config.ts`):
```ts
import { ECSPrimengTableHttpService, ECSPrimengTableNotificationService } from '@eternalcodestudio/primeng-table';
export const appConfig: ApplicationConfig = {
  providers: [
    ...
    { provide: ECSPrimengTableNotificationService, useClass: NotificationService },
    { provide: ECSPrimengTableHttpService, useClass: HttpService },
    ...
  ]
}
```
This tells the **ECS PrimeNG Table** package to use your custom services for handling HTTP requests and notifications.



---
## 4 Functional overview
The goal of this section is to provide a **user-level overview** of all the features included in the **ECS PrimeNG Table**. It allows you to quickly understand what the table can offer and how these functionalities can be utilized in your projects. This section provides a clear, at a glance view of everything available without diving into code.



### 4.1 Planning your table
Before diving into advanced features, it’s essential to start with the basics and carefully plan your table design. This will ensure that the table fits your users needs and your application’s requirements. Use the following questions as a guide:

**Columns**
- Which columns do I want to include in the table?
- Should all columns be visible by default, or will some be hidden initially?
- Are there columns that must always remain visible and cannot be hidden?
- What horizontal and vertical alignment should each column have?
- How should content overflow be handled in each column (e.g., wrap, truncate)?
- Which columns should allow sorting: all, some, or none?
- Which columns should allow filtering: all, some, or none?
- Can users change the position of columns via drag-and-drop?
- Are any columns going to be frozen (fixed) on the left or right side?

**Rows**
- Do any rows need conditional formatting based on the values of a specific column?
- What actions should I allow per row? Are action buttons enabled or disabled based on certain conditions?
- Can rows be selected (and an action performed on select)?
- Can users select multiple rows, filter by selected rows, or perform actions on multiple selections (row checkbox selector)?

**Global table features**
- Are there any table-level actions needed, such as creating records?
- How will dates be displayed in the table?
- Will users be able to customize the date format?
- Will a global filter be available for the table?
- Should the table support exporting data to Excel?
- Will users be able to save their table configuration? If so, should it be persistent across sessions or only for the current session?

Don’t worry if some of these concepts are unclear at this point, each feature will be explained individually in detail in the following sections.



### 4.2 Date formatting
At first glance, date formatting might seem simple, but it can easily confuse end users if not carefully considered from the start.

The **ECS PrimeNG table** component allows you to control how dates are displayed in each table, letting you customize:
- **Format**: This defines how the date and time will be displayed to the user.  
  For example, `"dd-MMM-yyyy HH:mm:ss zzzz"` means:
  - `dd` → day of the month (01-31).
  - `MMM` → short name of the month (Jan, Feb, etc.).
  - `yyyy` → full year (2025).
  - `HH:mm:ss` → hours, minutes, and seconds in 24-hour format.
  - `zzzz` → time zone name or offset.
- **Time zone**: This specifies the time zone that will be used to display the date/time.  
  For example, `"+00:00"` is UTC (Coordinated Universal Time). Changing this will adjust the displayed time to the desired zone.
- **Culture**: This determines the language and formatting conventions for the date, such as month names, day names, and the order of day/month/year. Default `"en-US"` uses English (United States) conventions. Using `"es-ES"` would show month and day names in Spanish, for example.

You can configure this customization per table, with several possible approaches:
- **Static**: Use the default values or hardcode alternative values if they suit your needs.
- **Server-based**: Use the configuration of the server environment where your application is deployed.
- **Per-user**: Save each user's preferred configuration, allowing users to choose how dates are displayed in their tables. This requires additional setup but provides maximum flexibility.

> [!NOTE]
> While per-table customization is possible, it is recommended to set a **global configuration** for all tables. Individual table settings are mainly useful for specific scenarios, but managing a global configuration is easier and more consistent.



### 4.3 Column configurations
The **ECS PrimeNG Table** allows you to define a variety of settings that control how each column behaves when displayed to users and what they are allowed to do with them.



#### 4.3.1 Data type
Columns can be configured to define how cell data is displayed and treated. The **ECS PrimeNG Table** supports five main data types, and choosing the appropriate type is important, as it also affects the filtering options available (column filtering is explained in later sections):
- **Text**: For data that should be treated as plain text.
- **Numeric**: For numerical values.
- **Boolean**: For yes/no (true/false) values.
- **Date**: For date values. The display format is controlled via the date formatting configuration described in previous sections.
- **List**: A specialized text variant designed for columns containing data separated by `";"`. This type is mainly intended for predefined filters. If not configured, the raw text will simply be displayed (predefined filters are explained in later sections).

> [!NOTE]  
> All data types support null (empty) values, allowing cells to remain blank if no data is available.



#### 4.3.2 Visibility
By default, all columns are visible. However, showing too many columns at once may overwhelm users, so you may want to hide some of them initially. This can be configured in the table setup.  

The table includes a built-in **column properties menu** (enabled by default), which allows users to show or hide columns at any time without needing to reload or reconfigure the table. This menu is accessible directly from the table interface and provides a simple checklist of all available columns. (Explained in more detail in later sections.)  

You can also restrict visibility changes for specific columns. For example, some columns can be marked as **always visible**, preventing users from hiding them.  

Additionally, developers can define **utility columns** that remain hidden from the user interface. These columns (such as row IDs or internal references) are not only invisible to the end user but also excluded from the column properties menu, ensuring they remain hidden while still being available for internal logic or processes.




#### 4.3.3 Horizontal and vertical alignment
Each column can be configured to control how the data inside its cells is aligned, both horizontally and vertically.  

**Horizontal alignment options:**  
- **Left**: Aligns the content to the left side of the cell. Commonly used for text values.  
- **Center**: Centers the content in the cell. Default option.  
- **Right**: Aligns the content to the right side of the cell. Typically used for numeric data.  

**Vertical alignment options:**  
- **Top**: Aligns the content to the top of the cell.  
- **Middle**: Centers the content vertically. Default option.  
- **Bottom**: Aligns the content to the bottom of the cell.  

By default, columns are set to **center** horizontally and **middle** vertically.  

Users can change the alignment of any column using a dedicated column properties menu (explained in later sections). You can restrict this behavior in two ways:  
- **Restrict per column**: Prevent users from changing the horizontal and/or vertical alignment for specific columns.  
- **Disable globally**: Turn off the entire Column Properties menu so users cannot adjust alignment or any other column settings.  



#### 4.3.4 Overflow Behaviour
When the content of a cell exceeds the available space, the **overflow behaviour** determines how the data is displayed. The available options are:

- **Hidden**: Extra content is clipped and not displayed. This avoids breaking the table layout but may hide part of the information.  
- **Wrap**: The content automatically continues on a new line within the same cell, ensuring all data is visible but potentially increasing the row height.  

By default, the overflow behaviour for all columns is set to **Hidden**.  

Users can adjust the overflow behaviour of each column through the **column properties menu** (explained in later sections). This feature can be controlled in two ways:  
- **Restrict per column**: Prevent users from changing the overflow behaviour for specific columns.  
- **Disable globally**: Turn off the entire column properties menu so users cannot modify overflow behaviour or any other column settings.  



#### 4.3.5 Modify Column properties menu
By default, the table includes a **column properties button** located at the top-left corner. This button opens a modal that allows users to customize how columns are displayed and formatted.

This menu can be **disabled globally** if you do not want users to make any modifications to column properties or visibility.

When enabled, clicking the button opens a modal window that provides the following features:
- **Column list**: Displays all available columns in the table (excluding **utility columns**).  
- **Search bar**: A global search input to filter columns by name. Columns are listed alphabetically (A–Z).  
- **Editable properties** (if not locked for the column):
  - Visibility (show/hide columns).  
  - Horizontal alignment.  
  - Vertical alignment.  
  - Cell overflow behaviour.  

At the bottom-right of the modal, users can either **Cancel** or **Apply** their changes:
- If visibility changes are applied, the table will **refresh data** and reset filters and sorting.  
- If only formatting changes (alignment or overflow) are applied, the table will **preserve filters and sorting** without refreshing data.  



#### 4.3.6 Resize



#### 4.3.7 Reorder


#### 4.3.8 Frozen



#### 4.3.9 Descriptions





#### 4.3.10 Sorting
By default, all columns are sortable. You can disable sorting on specific columns if you do not want users to sort them.

**How sorting works:**
- Click a column header once to sort in **ascending order**.
- Click the same header a second time to sort in **descending order**.
- Click a third time to **sort ascending again**.

If a different column is clicked while another column is already sorted, the new column will be sorted in ascending order, and the previous column will have its sorting cleared.

The table supports **multi-column sorting**: users can hold the **Ctrl** key while clicking multiple column headers to sort by several columns simultaneously.

You can also define a **default sorting** for one or more columns when the user has not applied any sorting.

In the **top-left corner of the table**, there is a button to **clear all sorting** applied by the user. This button is enabled only when at least one user-applied sorting is active.
<p align="center">
  <img src="https://github.com/user-attachments/assets/9b2cd936-7bd0-4054-9940-fa7dbc53a20f" alt="Clear sorting button">
</p>

> [!NOTE]
> If no columns allow sorting, you may hide this button. However, it is **not recommended** to hide it if some columns are sortable, as this could confuse users by preventing them from resetting the sorting.


#### 4.3.7 Filtering


---
## 5 Feature-to-Code mapping



---
## 6 Technical overview



---
## 7 Component reference


---
## 8 Editing ECS PrimeNG table and integrating locally


---
## 4 "PrimeNG Table reusable component" all features
The aim of this chapter is to explain all the things that have to be taken into account and what different functionalities are included (and how to implement them).


### 4.1 Starting with a simple table
Assuming you have already done all the needed setup steps in your project and you already have your mapped models that you wish to work with ready, each time you want to add a new table to your application you should do the following things in order:
1. Create a DTO / Projection of the final data that must be shown in the table. For example if you want to show 3 columns that are strings, you should have a DTO with 3 strings and an additional property that will act as the row ID. The previously DTO / Projection needs to have every of its elements decorated with the "PrimeNGAttribute", which is used to define the type of data of the column and how you want the column to behave in the front-end.
2. Create an endpoint in your API that will be used later on in the front-end to retrieve all the columns information (and the date mask).
3. Create an endpoint in the API that will be used by the table in the front-end to request the data.
4. In your desired component's HTML, add the table and define the needed properties. Additionally, in the TypeScript part of your component you might need to define additional things depending on what you want to show in the table and what features you wish to use.

We will cover in this section all these steps.


#### 4.1.1 Creating a basic DTO / Projection
As mentioned before, lets assume we want to have 3 columns. One of type string, another one of type numeric and a third one of type bool. Our DTO / Projection will look something like this:
```C#
public class TestDto {
	[PrimeNGAttribute(sendColumnAttributes: false)]
	public Guid RowID { get; set; }

	[PrimeNGAttribute("Username")]
	public string Username { get; set; } = null!;

	[PrimeNGAttribute("Money", dataType: EnumDataType.Numeric)]
	public decimal Money { get; set; }

	[PrimeNGAttribute("Has a house", dataType: EnumDataType.Boolean)]
	public bool House { get; set; }
}
```

Every DTO / Projection should contain the "RowID" property (must use this exact name), specially if you want to perform actions with the rows.

As it can be seen from the "TestDto" class, each property must use the "PrimeNGAttribute" decorator. This decorator ensures that when using the function that builds all the column data that is needed in the front-end, it includes all the relevant information to work properly.

"RowID" has the "sendColumnAttributes" set to false, since this will make sure that the RowID contents is not shown in the table, but is available in the front-end to retireve its data to perform actions.

"Username" has only a string declared that matches the first argument of the "PrimeNGAttribute", which is the column name. This is the name that will be displayed in the column header. There is no need to declare what data type is, since by default the data type that will be used is "Text".

"Money", apart from the column header title, needs to have its data type explicitly declared, since it will be different than "Text".

"House", has its column header title and data type declared in the "PrimeNGAttribute" decorator.

> [!IMPORTANT]  
> There are four types of data types handled by the table that affect the filters that are shown to the user. The four data types are:
> - **Text**: Used to handle strings.
> - **Numeric**: For numbers like longs, decimals, ints...
> - **Boolean**: For bool type values.
> - **Date**: For datetime data types. This data type can have some additional customization which is explained in later chaptets.

> [!IMPORTANT]  
> The order in which you include your columns in the DTO is important, since they will be place in order from left to right in the table the first time the table loads. This order could be overriden by frozen columns (explained in further sections of this guide).

> [!NOTE]  
> Including the property "RowID" is optional. It is only needed if you are going to perform actions with your rows or if you are going to use the row selection feature.

> [!WARNING]  
> Please, make sure that every element in the DTO / Projection has a PrimeNGAttribute, or the column fetching endpoint won't work properly!

> [!CAUTION]
> Manage your ID of each row in a property that must be exactly named "RowID". This is specially important if you are also going to use the row selection feature.

> [!CAUTION]
> Do not include a property in your DTO / Projection named "Selector", specially if you will be using the row selection feature in a table, as this can cause issues since this is the virtual column name that is used behind the scenes to manage this scenario.


#### 4.1.2 Creating the column data endpoint
This endpoint in your controller will be used to fetch all the columns information that is used by the table. To do so, you just need to create and endpoint that calls "GetColumnsInfo" from the "PrimeNGHelper" and provide the DTO / Projection that you creted in previous steps, and the function will do the rest for you. From the [MainController.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Controllers/MainController.cs) in the example project, and endpoint to fetch all the column data needed would look like this:
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


#### 4.1.3 Creating the table data endpoint
Another endpoint that must be created in the API is the one responsible of building the query dynamically and then retrieving just the needed data from the database. An example on how to do this can be found in [MainController.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Controllers/MainController.cs) in the example project under the endpoint "TestGetData". This is how it looks:
```c#
public IActionResult TestGetData([FromBody] PrimeNGPostRequest inputData) {
    try {
        if(!PrimeNGHelper.ValidateItemsPerPageSizeAndCols(inputData.PageSize, inputData.Columns)) { // Validate the items per page size and columns
            return BadRequest("Invalid page size or no columns for selection have been specified.");
        }
        IQueryable<TestDto> baseQuery = _context.TestTables
            .AsNoTracking()
            .Include(t => t.EmploymentStatus)
            .Select(
                u => new TestDto {
                    RowID = u.Id,
                    CanBeDeleted = u.CanBeDeleted,
                    Username = u.Username,
                    Age = u.Age,
                    EmploymentStatusName = u.EmploymentStatus != null ? u.EmploymentStatus.StatusName : null,
                    Birthdate = u.Birthdate,
                    PayedTaxes = u.PayedTaxes
                }
            );
        List<string> columnsToOrderByDefault = new List<string> { "Age", "EmploymentStatusName" };
        List<int> columnsToOrderByOrderDefault = new List<int> { 0, 0 };
        return Ok(PrimeNGHelper.PerformDynamicQuery(inputData, baseQuery, stringDateFormatMethod, columnsToOrderByDefault, columnsToOrderByOrderDefault));
    } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
        return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
    }
}
```

The strategy is to first check, by calling the function "ValidateItemsPerPageSizeAndCols", that we have been requested and allowed items per page number (the allowed values are defined in the variable "allowedItemsPerPage" under [PrimeNGHelper.cs](Backend/PrimeNGTableReusableComponent/PrimeNGTableReusableComponent/Services/PrimeNGHelper.cs)) and that at least a column to be retrieved has been requested.

The second part is to build and IQueryable that uses the same type as the DTO / Projection that we used to provide the columns. It is strongly recomended that you keep your base IQueryable as plain as possible, try to avoid delegating joins or any other type of complex operations to Entity Framework. As you can see from the example, the base IQueryable is very plain being the only "complex" operation fetching the string of the "employmentStatusName" from the  "EmploymentStatusCategories" table. If your IQueryable can't be very plain, it might be a good strategy to consider generating a view in the database and map the entity to the view, instead of trying to delegate the relation builder to Entity Framework, since sometimes it could generate complex queries that can't be solved by the Linq query builder.

Once you have your base IQueryable ready, the last part is to simply call the "PerformDynamicQuery" passing your base query. The "PerformDynamicQuery" accepts the following arguments:
- **inputData:** This is the PrimeNGPostRequest object that should have arrrived from the frontend as part of the BODY when calling the endpoint. It contains multiple data related to the filter rules requested, the columns that should be shown...
- **baseQuery:** The IQueryable that you have prepared before.
- **stringDateFormatMethod:** The exposed database function "FormatDateWithCulture" that is used if a global filter has been specified and if the columns is of type "date". You should have this function already available for you if you followed the setup steps as "private static readonly MethodInfo stringDateFormatMethod".
- **defaultSortColumnName:** If no sort order operations have been specified by the user, the specified columns will be used to perform the sort (if it has been specified). The columns must have the same name as it appears in the DTO / Projection (the property name, not the column header name). This is a list of strings.
- **defaultSortOrder:** The sorting order to be done to the "defaultSortColumnName" if it needs to be applied. If value is 1 it will be ascending, if not it will be descending. This is a list of ints.

> [!NOTE]  
> The arguments in "PerformDynamicQuery" of "defaultSortColumnName" and "defaultSortOrder" should both have the same list length.

The "PerformDynamicQuery" function will do all these steps in order:

1. Perform the sorting. The sorting will apply all the sorting rules specified by the user that are located in the PrimeNGPostRequest object. If no sorting rules have been given, and if a "defaultSortColumnName" has been given, a default sorting will be applied. Otherwise, no sotring will be performed.
2. Count the total elements that are available before applying the filtering rules by delegating a COUNT operation of all the records to the database engine.
3. Apply the global filter, if any have been specified in the PrimeNGPostRequest object, to each column that can have the global filter applied. Take into account that the global filter is one of the most costly operations launched to the database engine, since basically it performs a LIKE = '%VALUE_PROVIDED_BY_USER%' to each column. The more columns and data that you have, the slower the query will be. There is an option in the frontend to disable the global filter, which is recommendend when the dataset is very large or there is a large number of columns that could be affected by the global filter.
4. Apply the filter rules per column. From the PrimeNGPostRequest it will get all the filter rules per column that must be applied (it included the pedifined filter rules). In this step the IQueryable will be added all the additional rules that need to be done to reflect all the filtering operations that the user has requested.
5. Count the total elements that are available after applying the filtering rules by delegating a COUNT operation of all the records to the database engine with the current built query.
6. Calculate the number of pages that are available (taking into account the items per page selected and the filtering rules) and determine if the user need to be moved from his current page. For example, if user was in page 100 and suddenly, due to the filters that are applied, only 7 pages are available, the returned current page will be changed to page 7. The frontend will handle this situation and move the user to said page accordingly.
7. Perform the dynamic select and get the needed elements. In this step, the IQueryable will be added a SELECT statement to just get the columns that we are interested in, and the the IQueryable will be converted to a ToDynamicList, which will basically launch all the query that we have been building in the previous steps to the database. In this step, we would have delegated all operations to the database, and in the backend we will be given a dynamic list with the size of the number of items that must be shown in the current page and with only the selected columns that the user has requested (and the columns which have "sendColumnAttributes" set to false).
8. The function will end by returning us a PrimeNGPostReturn, which must be returned to the frontend.

The PrimeNGPostReturn object contains:
- The current page the user should be at.
- The number of total records that are available before performing the filtering rules.
- The number of total records that are available after performing the filtering rules.
- The data that will be sent to the frontend.

When the PrimeNGPostReturn is retrieved by the table component in the frontend, it will do all the necesarry operations to update what is shown to the user in the table.

> [!TIP]
> It is strongly recommended that the IQueryable has the "AsNoTracking" declaration, since we don't want to track the entity for any modified data and this gives a slight performance boost. 


#### 4.1.4 Implementing a new table in the frontend
Once you have at least created an endpoint to fetch the columns and the data in you API (we are ye assuming an scenario where you don't need predifined filters), you can generate a new component on your frontend through Visual Studio Code terminal (using CMD, not the default powershell terminal that opens up) by first doing "cd" to you frontend root folder and then executing the command:
```sh
ng generate c OPTIONAL_PATH_FROM_ROOT_FOLDER_TO_GENERATE_COMPONENT YOUR_COMPONENT_NAME
```

This will generate you component inside a folder with four files. Assuming that to start, you only want to show some data the moment the component is loaded, in the file that has been generated with an ".html" extension you must add:
```html
<ecs-primeng-table #dt
    columnsSourceURL="YOUR_API_ENDPOINT_TO_FETCH_COLUMNS"
    dataSoureURL="YOUR_API_ENDPOINT_TO_FETCH_DATA>
</ecs-primeng-table>
```

With only this, when starting the backend and the the frontend and navigating to the component, a table will be shown and it will automatically get the columns and data the moment the new component is entered. With this you would have completed a simple table that can be used to show data on the frontend with lots of personalization options to the user.

In the above example, the "ecs-primeng-table" has been given the template reference variable "dt", which is optional to do. This is needed when you want to access from the component exposed functions of "ecs-primeng-table". From the demo project, you should be aware that the endpoints of your API shouldn't be the complete URL, but rather the combination of what is already given in the variable "APIbaseURL" in the file [constants.ts](Frontend/primengtablereusablecomponent/src/constants.ts) and the endpoint part that you specify in the "ecs-primeng-table" component.


### 4.2 Date formating
Something that a first glance might sound simple but I've seen lots of developers struggle with this. Its important to know how you should handle your date storage and how you should display it to the end user.

My personal reccomendation, always store in your databases dates in UTC and (if using MSSQL) as a datetime2 type, even if you are not interested in saving the time part. Its a way to guarantee consistency when working with dates. This solution assumes that all your dates are stored in the database as datetime2 in UTC timezone.

If you need to show dates in a table, you don't need to do much more than just declaring in your DTO the appropiate row as date type and making sure that your date is stored in UTC. By default, in the front-end, it will be shown with the format "dd-MMM-yyyy HH:mm:ss zzzz", with the time zone "+00:00" and with the date culture "en-US".

This can be easily customized per user if you are storing their date preferences in your database (or if they have a way to select it and send it before fetching the table columns). In the previous example we called "GetColumnsInfo" in the backend passing it our DTO for it to prepare all our columns data that will be sent to the front-end. "GetColumnsInfo" can be also given three optional arguments to customize how a date is shown to a user. If before calling this function, you have a way to fetch the preferences of the user calling this endpoint, you can pass this arguments as shown in the following example:
```c#
[HttpGet("[action]")]
public IActionResult TestGetCols() {
    try {
        string dateFormat = "dd-MM-yyyy HH:mm zzzz"
        string dateTimezone = "+02:00"
        string dateCulture = "en-US"
        return Ok(PrimeNGHelper.GetColumnsInfo<TestDto>(dateFormat, dateTimezone, dateCulture)); // Get all the columns information to be returned
    } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
        return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
    }
}
```

This is a hardcoded example, normally you would get the userID and retrieve this date customization from the database. From the example, the date will be represented with the format "dd-MM-yyyy HH:mm zzzz" and in the time zone "+02:00". You don't need to do anything else, since this will be automatically handled for you and the user will see the date properly converted. From this example, if the date is stored in the database as "12-oct-2024 13:37:25", the user will see it in the table as "12-10-2024 15:37 GMT+02:00".

From the setup steps for implementing this reusable component, you might remember that there you had to created the database function [04 FormatDateWithCulture.txt](Database%20scripts/04%20FormatDateWithCulture.txt). This is actually not needed, since its only use is for being able to use the golbal filter functionality on columns that have the date type. The global filter tries to search things as a string, so this function makes a conversion of your date to a format that matches the date as you are showing it to the user in the frontend, taking into account the date format, timezone offset and culture that you wish to use. The database function needs to be exposed in the backend (as explained in previous sections) so that when the global filter is used, this function can be called with no issues. If for any reasons you were unable to use this function, the global filtered can be disabled in the date type columns to avoid errors when filtering.


### 4.3 Declaring header and row action buttons
This component allows you to easily define buttons which can be placed on the top right header of the table or in each row of data. In your component, you should define all the buttons that you want to have as an array of IprimengActionButtons (you need different arrays for the header buttons and another one for the row buttons). The IprimengActionButtons values that can be passed are:
- **icon:** If specified, it will show a PrimeNG icon. It has the capacity to show icons from PrimeNG or from other sources like Font Awesome. If you wish to show the "pi-address-book" from PrimeNG for example, you should put: "pi pi-address-book".
- **label:** If specified, it will show a label inside the button.
- **color:** The color property to be applied. The "color" references to the "severity" property of PrimeNG for the [button](https://primeng.org/button#severity).
- **condition:** A condition that must be met in order to show the button. It can be passed a function and the expected return is a boolean. If no condition is specified, the button will always show. If the button is in a row, the data of the row can be accessed (like for example the "ID").
> [!CAUTION]
> Do NOT ever trust that if a user can press a button that should only be shown under some condition, the action should be done. Always perform an additional final validation in the backend, since the exposed data in the frontend can be easily tampered with.
- **action:** The action that the button will perform when pressed. It can be passed a function and no return value is expected. If no action is specified, the button won't do anything when pressed.
- **tooltip:** If given, it will show a tooltip when the user hovers the mouse over the button.

> [!TIP]
> Buttons that are added into the IprimengActionButtons array that are then passed to the table, will be always drawn from left to right, meaning that the first button provided in the array will be in the most left part, while the last button will be the last button in the right.

> [!IMPORTANT]  
> If the button is in a row, the data of the row can be accessed, like for example the "rowID" which is useful to perform actions or check specific conditions. There is an example on how to do it in this section later on. Remember NOT to rely on data from columns that can be hidden from the user, since if the column is hidden, you won't have the data available in the front-end (this does not apply to columns with the "sendColumnAttributes" to false, since these columns are always sent and are safe to rely on for these operations).

From the example project here is an example on how you can specify buttons that are shown in the table. From the Typescript file [home.component.ts](Frontend/primengtablereusablecomponent/src/app/components/home/home.component.ts) we can see the following code fragment:
```ts
headerActionButtons: IprimengActionButtons[] = [
    {
        icon: 'pi pi-file',
        color: 'p-button-success',
        action: () => {
            this.sharedService.clearToasts();
            this.sharedService.showToast("info","Clicked on create a new record","Here you will for example show a modal to create a new record. Upon creating the record, you can do 'this.dt.updateDataExternal()' to refresh the table data and show the newly created record.");
        },
        label: "CREATE",
        tooltip: "Create new record"
    }
];
rowActionButtons: IprimengActionButtons[] = [
    {
        icon: 'pi pi-trash',
        tooltip: 'Delete record',
        color: 'p-button-danger',
        action: (rowData) => {
            this.sharedService.showToast("warn","Clicked on delete row",`The record ID is\n\n${rowData.rowID}\n\nThis button only appears if a condition is met. Remember that a backend validation should be done anyways because users can tamper with the exposed variables in the frontend.`);
        },
        condition: (rowData) => (rowData.canBeDeleted === true)
    }, {
        icon: 'pi pi-file-edit',
        tooltip: 'Edit record',
        color: 'p-button-primary',
        action: (rowData) => {
            this.sharedService.showToast("success","Clicked on edit row",`The record ID is\n\n${rowData.rowID}\n\nHere you could open a modal for the user to edit this record (you can retrieve data through the ID) and then call 'this.dt.updateDataExternal()' to refresh the table data.`);
        }
    }
];
```

From the above code, it can be seen that two different arrays have been created, one being "headerActionButtons" and the other one "rowActionButtons". In the header buttons we have one button that is always shown and it will execute the action of showing a toast message. In the row action buttons we have two buttons, were both will show a toast message including the "rowData.rowID" value. The delete button will be only shown under a specific condition, being "rowData.canBeDeleted === true".

Once the buttons have been defined in your component, you must pass them to the table in the HTML like so:
```html
<ecs-primeng-table #dt
    ...
    [headerActionButtons]="headerActionButtons"
    [rowActionButtons]="rowActionButtons"
    ...>
</ecs-primeng-table>
```

If at least a row action button has been provided, an additional column will be added to your table to show the row action buttons. There are some properties of this column that can be altered from their defaults through the HTML of your component, which are the following:
- **actionColumnName** (string): The title that will appear in the column header, by default is "Actions".
- **actionsColumnWidth** (number): A fixed width for this columns in pixels. By default is 150.
- **actionsColumnAligmentRight** (boolean): By default true. If true, this column will be placed at the right most part of your table. If false, it will be placed to the left of the table.
- **actionsColumnFrozen** (boolean): By default true. If true, this column will be frozen and follow the horizontal scroll if the table has a width longer than the component were it is drawn. If false, the column won't be frozen and act as a normal column.
- **actionsColumnResizable** (boolean): By default false. If false, the user can't resize the column. If true, the user will be able to resize this column.


### 4.4 Row selector
The goal of this feature is to allow the user to select rows and allow him to filter by rows that have been selected or rows that are not selected. From different components in the front-end, we can access the list of multiple "rowID" that the user could have selected and we can also subscribe to changes when the user changes the selection stauts of a row. The following image shows an example of how this column looks:
<p align="center">
  <img src="https://github.com/user-attachments/assets/2c1ba3b8-b939-4e17-840a-c7bb74fbf987" alt="Row selector example">
</p>


#### 4.4.1 Enabling and configuring the row selector
By default this feature is disabled and you need to activate it in each table that you wish to use it. To do so is as simple as in the HTML setting the variable "rowSelectorColumnActive" to true as shown in the next example:
```html
<ecs-primeng-table #dt
    ...
    [rowSelectorColumnActive]="true"
    ...>
</ecs-primeng-table>
```

Apart from activating the row selector, there are some additional properties of this column that can be modified through the HTML of your component, which are the following:
- **rowSelectorColumName** (string): The title that will appear in the column header, by default is "Selected".
- **rowSelectorColumnWidth** (number): A fixed width for this columns in pixels. By default is 150.
- **rowSelectorColumnAligmentRight** (boolean): By default true. If true, this column will be placed at the right most part of your table (before the actions column if present and if both are the same frozen type). If false, it will be placed to the left of the table (after the actions column if present and if both are the same frozen type).
- **rowSelectorColumnFrozen** (boolean): By default true. If true, this column will be frozen and follow the horizontal scroll if the table has a width longer than the component were it is drawn. If false, the column won't be frozen and act as a normal column.
- **rowselectorColumnResizable** (boolean): By default false. If false, the user can't resize the column. If true, the user will be able to resize this column.

An additional feature of this column, which is always active, is that it will show a filter button were the user will be able to filter by rows that are selected or unselected. By your side to have this feature working there is nothing that you need to do apart from making sure that in your back-end DTO you don't have a "Selector" property, since this could enter in conflict with this feature.


#### 4.4.2 Subscription to changes
The table component has an output which you can subscribe to for listening to changes when a user selects or unselects a row. To do so, in your component that is using the table, you first need to create a function in yor TypeScript that will be called when a user checks a row, for example:
```ts
rowSelect($event: any){
    if($event.selected){ // If the row has been selected
        this.sharedService.clearToasts();
        this.sharedService.showToast("info","ROW SELECT", `The row with ID ${$event.rowID} has been selected.`);
    } else { // If the row has been unselected
        this.sharedService.clearToasts();
        this.sharedService.showToast("info","ROW UNSELECT", `The row with ID ${$event.rowID} has been unselected.`);
    }
}
```

And now in the HTML of your component, you can call it like so:
```html
<ecs-primeng-table #dt
    ...
    (selectedRowsChange)="rowSelect($event)"
    ...>
</ecs-primeng-table>
```

With this subscription to "selectedRowsChange", each time a user changes the selection of a row, the even will be emitted and the "rowSelect" function will be triggered. The event variable contains the following:
- **selected** (boolean): True if the user has selected this row or false if it has been unselected.
- **rowID** (any): The ID of the affected row.


#### 4.4.3 Accesing the table component selected rows variable
Apart from subscribing to changes, something else that you can do is accesing a variable managed by the table component that contains all the row IDs of the currently selected rows. To achieve this, assuming that you have specified an alias for the table in your component's HTML as shown in previous example (it should be "dt"), you should go to the TypeScript of your component and do the following:
```ts
import { ViewChild, ... } from '@angular/core';
import { PrimengTableComponent, ... } from '../primeng-table/primeng-table.component';

export class YourClass {
    ...
    @ViewChild('dt') dt!: PrimengTableComponent; // Get the reference to the object table
    ...
}
```

By importing from "@angular/core" the "ViewChild", from "primeng-table.component" the "PrimengTableComponent" and calling the "ViewChild" as shown in the example, you should now be able to access the table exposed variables.

The variable that we are interested in is "selectedRows". This variable is an array that contains all the row IDs of the rows that are currently selected by the user. You could combine this with the subscription to changes shown before to, for example, log to console all the selected row IDs:
```ts
rowSelect($event: any){
    console.log(this.dt.selectedRows);
}
```

With this change in the "rowSelect" function from the "Subscription to changes" example, you can now log to console each time a user changes the selection value of a row.


### 4.5 Delay the table init or change the data endpoint dinamically
When you enter a component in your front-end that uses the table, by default, the table will fetch the columns from the configured endpoint and, if the column fetching was succesful, it will try and fetch the data afterwards. There might be scenarios were this behaviour is not ideal, since you might want to retrieve some data before the table loads. There is a way to disable the table from fetching the columns and afterwards the data upon entering a component and it can be changed in the HTML of your component that is using the table by setting the "canPerformActions" to "false" as shown below:
```html
<ecs-primeng-table #dt
    ...
    [canPerformActions]="false"
    ...>
</ecs-primeng-table>
```

With this value set to false, the table won't load anything until you explictly tell it to do so.

This will be useful for example for the predifined filters (what are predifined filters is explained in further chapters) if you want to set them up with values from your database instead of hardcoded values, or if you want to change were the data is fetched from.

In this section we will look at and example on how to change the data endpoint dinamically. To do so, we need to have a reference to the table element in the TypeScript part of your component (assuming its "dt"):
```ts
import { ViewChild, ... } from '@angular/core';
import { PrimengTableComponent, ... } from '../primeng-table/primeng-table.component';

export class YourClass {
    ...
    @ViewChild('dt') dt!: PrimengTableComponent; // Get the reference to the object table
    ...
}
```

Imagine that at any point you wish to change the endpoint, to do so, first we need to disable the table from performing actions (so it doesn't try and download the new data), we then need to update the endpoint variable and finally we can activate the table again (after waiting at least one step). An example function to do all this could be the following:
```ts
private _updateTableEndpoint(newEndpoint: string){
    this.dt.canPerformActions = false;
    this.dt.dataSoureURL = newEndpoint;
    setTimeout(() => {
        this.dt.canPerformActions = true;
        this.dt.updateDataExternal();
    }, 1);
}
```

With this function, you will now be able to update the endpoint of the table. You could also clear all filters and sorting applied before bringing the new data making these changes to the function:
```ts
private _updateTableEndpoint(newEndpoint: string){
    this.dt.canPerformActions = false;
    this.dt.dataSoureURL = newEndpoint;
    this.dt.clearFilters(this.dt, true); // Clear all active filters
    this.dt.clearSorts(this.dt, true); // Clear all active sorts
    setTimeout(() => {
        this.dt.canPerformActions = true;
        this.dt.updateDataExternal();
    }, 1);
}
```


### 4.6 Column sorting
By default, all columns that are shown in the front-end (with the exception of the actions and row selector column) can be sorted. When a column can be sorted, a user can perform in the header a first click to sort in ascending order, and a second click in the same column to sort in descensing order.

If a different column is clicked and the first one was in ascending order, the new clicked column will be sorted in ascending order and the first one will have it sorting cleared.

The table allows a multi-sorting feature to the user were he can hold the "Ctrl" key and then click multiple column headers to perform multi-sorting.

The table includes in the top left a button for clearing all sorting that has been done to the table. This button will be only be enabled when at least one sorting made by the user is active. The following image shows were this button is located at:
<p align="center">
  <img src="https://github.com/user-attachments/assets/9b2cd936-7bd0-4054-9940-fa7dbc53a20f" alt="Clear sorting button">
</p>

If for any reason, you want to hide this button, you can do so by in in your component HTML that is using the table, setting the variable "showClearSorts" to false.
```html
<ecs-primeng-table #dt
    ...
    [showClearSorts]="false"
    ...>
</ecs-primeng-table>
```

If you wish to disable the possibility of a user sorting an specific column, you can do so by modifying your DTO in the back-end. For the specific column that you wish to disable the sorting, in the "PrimeNGAttribute" you just have to give a value of false to "canBeSorted" as shown in the next example:
```c#
[PrimeNGAttribute("Example column", canBeSorted: false, ...)]
public string? ExampleColumn { get; set; }
```

By doing this, when the user clicks the header of the column "Example column", the column won't be sorted. Also, the sorting icon in the column header will no longer be shown.


### 4.7 Column filter
By default all columns in the table can be filtered (except the row actions column). This feature allows the user to select in the column header the filter icon to open up a small modal were he can put what filters shall apply to the column as shown in the image below: 
<p align="center">
  <img src="https://github.com/user-attachments/assets/ef575f1b-3f0d-4bda-9825-b49c1d8ae90c" alt="Filter menu not boolean">
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/99aa70bb-1988-49d8-a547-efc0334daa49" alt="Filter menu boolean">
</p>

Depending on the data type that you have configured in the backend for each column in the DTO, the filter menu will show different options.

All the filter menus, except for bool data type, show in the upper part the options "Match all" or "Match any", being the default selected "Match all". "Match all" means that only the records that match all rules specified in the column shall be reurned (the equivalent to an AND operator in SQL), where as "Match any" will lookup for any records that match any of the defined filtering rules in that column (the equivalent to an OR operator in SQL).

The user can define up to two different rules per column, except for the bool data type were he can only filter by "true", "false" or "both". Inside those rules, the user can select a different ruleset to lookup by, being the different options depending on the column data type as follows:
- **EnumDataType.Text**:
    - Starts with
    - Contains
    - Not contains
    - Ends with
    - Equals
    - Not equals
- **EnumDataType.Numeric**:
    - Equals
    - Not equals
    - Less than
    - Less than or equal to
    - Greater than
    - Greater than or equal to
- **EnumDataType.Date**:
    - Date is
    - Date is not
    - Date is before
    - Date is after
	
The date filters don't take into account the time, just the date. So for example, if the user selects to filter by "Date is" with the value "23-Sep-2024", it will return all records that have in that column a date between "23-Sep-2024 00:00:00" and "23-Sep-2024 23:59:59". The timezone conversion is already managed by the table so you don't have to worry about it, so for example, if a user is viewing the date in the timezone GMT+02:00, in UTC it will filter by "23-Sep-2024 02:00:00" and "24-Sep-2024 01:59:59".

The table includes in the top left a button for clearing all filters that has been done to the table (including the predifined filters and global filters that are explained later on). This button will be only be enabled when at least one column filter, predifined filter or global filter made by the user is active. The following image shows were this button is located at:
<p align="center">
  <img src="https://github.com/user-attachments/assets/b6a3b33c-c03c-4ccf-8ca6-d475c74676d4" alt="Clear filters button">
</p>

If for any reason, you want to hide this button, you can do so by in in your component HTML that is using the table, setting the variable "showClearFilters" to false.
```html
<ecs-primeng-table #dt
    ...
    [showClearFilters]="false"
    ...>
</ecs-primeng-table>
```

If you wish to disable the possibility of a user filtering an specific column, you can do so by modifying your DTO in the back-end. For the specific column that you wish to disable the filtering feature, in the "PrimeNGAttribute" you just have to give a value of false to "canBeFiltered" as shown in the next example:
```c#
[PrimeNGAttribute("Example column", canBeFiltered: false, ...)]
public string? ExampleColumn { get; set; }
```

By doing this, the column won't no longer have in the header the filter icon.


### 4.8 Column predfined filter
You might have some scenarios were you would like to limit the filter options that the user has available to a list of the only possible values that the column could have. This reusable component offers you a way to do so. 

> [!CAUTION]
> Do not use this feature on columns were there could be lots of different values, since this could lead to performance issues. This feature is designed for columns with a small variety of values.

There are two strategies when defining the predifined filter which are:
- Hardcoding the list of possible values in the front-end. An example of this could be if you have a small list of know values like for example "Open" and "Closed".
- Fetching the list of possible values in the front-end from an endpoint of the back-end before loading the table.

No matter what of the two strategies you follow, first of all, if you want to define the predifined filters in the TypeScript of your component you must create a dictionary and provide the N amount of predifined lists that you are going to use. An example of this could be done to manage two predifined filter list in the same table is as follows:
```ts
import { IPrimengPredifinedFilter } from '../../interfaces/primeng/iprimeng-predifined-filter';

export class YourClass {
    ...
    listOfPredifinedValues1: IPrimengPredifinedFilter[] = [];
	listOfPredifinedValues2: IPrimengPredifinedFilter[] = [];
    myPredifinedFiltersCollection: { [key: string]: IPrimengPredifinedFilter[] } = {
        'nameOfList1': this.listOfPredifinedValues1,
		'nameOfList2': this.listOfPredifinedValues2
    };
    ...
}
```

And in the HTML of your component:
```html
<ecs-primeng-table #dt
    ...
    [predifinedFiltersCollection]="myPredifinedFiltersCollection"
    ...>
</ecs-primeng-table>
```

Now the table has available two lists of predifined filters that we can use which are "nameOfList1" and "nameOfList2" (although they actually don't hold any data). To map the columns to the different predfined lists that we have just setup, we need to do it in the DTO in the back-end as shown in the following code fragment:
```c#
[PrimeNGAttribute("Example column 1", filterPredifinedValuesName: "nameOfList1", ...)]
public string? Column1 { get; set; }

[PrimeNGAttribute("Example column 2", filterPredifinedValuesName: "nameOfList2", ...)]
public string? Column2 { get; set; }
```

As you can see, the "filterPredifinedValuesName" must match the name entry of the dictionary that has been created in the front-end of our component that will be using the table. With all this, technically our predfined filters should already work, but there is not much that we can do with them right now since they are both empty. You should now populate them with the corresponding value of what you want to use. The next subsections describe how you can populate a "IPrimengPredifinedFilter" array to represent your data in different ways when drawn in the table. Take into account that you can modify different ways of representing your data, for example, you can combine images with text.

For the table component being able to match the options with the cell data, the value sent by the backend for a cell, must match the "value" property of one of the items of the "IPrimengPredifinedFilter" array.

In the front-end, when the user presses the filter button in a column with predifined values, a small modal will be shown with the option to select one or more values to filter by. Additionally, the modal will include a search bar.

> [!NOTE]
> If a list of values in a column could be null, this possibility does not need to be added to the "IPrimengPredifinedFilter" array. The table won't draw any value in null values.


### 4.8.1 Column predfined filter - Simple text
Imagine that you have the following possible values in a column:
- Ok
- Warning
- Critical

If you wish to just represent them as text, your "IPrimengPredifinedFilter" list should be populated similar to the following example in your TypeScript code:
```ts
examplePredfinedFilter: IPrimengPredifinedFilter[] = [
    {
        value: "backendValueForOK",
        name: "OK",
        displayName: true
    }, {
        value: "backendValueForWarning",
        name: "Warning",
        displayName: true
    }, {
        value: "backendValueForCritical",
        name: "Critical",
        displayName: true
    }
];
```
> [!IMPORTANT]  
> It is recommended that from the "IPrimengPredifinedFilter" array, the property of "value" and "name" match, so that the user can use the global filter, since what is displayed in the front-end is the "name", and what is used by the global filter is "value".

If from the demo project we modify the script that retrieves the values of the different employment status to be displayed as a simple text, how the table will shown them to the user is as follows:
<p align="center">
  <img src="https://github.com/user-attachments/assets/dfaf6c9b-c860-44d7-a135-e3293986bdb1" alt="Predifined filter - simple text">
</p>


### 4.8.2 Column predfined filter - Tags
Imagine that you have the following possible values in a column, that you wish to represent in a tag with the following colors:
- Ok (With a green tag)
- Warning (With an orange tag)
- Critical (With an red tag)

To achieve this your "IPrimengPredifinedFilter" list should be populated similar to the following example in your TypeScript code:
```ts
examplePredfinedFilter: IPrimengPredifinedFilter[] = [
    {
        value: "backendValueForOK",
        name: "OK",
        displayTag: true,
        tagStyle: {
            background: 'rgb(0, 255, 0)'
        }
    }, {
        value: "backendValueForWarning",
        name: "Warning",
        displayTag: true,
        tagStyle: {
            background: 'rgb(255, 130, 30)'
        }
    }, {
        value: "backendValueForCritical",
        name: "Critical",
        displayTag: true,
        tagStyle: {
            background: 'rgb(255 , 0, 0)'
        }
    }
];
```
> [!IMPORTANT]  
> It is recommended that from the "IPrimengPredifinedFilter" array, the property of "value" and "name" match, so that the user can use the global filter, since what is displayed in the front-end is the "name", and what is used by the global filter is "value".

If we launch the demo project, it already shows the column of "Employment status" as tas with different colors. Here is an example of how it looks:
<p align="center">
  <img src="https://github.com/user-attachments/assets/49d197e0-1081-455e-bb78-1172cc65e3ab" alt="Predifined filter - tags">
</p>


### 4.8.3 Column predfined filter - Icons
WIP
> [!IMPORTANT]  
> If you are just going to show icons in a predifined filter, it is strongly recommended that in the DTO in the backend you set in the column "PrimeNGAttribute" the "canBeGlobalFiltered" to "false", so that the global filter doesn't try to filter by this column that is not showing any text.


### 4.8.4 Column predfined filter - Images
WIP
> [!IMPORTANT]  
> If you are just going to show images in a predifined filter, it is strongly recommended that in the DTO in the backend you set in the column "PrimeNGAttribute" the "canBeGlobalFiltered" to "false", so that the global filter doesn't try to filter by this column that is not showing any text.


### 4.9 Global filter
The global filter is enabled by default in all columns of your table, except for bool data types and the actions column were this filter will be never applied. The global filter is located on the top right of your table headers as shown in the image below:
<p align="center">
  <img src="https://github.com/user-attachments/assets/117d4917-45fc-4330-97fd-739322a5ebf4" alt="Global filter">
</p>

When the user writes a value in the global filter text box, after a brief delay of the user not changing the value, a filter rule will be launched to the table were basically, the global filter will try to filter each individual column perfoming a LIKE '%VALUE_INTRODUCED_BY_USER%', which basically means that any match of that value introduced by the user (doesn't matter in which position of the cell) will be returned. When a value is written to the global filter, at the left of the text box an "X" icon will appear, that when pressed by the user, it will clear the global filter.

Additionally, as seen in the previous image, the global filter will underline with yellow each part of the cell were the value that is introduced by the user matches.

As in the column filter feature, the user has also the option to clear all filters by pressing the clear filters button when it is enabled (it is enabled if at least a column filter, a predifined filter or a global filter is active).

If for any reason, you want to hide the global filter search bar, you can do so by in in your component HTML that is using the table, setting the variable "globalSearchEnabled" to false.
```html
<ecs-primeng-table #dt
    ...
    [globalSearchEnabled]="false"
    ...>
</ecs-primeng-table>
```

The properties that you can modify in the HTML related to the global filter are the following:
- **globalSearchEnabled** (boolean): By default true. If true, the global search text box will be shown in the top right of your table. If false, it won't be shown.
- **globalSearchMaxLength** (number): By default 50. The maximun number of characters that the user can introduce in the global search text box.
- **globalSearchPlaceholder** (string): by default "Search keyword". This is a placeholder text shown when the user hasn't introduced any value to the global filter yet.

If you wish for a column to ignore the global filter, you can do so by modifying your DTO in the back-end. For the specific column that you wish to ignore the global filter, in the "PrimeNGAttribute" you just have to give a value of false to "canBeGlobalFiltered" as shown in the next example:
```c#
[PrimeNGAttribute("Example column", canBeGlobalFiltered: false, ...)]
public string? ExampleColumn { get; set; }
```

By doing this, the column won't take into account any global filters that should be applied to it. For the bool data type or columns that are hidden (or that have the "sendColumnAttributes" to false), this property is always false and they will never be affected by the global filter.

> [!NOTE]  
> The global filter search is case insensitive.

> [!IMPORTANT]  
> The global filter is very useful for users, but if has a downside. Since it performs a LIKE query per column (with the % at the start and at the end) which is one of the heaviest filters to perform in SQL, the more columns that there are shown at a given time (and that can be global filtered), the more time it will require to update the data shown when the global filter is updated.

> [!CAUTION]
> For date data types to work properly using the global filter, you need to have properly setup the database function **04 FormatDateWithCulture.sql** explained in previous sections and you also need to have permission of function execution in your database for the user that is going to execute the query. This is needed because said function, transforms the date to a string that can be filtered by. If for any reason you don't want dates to be global filtered, for each individual column that is of type date, you must set in the DTO the "canBeGlobalFiltered" to "false".


### 4.10 Pagination and number of results
At the footer of the table it is included a summary of the total results, results that are currently available (taking into account the filters) and the pagination.

In the pagination, the user can change the number of rows to display per page. The list of possible values is hardcoded in the table source code in the back-end in the **PrimeNGHelper.cs**. At the start of the file there is an array of integers named "allowedItemsPerPage" that contains the different values that are shown to the user in the front-end. This values could be updated if you need to, but because of how the code of this reusable component has been created, this change will affect all your tables.

in the paginator, the user can click the arrows or select a page number to navigate between pages.

This reusable table will automatically handle all the pagination and number of results aspects for you. This includes the following scenarios:
- When loading the table, the total number of pages will be computed based on the number of records that can be shown per page. Also, the total records will be computed and shown to the user in the table footer.
- If the user applies a filter, the total number of pages could be updated. The number of total records and how many records are available taking into account the filters will be also updated. This reusable component will also take into account that if the user was for example in a page 12, and now taking into account filters there are only 5 pages available, he will be moved to page 5.
- If the user changes a page, data displayed in the table is updated.


### 4.11 Column editor and setting up column initial properties
WIP


### 4.12 Column resize
By default, all columns can be resized. The user can put the mouse at the edge of the header of a column and the resize icon will appear. If the user holds the right clic when this icon appears, he can then move the mouse left or right to change the horizontal size of a column.

If you wish to disable this feature from a specific column, you can do so by modifying your DTO in the back-end. For the specific column that you wish to disable this feature from, in the "PrimeNGAttribute" you just have to give a value of false to "canBeResized" as shown in the next example:
```c#
[PrimeNGAttribute("Example column", canBeResized: false, ...)]
public string? ExampleColumn { get; set; }
```


### 4.13 Column reorder
By default, all columns can be reorder. The user can put the mouse inside the header of a column and the and the move icon will appear. If the user holds the right clic when this icon appears, he can then move the column to be before or after some specific columns. The frozen columns (explained further in this guide) will be before or after (depending if they are frozen left or right) from the unfrozen columns.

If you wish to disable this feature from a specific column, you can do so by modifying your DTO in the back-end. For the specific column that you wish to disable this feature from, in the "PrimeNGAttribute" you just have to give a value of false to "canBeReordered" as shown in the next example:
```c#
[PrimeNGAttribute("Example column", canBeReordered: false, ...)]
public string? ExampleColumn { get; set; }
```


### 4.14 Frozen columns
By default, columns are not frozen. You can change this behaviour for any column, except the row actions or row select columns which is done through the front-end in your component. To enable apart, from these two columns, to have addtinal frozen columns, in your DTO you have to add in the "PrimeNGAttribute" a value different from noone to "frozenColumnAlign", for example:
```c#
[PrimeNGAttribute("Example column", frozenColumnAlign: EnumFrozenColumnAlign.Left, ...)]
public string? ExampleColumn { get; set; }
```

This will make the "exampleColumn" to be frozen to the left of your table. To freeze the row actions column or the row selector, refer to the previous sections in this guide.


### 4.15 Column widths
By default all columns that are defined in the backend will have a width of 0px. This will be treated in the front-end to delegate the width to be automatically determined by the PrimeNG table component. However, this behaviour can be overriden if you wish to specify a fixed width of pixels to a column to start width. To define an initial width to a column, in your DTO you have to add in the "PrimeNGAttribute" a value different from 0 to "initialWidth", for example:
```c#
[PrimeNGAttribute("Example column", initialWidth: 150, ...)]
public string? ExampleColumn { get; set; }
```

This will make the "exampleColumn" to start with a width of 150 pixels.


### 4.16 Column descriptions
This feature is configurable by column. In the back-end, in your DTO, to the column that you want to add a description to, in the "PrimeNGAttribute" you just have to give a value to "columnDescription", and this value will be shown in the frontend. Thats it :D

The table will manage the rest for you. An example would be as follows:
```c#
[PrimeNGAttribute("Employment status", columnDescription: "A predifined filter that shows the employment status of the user", ...)]
public string? EmploymentStatusName { get; set; }
```

It will be shown in the frontend like this:
![image](https://github.com/user-attachments/assets/488e8fe5-2fcb-42e3-80df-73717bf11cf5)


### 4.17 Cell tooltip
By default all cells (except the bool data type) will show a tolltip with their value when the user hovers the mouse over the cell for at least 0.7 seconds. If you wish to disable this feature, in the "PrimeNGAttribute" you just have to give a value of "false" to "dataTooltipShow" as shown in the next example:
```c#
[PrimeNGAttribute("Example column", dataTooltipShow: false, ...)]
public string? ExampleColumn { get; set; }
```

You can also customize the tooltip value that will be shown, so it matches the value of another clumn. This is usefull if you are sending a column with "sendColumnAttributes" to "false" and you wish to just display their value in the tooltip of another column. To do so, in the "PrimeNGAttribute" you need to give the name of the column (matching your DTO entry starting with a lowercase) to "dataTooltipCustomColumnSource" as shown in the next example:
```c#
[PrimeNGAttribute(sendColumnAttributes: false, ...)]
public string? TooltipSource { get; set; }

[PrimeNGAttribute("Example column", dataTooltipCustomColumnSource: "tooltipSource", ...)]
public string? ExampleColumn { get; set; }
```

In this example, when the user hovers over the cells of "ExampleColumn", the tooltip will show the data of the column "TooltipSource".

> [!CAUTION]
> The "dataTooltipCustomColumnSource" that is referenced must match the name of a column defined in the DTO starting with lowercase, since this is how it is then treated in the front-end.


### 4.18 Copy cell content
This is a feature that is enabled by default in the table. If a user has the mouse above a cell and holds the right click, after a brief delay, an informational toast message will be displayed in the top right of the screen indicating that the contents of the cell has been copied to the clipboard.

You can modify the amount of delay (which is given in seconds) or disbale this feature completely. To do so, in the HTML of your component, in the part were you are calling the table you should add the following:
```html
<ecs-primeng-table #dt
    ...
    [copyCellDataToClipboardTimeSecs]="1.5"
    ...>
</ecs-primeng-table>
```

This will modify the default value that the user need to hold down the mouse for the value of a cell to be cpied to the clipboard from 0.5 seconds to 1.5 seconds. If you put a value equal or less than 0, this feature will be disabled.


### 4.19 Compute table scroll height
WIP


### 4.20 Table views
WIP


> [!CAUTION]
> WORK IN PROGRESS. All the information below this point could be outdated.

---
---
---






### Preparing what is going to be shown in the frontend
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


### Implementing a new table in the frontend
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
- **tableStateSaveAs** (enum): Default value is noone and the possible values are sessionStorage, localStorage and databaseStorage. It indicated were the table state should be saved to.
- **tableStateSaveKey** (string): If specified (and tableStateSaveAs is different than noone), the save and load table state will be available. The key is used to save the table data with this reference. Different tables should have different keys so that they are now overwriten.

There is an output which you can access from other components:

- **selectedRows:** (any): A list of all the "id" selected by the user in a row. By default is empty but the user can add elements through the front-end if rowSelectorColumnActive is true.
