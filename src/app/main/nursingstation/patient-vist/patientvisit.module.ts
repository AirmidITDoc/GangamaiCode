import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatBadgeModule } from '@angular/material/badge';
import { SharedModule } from 'app/main/shared/shared.module';
import { PatientVistComponent } from './patient-vist.component';
import { MatIconModule } from '@angular/material/icon';
import { NursingstationService } from '../nursingstation.service';
// import { DoctorNoteComponent } from './doctor-note/doctor-note.component';;


const routes: Routes = [
  {
      path: 'new-appointment',
      // component:PatientVistComponent,
  },{
      path: '**',
      component: PatientVistComponent
  }

];
@NgModule({
  declarations: [
 
    PatientVistComponent
      ],
  imports: [
      RouterModule.forChild(routes),
      CommonModule,
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
      MatBadgeModule,
      MatSelectModule,
      MatStepperModule,
      NgxMatSelectSearchModule,
      //  NgMultiSelectDropDownModule.forRoot(),
      //  MatTooltipModule,
      //  AngularEditorModule,
      //  NgxPrintModule,
      //  RichTextEditorModule,
      //  DateTimePickerModule
       
       
      
  ],
  providers: [
    NursingstationService
      // DatePipe,
      // NotificationServiceService
  ],
  entryComponents: [
    PatientVistComponent
          
  ]
})
export class PatientvisitModule { }
