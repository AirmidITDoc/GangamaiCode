import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
  {
    path: "bill",
    loadChildren: () => import("./op-search-list/opsearchlist.module").then((m) => m.opseachlistModule),
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
    loadChildren: () => import("./op-search-list/opsearchlist.module").then((m) => m.opseachlistModule),
},
{
    path: "bill",
    loadChildren: () => import("./op-search-list/opsearchlist.module").then((m) => m.opseachlistModule),
},
{
    path: "refund",
    loadChildren: () =>import("./op-search-list/op-refundof-bill/refundof-bill.module").then((m) => m.RefundofBillModule),
    
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
