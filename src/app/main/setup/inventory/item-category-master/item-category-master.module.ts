import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ItemCategoryMasterComponent } from "./item-category-master.component";
import { RouterModule, Routes } from "@angular/router";
import { ItemCategoryMasterService } from "./item-category-master.service";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { SharedModule } from "app/main/shared/shared.module";
import { NewItemcategoryComponent } from './new-itemcategory/new-itemcategory.component';
import { MatDialogModule } from "@angular/material/dialog";

const routes: Routes = [
    {
        path: "**",
        component: ItemCategoryMasterComponent,
    },
];

@NgModule({
    declarations: [ItemCategoryMasterComponent, NewItemcategoryComponent],
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
    providers: [ItemCategoryMasterService, DatePipe]
})
export class ItemCategoryMasterModule {}
