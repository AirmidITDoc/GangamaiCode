import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from "../shared/shared.module";


const appRoutes: Routes = [
  {
    path: "phone-appointment",
    loadChildren: () => import("./phoneappointment/phoneappointment.module").then((m) => m.phoneappointmentModule),
  },
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
    loadChildren: () => import("./appointment-list/appointment-billing/app-billing.module").then((m) => m.AppBillingModule),
  },
   
  {
    path: "registration",
    loadChildren: () => import("./registration/registration.module").then((m) => m.RegistrationModule),
  },
{
    path: "companysettlement",
    loadChildren: () => import("./companysettlement/companysettlement.module").then((m) => m.CompanysettlementModule),
},

{
    path: "medicalrecords",   
    loadChildren: () => import("./medicalrecord/medicalrecord.module").then((m) => m.MedicalrecordModule),
},
{
    path: "bill",
    loadChildren: () => import("./op-search-list/opsearchlist.module").then((m) => m.opseachlistModule),
},
{
    path: "refund",
    loadChildren: () =>import("./refundbill/refundbill.module").then((m) => m.RefundbillModule),
    
},
{
  path: "payment",
    loadChildren: () =>import("./companysettlement/companysettlement.module").then((m) => m.CompanysettlementModule),
},
{
  path: "physiotherapistSchedule",
    loadChildren: () =>import("./physiotherapist-schedule/physiotherapist-schedule.module").then((m) => m.PhysiotherapistScheduleModule),
},


];

@NgModule({
  declarations: [ 
  ],
  imports: [
    RouterModule.forChild(appRoutes),
    SharedModule
]
})
export class OPDModule { }
