import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ItemTypeMasterComponent } from "./item-type-master.component";
import { RouterModule, Routes } from "@angular/router";
import { ItemTypeMasterService } from "./item-type-master.service";
import { FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { NewItemtypeComponent } from './new-itemtype/new-itemtype.component';
import { MatDialogModule } from "@angular/material/dialog";
import { SharedModule } from "app/main/shared/shared.module";

const routes: Routes = [
    {
        path: "**",
        component: ItemTypeMasterComponent,
    },
];

@NgModule({
    declarations: [ItemTypeMasterComponent, NewItemtypeComponent],
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
    providers: [ItemTypeMasterService,DatePipe],
    entryComponents: [ItemTypeMasterComponent],
})
export class ItemTypeMasterModule {}
