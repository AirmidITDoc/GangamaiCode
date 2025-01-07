import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { GenericmasterComponent } from "./genericmaster.component";
import { RouterModule, Routes } from "@angular/router";
import { GenericmasterService } from "./genericmaster.service";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import {  MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FuseSidebarModule } from "@fuse/components";
import { NewGnericMasterComponent } from './new-gneric-master/new-gneric-master.component';
import { SharedModule } from "app/main/shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";

const routes: Routes = [
    {
        path: "**",
        component: GenericmasterComponent,
    },
];

@NgModule({
    declarations: [GenericmasterComponent, NewGnericMasterComponent],
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
    providers: [GenericmasterService, DatePipe]
})
export class GenericmasterModule {}
