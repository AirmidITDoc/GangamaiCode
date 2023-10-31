import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { PaymentmodechangesforPharmacyComponent } from './paymentmodechangesfor-pharmacy.component';


const routes: Routes = [
  {
      path: '**',
      component: PaymentmodechangesforPharmacyComponent,
  },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class PaymentmodechangesforPharmacyModule { }
