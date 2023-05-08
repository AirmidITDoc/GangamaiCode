import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [

  {
    path: "registration",
    loadChildren: () => import("./registration/registration.module").then((m) => m.RegistrationModule),
  },
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

    // loadChildren: () => import("./all-browse-list-page/all-browse-list.module").then((m) => m.AllBrowseListModule),

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
    // loadChildren: () => import("./op-bill/op-bill.module").then((m) => m.OpBillModule),
  },
  //   {
  //       path: "refund",
  //       loadChildren: () =>
  //       import("./op-refund-bill/oprefundbill.module").then((m) => m.oprefundbillModule),
  //   },
  {
    path: "brows-opd-refund",
    loadChildren: () =>
      import("./browse-refund-list/browserefund.module").then((m) => m.browserefundModule),
  },
  // {
  //     path: "companysettlement",
  //     loadChildren: () =>
  //     import("./company-settlement/company-settlement.module").then((m) => m.CompanySettlementModule),
  // },
  // {
  //     path: "ambulancemanagement",
  //     loadChildren: () =>
  //     import("./ambulance-management/ambulance-management.module").then((m) => m.AmbulanceManagementModule),
  // },
  // {
  //     path: "tokendisplay",
  //     loadChildren: () =>
  //     import("./tokan-display/token-display.module").then((m) => m.TokenDisplayModule),
  // },
  // {
  //     path: "appoinmentwithbill",
  //     loadChildren: () =>
  //     import("./appointwith-bill/appointmentwith-bill.module").then((m) => m.AppointmentwithBillModule),
  // },
  // {
  //     path: "payment",
  //     loadChildren: () =>
  //     import("./payment/payment.module").then((m) => m.PaymentModule),
  // },

  // {
  //     path: "memberregistration",
  //     loadChildren: () =>
  //     import("./member-registration-list/member-registration-list.module").then((m) => m.MemberRegistrationListModule),
  // },

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class OPDModule { }
