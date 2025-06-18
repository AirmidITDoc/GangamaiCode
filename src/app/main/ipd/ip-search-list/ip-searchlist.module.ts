import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BedTransferComponent } from './bed-transfer/bed-transfer.component';
import { DischargeComponent } from './discharge/discharge.component';

import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/main/shared/shared.module'; 
import { IPAdvanceComponent } from './ip-advance/ip-advance.component';
import { IPSearchListComponent } from './ip-search-list.component';
import { IPSearchListService } from './ip-search-list.service';
// import { IPRefundofAdvanceComponent } from './ip-refundof-advance/ip-refundof-advance.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatTimepickerModule } from 'mat-timepicker';
import { IPRefundofAdvanceComponent } from '../ip-refundof-advance/ip-refundof-advance.component';
import { CompanyBillComponent } from './company-bill/company-bill.component';
import { DischargeSummaryTemplateComponent } from './discharge-summary-template/discharge-summary-template.component';
import { DischargeSummaryComponent } from './discharge-summary/discharge-summary.component';
import { DischargeInitiateProcessComponent } from './discharge/initiate-discharge/discharge-initiate-process/discharge-initiate-process.component';
import { InitiateDischargeComponent } from './discharge/initiate-discharge/initiate-discharge.component';
import { DiscountAfterFinalBillComponent } from './discount-after-final-bill/discount-after-final-bill.component';
import { InterimBillComponent } from './interim-bill/interim-bill.component';
import { IPBillingComponent } from './ip-billing/ip-billing.component';
import { PrebillDetailsComponent } from './ip-billing/prebill-details/prebill-details.component';
import { IPRefundofBillComponent } from './ip-refundof-bill/ip-refundof-bill.component';
import { IPPackageDetComponent } from './ippackage-det/ippackage-det.component';

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
        //IPRefundofAdvanceComponent,
        IPRefundofBillComponent,
        IPBillingComponent,
        InterimBillComponent,
        DischargeSummaryComponent,
        PrebillDetailsComponent,
        DiscountAfterFinalBillComponent,
        // OPIPFeedbackComponent,
        CompanyBillComponent,
        InitiateDischargeComponent,
        DischargeInitiateProcessComponent,
        DischargeSummaryTemplateComponent,
        IPRefundofAdvanceComponent,
        IPPackageDetComponent
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
       MatTooltipModule,
        MatStepperModule,
        MatTimepickerModule,
         AngularEditorModule,
          
    ],
    providers: [
        IPSearchListService,
        DatePipe
        // NotificationService
    ]
})
export class IPSearchlistModule { }
