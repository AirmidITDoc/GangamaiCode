import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestApprovalListComponent } from './test-approval-list/test-approval-list.component';
import { BranchWiseSummaryComponent } from './branch-wise-summary/branch-wise-summary.component';
import { ReportDispatchComponent } from './report-dispatch/report-dispatch.component';
import { EmailorSMSHistoryComponent } from './emailor-smshistory/emailor-smshistory.component';

const appRoutes: Routes = [
  {
    path: "lab-patientreg",
    loadChildren: () => import("./lab-patient-reg/lab-patient-reg.module").then((m) => m.LabPatientRegModule),
  },
  {
    path: "lab-sample-collection",
    loadChildren: () => import("./lab-sample-collection/lab-sample-collection.module").then((m) => m.LabSampleCollectionModule),
  },
  {
    path: "lab-result-list",
    loadChildren: () => import("./lab-result-list/lab-result-list.module").then((m) => m.LabResultListModule),
  },
  {
    path: "labrefund",
    loadChildren: () => import("./labrefund-bill/labrefund-bill.module").then((m) => m.LabrefundBillModule),
  },
  // {
  //   path: "report-dispatch",
  //   loadChildren: () => import("./report-dispatch/report-dispatch.module").then((m) => m.ReportDispatchModule),
  // },
  // {
  //   path: "report-dispatch",
  //   loadChildren: () => import("./report-dispatch/report-dispatch.module").then((m) => m.ReportDispatchModule),
  // },
  // {
  //   path: "report-dispatch",
  //   loadChildren: () => import("./report-dispatch/report-dispatch.module").then((m) => m.ReportDispatchModule),
  // },
  {
    path: "settlement",
    loadChildren: () => import("./lab-settlement/lab-settlement.module").then((m) => m.LabSettlementModule),
  },
  {
    path: "browse-lab-bills",
    loadChildren: () => import("./browse-lab-bills/browse-lab-bills.module").then((m) => m.BrowseLabBillsModule),
  },
];

@NgModule({
  declarations: [
    TestApprovalListComponent,
    BranchWiseSummaryComponent,
    ReportDispatchComponent,
    EmailorSMSHistoryComponent
  ],
  imports: [
     RouterModule.forChild(appRoutes),
  ]
})
export class LabmanagementModule { }
