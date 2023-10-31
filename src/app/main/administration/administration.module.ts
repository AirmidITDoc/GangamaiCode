import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
 
 
 
 
 
 


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
    path: "paymentmode",
    loadChildren: () => import("./paymentmode/paymentmode.module").then((m) => m.PaymentmodeModule),
  },
  {
    path: "DischargeCancel",
    loadChildren: () => import("./discharge-cancel/discharge-cancel.module").then((m) => m.DischargeCancelModule),
  },
  {
    path: "TallyInterface",
    loadChildren: () => import("./tally-interface/tally-interface.module").then((m) => m.TallyInterfaceModule),
  },
  {
    path: "PharmacyPayment",
    loadChildren: () => import("./pharmacy-payment/pharmacy-payment.module").then((m) => m.PharmacyPaymentModule),
  },
  {
    path: "PaymentModeChangePharmacy",
    loadChildren: () => import("./payment-mode-change-pharmacy/payment-mode-change-pharmacy.module").then((m) => m.PaymentModeChangePharmacyModule),
  },
  
 
 
];


@NgModule({
  declarations: [ ],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class AdministrationModule { }
