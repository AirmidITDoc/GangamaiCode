import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PharmItemSummaryComponent } from './pharm-item-summary/pharm-item-summary.component';


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
    loadChildren:() => import("./pharm-item-summary/pharmaitemsummary.module").then((m)=>m.PharmaitemsummaryModule),
  },
   {
     path:"pharmacyclearence",
     loadChildren:() => import("./pharmacy-clearence/pharmacy-clearence.module").then((m)=>m.PharmacyClearenceModule),
   },
  {
    path:"salesbillsettlement",
    loadChildren:() => import("./sales-return-bill-settlement/sales-return-bill-settlement.module").then((m)=>m.SalesReturnBillSettlementModule),
  },

  // {
  //   path:"pharmacyitemwisesupplierList",
  //   loadChildren:() => import("./pharmacy-item-wise-supplier-list/pharmacy-item-wise-supplier-list.module").then((m)=>m.PharmacyItemWiseSupplierListModule),
  // },
 
];


@NgModule({
  declarations: [ ],
  imports: [
    RouterModule.forChild(appRoutes)
  ]
})
export class PharmacyModule { }
