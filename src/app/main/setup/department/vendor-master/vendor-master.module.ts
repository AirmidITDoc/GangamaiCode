import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VendorMasterComponent } from './vendor-master.component';


const routes: Routes = [
  {
      path: "**",
      component: VendorMasterComponent,
  },
];

@NgModule({
  declarations: [VendorMasterComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class VendorMasterModule { }
