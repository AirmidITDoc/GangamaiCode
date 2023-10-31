import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentModeChangePharmacyComponent } from './payment-mode-change-pharmacy.component';


const routes: Routes = [
  {
      path: "**",
      component:  PaymentModeChangePharmacyComponent,
  },
];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class PaymentModeChangePharmacyModule { }
