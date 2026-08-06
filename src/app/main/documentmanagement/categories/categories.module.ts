import { NgModule } from '@angular/core';
import { CategoriesComponent } from './categories.component';
import { CategoryFormDialogComponent } from './category-form-dialog.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../shared/shared.module';
const routes: Routes = [
    {
        path: '',
        component: CategoriesComponent
    },
];
@NgModule({
    declarations: [CategoriesComponent, CategoryFormDialogComponent],
    imports: [SharedModule,MatIconModule,MatCardModule,  RouterModule.forChild(routes) ],
})

export class CategoriesModule { }
