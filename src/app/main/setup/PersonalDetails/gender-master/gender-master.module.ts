import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseSidebarModule } from "@fuse/components";
import { GenderMasterComponent } from "./gender-master.component";
import { GenderMasterService } from "./gender-master.service";
import { SharedModule } from "app/main/shared/shared.module";
import { NewGendermasterComponent } from './new-gendermaster/new-gendermaster.component';
import { MatDialogModule } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";


const routes: Routes = [
    {
        path: "**",
        component: GenderMasterComponent,
    },
];

@NgModule({
    declarations: [GenderMasterComponent, NewGendermasterComponent],
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
    providers: [GenderMasterService, DatePipe]
})
export class GenderMasterModule {}
