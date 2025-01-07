import { RouterModule, Routes } from "@angular/router";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ReactiveFormsModule } from "@angular/forms";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import {  MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { VendorMasterComponent } from "./vendor-master.component";
import { BedMasterService } from "../bed-master/bed-master.service";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: "**",
        component: VendorMasterComponent,
    },
];

@NgModule({
    declarations: [VendorMasterComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatRadioModule,
        MatTabsModule,
        MatCardModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatStepperModule,
        NgxMatSelectSearchModule,
    ],
    providers: [BedMasterService]
})
export class VendorMasterModule { }
