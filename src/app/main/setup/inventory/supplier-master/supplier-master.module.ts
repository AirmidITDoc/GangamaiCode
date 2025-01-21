import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
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
import { SupplierMasterService } from "./supplier-master.service";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { SharedModule } from "app/main/shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";
import { NewSupplierComponent } from './new-supplier/new-supplier.component';
import { MatStepperModule } from "@angular/material/stepper";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { SuppliertestingComponent } from './suppliertesting/suppliertesting.component';
import { FixSupplierComponent } from './fix-supplier/fix-supplier.component';

const routes: Routes = [
    {
        path: "**",
        component: SupplierMasterComponent,
    },
];
@NgModule({
    declarations: [SupplierMasterComponent, SupplierFormMasterComponent, NewSupplierComponent, SuppliertestingComponent, FixSupplierComponent],
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
    ],
    providers: [SupplierMasterService, DatePipe]
})
export class SupplierMasterModule {}
