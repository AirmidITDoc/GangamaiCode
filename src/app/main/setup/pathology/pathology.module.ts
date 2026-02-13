import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OutsourceLabDetailsComponent } from './outsource-lab-details/outsource-lab-details.component';

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
        path: "outsourcelabdetails",
        loadChildren: () =>
            import("./outsource-lab-details/outsource-labtetails.module").then(
                (m) => m.OutsourceLabtetailsModule
            ),
    },
    {
        path: "specimenmaster",
        loadChildren: () =>
            import("./specimum-master/specimum-master.module").then(
                (m) => m.SpecimumMasterModule
            ),
    },
    {
        path: "specimen-condition",
        loadChildren: () =>
            import("./spec-condition-master/spec-condition-master.module").then(
                (m) => m.SpecConditionMasterModule
            ),
    },
    {
        path: "specimen-container",
        loadChildren: () =>
            import("./spec-container-master/spec-container-master.module").then(
                (m) => m.SpecContainerMasterModule
            ),
    },
    {
        path: "specimen-collection",
        loadChildren: () =>
            import("./spec-collection-master/spec-collection-master.module").then(
                (m) => m.SpecCollectionMasterModule
            ),
    },
    {
        path: "specimen-preservative",
        loadChildren: () =>
            import("./spec-preservative-master/spec-preservative-master.module").then(
                (m) => m.SpecPreservativeMasterModule
            ),
    },
];

@NgModule({
    declarations: [

    ],
    imports: [RouterModule.forChild(appRoutes)],
})
export class PathologyModule { }
