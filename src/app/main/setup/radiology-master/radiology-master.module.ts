import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryMasterComponent } from "./category-master/category-master.component";
import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {
        path: "category-master",
        loadChildren: () =>
            import("./category-master/category-master.module").then(
                (m) => m.CategoryMasterModule
            ),
    },
    {
        path: "radiology-template-master",
        loadChildren: () =>
            import(
                "./radiology-template-master/radiology-template-master.module"
            ).then((m) => m.RadiologytemplateMasterModule),
    },
    {
        path: "radiology-test-master",
        loadChildren: () =>
            import("./radiology-test-master/radiology-test-master.module").then(
                (m) => m.RadiologytestMasterModule
            ),
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(appRoutes)],
})
export class RadiologyMasterModule {}
