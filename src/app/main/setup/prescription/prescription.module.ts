import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";
import { ICDEMasterComponent } from './icde-master/icde-master.component';
import { NewICDEMasterComponent } from './icde-master/new-icde-master/new-icde-master.component';

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
    {
        path: "prescriptiontemplate",
        loadChildren: () =>
            import("./prescription-template/prescription-template.module").then(
                (m) => m.PrescriptionTemplateModule
            ),
    },

    {
        path: "QuestionMaser",
        loadChildren: () =>
            import("./gastology-question-master/question-master.module").then(
                (m) => m.QuestionMasterModule
            ),
    },
    {
        path: "SubQuestionMaser",
        loadChildren: () =>
            import("./sub-question-master/subquestion-master.module").then(
                (m) => m.SubquestionMasterModule
            ),
    },
    {
        path: "SubQuestionvaluesMaser",
        loadChildren: () =>
            import("./sub-result-value-master/subresult-value.module").then(
                (m) => m.SubresultValueModule
            ),
    },
    ,
    {
        path: "ICDEMaster",
        loadChildren: () =>
            import("./icde-master/icde-master.module").then(
                (m) => m.ICDEMasterModule
            ),
    },
];

@NgModule({
    declarations: [

  ],
    imports: [RouterModule.forChild(appRoutes)],
})
export class PrescriptionModule { }
