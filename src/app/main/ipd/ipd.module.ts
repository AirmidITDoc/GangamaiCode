import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
    {
        path: "admission",
        loadChildren: () =>
            import("./admission/admission.module").then((m) => m.AdmissionModule),
    },
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class IpdModule { }
