import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatRippleModule } from "@angular/material/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { SharedModule } from "app/main/shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MedicalrecordComponent } from "./medicalrecord.component";
import { AppointmentlistService } from "../appointment-list/appointmentlist.service";
import { PrescriptionTemplateComponent } from "../new-casepaper/prescription-template/prescription-template.component";
import { PrePresciptionListComponent } from "../new-casepaper/pre-presciption-list/pre-presciption-list.component";
import { NewCasepaperComponent } from "../new-casepaper/new-casepaper.component";
import { AddItemComponent } from "../new-casepaper/add-item/add-item.component";
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { PatientcertificateComponent } from './patientcertificate/patientcertificate.component';
import { AngularEditorModule } from "@kolkov/angular-editor";
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
