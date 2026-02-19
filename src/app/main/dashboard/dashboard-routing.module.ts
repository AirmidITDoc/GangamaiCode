import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyDashboardComponent } from './daily-dashboard/daily-dashboard.component';
import { PathologyDashboardComponent } from './pathology-dashboard/pathology-dashboard.component';
import { CashlessDashboardComponent } from './cashless-dashboard/cashless-dashboard.component';
import { RadiologyDashboardComponent } from './radiology-dashboard/radiology-dashboard.component';
import { PharmacyDashboardComponent } from './pharmacy-dashboard/pharmacy-dashboard.component';
import { BedOccupancyComponent } from './bed-occupancy/bed-occupancy.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NewDashboardComponent } from './new-dashboard/new-dashboard.component';
import { LabFinancialDashboardComponent } from './lab-financial-dashboard/lab-financial-dashboard.component';
import { FinancialDashboardComponent } from './financial-dashboard/financial-dashboard.component';
import { NewFinacialdashboardComponent } from './new-finacialdashboard/new-finacialdashboard.component';

const routes: Routes = [
  {
    path: '',
    component: NewDashboardComponent
  },
  {
    path: 'dashboard',
    component: NewDashboardComponent
  },
  {
    path: 'old-dashboard',
    component: DailyDashboardComponent
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
    component: CashlessDashboardComponent
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
