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

import { VendorMasterComponent } from './vendor-master.component';
import { VendorMasterFormComponent } from './vendor-master-form/vendor-master-form.component';
import { VendorMasterListComponent } from './vendor-master-list/vendor-master-list.component';
import { GroupMasterService } from './vendor-master.service';

const appRoutes: Routes = [
    {
        path: "**",
        component: VendorMasterComponent,
        resolve: {
            groupMasters: GroupMasterService
        }
    },
];

@NgModule({
    declarations: [
        VendorMasterComponent,
        VendorMasterFormComponent,
        VendorMasterListComponent
    ],
    imports: [
        RouterModule.forChild(appRoutes),

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

    ]
    ,providers: [
        GroupMasterService
    ],
    entryComponents: [
        VendorMasterFormComponent
    ]
})
export class VendorMasterModule {
}
