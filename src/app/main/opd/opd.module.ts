import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewCasepaperComponent } from './new-casepaper/new-casepaper.component';

const appRoutes: Routes = [
  {
    path: "phone-appointment",
    loadChildren: () => import("./phoneappointment/phoneappointment.module").then((m) => m.phoneappointmentModule),
  },
  {
    path: "appointment",
    loadChildren: () => import("./appointment/appointment.module").then((m) => m.appointmentModule),
  },
  {
    
    path: "browse-opd-bills",
    loadChildren: () => import("./browse-opbill/browse-opbill.module").then((m) => m.BrowseOPBillModule),
  },
  // {
  //   path: "bill",
  //   loadChildren: () => import("./op-search-list/opsearchlist.module").then((m) => m.opseachlistModule),
  // },

  {
    path: "bill",
    loadChildren: () => import("./OPBilling/op-billing.module").then((m) => m.OPBillingModule),
  },
   
  {
    path: "registration",
    loadChildren: () => import("./registration/registration.module").then((m) => m.RegistrationModule),
  },
{
    path: "browse-opd-bills",
    loadChildren: () => import("./browse-opbill/browse-opbill.module").then((m) => m.BrowseOPBillModule),
},
{
    path: "browse-opd-payment-receipt",
    loadChildren: () => import("./browse-payment-list/browsepayment.module").then((m) => m.browsepaymentModule),
},
{
    path: "medicalrecords",
    loadChildren: () => import("./new-casepaper/casepaper.module").then((m) => m.CasepaperModule),
},
{
    path: "bill",
    loadChildren: () => import("./op-search-list/opsearchlist.module").then((m) => m.opseachlistModule),
},
{
    path: "refund",
    loadChildren: () =>import("./op-search-list/new-oprefundofbill/oprefundofbill.module").then((m) => m.OPrefundofbillModule),
    
},
{
  path: "payment",
  // loadChildren: () =>import("./op-search-list/outstanding-payment/outstanding.module").then((m) => m.OutstandingModule),
  loadChildren: () =>import("./op-search-list/opsearchlist.module").then((m) => m.opseachlistModule),
},
{
    path: "brows-opd-refund",
    loadChildren: () =>
    import("./browse-refund-list/browserefund.module").then((m) => m.browserefundModule),
},

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class OPDModule { }
