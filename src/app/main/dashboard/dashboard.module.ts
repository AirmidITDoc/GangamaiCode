import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from 'app/main/shared/shared.module';
import { BedOccupancyComponent } from './bed-occupancy/bed-occupancy.component';
import { DailyDashboardComponent } from './daily-dashboard/daily-dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { PharmacyDashboardComponent } from './pharmacy-dashboard/pharmacy-dashboard.component';
import { SalesSummaryComponent } from './pharmacy-dashboard/sales-summary/sales-summary.component';

@NgModule({
    declarations: [
        DailyDashboardComponent,
        BedOccupancyComponent,
        PharmacyDashboardComponent,
        SalesSummaryComponent,
        HomePageComponent
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
