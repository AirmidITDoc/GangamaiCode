import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
//import { NgChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseWidgetModule } from '@fuse/components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';

import {  MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DailyDashboardComponent } from './daily-dashboard/daily-dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { BedOccupancyComponent } from './bed-occupancy/bed-occupancy.component';
import { PharmacyDashboardComponent } from './pharmacy-dashboard/pharmacy-dashboard.component'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatSortModule } from '@angular/material/sort'; 
import { RouterModule, Routes } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/main/shared/shared.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SalesSummaryComponent } from './pharmacy-dashboard/sales-summary/sales-summary.component';
// import { Component } from '@angular/core';

 
 


@NgModule({
    declarations: [
        DailyDashboardComponent,
        BedOccupancyComponent,
        PharmacyDashboardComponent,
        SalesSummaryComponent
    ],
    imports: [
        CommonModule,
        CommonModule,
        MatProgressBarModule,
        // Component,
        DashboardRoutingModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatIconModule,
        FuseSharedModule,
        //NgChartsModule,
        NgxChartsModule,
        FuseWidgetModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatDatepickerModule,
        MatSelectModule,
        MatRadioModule,
        MatPaginatorModule,
        MatCardModule,
        MatToolbarModule,
        SharedModule
    ],
    providers: [
        DatePipe
    ]
})
export class DashboardModule { }
