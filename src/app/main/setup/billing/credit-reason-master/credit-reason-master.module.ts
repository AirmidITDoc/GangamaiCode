import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreditReasonMasterComponent } from './credit-reason-master.component';


const routes: Routes = [
  {
      path: "**",
      component: CreditReasonMasterComponent,
  },
];

@NgModule({
  declarations: [CreditReasonMasterComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class CreditReasonMasterModule { }
