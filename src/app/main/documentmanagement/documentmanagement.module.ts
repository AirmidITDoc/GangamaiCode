import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/main/shared/shared.module';


const appRoutes: Routes = [
    {
        path: "categories",
        loadChildren: () =>
            import("./categories/categories.module").then((m) => m.CategoriesModule),
    },
    {
        path: "dashboard",
        loadChildren: () =>
            import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
    },
    {
        path: "documents",
        loadChildren: () =>
            import("./documents/documents.module").then((m) => m.DocumentsModule),
    },
    {
        path: "patient-search",
        loadChildren: () =>
            import("./patient-search/patient-search.module").then((m) => m.PatientSearchModule),
    },
    {
        path: "qr-scan",
        loadChildren: () =>
            import("./qr-scan/qr-scan.module").then((m) => m.QrScanModule),
    },
    {
        path: "upload",
        loadChildren: () =>
            import("./upload/upload.module").then((m) => m.UploadModule),
    }
];

@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule,
        RouterModule.forChild(appRoutes),
        SharedModule,
    ]
})

export class DocumentmanagementModule { }
