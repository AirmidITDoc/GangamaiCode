import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ParameterDescriptiveMasterComponent } from './parameter-descriptive-master.component';


const routes: Routes = [
  {
      path: "**",
      component: ParameterDescriptiveMasterComponent,
  },
];

@NgModule({
  declarations: [ParameterDescriptiveMasterComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class ParameterDescriptiveMasterModule { }
