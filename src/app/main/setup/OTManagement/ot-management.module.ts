import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

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
  },
  {
    path: "TypeMaster", //db linkaction name
    loadChildren: () =>
      import("./ottype-master/ottype-master.module").then((m) => m.OttypeMasterModule),
  },
  {
    path: "SiteDescriptionMaster", //db linkaction name
    loadChildren: () =>
      import("./sitedescription-master/sitedescription-master.module").then((m) => m.SitedescriptionMasterModule),
  },
  {
    path: "ConsentMaster", //db linkaction name
    loadChildren: () =>
      import("./consent-master/consent-master.module").then((m) => m.ConsentMasterModule),
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes) 
  ]
})
export class OtManagementModule { }
