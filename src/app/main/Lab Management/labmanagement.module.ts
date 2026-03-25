import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { EmailorSMSHistoryComponent } from './emailor-smshistory/emailor-smshistory.component';
import { ReportDispatchComponent } from './report-dispatch/report-dispatch.component';

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
import { DiscountApprovalComponent } from './discount-approval/discount-approval.component';
import { HomeCollectionComponent } from './home-collection/home-collection.component';
import { LabRadApprovallistComponent } from './lab-rad-approvallist/lab-rad-approvallist.component';
import { LabRadiologyComponent } from './lab-radiology/lab-radiology.component';


const appRoutes: Routes = [
    {
        path: "home-collection",
        loadChildren: () => import("./home-collection/home-collection.module").then((m) => m.HomeCollectionModule),
    },
    {
        path: "lab-appointment",
        loadChildren: () => import("./lab-appointment/lab-appointment.module").then((m) => m.LabAppointmentModule),
    },
    {
        path: "lab-patientreg",
        loadChildren: () => import("./lab-patient-reg/lab-patient-reg.module").then((m) => m.LabPatientRegModule),
    },
    {
        path: "browse-lab-bills",
        loadChildren: () => import("./browse-lab-bills/browse-lab-bills.module").then((m) => m.BrowseLabBillsModule),
    },
    {
        path: "labrefund",
        loadChildren: () => import("./labrefund-bill/labrefund-bill.module").then((m) => m.LabrefundBillModule),
    },
    {
        path: "lab-refund-approval",
        loadChildren: () => import("./refund-approval/refund-approval.module").then((m) => m.RefundApprovalModule),
    },
    {
        path: "lab-discount-approval",
        loadChildren: () => import("./discount-approval/discount-approval.module").then((m) => m.DiscountApprovalModule),
    },
    {
        path: "settlement",
        loadChildren: () => import("./lab-settlement/lab-settlement.module").then((m) => m.LabSettlementModule),
    },
    {
        path: "lab-sample-collection",
        loadChildren: () => import("./lab-sample-collection/lab-sample-collection.module").then((m) => m.LabSampleCollectionModule),
    },
    {
        path: "lab-sample-received",
        loadChildren: () => import("./lab-sample-received/lab-sample-received.module").then((m) => m.LabSampleReceivedModule),
    },
    {
        path: "lab-result-list",
        loadChildren: () => import("./lab-result-list/lab-result-list.module").then((m) => m.LabResultListModule),
    },
    {
        path: "TestApprovalList",
        loadChildren: () => import("./test-approval-list/test-approval.module").then((m) => m.TestApprovalModule),
    },
    {
        path: "BranchWiseSummary",
        loadChildren: () => import("./branch-wise-summary/branchwise-summary.module").then((m) => m.BranchwiseSummaryModule),
    },
    {
        path: "BranchCollectionDetail",
        loadChildren: () => import("./branch-collection-detail/branch-collection-detail.module").then((m) => m.BranchCollectionDetailModule),
    },
    {
        path: "radiology-list",
        loadChildren: () => import("./lab-radiology/lab-radiology.module").then((m) => m.LabRadiologyModule),
    },
    {
        path: "RadTestApprovalList",
        loadChildren: () => import("./lab-rad-approvallist/lab-rad-approvallist.module").then((m) => m.LabRadApprovallistModule),
    },
    {
        path: "investigation-list",
        loadChildren: () => import("./investigation-list/investigation-list.module").then((m) => m.InvestigationListModule),
    },
    {
        path: "lab-other-service",
        loadChildren: () => import("./lab-other-services/lab-other-services.module").then((m) => m.LabOtherServicesModule),
    },

];

@NgModule({
    declarations: [

        ReportDispatchComponent,
        EmailorSMSHistoryComponent,
        HomeCollectionComponent,
        LabRadiologyComponent,
        LabRadApprovallistComponent,
        DiscountApprovalComponent
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
