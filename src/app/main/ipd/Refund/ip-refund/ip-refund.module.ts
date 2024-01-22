import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ViewIPReunfofBillComponent } from './ip-browse-refundof-bill/view-ip-reunfof-bill/view-ip-reunfof-bill.component';
// import { IpRefundofbillComponent } from './ip-refundofbill/ip-refundofbill.component';

const appRoutes: Routes = [
   
  // {
  //     path: "iprefundofbill",
  
  //     loadChildren: () =>import("../ip-refund/ip-refundof-bill/").then((m) => m.IpSearchListModule),
  
  // },
  //  {
  //     path: "iprefundofadvance",
  
  //   loadChildren: () =>import("../ip-search-list/ip-search-list.module").then((m) => m.IpSearchListModule),
  // },

  {
    path: "browserefundofbill",
  loadChildren: () => import("./ip-browse-refundof-bill/ip-browse-refundof-bill.module").then((m) => m.IPBrowseRefundofBillModule),
  },
 {
    path: "browserefundofadvance",
  loadChildren: () => import("./ip-browse-refundof-advance/ip-browse-refundof-advance.module").then((m) => m.IPBrowseRefundofAdvanceModule),
  },
  {
    path: "iprefundofadvance",
    // loadChildren: () =>import("../ipd/ip-search-list/").then((m) => m.IpSearchListModule),
  },
];

@NgModule({
  declarations: [
 ],
  imports: [
      RouterModule.forChild(appRoutes),
  ]
})
export class IPRefundModule { }
