import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
    {
        path: "billing",
        loadChildren: () =>
            import("./billing/billing.module").then((m) => m.BillingModule),
    },
];

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(appRoutes),
    ]
})
export class SetupModule {
}
