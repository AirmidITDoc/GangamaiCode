import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyDashboardComponent } from './daily-dashboard/daily-dashboard.component';
import { PathologyDashboardComponent } from './pathology-dashboard/pathology-dashboard.component';
import { CashlessDashboardComponent } from './cashless-dashboard/cashless-dashboard.component';

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
    path: 'Inventory-dashboard',
    component: PathologyDashboardComponent
  },
  {
    path: 'Pathology-dashboard',
    component: PathologyDashboardComponent
  },
  {
    path: 'Cashless-dashboard',
    component: CashlessDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
