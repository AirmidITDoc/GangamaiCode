import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 

const appRoutes: Routes = [
    {
    path: "sales",
    loadChildren: () => import("./sales/sales.module").then((m) =>m.SalesModule),
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
    loadChildren :() =>import("./sales-hospital/sales-hospital.module").then ((m)=>m.SalesHospitalModule),
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
    path:"pharmacyclearence",
    loadChildren:() => import("./pharmacy-clearence/pharmacy-clearence.module").then((m)=>m.PharmacyClearenceModule),
    
  },
  {
    path:"discountaftersalesbill",
    loadChildren: () => import("./discount-after-sales-bill/discount-after-sales-bill.module").then((m)=>m.DiscountAfterSalesBillModule),
  },




  // {
  //   path:"ippharmacyadvance",
    
  // },
  // {
  //   path:"ippharmacyadvancereturn",
  //   loadChildren: () => import("./pharm-item-summary/pharmaitemsummary.module").then((m)=>m.PharmaitemsummaryModule),
  // },

  // {
  //   path:"pharmacyitemwisesupplierList",
  //   loadChildren:() => import("./pharmacy-item-wise-supplier-list/pharmacy-item-wise-supplier-list.module").then((m)=>m.PharmacyItemWiseSupplierListModule),
  // },
 
];


@NgModule({
  declarations: [  ],
  imports: [
    RouterModule.forChild(appRoutes)
  ]
})
export class PharmacyModule { }
