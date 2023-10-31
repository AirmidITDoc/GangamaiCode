import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PharmacyPaymentIPAdvModeComponent } from './pharmacy-payment-ipadv-mode.component';


const routes: Routes = [
  {
      path:"**",
      component: PharmacyPaymentIPAdvModeComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class PharmacyPaymentIPAdvModeModule { }
