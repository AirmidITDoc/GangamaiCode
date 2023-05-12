import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MaritalstatusMasterComponent } from "./maritalstatus-master.component";
import { MatButtonModule } from "@angular/material/button";
import { MaritalstatusMasterService } from "./maritalstatus-master.service";
import { NotificationServiceService } from "app/core/notification-service.service";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

const routes: Routes = [
    {
        path: "**",
        component: MaritalstatusMasterComponent,
    },
];

@NgModule({
    declarations: [MaritalstatusMasterComponent],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatTableModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatRadioModule,
        MatSnackBarModule,
        FuseSharedModule,
        FuseSidebarModule,
    ],

    providers: [MaritalstatusMasterService, NotificationServiceService],

    entryComponents: [MaritalstatusMasterComponent],
})
export class MaritalstatusMasterModule {}
