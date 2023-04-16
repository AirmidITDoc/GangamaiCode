import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ServiceMasterComponent } from 'app/main/setup/billing/service-master/service-master.component';
import { ServiceMasterService } from 'app/main/setup/billing/service-master/service-master.service';
import { ServiceMasterListComponent } from 'app/main/setup/billing/service-master/service-master-list/service-master-list.component';
import { ContactsSelectedBarComponent } from 'app/main/setup/billing/service-master/selected-bar/selected-bar.component';
import { ContactsMainSidebarComponent } from 'app/main/setup/billing/service-master/sidebars/main/main.component';
import { ServiceMasterFormDialogComponent } from 'app/main/setup/billing/service-master/service-master-form/service-master-form.component';

const routes: Routes = [
    {
        path: '**',
        component: ServiceMasterComponent,
        resolve: {
            contacts: ServiceMasterService
        }
    }
];

@NgModule({
    declarations: [
        ServiceMasterComponent,
        ServiceMasterListComponent,
        ContactsSelectedBarComponent,
        ContactsMainSidebarComponent,
        ServiceMasterFormDialogComponent
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

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers: [
        ServiceMasterService
    ],
    entryComponents: [
        ServiceMasterFormDialogComponent
    ]
})
export class ServiceMasterModule {
}
