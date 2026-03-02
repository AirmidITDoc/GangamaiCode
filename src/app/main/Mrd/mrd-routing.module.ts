import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [

    {
        path: "mrdfile",
        loadChildren: () => import("./mrd-detail-list/mrd-details.module").then((m) => m.MrdDetailsModule),

    },
    //  {
    //     path: "prescription",
    //     loadChildren: () => import("./mrd-detail-list/mrd-details.module").then((m) => m.MrdDetailsModule),

    // },
    //  {
    //     path: "certificates",
    //     loadChildren: () => import("./mrd.module/m").then((m) => m.MrdDetailsModule),

    // },
];


@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
        FormsModule
    ]
})
export class MrdRoutingModule { }
