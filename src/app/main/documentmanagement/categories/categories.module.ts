import { NgModule } from '@angular/core';
import { CategoriesComponent } from './categories.component';
import { CategoryFormDialogComponent } from './category-form-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {
        path: '',
        component: CategoriesComponent
    },
];
@NgModule({
    declarations: [CategoriesComponent, CategoryFormDialogComponent],
    imports: [SharedModule,  RouterModule.forChild(routes),],
})

export class CategoriesModule { }
