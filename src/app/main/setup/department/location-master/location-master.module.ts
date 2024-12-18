import { NgModule } from "@angular/core";

import { LocationMasterComponent } from "./location-master.component";
import { RouterModule, Routes } from "@angular/router";
import { LocationMasterService } from "./location-master.service";
import { FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { NewLocationComponent } from './new-location/new-location.component';
import { MatDialogModule } from "@angular/material/dialog";
import { SharedModule } from "app/main/shared/shared.module";
import { DatePipe } from "@angular/common";

const routes: Routes = [
    {
        path: "**",
        component: LocationMasterComponent,
    },
];

@NgModule({
    declarations: [LocationMasterComponent, NewLocationComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
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
        MatDialogModule,
    ],
    providers: [LocationMasterService,DatePipe],
    entryComponents: [LocationMasterComponent],
})
export class LocationMasterModule {}
