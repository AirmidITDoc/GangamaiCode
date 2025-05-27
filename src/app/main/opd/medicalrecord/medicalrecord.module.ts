import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from '@angular/material/chips';
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
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { SharedModule } from "app/main/shared/shared.module";
import { AppointmentlistService } from "../appointment-list/appointmentlist.service";
import { AddItemComponent } from "../new-casepaper/add-item/add-item.component";
import { NewCasepaperComponent } from "../new-casepaper/new-casepaper.component";
import { PrePresciptionListComponent } from "../new-casepaper/pre-presciption-list/pre-presciption-list.component";
import { PrescriptionTemplateComponent } from "../new-casepaper/prescription-template/prescription-template.component";
import { MedicalrecordComponent } from "./medicalrecord.component";
import { PatientcertificateComponent } from './patientcertificate/patientcertificate.component';
const routes: Routes = [
    {
        path: "**",
        component: MedicalrecordComponent,
    },
];

@NgModule({
  declarations: [MedicalrecordComponent, PrescriptionTemplateComponent,
    PrePresciptionListComponent,NewCasepaperComponent,AddItemComponent, PatientcertificateComponent
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
            MatSnackBarModule,
            FuseSharedModule,
            FuseConfirmDialogModule,
            MatAutocompleteModule,
            FuseSidebarModule,
            CommonModule,
            MatExpansionModule,
            MatCardModule,
            MatSlideToggleModule,
            MatTabsModule,
            SharedModule,
            MatDialogModule,
            MatListModule,
            MatTooltipModule,
            MatChipsModule,
            MatButtonToggleModule,
            AngularEditorModule
  ],
  providers: [AppointmentlistService, DatePipe]
})
export class MedicalrecordModule { }
