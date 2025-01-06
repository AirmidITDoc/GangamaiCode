import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, Routes } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/main/shared/shared.module';

import { AdmissionComponent } from './admission.component';
import { AdmissionService } from './admission.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { EditAdmissionComponent } from './edit-admission/edit-admission.component';
import { MLCInformationComponent } from './mlcinformation/mlcinformation.component';
import { SubCompanyTPAInfoComponent } from './sub-company-tpainfo/sub-company-tpainfo.component';
import { AdmissionNewComponent } from './admission-new/admission-new.component';
import { IPDSearcPatienthComponent } from '../../ipdsearc-patienth/ipdsearc-patienth.component';
import { NewAdmissionComponent } from './new-admission/new-admission.component';
import { RegAdmissionComponent } from '../reg-admission/reg-admission.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { CompanyInformationComponent } from '../../company-information/company-information.component';
import { AdmissionViewComponent } from './admission-view/admission-view.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

const routes: Routes = [
  { 
      path: '**', 
      component: AdmissionComponent 
  },
];

@NgModule({
    declarations: [
        AdmissionNewComponent,
        AdmissionComponent,
        EditAdmissionComponent,
        MLCInformationComponent,
        SubCompanyTPAInfoComponent, IPDSearcPatienthComponent, NewAdmissionComponent,
        RegAdmissionComponent,
        CompanyInformationComponent,
        AdmissionViewComponent
    ],
    imports: [
        CommonModule,
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
        MatTabsModule,
        MatCardModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatDialogModule,
        MatStepperModule,
        // WebcamModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatExpansionModule,
        FuseSidebarModule,
        MatDialogModule,
        MatGridListModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatListModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatTooltipModule,
        MatButtonToggleModule
    ],
    providers: [
        AdmissionService,
        DatePipe,
    ]
})
export class AdmissionModule { }
