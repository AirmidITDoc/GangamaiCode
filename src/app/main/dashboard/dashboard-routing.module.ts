import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyDashboardComponent } from './daily-dashboard/daily-dashboard.component';
import { PathologyDashboardComponent } from './pathology-dashboard/pathology-dashboard.component';
import { CashlessDashboardComponent } from './cashless-dashboard/cashless-dashboard.component';
import { RadiologyDashboardComponent } from './radiology-dashboard/radiology-dashboard.component';
import { PharmacyDashboardComponent } from './pharmacy-dashboard/pharmacy-dashboard.component';
import { BedOccupancyComponent } from './bed-occupancy/bed-occupancy.component';

const routes: Routes = [
  {
    path: '',
    component: DailyDashboardComponent
  },
  {
    path: 'dashboard',
    component: DailyDashboardComponent
  },
  {
    path: 'daily-dashboard',
    component: DailyDashboardComponent
  },
  {
    path: 'Pathology-dashboard',
    component: PathologyDashboardComponent
  },
  {
    path: 'Radiololgy-dashboard',
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
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
