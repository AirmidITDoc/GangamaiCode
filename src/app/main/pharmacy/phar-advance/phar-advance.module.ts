import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PharAdvanceComponent } from './phar-advance.component';

const routes: Routes = [
  { 
      path: '**', 
      component: PharAdvanceComponent 
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class PharAdvanceModule { }
