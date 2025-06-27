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
import { DoctorMasterComponent } from "./doctor-master.component";
import { DoctorMasterService } from "./doctor-master.service";
import { NewDoctorComponent } from "./new-doctor/new-doctor.component";
import { SignatureViewComponent } from "./signature-view/signature-view.component";
import { ExcelPreviewDialogComponent } from "./excel-preview-dialog/excel-preview-dialog.component";
import { DoctorschdulerComponent } from './doctorschduler/doctorschduler.component';
import { MatTabsModule } from "@angular/material/tabs";
import { DoctorEducationComponent } from './doctor-education/doctor-education.component';
import { DoctorExperienceComponent } from './doctor-experience/doctor-experience.component';
import { DoctorChargesComponent } from './doctor-charges/doctor-charges.component';
import { DoctorSchduleComponent } from './doctor-schdule/doctor-schdule.component';
import { MatTimepickerModule } from "mat-timepicker";
import { DoctorLeaveComponent } from "./doctor-leave/doctor-leave.component";

const routes: Routes = [
    {
        path: "**",
        component: DoctorMasterComponent,
    },
];

@NgModule({
    declarations: [DoctorMasterComponent, NewDoctorComponent, SignatureViewComponent, ExcelPreviewDialogComponent, DoctorschdulerComponent, DoctorEducationComponent, DoctorExperienceComponent, DoctorChargesComponent,
         DoctorSchduleComponent,DoctorLeaveComponent],
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
           MatTabsModule,
        //    SignaturePadModule 
                MatTimepickerModule,
                
                
    ],
    providers: [DoctorMasterService, DatePipe]
})
export class DoctorMasterModule { }
