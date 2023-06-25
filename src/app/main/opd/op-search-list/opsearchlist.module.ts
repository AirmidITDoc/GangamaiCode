import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OpdSearchListComponent } from './opd-search-list/opd-search-list.component';
import { OPSearhlistService } from './op-searhlist.service';
import { OPBillingComponent } from './op-billing/op-billing.component';
import { SharedModule } from 'app/main/shared/shared.module';
import { SearchPageComponent } from './search-page/search-page.component';
import { OPCasepaperComponent } from './op-casepaper/op-casepaper.component';
import { ViewCasepaperComponent } from './op-casepaper/view-casepaper/view-casepaper.component';
import { OPAdvanceComponent } from './op-advance/op-advance.component';
import { OPAdvancePaymentComponent } from './op-advance-payment/op-advance-payment.component';
import { OPRefundofBillComponent } from './op-refundof-bill/op-refundof-bill.component';




const routes: Routes = [
    {
        path: '**',
        component: OpdSearchListComponent,
    },
    {
        path: 'new-OpdBilling',
        // component: OpBillingComponent,
    },
];
@NgModule({
    declarations: [
        OpdSearchListComponent,
        OPBillingComponent,
        SearchPageComponent,
        OPCasepaperComponent,
        ViewCasepaperComponent,
        OPAdvanceComponent,
         OPAdvancePaymentComponent,
        // OutstandingPaymentComponent,
        OPRefundofBillComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        
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
        MatProgressSpinnerModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatDialogModule,
        MatStepperModule,
        // WebcamModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatExpansionModule,
        FuseSidebarModule,
        MatDialogModule,
        MatGridListModule,
        MatSnackBarModule,
        MatSlideToggleModule , 
        MatListModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatTooltipModule
        
        
    ],
    providers: [
        OPSearhlistService,
        NotificationServiceService ,
        DatePipe
    ],
    entryComponents: [
        OpdSearchListComponent
        // CasePaperComponent
    ]
})
export class opseachlistModule {
} 