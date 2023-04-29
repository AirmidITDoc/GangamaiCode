import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: "admission",
    loadChildren: () =>
      import("./admission/admission.module").then((m) => m.AdmissionModule),
  },
  {
    path: "ipadvance",
    loadChildren: () =>
      import("./ip-search-list/ip-search-list.module").then((m) => m.IpSearchListModule),
  },
  {
    path: "ip-casepaper",
    loadChildren: () =>
      import("./ip-search-list/ip-search-list.module").then((m) => m.IpSearchListModule),
  },
  {
    path: "ip-addCharges",
    // loadChildren: () => import("./browse-ipd-payment-receipt/ipd-browse-paymentreceipt.module").then((m) => m.IpdBrowsePaymentreceiptModule),
  },
  // {
  //     path: "refund",
  //     loadChildren: () =>import("./refund/refund.module").then((m) => m.RefundModule),
  // },
  {
    path: "discharge",
    loadChildren: () =>
      import("./ip-search-list/ip-search-list.module").then((m) => m.IpSearchListModule),
  },
  {
    path: "dischargesummary",
    loadChildren: () =>
      import("./ip-search-list/ip-search-list.module").then((m) => m.IpSearchListModule),
  },
  {
    path: "add-billing",
    loadChildren: () =>
      import("./ip-search-list/ip-search-list.module").then((m) => m.IpSearchListModule),
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class IpdModule { }
