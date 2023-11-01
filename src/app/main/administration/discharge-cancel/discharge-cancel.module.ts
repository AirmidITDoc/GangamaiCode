import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DischargeCancelComponent } from './discharge-cancel.component';


const routes: Routes = [
  {
      path:"**",
      component: DischargeCancelComponent
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class DischargeCancelModule { }
