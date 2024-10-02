import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {
        path: "view-patient-document",
        loadChildren: () =>
            import("./view-patient-document/view-patient-document.module").then(
                (m) => m.ViewPaitentDocumentManagementModule
            ),
    },
    {
        path: "document-management",
        loadChildren: () =>
            import("./document-management/document-management.module").then(
                (m) => m.DocumentManagementModule
            ),
    },
    {
        path: "patient-document-management",
        loadChildren: () =>
            import("./patient-document-management/patient-document-management.module").then(
                (m) => m.PatioentDocumentManagementModule
            ),
    }
];


@NgModule({
    declarations: [],
    imports: [
      RouterModule.forChild(appRoutes),
    ]
  })
export class DocumentModule {}
