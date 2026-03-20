import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
    {
        path: "FAregistration",
        loadChildren: () => import("./fa-registration/fa-registration.module").then((m) => m.FARegistrationModule),
    }
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class AssetsmanagementModule { }
