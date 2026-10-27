import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DietRoutingModule } from './diet-routing.module';
import { DietPlannerComponent } from './planner/diet-planner.component';
import { DietViewComponent } from './view/diet-view.component';
import { AddItemsDialogComponent } from './add-items-dialog/add-items-dialog.component';
import { AppMaterialModule } from '../shared/material.module';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const appRoutes: Routes = [
    {
        path: "add-items",
        component: AddItemsDialogComponent
    },
    {
        path: "planner",
        component: DietPlannerComponent
    },
    {
        path: "view",
        component: DietViewComponent
    }
];

@NgModule({
  declarations: [DietPlannerComponent, DietViewComponent, AddItemsDialogComponent],
  imports: [CommonModule, FormsModule, AppMaterialModule, DietRoutingModule, RouterModule.forChild(appRoutes),
        SharedModule,],
})
export class DietModule {}
