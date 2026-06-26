import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
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
import { BedDetailsDialogComponent } from './bed-occupancy/bed-details-dialog/bed-details-dialog.component';
import { BedOccupancyComponent } from './bed-occupancy/bed-occupancy.component';
import { CashlessDashboardComponent } from './cashless-dashboard/cashless-dashboard.component';
import { DailyDashboardComponent } from './daily-dashboard/daily-dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FinancialDashboardComponent } from './financial-dashboard/financial-dashboard.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LabFinancialDashboardComponent } from './lab-financial-dashboard/lab-financial-dashboard.component';
import { NewDashboardComponent } from './new-dashboard/new-dashboard.component';
import { BedstausgraphComponent } from './new-finacialdashboard/bedstausgraph/bedstausgraph.component';
import { BillingSummarygraphComponent } from './new-finacialdashboard/billing-summarygraph/billing-summarygraph.component';
import { DrwisecollectionComponent } from './new-finacialdashboard/drwisecollection/drwisecollection.component';
import { NewFinacialdashboardComponent } from './new-finacialdashboard/new-finacialdashboard.component';
import { OPIPCollectiongraphComponent } from './new-finacialdashboard/opipcollectiongraph/opipcollectiongraph.component';
import { PharCollecionGraphComponent } from './new-finacialdashboard/phar-collecion-graph/phar-collecion-graph.component';
import { ServiceGraphComponent } from './new-finacialdashboard/service-graph/service-graph.component';
import { ServiceReceiptGraphComponent } from './new-finacialdashboard/service-receipt-graph/service-receipt-graph.component';
import { OperatonalDashboardComponent } from './operatonal-dashboard/operatonal-dashboard.component';
import { PharmacyDashboardComponent } from './pharmacy-dashboard/pharmacy-dashboard.component';
import { VisitDatagraphComponent } from './new-finacialdashboard/visit-datagraph/visit-datagraph.component';
import { SalesSummaryComponent } from './pharmacy-dashboard/sales-summary/sales-summary.component';
import { PathologyDashboardComponent } from './pathology-dashboard/pathology-dashboard.component';
import { RadiologyDashboardComponent } from './radiology-dashboard/radiology-dashboard.component';
import { RadiologysaleComponent } from './lab-financial-dashboard/radiologysale/radiologysale.component';
import { CashlessCompanyDashboardComponent } from './cashless-company-dashboard/cashless-company-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { CompanyPatientSummaryDashboardComponent } from './cashless-company-dashboard/company-patient-summary-dashboard/company-patient-summary-dashboard.component';
import { TestingDailyDashBoardComponent } from './testing-daily-dash-board/testing-daily-dash-board.component';
import { DepartmentSalesComponent } from './lab-financial-dashboard/department-sales/department-sales.component';
import { NgChartsModule } from 'ng2-charts';
// import { FinancetestComponent } from './financetest/financetest.component';

@NgModule({
    declarations: [
        DailyDashboardComponent,
        BedOccupancyComponent,
        BedDetailsDialogComponent,
        PharmacyDashboardComponent,
        SalesSummaryComponent,
        HomePageComponent,
        NewDashboardComponent,
        RadiologyDashboardComponent,
        PathologyDashboardComponent,
        CashlessDashboardComponent,
        LabFinancialDashboardComponent,
        FinancialDashboardComponent,
        NewFinacialdashboardComponent,
        ServiceGraphComponent,
        DrwisecollectionComponent,
        OPIPCollectiongraphComponent,
        PharCollecionGraphComponent,
        VisitDatagraphComponent,
        BillingSummarygraphComponent,
        BedstausgraphComponent,
        ServiceReceiptGraphComponent,
        OperatonalDashboardComponent,
        RadiologysaleComponent,
        CashlessCompanyDashboardComponent,
        CompanyPatientSummaryDashboardComponent,
        TestingDailyDashBoardComponent,
        DepartmentSalesComponent
        // FinancetestComponent
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
        MatGridListModule,
        MatDialogModule,
        SharedModule,
        NgChartsModule
    ],
    providers: [
        DatePipe
    ]
})
export class DashboardModule { }
