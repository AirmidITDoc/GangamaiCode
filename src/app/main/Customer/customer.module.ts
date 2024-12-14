import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VendorListComponent } from './vendor-list/vendor-list.component';


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
  },
  {
    path: "vendorlist",
    loadChildren: () => import("./vendor-list/vendor-list.module").then((m) => m.VendorListModule),
  }
]; 
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class CustomerModule { }
