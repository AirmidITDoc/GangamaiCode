import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
  {
    path: "customerlist",
    loadChildren: () => import("./customer-information/customer-information.module").then((m) => m.CustomerInformationModule),
  }, 
  {
    path: "customerbill",
    loadChildren: () => import("./customer-bill-raise/customer-bill-raise.module").then((m) => m.CustomerBillRaiseModule),
  },
  {
    path: "issuetracker",
    loadChildren: () => import("./issue-tracker/issue-tracker.module").then((m) => m.IssueTrackerModule),
  }
]; 
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class CustomerModule { }
