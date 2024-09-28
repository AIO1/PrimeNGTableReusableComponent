import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Needed by PrimeNG for browser animations

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // In angular 18 it is recommended to manage the http provider this way

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
import { DatePipe, registerLocaleData } from '@angular/common'; // registerLocaleData import is optional. Needed for scenarios were you would like to manage different locales from "en-US", like "es-ES".

import es from '@angular/common/locales/es'; // Optional. Needed for scenarios were you would like to manage different locales from "en-US", like "es-ES".
registerLocaleData(es); // Optional. Needed for scenarios were you would like to manage different locales from "en-US", like "es-ES".

// Optional imports to show the loading indicator
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Component imports
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { PrimengTableComponent } from './components/primeng-table/primeng-table.component';

@NgModule({
  declarations: [
    AppComponent,

    PrimengTableComponent,
    HomeComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Needed by PrimeNG for browser animations
    AppRoutingModule,

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
    CheckboxModule,

    DialogModule, // Optional import to show the loading indicator in HTTP calls
    ProgressSpinnerModule // Optional import to show the loading indicator in HTTP calls
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // Http provider
    MessageService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
