import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from 'app/main/shared/shared.module';
import { MatTimepickerModule } from 'mat-timepicker';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DiscountAfterFinalLabbillComponent } from './discount-after-final-labbill/discount-after-final-labbill.component';
import { EditLabregComponent } from './edit-labreg/edit-labreg.component';
import { EditPatientRegComponent } from './edit-patient-reg/edit-patient-reg.component';
import { EstimateForPatientComponent } from './estimate-for-patient/estimate-for-patient.component';
import { LabPatientRegComponent } from './lab-patient-reg.component';
import { LabRegBillDeatilsComponent } from './lab-reg-bill-deatils/lab-reg-bill-deatils.component';
import { LabTrackingDetailsComponent } from './lab-tracking-details/lab-tracking-details.component';
import { NewLabPatientRegComponent } from './new-lab-patient-reg/new-lab-patient-reg.component';
import { PrevlabHistoryComponent } from './prevlab-history/prevlab-history.component';
import { LabPackageDetailsComponent } from './lab-package-details/lab-package-details.component';

const routes: Routes = [
    {
        path: '**',
        component: LabPatientRegComponent
    },
];

@NgModule({
    declarations: [LabPatientRegComponent, NewLabPatientRegComponent, LabRegBillDeatilsComponent, EstimateForPatientComponent, DiscountAfterFinalLabbillComponent,
        EditLabregComponent, PrevlabHistoryComponent, LabTrackingDetailsComponent, EditPatientRegComponent, LabPackageDetailsComponent],
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
