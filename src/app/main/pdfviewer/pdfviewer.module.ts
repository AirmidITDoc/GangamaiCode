import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  MatToolbarModule } from '@angular/material/toolbar';
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