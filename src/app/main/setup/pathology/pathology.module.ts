import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {
        path: "categorymaster",
        loadChildren: () =>
            import("./categorymaster/categorymaster.module").then(
                (m) => m.CategorymasterModule
            ),
    },
    {
        path: "unitmaster",
        loadChildren: () =>
            import("./unitmaster/unitmaster.module").then(
                (m) => m.UnitmasterModule
            ),
    },
    {
        path: "parametermaster",
        loadChildren: () =>
            import("./parametermaster/parametermaster.module").then(
                (m) => m.ParametermasterModule
            ),
    },
    {
        path: "templatemaster",
        loadChildren: () =>
            import("./template-master/template-master.module").then(
                (m) => m.TemplateMasterModule
            ),
    },
    {
        path: "testmaster",
        loadChildren: () =>
            import("./testmaster/testmaster.module").then(
                (m) => m.TestmasterModule
            ),
    },
    {
        path: "paramteragewise",
        loadChildren: () =>
            import("./paramteragewise/paramteragewise.module").then(
                (m) => m.ParamteragewiseModule
            ),
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(appRoutes)],
})
export class PathologyModule {}
