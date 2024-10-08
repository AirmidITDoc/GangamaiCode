import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SupplierMasterComponent } from "./supplier-master.component";
import { RouterModule, Routes } from "@angular/router";
import { SupplierFormMasterComponent } from "./supplier-form-master/supplier-form-master.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";

import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatBadgeModule } from "@angular/material/badge";

import { SupplierMasterService } from "./supplier-master.service";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
const routes: Routes = [
    {
        path: "**",
        component: SupplierMasterComponent,
    },
];

@NgModule({
    declarations: [SupplierMasterComponent, SupplierFormMasterComponent],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,

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
        CommonModule,
        MatExpansionModule,
        MatCardModule,
        MatSlideToggleModule,
        MatListModule,
        MatTableModule,
        MatAutocompleteModule,
        NgxMatSelectSearchModule,
        MatBadgeModule,
        MatSelectModule,
        MatDatepickerModule,
        MatChipsModule
    ],
    providers: [SupplierMasterService],
    entryComponents: [SupplierMasterComponent],
})
export class SupplierMasterModule {}
