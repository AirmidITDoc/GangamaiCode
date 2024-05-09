import { IPBillBrowseListComponent } from './ip-bill-browse-list/ip-bill-browse-list.component';
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
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';

import { MatChipsModule } from '@angular/material/chips';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatList, MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { IPSearchListService } from './ip-search-list/ip-search-list.service';
// import { IPSearchListComponent } from './ip-search-list/ip-search-list.component';
import { SharedModule } from '../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { IPSearchListComponent } from './ip-search-list/ip-search-list.component';
import { BedTransferComponent } from './ip-search-list/bed-transfer/bed-transfer.component';
import { DischargeComponent } from './ip-search-list/discharge/discharge.component';
import { IPAdvanceComponent } from './ip-search-list/ip-advance/ip-advance.component';
import { IPAdvancePaymentComponent } from './ip-search-list/ip-advance-payment/ip-advance-payment.component';
import { IPRefundComponent } from './Refund/ip-refund/ip-refund.component';
import { IPRefundofAdvanceComponent } from './Refund/ip-refund/ip-refundof-advance/ip-refundof-advance.component';
import { IPBrowseRefundofAdvanceComponent } from './Refund/ip-refund/ip-browse-refundof-advance/ip-browse-refundof-advance.component';
import { IPBrowseRefundofBillComponent } from './Refund/ip-refund/ip-browse-refundof-bill/ip-browse-refundof-bill.component';
import { BrowseIPAdvanceComponent } from './browse-ipadvance/browse-ipadvance.component';
import { IPDSearcPatienthComponent } from './ipdsearc-patienth/ipdsearc-patienth.component';
import { StockManagementComponent } from './stock-management/stock-management.component';
import { IPSettlementViewComponent } from './ip-settlement/ipsettlement-view/ipsettlement-view.component';
import { ViewBrowseIPDPaymentComponent } from './browse-ipdpayment-receipt/view-browse-ipdpayment/view-browse-ipdpayment.component';
import { CompanyInformationComponent } from './company-information/company-information.component';


// import { IPPatientsearchComponent } from 'app/main/SearchDlg/ippatientsearch/ippatientsearch.component';


@NgModule({
  declarations: [IPBillBrowseListComponent, 
    IPSearchListComponent, IPBillBrowseListComponent, BedTransferComponent,
     DischargeComponent, IPAdvanceComponent, IPAdvancePaymentComponent, 
      IPRefundComponent, IPRefundofAdvanceComponent, 
     IPBrowseRefundofAdvanceComponent, IPBrowseRefundofBillComponent,
      BrowseIPAdvanceComponent, IPDSearcPatienthComponent, StockManagementComponent, IPSettlementViewComponent, 
      ViewBrowseIPDPaymentComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    BrowserModule,
    BrowserAnimationsModule,
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
    MatSpinner,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
    //  NgMultiSelectDropDownModule.forRoot(),
     MatTooltipModule
    
],
providers: [
  IPSearchListService,
    DatePipe,
    NotificationServiceService
],
entryComponents: [
  IPSearchListComponent,
    NotificationServiceService
]
})
export class IpdModule { }
