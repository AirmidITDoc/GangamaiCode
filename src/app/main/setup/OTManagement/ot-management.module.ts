import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SurgeryMasterComponent } from './surgery-master/surgery-master.component';


const appRoutes: Routes = [
  {
    path: "tablemaster", //db linkaction name
    loadChildren: () =>
      import("./ottable-master/ot-table-master.module").then((m) => m.OtTableMasterModule),
  },
  {
    path: "Surgerymaster", //db linkaction name
    loadChildren: () =>
      import("./surgery-master/surgery-master.module").then((m) => m.SurgeryMasterModule),
  }
];

@NgModule({
  declarations: [ ],
  imports: [
    RouterModule.forChild(appRoutes) 
  ]
})
export class OtManagementModule { }
