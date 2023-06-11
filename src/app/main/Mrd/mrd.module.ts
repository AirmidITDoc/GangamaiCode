import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CertificateComponent } from './certificate/certificate.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';

import { MatStepperModule } from '@angular/material/stepper';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MrdService } from './mrd.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatBadgeModule } from '@angular/material/badge';
import { SharedModule } from '../shared/shared.module';
import { NewCertificateComponent } from './certificate/new-certificate/new-certificate.component';



const approutes : Routes =[
  {
    path: 'certificates',
    component: CertificateComponent
  },
  // {
  //   path: 'prescription',
  //   component: MedicalCasepaperComponent
  // },
];

@NgModule({
  declarations: [CertificateComponent, NewCertificateComponent],
  imports: [
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatRadioModule,
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
    MatDatepickerModule ,
    // NgMultiSelectDropDownModule.forRoot(),
    MatTooltipModule,
    SharedModule,
    MatBadgeModule,
    // AngularEditorModule,
    //  NgxPrintModule,
    //  RichTextEditorModule,
    //  DateTimePickerModule,
    MatIconModule,
  RouterModule.forChild(approutes)
  ],
   providers:[MrdService,
    DatePipe,
    {provide: MatDialogRef, useValue: {}},
    NotificationServiceService]
})
export class MrdModule { }
