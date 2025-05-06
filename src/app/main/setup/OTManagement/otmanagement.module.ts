import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
  {
    path: "ottablemaster",
    loadChildren: () =>
      import("./ottablemaster/ottablemaster.module").then((m) => m.OTTablemasterModule
      ), 
  }, 
  {
    path: "categorymaster",
    loadChildren: () =>
      import("./category-master/category-master.module").then((m) => m.CategoryMasterModule
      ), 
  },

  {
    path: "surgerymaster",
    loadChildren: () =>
      import("./surgery-master/surgery-master.module").then((m) => m.SurgeryMasterModule
      ), 
  },
];

@NgModule({
  declarations: [
    
  ],
  imports: [RouterModule.forChild(appRoutes)],
})
export class OTManagementModule { }



