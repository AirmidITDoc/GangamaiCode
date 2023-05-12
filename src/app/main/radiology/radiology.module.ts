import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
  // {
  //     path: "radiology-order-list",
  //     loadChildren: () => import("./radiology-order-list/radioloy-orderlist.module").then((m) => m.RadioloyOrderlistModule),
  // },

 
];


@NgModule({
  declarations: [
  ],
  imports: [
      RouterModule.forChild(appRoutes),
  ]
})
export class RadiologyModule { }
