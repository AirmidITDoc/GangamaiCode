import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [

  {
    path: "sample-collection-list",
    loadChildren: () => import("./sample-collection/sample-collection.module").then((m) => m.SampleCollectionModule),
  },
  {
    path: "pathology-result-list",
    loadChildren: () => import("./result-entry/result-entry.module").then((m) => m.ResultEntryModule),
  },
  {
    path: "lab-request-list",
    loadChildren: () => import("./sample-request/sample-request.module").then((m) => m.SampleRequestModule),
  },
  {
    path: "lab-patientreg",
    loadChildren: () => import("./lab-patient-reg/lab-patient-reg.module").then((m) => m.LabPatientRegModule),
  },
  {
    path: "labrefund",
    loadChildren: () => import("./labrefund-bill/labrefund-bill.module").then((m) => m.LabrefundBillModule),
  },
  {
    path: "report-dispatch",
    loadChildren: () => import("./report-dispatch/report-dispatch.module").then((m) => m.ReportDispatchModule),
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class PathologyModule { }
