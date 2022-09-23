import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArgonDashboardComponent } from './argon-dashboard/argon-dashboard.component';
import { HomeComponent } from './home/home.component';
import { HtmlToPdfComponent } from './html-to-pdf/html-to-pdf.component';
import { NewHomeComponent } from './new-home/new-home.component';

const routes: Routes = [
  {
    path: 'home',
    component: NewHomeComponent
  },
  {
    path: 'old-home',
    component: HomeComponent
  },
  {
    path: 'argon-dashboard',
    component: ArgonDashboardComponent
  },
  {
    path: 'html-to-pdf-example',
    component: HtmlToPdfComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
