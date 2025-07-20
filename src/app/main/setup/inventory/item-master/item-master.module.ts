import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { SharedModule } from "../../../shared/shared.module";
import { ItemFormMasterComponent } from "./item-form-master/item-form-master.component";
import { ItemMasterComponent } from "./item-master.component";
import { ItemMasterService } from "./item-master.service";

const routes: Routes = [
    {
        path: "**",
        component: ItemMasterComponent
    },
];

@NgModule({
    declarations: [ItemMasterComponent, ItemFormMasterComponent],
    imports: [
        RouterModule.forChild(routes),
        MatChipsModule,
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
               MatStepperModule,
               MatAutocompleteModule,
               MatProgressSpinnerModule,
               SharedModule,
               NgxMatSelectSearchModule,
               MatButtonToggleModule,
               MatDialogModule,
               SharedModule
    ],
     providers: [ItemMasterService, DatePipe]
})
export class ItemMasterModule {}
