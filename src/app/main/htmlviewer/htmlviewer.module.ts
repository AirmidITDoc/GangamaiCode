import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [];
@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes),
        MatToolbarModule
    ]
})
export class HtmlViewerModule {
} 