

import { PathologyDashboardComponent } from './pathology-dashboard/pathology-dashboard.component';
import { RadiologyDashboardComponent } from './radiology-dashboard/radiology-dashboard.component';
import { CashlessDashboardComponent } from './cashless-dashboard/cashless-dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { FuseWidgetModule } from '@fuse/components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DailyDashboardComponent } from './daily-dashboard/daily-dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { BedOccupancyComponent } from './bed-occupancy/bed-occupancy.component';


@NgModule({
  declarations: [
    DailyDashboardComponent,
    BedOccupancyComponent,
  ],
  imports: [
    CommonModule,
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    FuseSharedModule,
    ChartsModule,
    NgxChartsModule,
    FuseWidgetModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatPaginatorModule,
    MatCardModule
  ],
  providers: [
    DatePipe
  ],
  entryComponents: [DailyDashboardComponent]
})
export class DashboardModule { }
