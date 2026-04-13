import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BedOccupancyComponent } from './bed-occupancy/bed-occupancy.component';
import { CashlessDashboardComponent } from './cashless-dashboard/cashless-dashboard.component';
import { DailyDashboardComponent } from './daily-dashboard/daily-dashboard.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LabFinancialDashboardComponent } from './lab-financial-dashboard/lab-financial-dashboard.component';
import { NewDashboardComponent } from './new-dashboard/new-dashboard.component';
import { NewFinacialdashboardComponent } from './new-finacialdashboard/new-finacialdashboard.component';
import { PathologyDashboardComponent } from './pathology-dashboard/pathology-dashboard.component';
import { PharmacyDashboardComponent } from './pharmacy-dashboard/pharmacy-dashboard.component';
import { RadiologyDashboardComponent } from './radiology-dashboard/radiology-dashboard.component';
import { CashlessCompanyDashboardComponent } from './cashless-company-dashboard/cashless-company-dashboard.component';
import { TestingDailyDashBoardComponent } from './testing-daily-dash-board/testing-daily-dash-board.component';
debugger
const routes: Routes = [
    {
        path: '',
        component: HomePageComponent // added by raksha on 08/04/2026(sachin sir require)
        // component: NewDashboardComponent
    },
    {
        path: 'dashboard',
        component: TestingDailyDashBoardComponent
    },
    {
        path: 'old-dashboard',
        component: TestingDailyDashBoardComponent
    },
    {
        path: 'Pathology-dashboard',
        component: PathologyDashboardComponent
    },
    {
        path: 'Radiology-dashboard',
        component: RadiologyDashboardComponent
    },
    {
        path: 'Cashless-dashboard',
        component: CashlessCompanyDashboardComponent
    },
    {
        path: 'Pharmacy-dashboard',
        component: PharmacyDashboardComponent
    },
    {
        path: 'bed-occupancy',
        component: BedOccupancyComponent
    },
    {
        path: 'home-page',
        component: HomePageComponent
    },
    {
        path: 'Financial-dashboard',
        component: NewFinacialdashboardComponent
    }
    ,
    {
        path: 'Lab-Financial-dashboard',
        component: LabFinancialDashboardComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
