import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrPaymentListComponent } from './dr-payment-list/dr-payment-list.component';


const appRoutes: Routes = [
    {
        path: "expenses",
        loadChildren: () => import("./expenses/expenses.module").then((m) => m.ExpensesModule),
    },
    {
        path: "expenses-approval",
        loadChildren: () => import("./expenses-approval/expenses-approval.module").then((m) => m.ExpensesApprovalModule),
    },
    {
        path: "doctorshare",
        loadChildren: () => import("./bill-list-doctorwise/billlist-doctorwise.module").then((m) => m.BilllistDoctorwiseModule),
    },
    {
        path: "doctorshareprocess",
        loadChildren: () => import("./doctorshare-process/doctorshare-process.module").then((m) => m.DoctorshareProcessModule),
    }
    ,
    {
        path: "demomenu",
        loadChildren: () => import("./dr-payment-list/drpaymentlist.module").then((m) => m.DrpaymentlistModule),
    }
];

@NgModule({
    declarations: [
   
    
  ],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class ManagmentModule { }
