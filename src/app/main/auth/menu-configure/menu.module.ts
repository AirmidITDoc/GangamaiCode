import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NotificationService } from 'app/core/notification.service';
import { MenuConfigureComponent } from './menu-configure.component';
import { MenuConfigureService } from './menu-configure.service';
import { MenuMainComponent } from './menu-main/menu-main.component';
import { MenuMasterComponent } from './menu-master/menu-master.component';
import { MenuSubMenuComponent } from './menu-sub-menu/menu-sub-menu.component';
import { MenuSubSubmenuComponent } from './menu-sub-submenu/menu-sub-submenu.component';

const appRoutes: Routes = [
    {
        path: 'menu-master',
        component: MenuMainComponent,
    },
    // {
    //     path: "menu-configure",
    //     component: MenuConfigureComponent,
    // },
    {
        path: "menu-master/:id",
        component: MenuSubMenuComponent,
    }
];

@NgModule({
    declarations: [
        MenuConfigureComponent,
        MenuMasterComponent,
        MenuSubMenuComponent,
        MenuSubSubmenuComponent,
        MenuMainComponent,
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
        FuseSidebarModule,
        MatCardModule
    ]
    ,providers: [
        MenuConfigureService,
        NotificationService
    ],
    entryComponents: [
        MenuMainComponent,
    ]
})
export class MenuModule {
}
