import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RolePermissionComponent } from './role-permission/role-permission.component';
 
   
 
 
 
 
 
 


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
   
 
 
];

@NgModule({
  declarations: [  RolePermissionComponent ],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class AdministrationModule { }
