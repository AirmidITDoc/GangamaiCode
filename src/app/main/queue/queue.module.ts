import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueueRoutingModule } from './queue-routing.module';
import { QueueOperatorComponent } from './operator/queue-operator.component';
import { QueueDisplayComponent } from './display/queue-display.component';
import { AppMaterialModule } from '../shared/material.module';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DietPlannerComponent } from '../diet/planner/diet-planner.component';
const appRoutes: Routes = [
  {
    path: "display",
    component: QueueDisplayComponent
  },
  {
    path: "operator",
    component: QueueOperatorComponent
  }
];
@NgModule({
  declarations: [QueueOperatorComponent, QueueDisplayComponent],
  imports: [CommonModule, FormsModule, AppMaterialModule, QueueRoutingModule, RouterModule.forChild(appRoutes),
    SharedModule],
})
export class QueueModule { }
