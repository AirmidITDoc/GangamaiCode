import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemCategoryMasterComponent } from "./item-category-master.component";
import { RouterModule, Routes } from "@angular/router";
import { ItemCategoryMasterService } from "./item-category-master.service";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatRippleModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { SharedModule } from "app/main/shared/shared.module";
import { MatBadgeModule } from "@angular/material/badge";

const routes: Routes = [
    {
        path: "**",
        component: ItemCategoryMasterComponent,
    },
];

@NgModule({
    declarations: [ItemCategoryMasterComponent],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatRadioModule,
        MatSnackBarModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatBadgeModule,
        MatSelectModule,
       
    ],
    providers: [ItemCategoryMasterService],
    entryComponents: [ItemCategoryMasterComponent],
})
export class ItemCategoryMasterModule {}
