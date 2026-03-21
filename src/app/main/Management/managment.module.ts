import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
    {
        path: "expenses",
        loadChildren: () => import("./expenses/expenses.module").then((m) => m.ExpensesModule),
    },
    {
        path: "doctorshare",
        loadChildren: () => import("./bill-list-doctorwise/billlist-doctorwise.module").then((m) => m.BilllistDoctorwiseModule),
    },
    {
        path: "doctorshareprocess",
        loadChildren: () => import("./doctorshare-process/doctorshare-process.module").then((m) => m.DoctorshareProcessModule),
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
