import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [

    {
        path: "openingbalance",
        loadChildren: () => import("./mrd-detail-list/mrd-details.module").then((m) => m.MrdDetailsModule),

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
