import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
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
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { SharedModule } from "app/main/shared/shared.module";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { EditpackageComponent } from './editpackage/editpackage.component';
import { ServiceMasterFormComponent } from "./service-master-form/service-master-form.component";
import { ServiceMasterComponent } from "./service-master.component";
import { ServiceMasterService } from "./service-master.service";
import { TariffComponent } from './tariff/tariff.component';
import { MatTimepickerModule } from "mat-timepicker";

const routes: Routes = [
    {
        path: "**",
        component: ServiceMasterComponent,
    },
];

@NgModule({
    declarations: [ServiceMasterComponent, ServiceMasterFormComponent, TariffComponent, EditpackageComponent],
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
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatAutocompleteModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatCardModule,
        MatDialogModule,
        CommonModule,
        MatTabsModule,
        MatExpansionModule,
        MatListModule,
        MatTooltipModule,
        MatTimepickerModule
    ],
    providers: [ServiceMasterService, DatePipe]
})
export class ServiceMasterModule {}
