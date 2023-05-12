import { NgModule } from "@angular/core";

import { ReligionMasterComponent } from "./religion-master.component";
import { RouterModule, Routes } from "@angular/router";
import { ReligionMasterService } from "./religion-master.service";
import { NotificationServiceService } from "app/core/notification-service.service";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRadioModule } from "@angular/material/radio";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";

const routes: Routes = [
    {
        path: "**",
        component: ReligionMasterComponent,
    },
];

@NgModule({
    declarations: [ReligionMasterComponent],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,

        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        MatTableModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatRadioModule,
        MatSnackBarModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
    ],
    providers: [ReligionMasterService, NotificationServiceService],

    entryComponents: [ReligionMasterComponent],
})
export class ReligionMasterModule {}
