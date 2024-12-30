import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SurgeryMasterComponent } from './surgery-master/surgery-master.component';


const appRoutes: Routes = [
  {
    path: "Tablemaster", //db linkaction name
    loadChildren:()=>
      import("./ottable-master/ottable-master.module").then((m)=>m.OttableMasterModule),
  },
  {
    path: "Surgerymaster", //db linkaction name
    loadChildren: () =>
      import("./surgery-master/surgery-master.module").then((m) => m.SurgeryMasterModule),
  },
  {
    path: "categorymaster", //db linkaction name
    loadChildren: () =>
      import("./category-master/category-master.module").then((m) => m.CategoryMasterModule),
  }
];

@NgModule({
  declarations: [ ],
  imports: [
    RouterModule.forChild(appRoutes) 
  ]
})
export class OtManagementModule { }
