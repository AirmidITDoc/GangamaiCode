import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {
        path: "prescriptionclassmaster",
        loadChildren: () =>
            import(
                "./prescriptionclassmaster/prescriptionclassmaster.module"
            ).then((m) => m.PrescriptionclassmasterModule),
    },
    {
        path: "genericmaster",
        loadChildren: () =>
            import("./genericmaster/genericmaster.module").then(
                (m) => m.GenericmasterModule
            ),
    },
    {
        path: "drugmaster",
        loadChildren: () =>
            import("./drugmaster/drugmaster.module").then(
                (m) => m.DrugmasterModule
            ),
    },
    {
        path: "dosemaster",
        loadChildren: () =>
            import("./dosemaster/dosemaster.module").then(
                (m) => m.DosemasterModule
            ),
    },
    {
        path: "certificatemaster",
        loadChildren: () =>
            import("./certificatemaster/certificatemaster.module").then(
                (m) => m.CertificatemasterModule
            ),
    },
    {
        path: "instructionmaster",
        loadChildren: () =>
            import("./instructionmaster/instructionmaster.module").then(
                (m) => m.InstructionmasterModule
            ),
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(appRoutes)],
})
export class PrescriptionModule {}
