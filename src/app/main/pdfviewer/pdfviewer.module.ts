import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
const routes: Routes = [];
@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes),
        MatToolbarModule, NgxExtendedPdfViewerModule
    ]
})
export class PdfViewerModule {
} 