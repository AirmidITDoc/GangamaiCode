import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [

  {
    path: "Canteensales",
    loadChildren: () =>
      import("./canteen-sales/canteen-sales.module").then((m) => m.CanteenSalesModule),
  },
  {
    path: "Canteenbills",
    loadChildren: () =>
      import("./canteen-bill-list/canteen-bill.module").then((m) => m.CanteenBillModule),
  },
  {
    path: "dietrequestlist",
    loadChildren: () =>
      import("./patient-diet-reauest/diet-request.module").then((m) => m.DietRequestModule),
  }

];

@NgModule({
  declarations: [



  ],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})

export class CanteenmanagementModule { }
