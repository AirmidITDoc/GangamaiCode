import { BrowseRefundListComponent } from './browse-refund-list.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NotificationServiceService } from 'app/core/notification-service.service';
//import { BrowseOpdRefundListComponent } from './browse-opd-refund-list/browse-opd-refund-list.component';
//import { BrowseOpdRefundSidebarComponent } from './browse-opd-refund-sidebar/browse-opd-refund-sidebar.component';
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
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/main/shared/shared.module';
import { BrowseRefundlistService } from './browse-refundlist.service';
import { MatChipsModule } from '@angular/material/chips';
import { ViewBrowseOPDRefundComponent } from './view-browse-opdrefund/view-browse-opdrefund.component';


const routes: Routes = [
    {
        path: '**',
        component: BrowseRefundListComponent,
    },
];
@NgModule({
    declarations: [
        BrowseRefundListComponent,
        ViewBrowseOPDRefundComponent
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
        MatChipsModule,
        SharedModule,
        MatDialogModule,
        MatTooltipModule
    ],
    providers: [
        BrowseRefundlistService,
        // NotificationServiceService ,
        DatePipe
    ],
    entryComponents: [
        BrowseRefundListComponent,
        // NotificationServiceService
    ]
})
export class browserefundModule {
} 