import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DoctorShareComponent } from './doctor-share.component';



const routes: Routes = [
  {
      path: '**',
      component: DoctorShareComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class DOctorShareModule { }
