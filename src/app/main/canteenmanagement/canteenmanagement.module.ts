import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  
  {
      path: "Canteensales",
      loadChildren: () =>
          import("./canteen-sales/canteen-sales.module").then((m) => m.CanteenSalesModule),
  } 
];

@NgModule({
  declarations: [],
  imports: [
      RouterModule.forChild(appRoutes),
  ]
})

export class CanteenmanagementModule { }
