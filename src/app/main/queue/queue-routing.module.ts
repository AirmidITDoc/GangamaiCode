import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueueOperatorComponent } from './operator/queue-operator.component';
import { QueueDisplayComponent } from './display/queue-display.component';

const routes: Routes = [
  { path: '', component: QueueOperatorComponent },
  { path: 'display', component: QueueDisplayComponent }, // URL to open on the LED screen
];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class QueueRoutingModule {}
