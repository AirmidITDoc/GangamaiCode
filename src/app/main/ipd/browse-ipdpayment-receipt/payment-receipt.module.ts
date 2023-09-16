import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
//import { IpdBrowsePaymentreceiptListComponent } from './ipd-browse-paymentreceipt-list/ipd-browse-paymentreceipt-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewBrowseIPDPaymentComponent } from './view-browse-ipdpayment/view-browse-ipdpayment.component';
import { PaymentReceiptService } from './payment-receipt.service';
import { IpdPaymentreceiptComponent } from './ipd-paymentreceipt/ipd-paymentreceipt.component';



const routes: Routes = [
  { path: '**', component: IpdPaymentreceiptComponent },
];


@NgModule({
  declarations: [
        ViewBrowseIPDPaymentComponent,
    IpdPaymentreceiptComponent
  ],
 
  imports: [
    CommonModule,
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
    MatDialogModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    MatExpansionModule,
    MatTooltipModule,
   
  ],
  providers: [
    PaymentReceiptService,
      DatePipe,
      
  ],
  entryComponents: [
    IpdPaymentreceiptComponent,
  
  ]
})
export class PaymentReceiptModule { }
