import { AppointmentComponent } from "./appointment.component";
import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRippleModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { RouterModule, Routes } from "@angular/router";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDividerModule } from "@angular/material/divider";
import { MatRadioModule } from "@angular/material/radio";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { SharedModule } from "app/main/shared/shared.module";
import { EditConsultantDoctorComponent } from "./edit-consultant-doctor/edit-consultant-doctor.component";
import { EditRefraneDoctorComponent } from "./edit-refrane-doctor/edit-refrane-doctor.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FeedbackComponent } from "./feedback/feedback.component";
import { PatientAppointmentComponent } from './patient-appointment/patient-appointment.component';
import { ImageViewComponent } from './image-view/image-view.component';
import { CameraComponent } from './camera/camera.component';
import { WebcamModule } from 'ngx-webcam';
import { HeaderComponent } from "app/main/shared/componets/header/header.component";
import { InfoheadDirective } from './infohead.directive';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatDrawer, MatDrawerContainer, MatSidenavModule } from "@angular/material/sidenav";
import { VisitDetailsComponent } from './visit-details/visit-details.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CrossConsultationComponent } from './cross-consultation/cross-consultation.component';
// import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import {NgxPrintModule} from 'ngx-print';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { PatientVitalInformationComponent } from './patient-vital-information/patient-vital-information.component';
import { UpdateRegisteredPatientInfoComponent } from './update-registered-patient-info/update-registered-patient-info.component';
import { PreviousDepartmentListComponent } from './update-registered-patient-info/previous-department-list/previous-department-list.component';

const routes: Routes = [
    {
        path: "**",
        component: AppointmentComponent,
    },
];
@NgModule({
    declarations: [
        AppointmentComponent,
         EditConsultantDoctorComponent,
        EditRefraneDoctorComponent,
        FeedbackComponent,
        PatientAppointmentComponent,
        ImageViewComponent,
        CameraComponent,
        InfoheadDirective,
        VisitDetailsComponent,
        CrossConsultationComponent,
        PatientVitalInformationComponent,
        UpdateRegisteredPatientInfoComponent,
        PreviousDepartmentListComponent,
        
    ],
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
        WebcamModule,
        ScrollingModule,
        MatSidenavModule,
        NgxQRCodeModule,
        NgxPrintModule,
        MatButtonToggleModule
    ],
    providers: [DatePipe],
    entryComponents: [AppointmentComponent],
})
export class appointmentModule {}
