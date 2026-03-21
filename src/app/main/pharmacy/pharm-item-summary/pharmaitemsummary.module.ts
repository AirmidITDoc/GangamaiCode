import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
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
import { PharmItemSummaryComponent } from './pharm-item-summary.component';

export const MONTH_YEAR_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};


const routes: Routes = [
    {
        path: '**',
        component: PharmItemSummaryComponent
    },
];

@NgModule({
    declarations: [
        PharmItemSummaryComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        CommonModule,
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
        // NgMultiSelectDropDownModule.forRoot(),
        MatTooltipModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule
    ],
    providers: [

        DatePipe,
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
        { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS },
    ],
})
export class PharmaitemsummaryModule { }
