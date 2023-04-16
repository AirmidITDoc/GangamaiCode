import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvMillComponent } from './invoice-list/inv-mill/inv-mill.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';


const appRoutes: Routes = [
    {
        path: "invoicelist",
        loadChildren: () => import("./invoice-list/invoice-list.module").then((m) => m.InvoiceListModule),

    },
   
  
    {
        // Yarn
         path: "InventoryMaster/Mill",
         loadChildren: () =>
        //  import("./invoice-list/invoice-list.module").then((m) => m.InvoiceListModule),
        InvMillComponent
     },
];

@NgModule({
    declarations: [
//     YarninwardComponent,
//     InvDesignComponent,
//    InvLocationComponent
// InvoiceListComponent

],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class InvoiceModule {
}
