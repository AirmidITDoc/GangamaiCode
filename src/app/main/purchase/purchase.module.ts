import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    },
    {
        path: "grnreturnsupplierinformation",
        loadChildren: () => import("./grn-return-without-grn/grn-return-withoutgrn.module").then((m) => m.GrnReturnWithoutgrnModule),
    },
    {
        path: "materialconsumption",
        loadChildren: () => import("./material-consumption/material-consumption.module").then((m) => m.MaterialConsumptionModule),
    },

    {
        path: "workorder",
        loadChildren: () => import("./work-order/work-order.module").then((m) => m.WorkOrderModule),
    },

    {
        path: "grnreturnnew",
        loadChildren: () => import("./deliverychallan/deliverychallan.module").then((m) => m.DeliverychallanModule),

    },
    {
        path: "purchaserequisitionverification",
        loadChildren: () => import("./purchase-requisition-verification/purchase-requisition-verification.module").then((m) => m.PurchaseRequisitionVerificationModule)
    },
        {
        path: "approvallist",
        loadChildren: () => import("./approval-list/approval-list.module").then((m) => m.ApprovalListModule)
    },
];


@NgModule({
    declarations: [  
  ],
    imports: [
        RouterModule.forChild(appRoutes),
        FormsModule
    ]
})
export class PurchaseModule { }
