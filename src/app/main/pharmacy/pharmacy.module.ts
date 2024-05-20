import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PharmItemSummaryComponent } from './pharm-item-summary/pharm-item-summary.component';
import { PharmaAdvanceComponent } from './pharma-advance/pharma-advance.component';
import { PharAdvanceComponent } from './phar-advance/phar-advance.component';



const appRoutes: Routes = [
    {
    path: "sales",
    loadChildren: () => import("./sales/sales.module").then((m) =>m.SalesModule),
  },
  {
    path: "salesreturn",
    loadChildren: () => import("./sales-return/sales-return.module").then((m) =>m.SalesReturnModule),
  },
  {
    path: "browsesalesbill",
    loadChildren : () =>import("./brows-sales-bill/brows-sales-bill.module").then((m)=>m.BrowsSalesBillModule),
  },
  {
    path:"matrialreceivedfrommainstore",
    loadChildren : () =>import("./brows-sales-return-bill/brows-sales-return-bill.module").then((m)=>m.BrowsSalesReturnBillModule),
  },
  {
    path:"ippharmacyadvance",
    loadChildren :() =>import("./ip-pharmacy-advance/ip-pharmacy-advance.module").then ((m)=>m.IpPharmacyAdvanceModule),
  },
  {
    path:"ippharmacyadvancereturn",
    loadChildren: () => import("./pharm-item-summary/pharmaitemsummary.module").then((m)=>m.PharmaitemsummaryModule),
  },
  {
    path:"ipsalesreturn",
    loadChildren:() => import("./ip-sales-return/ip-sales-return.module").then((m)=>m.IpSalesReturnModule),
  },
  //  {
  //    path:"pharmacyclearence",
  //    loadChildren:() => import("./pharmacy-clearence/pharmacy-clearence.module").then((m)=>m.PharmacyClearenceModule),
  //  },
   {
    path:"pharmacyclearence",
    loadChildren: () => import("./pharma-advance/pharma-advance.module").then((m)=>m.PharmaAdvanceModule),
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
  
  // {
  //   path:"pharmacyitemwisesupplierList",
  //   loadChildren:() => import("./pharmacy-item-wise-supplier-list/pharmacy-item-wise-supplier-list.module").then((m)=>m.PharmacyItemWiseSupplierListModule),
  // },
 
];


@NgModule({
  declarations: [PharAdvanceComponent],
  imports: [
    RouterModule.forChild(appRoutes)
  ]
})
export class PharmacyModule { }
