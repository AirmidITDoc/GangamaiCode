import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CancellationComponent } from './cancellation.component';



const routes : Routes =[
  {
    path:"**",
    component:CancellationComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class CancellationModule { }
