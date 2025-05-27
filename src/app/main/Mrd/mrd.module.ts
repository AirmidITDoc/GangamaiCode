import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { CertificateComponent } from './certificate/certificate.component';

import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from 'app/core/notification.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from '../shared/shared.module';
import { NewCertificateComponent } from './certificate/new-certificate/new-certificate.component';
import { MrdService } from './mrd.service';



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
    NotificationService]
})
export class MrdModule { }
