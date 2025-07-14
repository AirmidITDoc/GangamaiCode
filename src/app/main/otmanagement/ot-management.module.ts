import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
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

import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from '../shared/shared.module';
import { OTManagementServiceService } from './ot-management-service.service';



// otmanagement/listofreservation

const approutes : Routes =[
  {
    path: "listofreservation",
    loadChildren: () =>
    import("./ot-reservation/ot-reservation.module").then((m) => m.OTReservationModule),
       
},
// {
//   path: "endoscopylist",
//   loadChildren: () =>
//   import("./ot-reservation/ot-reservation.module").then((m) => m.OTReservationModule),
     
// },
{
  path: "otrequest",
  loadChildren: () =>
  import("./ot-request/ot-request.module").then((m) => m.OtRequestModule),
     
},
{
  path: "cathlablist",
  loadChildren: () =>
  import("./CathLab/cath-lab/cath-lab.module").then((m) => m.CathLabModule),
     
},
// {
//   path:"otnotes",
//   loadChildren: () =>
//     import("./ot-note/ot-note.module").then((m) => m.OTNoteModule),
// },
{
  path:"endoscopylist",
  loadChildren: () =>
  import("./Endoscopy/endoscopy/endoscopy.module").then((m) => m.EndoscopyModule),
}
];

@NgModule({
  declarations: [],
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
   providers:[OTManagementServiceService
   ]
})
export class OTManagementModule { }
