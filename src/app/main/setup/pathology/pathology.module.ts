import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategorymasterComponent } from "./categorymaster/categorymaster.component";
import { UnitmasterComponent } from "./unitmaster/unitmaster.component";
import { ParametermasterComponent } from "./parametermaster/parametermaster.component";
import { TestmasterComponent } from "./testmaster/testmaster.component";
import { ParamteragewiseComponent } from "./paramteragewise/paramteragewise.component";
import { RouterModule, Routes } from "@angular/router";
import { TemplateMasterComponent } from './template-master/template-master.component';
import { TemplateFormComponent } from './template-master/template-form/template-form.component';

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
