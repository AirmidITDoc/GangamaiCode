import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
  


const appRoutes: Routes = [
    
  {
      path: "openingbalance",
       loadChildren: () => import("./opening-balance/opening-balance.module").then((m) => m.OpeningBalanceModule),

  },
  {
      path: "purchaseorder",
     loadChildren: () => import("./purchase-order/purchase-order.module").then((m) => m.PurchaseOrderModule),
     
  },
  {
      path: "goodreceiptnote",
      loadChildren: () => import("./good-receiptnote/good-receiptnote.module").then((m) => m.GoodReceiptnoteModule),
  },
  {
      path: "grnreturn",
      loadChildren: () => import("./grn-return/grn-return.module").then((m) => m.GRNReturnModule),
  },
  {
      path: "grnreturnwithoutgrn",
      loadChildren: () => import("./grn-return-without-grn/grn-return-withoutgrn.module").then((m) => m.GrnReturnWithoutgrnModule),
  },
  {
      path: "supplierpaymentstatus",
      loadChildren: () => import("./supplier-payment-status/supplier-payment-status.module").then((m) => m.SupplierPaymentStatusModule),
     // loadChildren: () => import("../purchase/config-manager/config-manager.module").then((m) => m.ConfigManagerModule),
  },
  {
      path: "grnreturnsupplierinformation",
      loadChildren: () => import("./grn-return-without-grn/grn-return-withoutgrn.module").then((m) => m.GrnReturnWithoutgrnModule),
  },
   
//   {
//     path: "browsesalesbill",
//     loadChildren: () => import("./browse-sales-bill/browse-sales-bill.module").then((m) => m.BrowseSalesBillModule),
// },

// {
//     path: "browsesalesreturnbill",
//     loadChildren: () => import("./browse-sales-return-bill/browse-sales-return-bill.module").then((m) => m.BrowseSalesReturnBillModule),
// },

// {
//     path: "browsesalesreceipt",
//     loadChildren: () => import("./browse-sales-receipt/browse-sales-receipt.module").then((m) => m.BrowseSalesReceiptModule),
// },
// {
//     path: "smsgenerationtool",
//     loadChildren: () => import("./sms-generation-tool/sms-generation-tool.module").then((m) => m.SmsGenerationToolModule),
// },

// {
//     path: "configmanager",
//     loadChildren: () => import("./config-manager/config-manager.module").then((m) => m.ConfigManagerModule),
// },

// {
//     path: "billcancellation",
//     loadChildren: () => import("./bill-cancelation/bill-cancellation.module").then((m) => m.BillCancellationModule),
// },

{
    path: "materialconsumption",
    loadChildren: () => import("./material-consumption/material-consumption.module").then((m) => m.MaterialConsumptionModule),
},

{
    path: "workorder",
    loadChildren: () => import("./work-order/work-order.module").then((m) => m.WorkOrderModule),
},

// {
//     path: "ratilergrnlistforaccount",
//     loadChildren: () => import("./retailer-grnlist-for-account/retailer-grnlist-for-account.module").then((m) => m.RetailerGrnlistForAccountModule),
// },

{
    path: "grnreturnnew",
     //loadChildren: () => import("./grn-return-new/grn-return-new.module").then((m) => m.GrnReturnNewModule),
     loadChildren: () => import("./deliverychallan/deliverychallan.module").then((m) => m.DeliverychallanModule),

},
];


@NgModule({
  declarations: [ ],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class PurchaseModule { }
