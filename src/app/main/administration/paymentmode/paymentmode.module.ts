import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentmodeComponent } from './paymentmode.component';

const routes: Routes = [
  {
      path: "**",
      component: PaymentmodeComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class PaymentmodeModule { }
