import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ItemMasterComponent } from "./item-master.component";
import { RouterModule, Routes } from "@angular/router";
import { ItemFormMasterComponent } from "./item-form-master/item-form-master.component";
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
import { MatCardModule } from "@angular/material/card";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatListModule } from "@angular/material/list";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatBadgeModule } from "@angular/material/badge";
import { FormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { SharedModule } from "../../../shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";

const routes: Routes = [
    {
        path: "**",
        component: ItemMasterComponent,
    },
];

@NgModule({
    declarations: [ItemMasterComponent, ItemFormMasterComponent],
    imports: [

    RouterModule.forChild(routes),
    FormsModule,
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
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatSlideToggleModule,
    MatListModule,
    NgxMatSelectSearchModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatChipsModule,
    SharedModule,
    MatDialogModule,

    ],
    providers: [ItemMasterComponent,DatePipe],
    entryComponents: [ItemMasterComponent],
})
export class ItemMasterModule {}
