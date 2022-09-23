import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrSdkModule } from "@bloomreach/ng-sdk";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NewHomeComponent } from './new-home/new-home.component';
import { ButtonDesignComponent } from './button-design/button-design.component';
import { ArgonDashboardComponent } from './argon-dashboard/argon-dashboard.component';
import { ArgonHeaderComponent } from './argon-header/argon-header.component';
import { HtmlToPdfComponent } from './html-to-pdf/html-to-pdf.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewHomeComponent,
    ButtonDesignComponent,
    ArgonDashboardComponent,
    ArgonHeaderComponent,
    HtmlToPdfComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrSdkModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
