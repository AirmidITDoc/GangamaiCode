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
import { MatRadioModule } from '@angular/material/radio';
// import { NotificationServiceService } from 'app/APIs/notification-service.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { menuservice } from './menu.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MenuSubMenuComponent } from './menu-sub-menu.component';
import { MenuConfigureService } from '../menu-configure.service';

const appRoutes: Routes = [
    {
        path: "**",
        component: MenuSubMenuComponent,
       
    }
];

@NgModule({
    declarations: [
        MenuSubMenuComponent,
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
        MatRadioModule,
        MatSnackBarModule,
        MatTabsModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule

    ]
    ,providers: [
           MenuConfigureService,
        // NotificationServiceService
    ],
    entryComponents: [
        MenuSubMenuComponent,
    ]
})
export class MenuSubModule {
}
