import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
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
import {  MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IPBrowseRefundofBillComponent } from './ip-browse-refundof-bill.component';
import { IPBrowseRefundofBillService } from './ip-browse-refundof-bill.service';
import { ViewIPReunfofBillComponent } from './view-ip-reunfof-bill/view-ip-reunfof-bill.component';


const routes: Routes = [
  {
      path: '**',
      component: IPBrowseRefundofBillComponent,
  },

];

@NgModule({
    declarations: [
        IPBrowseRefundofBillComponent,
        ViewIPReunfofBillComponent,
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
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatTooltipModule,
        //HeaderComponent
    ],
    providers: [
        IPBrowseRefundofBillService,
        // NotificationServiceService,
        DatePipe
    ]
})
export class IPBrowseRefundofBillModule { }
