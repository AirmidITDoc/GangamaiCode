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
  declarations: [ ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  entryComponents: [CreditReasonMasterComponent],
})
export class CreditReasonMasterModule { }

 
