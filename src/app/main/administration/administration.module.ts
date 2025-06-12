import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';


const appRoutes: Routes = [
  {
      path: "createuser",
      loadChildren: () => import("./create-user/create-user.module").then((m) => m.CreateUserModule),
  },
  {
    path: "configuration",
   loadChildren: () => import("./configuration/configuration.module").then((m) => m.ConfigurationModule),
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
    loadChildren: () => import("./cancellation/cancellation.module").then((m)=>m.CancellationModule),
  },
  {
    path: "reportconfiguration",
    loadChildren: () => import("./report-configuration/report-configuration.module").then((m) => m.ReportConfigurationModule),
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
    path:"pharamacypayipadvmode", 
    loadChildren: () => import("./pharmacypayipadvmode/pharmacypayipadvmode.module").then((m)=>m.PharmacypayipadvmodeModule),
   },
  //  {
  //   path:"scheduler",
  //   loadChildren: () => import("./scheduler/scheduler.module").then((m)=>m.NewScdulerModule),
  //  },
   {
    path: "smsconfigrationtool",
    loadChildren: () => import("./smsconfuguration/smsconfuguration.module").then((m) => m.SMSConfugurationModule),
},
{
    path: "Template Description",
    loadChildren: () => import("./template-description/templatedescription.module").then((m) => m.TemplatedescriptionModule),
},
{
  path: "import-excel",
  loadChildren: () => import("./import-excel/import-excel.module").then((m) => m.ImportExcelModule),
}
 
];

@NgModule({
  declarations: [ 
    
  ],
  imports: [
    RouterModule.forChild(appRoutes),
    MatToolbarModule,
    MatIconModule,MatTableModule,MatPaginatorModule,MatSortModule,MatCheckboxModule,MatButtonModule,CdkTreeModule,CdkTableModule,MatTreeModule,
    SharedModule
  ]
})
export class AdministrationModule { }
