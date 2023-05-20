import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [

  // {
  //   path: "registration",
  //   loadChildren: () => import("./department/department.module").then((m) => m.DepartmentModule),
  // },
  {
    path: "phone-appointment",
    loadChildren: () => import("./phoneappointment/phoneappointment.module").then((m) => m.phoneappointmentModule),
  },
  {
    path: "appointment",
    loadChildren: () => import("./appointment/appointment.module").then((m) => m.AppointmentModule),
  },
  {
    
    path: "browse-opd-bills",
    loadChildren: () => import("./browse-opbill/browse-opbill.module").then((m) => m.BrowseOPBillModule),

    // loadChildren: () => import("./all-browse-list-page/all-browse-list.module").then((m) => m.AllBrowseListModule),

  },
 
  // {
  //   path: "medicalrecords",
  //   loadChildren: () => import("./department/department.module").then((m) => m.DepartmentModule),
  // },
  {
    path: "bill",
    loadChildren: () => import("./op-search-list/opsearchlist.module").then((m) => m.opseachlistModule),
    // loadChildren: () => import("./op-bill/op-bill.module").then((m) => m.OpBillModule),
  },
 

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class OPDModule { }
