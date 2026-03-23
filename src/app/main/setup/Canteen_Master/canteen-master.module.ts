import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";



const appRoutes: Routes = [
    {
        path: "ItemMaster",
        loadChildren: () =>
            import("./canteen-item-mater/item-maser.module").then(
                (m) => m.ItemMaserModule
            ),
    },
    {
        path: "dietplan",
        loadChildren: () =>
            import("./diet-plan/dietplan.module").then(
                (m) => m.DietplanModule
            ),
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(appRoutes)],
})
export class CanteenMasterModule { }
