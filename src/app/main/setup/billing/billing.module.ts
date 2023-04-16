import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
    // {
    //     path: "service-master",
    //     loadChildren: () =>
    //         import("./service-master/service-master.module").then((m) => m.ServiceMasterModule),
    // },
    // {
    //     path: "group-master",
    //     loadChildren: () =>
    //         import("./group-master/group-master.module").then((m) => m.GroupMasterModule),
    // },
    // {
    //     path: "bank-master",
    //     loadChildren: () =>
    //         import("./bank-master/bank-master.module").then((m) => m.BankMasterModule),
    // },
    // {
    //     path: "vendor-master",
    //     loadChildren: () =>
    //         import("./vendor-master/vendor-master.module").then((m) => m.VendorMasterModule),
    // },
    // {
    //     path: "product-type-master",
    //     loadChildren: () =>
    //         import("./product-type-master/product-type-master.module").then((m) => m.ProductTypeMasterModule),
    // },
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class BillingModule {
}
