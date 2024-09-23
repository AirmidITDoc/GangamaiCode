import { NgModule } from "@angular/core";

import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {
        path: "document-management",
        loadChildren: () =>
            import("./document-management/document-management.module").then(
                (m) => m.DocumentManagementModule
            ),
    }
];


@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
})
export class DocumentModule {}
