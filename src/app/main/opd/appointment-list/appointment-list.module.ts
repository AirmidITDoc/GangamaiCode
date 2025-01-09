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
import { MatCheckboxModule } from "@angular/material/checkbox";
import { WebcamModule } from 'ngx-webcam';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatDrawer, MatDrawerContainer, MatSidenavModule } from "@angular/material/sidenav";
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxPrintModule } from 'ngx-print';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips"; 
import { AppointmentListComponent } from "./appointment-list.component";  
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTreeModule } from "@angular/material/tree";
import { MatSliderModule } from "@angular/material/slider";
import { NewCasepaperComponent } from "../new-casepaper/new-casepaper.component";
import { PrescriptionTemplateComponent } from "../new-casepaper/prescription-template/prescription-template.component";
import { PrePresciptionListComponent } from "../new-casepaper/pre-presciption-list/pre-presciption-list.component";
import { AddItemComponent } from "../new-casepaper/add-item/add-item.component";
import { PatientcertificateComponent } from './patientcertificate/patientcertificate.component';


const routes: Routes = [
  {
    path: "**",
    component: AppointmentListComponent,
  },
];
@NgModule({
  declarations: [
    AppointmentListComponent, 
    NewCasepaperComponent,
    PrescriptionTemplateComponent,
    PrePresciptionListComponent,
    AddItemComponent,
    PatientcertificateComponent


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
         MatCardModule,
         MatDividerModule,
         MatProgressSpinnerModule,
         FuseSharedModule,
         FuseConfirmDialogModule,
         FuseSidebarModule,
         // MatDialogModule,
         MatStepperModule,
         // WebcamModule,
         ReactiveFormsModule,
         MatSidenavModule,
         MatExpansionModule,
         FuseSidebarModule,
          MatGridListModule,
         MatSnackBarModule,
         MatSlideToggleModule , 
         MatListModule,
         SharedModule,
         NgxMatSelectSearchModule,
         MatAutocompleteModule,
         MatChipsModule,
         MatTooltipModule,
         MatTreeModule,
         MatSliderModule,
         MatButtonToggleModule
  ],
  providers: [DatePipe],
  entryComponents: [AppointmentListComponent],
})
export class AppointmentListModule { }

