import { ScrollingModule } from "@angular/cdk/scrolling";
import { DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
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
import { RouterModule, Routes } from "@angular/router";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { SharedModule } from "app/main/shared/shared.module";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { AppointmentListComponent } from "./appointment-list.component";
import { AppointmentlistService } from "./appointmentlist.service";
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
//import { NgxPrintModule } from "ngx-print";
import { MatTooltipModule } from "@angular/material/tooltip";
// import { NgxQRCodeModule } from "@techiediaries/ngx-qrcode";
//import { WebcamModule } from "ngx-webcam";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSidenavModule } from "@angular/material/sidenav";
import { CrossConsultationComponent } from './cross-consultation/cross-consultation.component';
import { EditConsultantDoctorComponent } from './edit-consultant-doctor/edit-consultant-doctor.component';
import { EditRefranceDoctorComponent } from './edit-refrance-doctor/edit-refrance-doctor.component';
import { ImageViewComponent } from './image-view/image-view.component';
import { PatientvitalInformationComponent } from './new-appointment/patientvital-information/patientvital-information.component';
import { PreviousDeptListComponent } from './update-reg-patient-info/previous-dept-list/previous-dept-list.component';
import { UpdateRegPatientInfoComponent } from './update-reg-patient-info/update-reg-patient-info.component';
import { WebcamModule } from "ngx-webcam";


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
        WebcamModule
    ],
    providers: [AppointmentlistService, DatePipe]
})
export class AppointmentlistModule { }
