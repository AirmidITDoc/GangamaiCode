import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalespageRedirectComponent } from './salespage-redirect/salespage-redirect.component';
import { InpatientbrowseListComponent } from './inpatientbrowse-list/inpatientbrowse-list.component';


const appRoutes: Routes = [
  {
    path: "sales", 
    loadChildren :() =>import("./sales-hopsital-new/sales-hopsital-new.module").then ((m)=>m.SalesHospitalNewModule),
  }, 
  {
    path: "kenyasales", 
    loadChildren :() =>import("./sales-hospital-kenya/sales-hospitalkenya.module").then ((m)=>m.SalesHospitalkenyaModule),
  }, 
  {
    path: "browsesalesbill",
    loadChildren : () =>import("./brows-sales-bill/brows-sales-bill.module").then((m)=>m.BrowsSalesBillModule),
  },
  {
    path: "salesreturn",
    loadChildren: () => import("./sales-return/sales-return.module").then((m) =>m.SalesReturnModule),
  },
  {
    path:"ipsalesreturn",
    loadChildren:() => import("./ip-sales-return/ip-sales-return.module").then((m)=>m.IpSalesReturnModule),
  },
  {
    path:"matrialreceivedfrommainstore",
    //loadChildren : () =>import("./brows-sales-return-bill/brows-sales-return-bill.module").then((m)=>m.BrowsSalesReturnBillModule),
    loadChildren : () =>import("./material-received-from-department/material-received-from-department.module").then((m)=>m.MaterialReceivedFromDepartmentModule),
  },
  {
    path:"salesbillsettlement",
    loadChildren:() => import("./sales-return-bill-settlement/sales-return-bill-settlement.module").then((m)=>m.SalesReturnBillSettlementModule),
  },
  {
    path:"reorderlevelsummary",
    loadChildren: () => import("./reorderlevelsummary/reorderlevelsummary.module").then((m)=>m.ReorderlevelsummaryModule),
  },
  {
    path:"pharmaceadvance",
    loadChildren: () => import("./phar-advance/phar-advance.module").then((m)=>m.PharAdvanceModule),
  },
  {
    path:"saleshospital", 
    loadChildren: () => import("./sales/sales.module").then((m) =>m.SalesModule),

   // loadChildren :() =>import("./sales-hopsital-new/sales-hopsital-new.module").then ((m)=>m.SalesHospitalNewModule),
  },
  {
    path:"issuetracker",
    loadChildren: () => import("./issue-tracker/issue-tracker.module").then((m)=>m.IssueTrackerModule),
  },
  {
    path:"pharmaitemsummery",
    loadChildren: () => import("./pharm-item-summary/pharmaitemsummary.module").then((m)=>m.PharmaitemsummaryModule),
  },
  {
    path:"externalsalesreturn",
    loadChildren:() => import("./external-sales-return/external-sales-return.module").then((m)=>m.ExternalSalesReturnModule),
    
  },
  {
    path:"discountaftersalesbill",
    loadChildren: () => import("./sales-in-patient/sales-in-patient.module").then((m)=>m.SalesInPatientModule),
  },
   {  
    path:"salesreturninpatient",
    loadChildren: () => import("./sales-return-in-patient/sales-return-in-patient.module").then((m)=>m.SalesReturnInPatientModule),
  },
  {  
    path:"browseInPatientissuelist",
    loadChildren: () => import("./inpatientbrowse-list/inpatientbrowse-list.module").then((m)=>m.InpatientbrowseListModule),
  },
];


@NgModule({
  declarations: [   
    ],
  imports: [
    RouterModule.forChild(appRoutes)
  ]
})
export class PharmacyModule { }
