import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CathLabListComponent } from './cath-lab-list/cath-lab-list.component';
import { EndoscopyListComponent } from './endoscopy-list/endoscopy-list.component';
import { NeuroSurgeryListComponent } from './neuro-surgery-list/neuro-surgery-list.component';
import { OTRequestListComponent } from './ot-request-list/ot-request-list.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { OTNoteComponent } from './ot-note/ot-note.component';
import { PrePostNoteComponent } from './pre-post-note/pre-post-note.component';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { OTManagementService } from './ot-management.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtRequestListComponent } from './ot-request-list/ot-request-list.component';
import { DatePipe } from '@angular/common';
import { EndoscopyDetailsComponent } from './endoscopy-details/endoscopy-details.component';
import { CathlabListComponent } from './cathlab-list/cathlab-list.component';
import { CommonModule } from '@angular/common';
import { OtManagementService } from './ot-management.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from '../shared/shared.module';




const appRoutes: Routes = [
//   {
//     path: "otrequest",
//     component:OtRequestListComponent
//   },
//   {
//     path: "listofreservation",
//     component:ReservationListComponent
//   },
//   {
//     path: "endoscopylist",
//     component:EndoscopyDetailsComponent
//   },
//   {
//     path: "cathlablist",
//     component:CathlabListComponent
//   },
//   {
//     path: "otnotes",
//     component:OTNoteComponent
//   }

];

@NgModule({
  declarations: [
    // CathLabListComponent, EndoscopyListComponent, NeuroSurgeryListComponent, OTRequestListComponent, ReservationListComponent, OTNoteComponent, PrePostNoteComponent, NewEndoscopyRequestComponent
  ],
  imports: [
    RouterModule.forChild(appRoutes),
     CommonModule,
    MatButtonModule,
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
    MatIconModule
    
  ],
  providers:[OTManagementService,
      DatePipe,
      {provide: MatDialogRef, useValue: {}},
      NotificationServiceService]
})
export class OtmanagementModule { }
