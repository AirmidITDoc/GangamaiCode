import { NgModule } from "@angular/core";

import { BedMasterComponent } from "./bed-master.component";
import { RouterModule, Routes } from "@angular/router";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe } from "@angular/common";
import { BedMasterService } from "./bed-master.service";
import { NewBedComponent } from './new-bed/new-bed.component';
import { SharedModule } from "app/main/shared/shared.module";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";

const routes: Routes = [
    {
        path: "**",
        component: BedMasterComponent,
    },
];

@NgModule({
    declarations: [BedMasterComponent, NewBedComponent],
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
        MatDialogModule,SharedModule,
    ],
    providers: [BedMasterService,DatePipe],
    entryComponents: [BedMasterComponent],
})
export class BedMasterModule {}
