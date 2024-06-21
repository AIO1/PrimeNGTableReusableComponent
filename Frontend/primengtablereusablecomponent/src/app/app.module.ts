import { LOCALE_ID, NgModule } from '@angular/core';
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
import { DatePipe, registerLocaleData } from '@angular/common';

import es from '@angular/common/locales/es'; // Needed for scenarios were you would like to manage different locales from "en", like "es-ES"
registerLocaleData(es);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PrimengTableComponent } from './components/primeng-table/primeng-table.component';

@NgModule({
  declarations: [
    AppComponent,

    PrimengTableComponent,
    HomeComponent
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
    RippleModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-*' },
    provideHttpClient(withInterceptorsFromDi()), // Http provider
    MessageService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
