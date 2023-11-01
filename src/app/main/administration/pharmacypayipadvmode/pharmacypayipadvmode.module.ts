import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PharmacypayipadvmodeComponent } from './pharmacypayipadvmode.component';


const routes: Routes = [
  {
      path: '**',
      component: PharmacypayipadvmodeComponent,
  },
];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class PharmacypayipadvmodeModule { }
