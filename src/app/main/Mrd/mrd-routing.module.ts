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
     {
        path: "certificates",
        loadChildren: () => import("./certificate/cretificate.module").then((m) => m.CretificateModule),

    },
];


@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
        FormsModule
    ]
})
export class MrdRoutingModule { }
