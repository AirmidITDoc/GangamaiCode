import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";


const appRoutes: Routes = [
    {
        path: "radiology-order-list",
        loadChildren: () => import("./radiologyorder-list/radiology-list.module").then((m) => m.RadiologyListModule),
    },

   
];

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class RadiologyModule {
}