import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from 'app/main/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSliderModule } from '@angular/material/slider';
import { MatTreeModule } from '@angular/material/tree';
import { LabPatientRegComponent } from './lab-patient-reg.component';
import { NewLabPatientRegComponent } from './new-lab-patient-reg/new-lab-patient-reg.component';
import { LabRegBillDeatilsComponent } from './lab-reg-bill-deatils/lab-reg-bill-deatils.component';
import { EstimateForPatientComponent } from './estimate-for-patient/estimate-for-patient.component';
import { DiscountAfterFinalLabbillComponent } from './discount-after-final-labbill/discount-after-final-labbill.component';
import { EditLabregComponent } from './edit-labreg/edit-labreg.component';
import { PrevlabHistoryComponent } from './prevlab-history/prevlab-history.component';

const routes: Routes = [
  {
    path: '**',
    component: LabPatientRegComponent
  },
];

@NgModule({
  declarations: [LabPatientRegComponent, NewLabPatientRegComponent, LabRegBillDeatilsComponent, EstimateForPatientComponent, DiscountAfterFinalLabbillComponent, 
    EditLabregComponent, PrevlabHistoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    MatSlideToggleModule,
    MatListModule,
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
    MatDialogModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    SharedModule,
    NgxMatSelectSearchModule,
    MatBadgeModule,
    MatSelectModule,
    MatSelectModule,
    MatChipsModule,
    MatGridListModule,
    MatSidenavModule,
    MatTimepickerModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatTreeModule,
  ],
  providers: [
    DatePipe,
  ]
})
export class LabPatientRegModule { }
