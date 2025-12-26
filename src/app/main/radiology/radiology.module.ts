import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: "radiology-order-list",
    loadChildren: () =>
      import("./radiology-order-list/radioloy-orderlist.module").then((m) => m.RadioloyOrderlistModule),
  },
  {
    path: "report-dispatch",
    loadChildren: () =>
      import("./radio-report-dispatch/radio-report-dispatch.module").then((m) => m.RadioReportDispatchModule),
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class RadiologyModule { }
