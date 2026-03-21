import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTimepickerModule } from 'mat-timepicker';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from '../shared/shared.module';
import { MrdService } from './mrd.service';
import { NewCertificateVersionComponent } from './new-certificate-version/new-certificate-version.component';



const approutes: Routes = [
    {
        path: 'certificates',
        component: NewCertificateVersionComponent
    },
    // {
    //   path: 'prescription',
    //   component: MedicalCasepaperComponent
    // },
];

@NgModule({
    declarations: [],
    // declarations: [CertificateComponent, NewCertificateComponent],
    imports: [
        RouterModule.forChild(approutes),
        //  MatTableExporterModule,
        MatChipsModule,
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
        FuseSidebarModule,
        CommonModule,
        MatExpansionModule,
        MatCardModule,
        MatSlideToggleModule,
        MatListModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatTabsModule,
        MatTimepickerModule
    ],
    providers: [MrdService,
        DatePipe,
        { provide: MatDialogRef, useValue: {} },
    ]
})
export class MrdModule { }
