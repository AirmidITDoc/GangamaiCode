import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PharmacyPaymentComponent } from './pharmacy-payment.component';


const routes: Routes = [
  {
      path: "**",
      component:  PharmacyPaymentComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class PharmacyPaymentModule { }
