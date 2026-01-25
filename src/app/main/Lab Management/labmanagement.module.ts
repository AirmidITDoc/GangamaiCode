import { NgModule } from '@angular/core';
import { TestApprovalListComponent } from './test-approval-list/test-approval-list.component';
import { BranchWiseSummaryComponent } from './branch-wise-summary/branch-wise-summary.component';
import { ReportDispatchComponent } from './report-dispatch/report-dispatch.component';
import { EmailorSMSHistoryComponent } from './emailor-smshistory/emailor-smshistory.component';

import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from 'app/main/shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseConfirmDialogModule } from '@fuse/components';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


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
    path: "TestApprovalList",
    loadChildren: () => import("./test-approval-list/test-approval.module").then((m) => m.TestApprovalModule),
  },
{
    path: "browse-lab-bills",
    loadChildren: () => import("./browse-lab-bills/browse-lab-bills.module").then((m) => m.BrowseLabBillsModule),
  },
 
];

@NgModule({
  declarations: [
    
    BranchWiseSummaryComponent,
    ReportDispatchComponent,
    EmailorSMSHistoryComponent
  ],
  imports: [
     RouterModule.forChild(appRoutes),
     CommonModule,
         SharedModule,
         MatButtonModule,
         MatCheckboxModule,
         MatFormFieldModule,
         MatIconModule,
         MatInputModule,
         MatMenuModule,
         MatTableModule,
         MatToolbarModule,
         MatPaginatorModule,
         MatSortModule,
         MatSelectModule,
         MatRadioModule,
         MatSnackBarModule,
         FuseSharedModule,
         FuseSidebarModule,
         MatDialogModule,
         MatSlideToggleModule,
         MatCheckboxModule,
         MatDatepickerModule,
         MatFormFieldModule,
         MatIconModule,
         MatInputModule,
         MatMenuModule,
         MatRippleModule,
         MatTableModule,
         MatToolbarModule,
         MatPaginatorModule,
         MatSortModule,
         MatSelectModule,
         MatRadioModule,
         MatTabsModule,
         MatCardModule,
         MatDividerModule,
         MatProgressSpinnerModule,
         FuseSharedModule,
         FuseConfirmDialogModule,
         FuseSidebarModule,
         MatDialogModule,
         MatListModule,
         MatSnackBarModule,
         MatSlideToggleModule,
         MatDividerModule,
         MatDialogModule,
         FuseSharedModule,
         FuseConfirmDialogModule,
         FuseSidebarModule,
         ReactiveFormsModule,
         MatSnackBarModule,
         MatStepperModule,
         MatAutocompleteModule,
         MatProgressSpinnerModule,
         SharedModule,
         NgxMatSelectSearchModule,
         MatCardModule,
         MatTooltipModule,
         MatExpansionModule,
  ]
})
export class LabmanagementModule { }
