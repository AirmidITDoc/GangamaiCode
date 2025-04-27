import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import {  MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRadioModule } from "@angular/material/radio";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatDialogModule } from "@angular/material/dialog";
import { SharedModule } from "app/main/shared/shared.module";
import { AppointmentListComponent } from "./appointment-list.component";
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { AppointmentlistService } from "./appointmentlist.service";
import { MatTabsModule } from "@angular/material/tabs";
import { MatListModule } from "@angular/material/list";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatStepperModule } from "@angular/material/stepper";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDividerModule } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { AbstractControl, ReactiveFormsModule } from "@angular/forms";
import { MatExpansionModule } from "@angular/material/expansion";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { ScrollingModule } from "@angular/cdk/scrolling";
//import { NgxPrintModule } from "ngx-print";
import { MatTooltipModule } from "@angular/material/tooltip";
// import { NgxQRCodeModule } from "@techiediaries/ngx-qrcode";
//import { WebcamModule } from "ngx-webcam";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { EditConsultantDoctorComponent } from './edit-consultant-doctor/edit-consultant-doctor.component';
import { EditRefranceDoctorComponent } from './edit-refrance-doctor/edit-refrance-doctor.component';
import { CrossConsultationComponent } from './cross-consultation/cross-consultation.component';
import { ImageViewComponent } from './image-view/image-view.component';
import { PatientvitalInformationComponent } from './new-appointment/patientvital-information/patientvital-information.component';
import { UpdateRegPatientInfoComponent } from './update-reg-patient-info/update-reg-patient-info.component';
import { PreviousDeptListComponent } from './update-reg-patient-info/previous-dept-list/previous-dept-list.component';
import { AppointmentBillingComponent } from "./appointment-billing/appointment-billing.component";


const routes: Routes = [
    {
        path: "**",
        component: AppointmentListComponent,
    },
];

@NgModule({
    declarations: [AppointmentListComponent, NewAppointmentComponent, EditConsultantDoctorComponent, EditRefranceDoctorComponent, CrossConsultationComponent, ImageViewComponent, PatientvitalInformationComponent, UpdateRegPatientInfoComponent, 
        PreviousDeptListComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
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
        FuseSidebarModule,
        MatListModule,
        MatSlideToggleModule,
        MatDividerModule,
        MatDialogModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatCardModule,
        MatListModule,
        MatTooltipModule,
        MatExpansionModule,
        MatListModule,
        //WebcamModule,
        ScrollingModule,
        MatSidenavModule,
        //NgxQRCodeModule,
        //NgxPrintModule,
        MatButtonToggleModule,
        
    ],
    providers: [AppointmentlistService, DatePipe]
})
export class AppointmentlistModule { }
