import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewOPListComponent } from './new-oplist/new-oplist.component';
import { CompanysettlementComponent } from './companysettlement/companysettlement.component';
import { SharedModule } from "../shared/shared.module";

const appRoutes: Routes = [
  {
    path: "phone-appointment",
    loadChildren: () => import("./phoneappointment/phoneappointment.module").then((m) => m.phoneappointmentModule),
  },
  // {
  //   path: "view-phone-appointment",
  //   loadChildren: () => import("./phoneappointment/view-phone-appointment/view-phone-appointment.module").then((m) => m.viewPhoneAppointmentModule),
  // },
  {
    path: "appointment",
    loadChildren: () => import("./appointment-list/appointmentlist.module").then((m) => m.AppointmentlistModule),
  },
  {
    
    path: "browse-opd-bills",
    loadChildren: () => import("./new-oplist/oplist.module").then((m) => m.OplistModule),
  },


  {
    path: "bill",
    loadChildren: () => import("./op-search-list/op-billing/op-billing.module").then((m) => m.OpBillingModule),
  },
   
  {
    path: "registration",
    loadChildren: () => import("./registration/registration.module").then((m) => m.RegistrationModule),
  },
{
    path: "companysettlement",
    loadChildren: () => import("./companysettlement/companysettlement.module").then((m) => m.CompanysettlementModule),
},
// {
//     path: "browse-opd-payment-receipt",
//     loadChildren: () => import("./browse-payment-list/browsepayment.module").then((m) => m.browsepaymentModule),
// },
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
  loadChildren: () =>import("./companysettlement/companysettlement.module").then((m) => m.CompanysettlementModule),
},
// {
//     path: "brows-opd-refund",
//     loadChildren: () =>
//     import("./browse-refund-list/browserefund.module").then((m) => m.browserefundModule),
// },

];

@NgModule({
  declarations: [
    // CompanysettlementComponent
  ],
  imports: [
    RouterModule.forChild(appRoutes),
    SharedModule
]
})
export class OPDModule { }
