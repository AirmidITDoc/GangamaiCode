import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DietPlannerComponent } from './planner/diet-planner.component';
import { DietViewComponent } from './view/diet-view.component';

const routes: Routes = [
  { path: '', component: DietPlannerComponent },
  { path: 'view', component: DietViewComponent },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class DietRoutingModule {}
