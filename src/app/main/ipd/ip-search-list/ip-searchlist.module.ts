import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';


import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { DischargeComponent } from './discharge/discharge.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BedTransferComponent } from './bed-transfer/bed-transfer.component';

import { MatList, MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MatHorizontalStepper, MatStep, MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from 'app/main/shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IPSearchListComponent } from './ip-search-list.component';
import { IPSearchListService } from './ip-search-list.service';
import { IPAdvanceComponent } from './ip-advance/ip-advance.component';
import { IPAdvancePaymentComponent } from './ip-advance-payment/ip-advance-payment.component';
// import { IPRefundofAdvanceComponent } from './ip-refundof-advance/ip-refundof-advance.component';
import { IPRefundofBillComponent } from './ip-refundof-bill/ip-refundof-bill.component';
import { IPBillingComponent } from './ip-billing/ip-billing.component';
import { InterimBillComponent } from './interim-bill/interim-bill.component';
import { DischargeSummaryComponent } from './discharge-summary/discharge-summary.component';
import { IpPaymentwithAdvanceComponent } from './ip-paymentwith-advance/ip-paymentwith-advance.component';
import { PrebillDetailsComponent } from './ip-billing/prebill-details/prebill-details.component';
import { DiscountAfterFinalBillComponent } from './discount-after-final-bill/discount-after-final-bill.component';
import { OPIPFeedbackComponent } from '../Feedback/opip-feedback/opip-feedback.component';
import { CompanyBillComponent } from './company-bill/company-bill.component';
import { UpdateCompanyDetailsComponent } from './company-bill/update-company-details/update-company-details.component';
import { DischargesummaryTemplateComponent } from './dischargesummary-template/dischargesummary-template.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { InitiateDischargeComponent } from './discharge/initiate-discharge/initiate-discharge.component';
import { InitiateProcessComponent } from './discharge/initiate-discharge/initiate-process/initiate-process.component';
import { NewFeedbackComponent } from './new-feedback/new-feedback.component';



const routes: Routes = [
    {
        path: 'new-appointment',
        component:IPSearchListComponent,
    },{
        path: '**',
        component: IPSearchListComponent,
    }

];
@NgModule({
    declarations: [
      IPSearchListComponent,
      BedTransferComponent,
      DischargeComponent,
      IPAdvanceComponent,
      IPAdvancePaymentComponent,
      //IPRefundofAdvanceComponent,
      IPRefundofBillComponent,
      IPBillingComponent,
      InterimBillComponent,
      DischargeSummaryComponent,
      IpPaymentwithAdvanceComponent,
      PrebillDetailsComponent,
      DiscountAfterFinalBillComponent,
      // OPIPFeedbackComponent,
      CompanyBillComponent,
      UpdateCompanyDetailsComponent,
      DischargesummaryTemplateComponent,
      InitiateDischargeComponent,
      InitiateProcessComponent,
      NewFeedbackComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatButtonModule,
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
        MatDialogModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        // WebcamModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatSidenavModule,
        MatExpansionModule,
        MatGridListModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatListModule,
        SharedModule,
        MatStepperModule,
        NgxMatSelectSearchModule,
        MatDatepickerModule,
        AngularEditorModule,
        // MatStepper,
        //  MatStep,
        //  NgMultiSelectDropDownModule.forRoot(),
         MatTooltipModule,
        //  MatHorizontalStepper
        
    ],
    providers: [
      IPSearchListService,
        DatePipe
        // NotificationServiceService
    ],
    entryComponents: [
      IPSearchListComponent
        // NotificationServiceService
    ]
})
export class IPSearchlistModule { }
