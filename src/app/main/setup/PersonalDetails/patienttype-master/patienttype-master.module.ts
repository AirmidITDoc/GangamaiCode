import { NgModule } from "@angular/core";
import { PatienttypeMasterComponent } from "./patienttype-master.component";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseSidebarModule } from "@fuse/components";
import { PatienttypeMasterService } from "./patienttype-master.service";
import { NewPatientTypeComponent } from './new-patient-type/new-patient-type.component';
import { SharedModule } from "app/main/shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatToolbarModule } from "@angular/material/toolbar";
import { DatePipe } from "@angular/common";
import { MatTableModule } from "@angular/material/table";

const routes: Routes = [
    {
        path: "**",
        component: PatienttypeMasterComponent,
    },
];

@NgModule({
    declarations: [PatienttypeMasterComponent, NewPatientTypeComponent],

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
    providers: [PatienttypeMasterService, DatePipe],
    entryComponents: [PatienttypeMasterComponent],
})
export class PatienttypeMasterModule {}
