import { NgModule } from "@angular/core";

import { PatienttypeMasterComponent } from "./patienttype-master.component";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatRippleModule } from "@angular/material/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { NotificationServiceService } from "app/core/notification-service.service";
import { PatienttypeMasterService } from "./patienttype-master.service";

const routes: Routes = [
    {
        path: "**",
        component: PatienttypeMasterComponent,
    },
];

@NgModule({
    declarations: [PatienttypeMasterComponent],

    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        // MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        // MatRippleModule,
        MatTableModule,
        // MatToolbarModule,
        MatPaginatorModule,
        // MatSortModule,
        MatSelectModule,
        MatRadioModule,
        MatSnackBarModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
    ],
    providers: [PatienttypeMasterService, NotificationServiceService],
    entryComponents: [PatienttypeMasterComponent],
})
export class PatienttypeMasterModule {}
