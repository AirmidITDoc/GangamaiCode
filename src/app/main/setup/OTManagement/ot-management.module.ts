import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
  {
      path: "tablemaster", //db linkaction name
      loadChildren: () =>
          import("./ottable-master/ot-table-master.module").then(
              (m) => m.OtTableMasterModule
          ),
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes),
    CommonModule
  ]
})
export class OtManagementModule { }
