import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TalukaMasterComponent } from "./taluka-master.component";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import {  MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule } from "@fuse/components";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { TalukaMasterService } from "./taluka-master.service";

const routes: Routes = [
    {
        path: "**",
        component: TalukaMasterComponent,
    },
];

@NgModule({
    declarations: [TalukaMasterComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
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
        FuseSharedModule,
        FuseConfirmDialogModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        NgxMatSelectSearchModule,
    ],
    providers: [TalukaMasterService]
})
export class TalukaMasterModule {}
