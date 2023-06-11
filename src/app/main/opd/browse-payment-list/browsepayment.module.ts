import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BrowsePaymentListComponent } from './browse-payment-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewOPBrowsePaymentListComponent } from './view-opbrowse-payment-list/view-opbrowse-payment-list.component';
import { PrintPaymentComponent } from './print-payment/print-payment.component';


const routes: Routes = [
    {
        path: '**',
        component: BrowsePaymentListComponent,
    },
];
@NgModule({
    declarations: [
        BrowsePaymentListComponent,
        ViewOPBrowsePaymentListComponent,
        PrintPaymentComponent,
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
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatProgressSpinnerModule,
        MatTooltipModule
    ],
    providers: [
        DatePipe
    ],
    entryComponents: [
        BrowsePaymentListComponent,
    ]
})
export class browsepaymentModule {
} 