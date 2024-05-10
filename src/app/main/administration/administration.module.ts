import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTreeModule } from '@angular/material/tree';
import { SharedModule } from '../shared/shared.module';


const appRoutes: Routes = [
  {
      path: "createuser",
      loadChildren: () => import("./create-user/create-user.module").then((m) => m.CreateUserModule),
  },
  {
    path: "configuration",
   loadChildren: () => import("./system-configuration/system-configuration.module").then((m) => m.SystemConfigurationModule),
  },
  {
    path: "roletemplatemaster",
   loadChildren: () => import("./role-template-master/role-template-master.module").then((m) => m.RoleTemplateMasterModule),
  },
 
  {
    path: "doctorshare",
    loadChildren: () => import("./doctor-share/doctor-share.module").then((m) => m.DOctorShareModule),
  },
  {
    path: "cancellation",
    loadChildren: () => import("./cancellation/cancellation.module").then((m) => m.CancellationModule),
  },
   {
    path:"dischargecancel",
    loadChildren: () => import("./discharge-cancel/discharge-cancel.module").then((m) => m.DischargeCancelModule),
   },
   {
    path:"paymentmodechanges",
    loadChildren: () => import("./paymentmodechanges/paymentmodechanges.module").then((m) => m.PaymentmodechangesModule),
   },
   {
    path:"paymentmodechangesforpharmacy",
    loadChildren: () => import("./paymentmodechangesfor-pharmacy/paymentmodechangesfor-pharmacy.module").then((m) => m.PaymentmodechangesforPharmacyModule),
   },
   {
    path:"tallyinterface",
    loadChildren: () => import("./tally-interface/tally-interface.module").then((m)=>m.TallyInterfaceModule),
   },
   {
    path:"pharmacypayipadvmode",
    loadChildren: () => import("./pharmacypayipadvmode/pharmacypayipadvmode.module").then((m)=>m.PharmacypayipadvmodeModule),
   },
   {
    path:"scheduler",
    loadChildren: () => import("./scheduler/scheduler.module").then((m)=>m.NewScdulerModule),
   },
 
 
];

@NgModule({
  declarations: [  ],
  imports: [
    RouterModule.forChild(appRoutes),
    MatToolbarModule,
    MatIconModule,MatTableModule,MatPaginatorModule,MatSortModule,MatCheckboxModule,MatButtonModule,CdkTreeModule,CdkTableModule,MatTreeModule,
    SharedModule
  ]
})
export class AdministrationModule { }
