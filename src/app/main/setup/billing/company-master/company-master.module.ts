import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { CompanyMasterComponent } from "./company-master.component";
import { CompanyMasterService } from "./company-master.service";
import { SharedModule } from "app/main/shared/shared.module";
import { FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { CompanyMasterListComponent } from "./company-master-list/company-master-list.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";

const routes: Routes = [
    {
        path: "**",
        component: CompanyMasterComponent,
    },
];

@NgModule({
    declarations: [CompanyMasterComponent, CompanyMasterListComponent],
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
        MatCardModule,
    ],
    providers: [CompanyMasterService, DatePipe]
})
export class CompanyMasterModule {}
