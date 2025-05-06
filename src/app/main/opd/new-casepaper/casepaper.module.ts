import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
//import { BrowseOpdRefundListComponent } from './browse-opd-refund-list/browse-opd-refund-list.component';
//import { BrowseOpdRefundSidebarComponent } from './browse-opd-refund-sidebar/browse-opd-refund-sidebar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/main/shared/shared.module';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from '@angular/material/chips';
import { NewCasepaperComponent } from './new-casepaper.component';
import { CasepaperService } from './casepaper.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import { MatTreeModule } from '@angular/material/tree';
import { PrescriptionTemplateComponent } from './prescription-template/prescription-template.component';
import { PrePresciptionListComponent } from './pre-presciption-list/pre-presciption-list.component';
import { AddItemComponent } from './add-item/add-item.component';
// import { FocusNextDirective } from './directives/focus-next/focus-next.directive';
import { FocusNextDirective } from 'app/main/shared/directives/focus-next/focus-next.directive';

const routes: Routes = [
    {
        path: '**',
        component: NewCasepaperComponent,
    },
];
@NgModule({
    declarations: [
        NewCasepaperComponent,
        PrescriptionTemplateComponent,
        PrePresciptionListComponent,
        AddItemComponent,
        FocusNextDirective
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
        MatDialogModule,
        MatStepperModule,
        // WebcamModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatExpansionModule,
        FuseSidebarModule,
        MatGridListModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatListModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatTooltipModule,
        MatTreeModule,
        MatSliderModule,
        MatButtonToggleModule,
        MatDialogModule ,
        CommonModule,
    ],
    providers: [
        CasepaperService,
        // NotificationService ,
        DatePipe
    ],
     exports: [
            FocusNextDirective
        ],
})
export class CasepaperModule { }
