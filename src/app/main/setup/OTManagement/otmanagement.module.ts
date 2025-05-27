import { NgModule } from '@angular/core';
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
   {
    path: "typemaster",
    loadChildren: () =>
      import("./type-master/type-master.module").then((m) => m.TypeMasterModule
      ), 
  },
   {
    path: "sitediscriptionmaster",
    loadChildren: () =>
      import("./site-description/site-description.module").then((m) => m.SiteDescriptionModule
      ), 
  },
  {
    path: "consentmaster",
    loadChildren: () =>
      import("./consent-master/consent-master.module").then((m) => m.ConsentMasterModule
      ), 
  },
];

@NgModule({
  declarations: [
  ],
  imports: [RouterModule.forChild(appRoutes)],
})
export class OTManagementModule { }



