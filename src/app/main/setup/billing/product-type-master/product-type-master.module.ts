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

import { GroupMasterService } from './product-type-master.service';
import { ProductTypeMasterComponent } from './product-type-master.component';
import { ProductTypeFormComponent } from './product-type-form/product-type-form.component';
import { ProductTypeListComponent } from './product-type-list/product-type-list.component';

const appRoutes: Routes = [
    {
        path: "**",
        component: ProductTypeMasterComponent,
        resolve: {
            groupMasters: GroupMasterService
        }
    },
];

@NgModule({
    declarations: [
        ProductTypeMasterComponent,
        ProductTypeFormComponent,
        ProductTypeListComponent
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
        ProductTypeFormComponent
    ]
})
export class ProductTypeMasterModule {
}
