import { NgModule } from "@angular/core";

import { CommonModule, DatePipe } from "@angular/common";
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
import { SharedModule } from "app/main/shared/shared.module";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";

import { MatTabsModule } from "@angular/material/tabs";
import { MatTimepickerModule } from "mat-timepicker";
import { BillListDoctorwiseComponent } from "./bill-list-doctorwise.component";
import { BillDoctorwiseService } from "./bill-doctorwise.service";
import { DoctorAddonpayComponent } from './doctor-addonpay/doctor-addonpay.component';
import { ProcessDoctorshareComponent } from './process-doctorshare/process-doctorshare.component';
import { MatDividerModule } from "@angular/material/divider";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatGridListModule } from "@angular/material/grid-list";
import { PatientBilldetailComponent } from './patient-billdetail/patient-billdetail.component';



const routes: Routes = [
    {
        path: "**",
        component: BillListDoctorwiseComponent,
    },
];

@NgModule({
    declarations: [BillListDoctorwiseComponent, DoctorAddonpayComponent, ProcessDoctorshareComponent, PatientBilldetailComponent],
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
             MatTabsModule,
             MatCardModule,
             MatDividerModule,
             MatDialogModule,
             FuseSharedModule,
             FuseConfirmDialogModule,
             FuseSidebarModule,
             MatChipsModule,
             MatProgressSpinnerModule,
             // WebcamModule,
             ReactiveFormsModule,
             MatAutocompleteModule,
             MatSidenavModule,
             MatExpansionModule,
             MatGridListModule,
             MatSnackBarModule,
             MatSlideToggleModule,
             MatListModule,
             SharedModule,
             MatStepperModule,
             NgxMatSelectSearchModule,
             MatDatepickerModule,
             //  NgMultiSelectDropDownModule.forRoot(),
             MatTooltipModule,
             MatTimepickerModule,
                
    ],
    providers: [BillDoctorwiseService, DatePipe]
})
export class BilllistDoctorwiseModule { }
